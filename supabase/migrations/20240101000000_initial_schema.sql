-- ============================================================================
-- MedFlow Healthcare Platform - Initial Schema
-- Migration: 20240101000000_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- CUSTOM ENUM TYPES
-- ============================================================================

CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'clinic_owner',
    'doctor',
    'nurse',
    'receptionist',
    'pharmacist'
);

CREATE TYPE gender_type AS ENUM ('male', 'female');

CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
);

CREATE TYPE appointment_type AS ENUM (
    'consultation',
    'follow_up',
    'emergency',
    'procedure'
);

CREATE TYPE prescription_status AS ENUM (
    'pending',
    'dispensed',
    'partially_dispensed',
    'cancelled'
);

CREATE TYPE medication_category AS ENUM (
    'tablet',
    'capsule',
    'syrup',
    'injection',
    'cream',
    'drops',
    'inhaler',
    'other'
);

CREATE TYPE invoice_status AS ENUM (
    'draft',
    'sent',
    'paid',
    'partially_paid',
    'overdue',
    'cancelled'
);

CREATE TYPE payment_method AS ENUM (
    'cash',
    'transfer',
    'card',
    'insurance',
    'qris'
);

CREATE TYPE invoice_item_category AS ENUM (
    'consultation',
    'procedure',
    'medication',
    'lab_test',
    'other'
);

CREATE TYPE notification_type AS ENUM (
    'appointment_reminder',
    'low_stock',
    'payment_due',
    'new_patient',
    'system'
);

-- ============================================================================
-- HELPER: auto-update updated_at column
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLE 1: clinics
-- ============================================================================

CREATE TABLE clinics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    address         TEXT,
    phone           TEXT,
    email           TEXT,
    logo_url        TEXT,
    subscription_plan subscription_plan NOT NULL DEFAULT 'free',
    settings        JSONB DEFAULT '{}'::JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinics_slug ON clinics (slug);

CREATE TRIGGER trg_clinics_updated_at
    BEFORE UPDATE ON clinics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 2: users
-- ============================================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    role            user_role NOT NULL,
    full_name       TEXT NOT NULL,
    email           TEXT NOT NULL,
    phone           TEXT,
    avatar_url      TEXT,
    specialization  TEXT,
    license_number  TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clinic_id ON users (clinic_id);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_is_active ON users (is_active);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 3: patients
-- ============================================================================

CREATE TABLE patients (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id               UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    medical_record_number   TEXT NOT NULL,
    full_name               TEXT NOT NULL,
    date_of_birth           DATE NOT NULL,
    gender                  gender_type NOT NULL,
    blood_type              TEXT,
    phone                   TEXT,
    email                   TEXT,
    address                 TEXT,
    emergency_contact_name  TEXT,
    emergency_contact_phone TEXT,
    allergies               TEXT[] DEFAULT '{}',
    insurance_provider      TEXT,
    insurance_number        TEXT,
    photo_url               TEXT,
    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_patients_mr_per_clinic UNIQUE (clinic_id, medical_record_number)
);

CREATE INDEX idx_patients_clinic_id ON patients (clinic_id);
CREATE INDEX idx_patients_full_name ON patients (full_name);
CREATE INDEX idx_patients_medical_record_number ON patients (medical_record_number);
CREATE INDEX idx_patients_date_of_birth ON patients (date_of_birth);
CREATE INDEX idx_patients_phone ON patients (phone);

CREATE TRIGGER trg_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 4: appointments
-- ============================================================================

CREATE TABLE appointments (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id         UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_date  DATE NOT NULL,
    start_time        TIME NOT NULL,
    end_time          TIME NOT NULL,
    status            appointment_status NOT NULL DEFAULT 'scheduled',
    type              appointment_type NOT NULL DEFAULT 'consultation',
    complaint         TEXT,
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_appointments_time CHECK (end_time > start_time)
);

CREATE INDEX idx_appointments_clinic_id ON appointments (clinic_id);
CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments (doctor_id);
CREATE INDEX idx_appointments_date ON appointments (appointment_date);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_appointments_date_doctor ON appointments (appointment_date, doctor_id);

CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 5: medical_records
-- ============================================================================

CREATE TABLE medical_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,
    record_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    subjective      TEXT,
    objective       TEXT,
    assessment      TEXT,
    plan            TEXT,
    vital_signs     JSONB DEFAULT '{}'::JSONB,
    icd_10_codes    TEXT[] DEFAULT '{}',
    attachments     TEXT[] DEFAULT '{}',
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medical_records_clinic_id ON medical_records (clinic_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records (patient_id);
CREATE INDEX idx_medical_records_doctor_id ON medical_records (doctor_id);
CREATE INDEX idx_medical_records_appointment_id ON medical_records (appointment_id);
CREATE INDEX idx_medical_records_record_date ON medical_records (record_date);
CREATE INDEX idx_medical_records_confidential ON medical_records (is_confidential) WHERE is_confidential = TRUE;

CREATE TRIGGER trg_medical_records_updated_at
    BEFORE UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 6: prescriptions
-- ============================================================================

CREATE TABLE prescriptions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id         UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    medical_record_id UUID NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prescription_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status            prescription_status NOT NULL DEFAULT 'pending',
    notes             TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_clinic_id ON prescriptions (clinic_id);
CREATE INDEX idx_prescriptions_medical_record_id ON prescriptions (medical_record_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions (patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions (doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions (status);

CREATE TRIGGER trg_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 7: medications
-- ============================================================================

CREATE TABLE medications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    generic_name    TEXT,
    category        medication_category NOT NULL DEFAULT 'tablet',
    unit            TEXT NOT NULL,
    stock_quantity  INTEGER NOT NULL DEFAULT 0,
    min_stock_alert INTEGER NOT NULL DEFAULT 10,
    price_per_unit  DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    manufacturer    TEXT,
    description     TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_medications_stock_quantity CHECK (stock_quantity >= 0),
    CONSTRAINT chk_medications_price CHECK (price_per_unit >= 0)
);

CREATE INDEX idx_medications_clinic_id ON medications (clinic_id);
CREATE INDEX idx_medications_name ON medications (name);
CREATE INDEX idx_medications_category ON medications (category);
CREATE INDEX idx_medications_is_active ON medications (is_active);
CREATE INDEX idx_medications_low_stock ON medications (clinic_id, stock_quantity, min_stock_alert)
    WHERE stock_quantity <= min_stock_alert;

CREATE TRIGGER trg_medications_updated_at
    BEFORE UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 8: prescription_items
-- ============================================================================

CREATE TABLE prescription_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_id   UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    dosage          TEXT NOT NULL,
    quantity        INTEGER NOT NULL,
    frequency       TEXT NOT NULL,
    duration_days   INTEGER NOT NULL,
    instructions    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_prescription_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_prescription_items_duration CHECK (duration_days > 0)
);

CREATE INDEX idx_prescription_items_prescription_id ON prescription_items (prescription_id);
CREATE INDEX idx_prescription_items_medication_id ON prescription_items (medication_id);

-- ============================================================================
-- TABLE 9: invoices
-- ============================================================================

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id       UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,
    invoice_number  TEXT NOT NULL UNIQUE,
    invoice_date    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date        DATE,
    subtotal        DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    tax_amount      DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    paid_amount     DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    status          invoice_status NOT NULL DEFAULT 'draft',
    payment_method  payment_method,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_invoices_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_invoices_tax CHECK (tax_amount >= 0),
    CONSTRAINT chk_invoices_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_invoices_total CHECK (total_amount >= 0),
    CONSTRAINT chk_invoices_paid CHECK (paid_amount >= 0)
);

CREATE INDEX idx_invoices_clinic_id ON invoices (clinic_id);
CREATE INDEX idx_invoices_patient_id ON invoices (patient_id);
CREATE INDEX idx_invoices_appointment_id ON invoices (appointment_id);
CREATE INDEX idx_invoices_invoice_number ON invoices (invoice_number);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_invoices_invoice_date ON invoices (invoice_date);
CREATE INDEX idx_invoices_due_date ON invoices (due_date);

CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE 10: invoice_items
-- ============================================================================

CREATE TABLE invoice_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category    invoice_item_category NOT NULL DEFAULT 'other',
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_invoice_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_invoice_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_invoice_items_total_price CHECK (total_price >= 0)
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items (invoice_id);

-- ============================================================================
-- TABLE 11: audit_logs
-- ============================================================================

CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id   UUID REFERENCES clinics(id) ON DELETE SET NULL,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id   UUID,
    old_data    JSONB,
    new_data    JSONB,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_clinic_id ON audit_logs (clinic_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);

-- ============================================================================
-- TABLE 12: notifications
-- ============================================================================

CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id   UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    title       TEXT NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    action_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_clinic_id ON notifications (clinic_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
