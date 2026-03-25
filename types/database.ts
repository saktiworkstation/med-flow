// ═══════════════════════════════════════
// MedFlow Database Types
// Matching Supabase PostgreSQL Schema
// ═══════════════════════════════════════

// ── Enums ──────────────────────────────

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export type UserRole =
  | 'super_admin'
  | 'clinic_owner'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist';

export type Gender = 'male' | 'female';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentType =
  | 'consultation'
  | 'follow_up'
  | 'emergency'
  | 'procedure';

export type PrescriptionStatus =
  | 'pending'
  | 'dispensed'
  | 'partially_dispensed'
  | 'cancelled';

export type MedicationCategory =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'drops'
  | 'inhaler'
  | 'other';

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled';

export type PaymentMethod =
  | 'cash'
  | 'transfer'
  | 'card'
  | 'insurance'
  | 'qris';

export type InvoiceItemCategory =
  | 'consultation'
  | 'procedure'
  | 'medication'
  | 'lab_test'
  | 'other';

export type NotificationType =
  | 'appointment_reminder'
  | 'low_stock'
  | 'payment_due'
  | 'new_patient'
  | 'system';

export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'login'
  | 'logout'
  | 'export';

export type AuditEntityType =
  | 'patient'
  | 'appointment'
  | 'medical_record'
  | 'prescription'
  | 'invoice'
  | 'medication';

// ── Vital Signs ────────────────────────

export interface VitalSigns {
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
}

// ── Clinic Settings ────────────────────

export interface ClinicSettings {
  operating_hours?: {
    [day: string]: { open: string; close: string; is_open: boolean };
  };
  consultation_fee?: number;
  tax_rate?: number;
  currency?: string;
  timezone?: string;
  invoice_prefix?: string;
  appointment_duration_minutes?: number;
}

// ── Table Types ────────────────────────

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  subscription_plan: SubscriptionPlan;
  settings: ClinicSettings;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clinic_id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  specialization: string | null;
  license_number: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  clinic_id: string;
  medical_record_number: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  blood_type: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  allergies: string[];
  insurance_provider: string | null;
  insurance_number: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  type: AppointmentType;
  complaint: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  patient?: Patient;
  doctor?: User;
}

export interface MedicalRecord {
  id: string;
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  record_date: string;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  vital_signs: VitalSigns;
  icd_10_codes: string[];
  attachments: string[];
  is_confidential: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  patient?: Patient;
  doctor?: User;
  appointment?: Appointment;
}

export interface Prescription {
  id: string;
  clinic_id: string;
  medical_record_id: string;
  patient_id: string;
  doctor_id: string;
  prescription_date: string;
  status: PrescriptionStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: PrescriptionItem[];
  patient?: Patient;
  doctor?: User;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medication_id: string;
  dosage: string;
  quantity: number;
  frequency: string;
  duration_days: number;
  instructions: string | null;
  created_at: string;
  // Joined
  medication?: Medication;
}

export interface Medication {
  id: string;
  clinic_id: string;
  name: string;
  generic_name: string | null;
  category: MedicationCategory;
  unit: string;
  stock_quantity: number;
  min_stock_alert: number;
  price_per_unit: number;
  manufacturer: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  clinic_id: string;
  patient_id: string;
  appointment_id: string | null;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: InvoiceItem[];
  patient?: Patient;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  category: InvoiceItemCategory;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  clinic_id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined
  user?: User;
}

export interface Notification {
  id: string;
  clinic_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string | null;
  created_at: string;
}

// ── Supabase Database Type Map ─────────

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: Clinic;
        Insert: Omit<Clinic, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Clinic, 'id' | 'created_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      patients: {
        Row: Patient;
        Insert: Omit<Patient, 'id' | 'medical_record_number' | 'created_at' | 'updated_at'> & {
          id?: string;
          medical_record_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Patient, 'id' | 'medical_record_number' | 'created_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'patient' | 'doctor'>>;
      };
      medical_records: {
        Row: MedicalRecord;
        Insert: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor' | 'appointment'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<MedicalRecord, 'id' | 'created_at' | 'patient' | 'doctor' | 'appointment'>>;
      };
      prescriptions: {
        Row: Prescription;
        Insert: Omit<Prescription, 'id' | 'created_at' | 'updated_at' | 'items' | 'patient' | 'doctor'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Prescription, 'id' | 'created_at' | 'items' | 'patient' | 'doctor'>>;
      };
      prescription_items: {
        Row: PrescriptionItem;
        Insert: Omit<PrescriptionItem, 'id' | 'created_at' | 'medication'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PrescriptionItem, 'id' | 'created_at' | 'medication'>>;
      };
      medications: {
        Row: Medication;
        Insert: Omit<Medication, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Medication, 'id' | 'created_at'>>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'updated_at' | 'items' | 'patient'> & {
          id?: string;
          invoice_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Invoice, 'id' | 'invoice_number' | 'created_at' | 'items' | 'patient'>>;
      };
      invoice_items: {
        Row: InvoiceItem;
        Insert: Omit<InvoiceItem, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<InvoiceItem, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at' | 'user'> & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Pick<Notification, 'is_read'>>;
      };
    };
  };
}
