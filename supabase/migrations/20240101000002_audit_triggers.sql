-- ============================================================================
-- MedFlow Healthcare Platform - Audit Logging Triggers
-- Migration: 20240101000002_audit_triggers.sql
-- ============================================================================

-- ============================================================================
-- GENERIC AUDIT LOG FUNCTION
-- Runs as SECURITY DEFINER to bypass RLS when inserting into audit_logs.
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_clinic_id UUID;
    v_user_id UUID;
    v_action TEXT;
    v_old_data JSONB;
    v_new_data JSONB;
    v_entity_id UUID;
BEGIN
    -- Determine the current user
    v_user_id := auth.uid();

    -- Determine action
    v_action := TG_OP;

    -- Determine entity_id and clinic_id based on operation
    IF TG_OP = 'DELETE' THEN
        v_entity_id := OLD.id;
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;
        -- Try to get clinic_id from OLD record
        IF TG_TABLE_NAME IN ('patients', 'appointments', 'medical_records', 'prescriptions', 'invoices', 'medications') THEN
            v_clinic_id := OLD.clinic_id;
        END IF;
    ELSIF TG_OP = 'INSERT' THEN
        v_entity_id := NEW.id;
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);
        IF TG_TABLE_NAME IN ('patients', 'appointments', 'medical_records', 'prescriptions', 'invoices', 'medications') THEN
            v_clinic_id := NEW.clinic_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        v_entity_id := NEW.id;
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
        IF TG_TABLE_NAME IN ('patients', 'appointments', 'medical_records', 'prescriptions', 'invoices', 'medications') THEN
            v_clinic_id := NEW.clinic_id;
        END IF;
    END IF;

    -- If clinic_id was not found from the record, try to get it from the user
    IF v_clinic_id IS NULL AND v_user_id IS NOT NULL THEN
        SELECT clinic_id INTO v_clinic_id FROM users WHERE id = v_user_id;
    END IF;

    -- Insert the audit log entry
    INSERT INTO audit_logs (
        clinic_id,
        user_id,
        action,
        entity_type,
        entity_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) VALUES (
        v_clinic_id,
        v_user_id,
        v_action,
        TG_TABLE_NAME,
        v_entity_id,
        v_old_data,
        v_new_data,
        current_setting('request.headers', TRUE)::JSON->>'x-forwarded-for',
        current_setting('request.headers', TRUE)::JSON->>'user-agent'
    );

    -- Return appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUDIT TRIGGERS FOR PATIENTS
-- ============================================================================

CREATE TRIGGER trg_audit_patients_insert
    AFTER INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_patients_update
    AFTER UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_patients_delete
    AFTER DELETE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

-- ============================================================================
-- AUDIT TRIGGERS FOR APPOINTMENTS
-- ============================================================================

CREATE TRIGGER trg_audit_appointments_insert
    AFTER INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_appointments_update
    AFTER UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_appointments_delete
    AFTER DELETE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

-- ============================================================================
-- AUDIT TRIGGERS FOR MEDICAL RECORDS
-- ============================================================================

CREATE TRIGGER trg_audit_medical_records_insert
    AFTER INSERT ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_medical_records_update
    AFTER UPDATE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_medical_records_delete
    AFTER DELETE ON medical_records
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

-- ============================================================================
-- AUDIT TRIGGERS FOR PRESCRIPTIONS
-- ============================================================================

CREATE TRIGGER trg_audit_prescriptions_insert
    AFTER INSERT ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_prescriptions_update
    AFTER UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_prescriptions_delete
    AFTER DELETE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

-- ============================================================================
-- AUDIT TRIGGERS FOR INVOICES
-- ============================================================================

CREATE TRIGGER trg_audit_invoices_insert
    AFTER INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_invoices_update
    AFTER UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_invoices_delete
    AFTER DELETE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

-- ============================================================================
-- AUDIT TRIGGERS FOR MEDICATIONS
-- ============================================================================

CREATE TRIGGER trg_audit_medications_insert
    AFTER INSERT ON medications
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_medications_update
    AFTER UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();

CREATE TRIGGER trg_audit_medications_delete
    AFTER DELETE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION fn_audit_log();
