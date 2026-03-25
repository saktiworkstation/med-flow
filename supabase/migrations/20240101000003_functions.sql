-- ============================================================================
-- MedFlow Healthcare Platform - Helper Functions
-- Migration: 20240101000003_functions.sql
-- ============================================================================

-- ============================================================================
-- FUNCTION: Generate Medical Record Number (MR-YYYYMMDD-XXXX)
-- Format: MR-20240315-0001, MR-20240315-0002, etc.
-- Sequential numbering resets daily per clinic.
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_medical_record_number(p_clinic_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_date_part TEXT;
    v_today DATE;
    v_sequence INT;
    v_mr_number TEXT;
BEGIN
    v_today := CURRENT_DATE;
    v_date_part := TO_CHAR(v_today, 'YYYYMMDD');

    -- Count existing records for this clinic today and get next sequence
    SELECT COUNT(*) + 1 INTO v_sequence
    FROM patients
    WHERE clinic_id = p_clinic_id
      AND medical_record_number LIKE 'MR-' || v_date_part || '-%';

    -- Format as MR-YYYYMMDD-XXXX
    v_mr_number := 'MR-' || v_date_part || '-' || LPAD(v_sequence::TEXT, 4, '0');

    -- Ensure uniqueness: if this number already exists, increment
    WHILE EXISTS (
        SELECT 1 FROM patients
        WHERE clinic_id = p_clinic_id
          AND medical_record_number = v_mr_number
    ) LOOP
        v_sequence := v_sequence + 1;
        v_mr_number := 'MR-' || v_date_part || '-' || LPAD(v_sequence::TEXT, 4, '0');
    END LOOP;

    RETURN v_mr_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Generate Invoice Number (INV-YYYYMMDD-XXXX)
-- Format: INV-20240315-0001, INV-20240315-0002, etc.
-- Sequential numbering resets daily per clinic.
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_invoice_number(p_clinic_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_date_part TEXT;
    v_today DATE;
    v_sequence INT;
    v_inv_number TEXT;
BEGIN
    v_today := CURRENT_DATE;
    v_date_part := TO_CHAR(v_today, 'YYYYMMDD');

    -- Count existing invoices for this clinic today and get next sequence
    SELECT COUNT(*) + 1 INTO v_sequence
    FROM invoices
    WHERE clinic_id = p_clinic_id
      AND invoice_number LIKE 'INV-' || v_date_part || '-%';

    -- Format as INV-YYYYMMDD-XXXX
    v_inv_number := 'INV-' || v_date_part || '-' || LPAD(v_sequence::TEXT, 4, '0');

    -- Ensure uniqueness: if this number already exists, increment
    WHILE EXISTS (
        SELECT 1 FROM invoices
        WHERE invoice_number = v_inv_number
    ) LOOP
        v_sequence := v_sequence + 1;
        v_inv_number := 'INV-' || v_date_part || '-' || LPAD(v_sequence::TEXT, 4, '0');
    END LOOP;

    RETURN v_inv_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGER: Auto-generate MR number on patient insert
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_auto_generate_mr_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if not already provided
    IF NEW.medical_record_number IS NULL OR NEW.medical_record_number = '' THEN
        NEW.medical_record_number := generate_medical_record_number(NEW.clinic_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_patients_auto_mr_number
    BEFORE INSERT ON patients
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_generate_mr_number();

-- ============================================================================
-- TRIGGER: Auto-generate invoice number on invoice insert
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_auto_generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if not already provided
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := generate_invoice_number(NEW.clinic_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_invoices_auto_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_generate_invoice_number();

-- ============================================================================
-- FUNCTION: Update invoice totals when invoice_items change
-- Recalculates subtotal from items and recomputes total_amount.
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_recalculate_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
    v_invoice_id UUID;
    v_subtotal DECIMAL(12, 2);
BEGIN
    -- Determine which invoice to recalculate
    IF TG_OP = 'DELETE' THEN
        v_invoice_id := OLD.invoice_id;
    ELSE
        v_invoice_id := NEW.invoice_id;
    END IF;

    -- Sum all item totals for this invoice
    SELECT COALESCE(SUM(total_price), 0) INTO v_subtotal
    FROM invoice_items
    WHERE invoice_id = v_invoice_id;

    -- Update the invoice
    UPDATE invoices
    SET subtotal = v_subtotal,
        total_amount = v_subtotal + tax_amount - discount_amount
    WHERE id = v_invoice_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_invoice_items_recalc_insert
    AFTER INSERT ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalculate_invoice_totals();

CREATE TRIGGER trg_invoice_items_recalc_update
    AFTER UPDATE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalculate_invoice_totals();

CREATE TRIGGER trg_invoice_items_recalc_delete
    AFTER DELETE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION fn_recalculate_invoice_totals();

-- ============================================================================
-- FUNCTION: Check and create low stock notification
-- Called after medication stock changes.
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_check_low_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_pharmacist RECORD;
BEGIN
    -- Only check if stock_quantity changed and is now at or below the alert threshold
    IF NEW.stock_quantity <= NEW.min_stock_alert
       AND (OLD.stock_quantity IS NULL OR OLD.stock_quantity > OLD.min_stock_alert)
    THEN
        -- Notify all pharmacists and clinic_owner in this clinic
        FOR v_pharmacist IN
            SELECT id FROM users
            WHERE clinic_id = NEW.clinic_id
              AND role IN ('pharmacist', 'clinic_owner')
              AND is_active = TRUE
        LOOP
            INSERT INTO notifications (
                clinic_id,
                user_id,
                type,
                title,
                message,
                action_url
            ) VALUES (
                NEW.clinic_id,
                v_pharmacist.id,
                'low_stock',
                'Low Stock Alert: ' || NEW.name,
                'Medication "' || NEW.name || '" has only ' || NEW.stock_quantity || ' ' || NEW.unit || ' remaining (minimum: ' || NEW.min_stock_alert || ').',
                '/medications/' || NEW.id
            );
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_medications_low_stock
    AFTER UPDATE ON medications
    FOR EACH ROW
    EXECUTE FUNCTION fn_check_low_stock();

-- ============================================================================
-- FUNCTION: Deduct medication stock when prescription is dispensed
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_deduct_medication_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only deduct when status changes to 'dispensed' or 'partially_dispensed'
    IF (NEW.status IN ('dispensed', 'partially_dispensed'))
       AND (OLD.status = 'pending' OR (OLD.status = 'partially_dispensed' AND NEW.status = 'dispensed'))
    THEN
        -- Deduct stock for each prescription item
        UPDATE medications m
        SET stock_quantity = GREATEST(m.stock_quantity - pi.quantity, 0)
        FROM prescription_items pi
        WHERE pi.prescription_id = NEW.id
          AND m.id = pi.medication_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_prescriptions_deduct_stock
    AFTER UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION fn_deduct_medication_stock();

-- ============================================================================
-- FUNCTION: Update user last_login_at
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET last_login_at = NOW()
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger fires on auth.users which may require additional
-- Supabase configuration. An alternative is to call this from the
-- application layer after successful login.
-- CREATE TRIGGER trg_auth_users_last_login
--     AFTER UPDATE OF last_sign_in_at ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION fn_update_last_login();

-- ============================================================================
-- FUNCTION: Get dashboard stats for a clinic
-- Returns patient count, appointment count today, pending prescriptions, revenue
-- ============================================================================

CREATE OR REPLACE FUNCTION get_clinic_dashboard_stats(p_clinic_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'total_patients', (
            SELECT COUNT(*) FROM patients WHERE clinic_id = p_clinic_id
        ),
        'appointments_today', (
            SELECT COUNT(*) FROM appointments
            WHERE clinic_id = p_clinic_id
              AND appointment_date = CURRENT_DATE
              AND status NOT IN ('cancelled', 'no_show')
        ),
        'pending_prescriptions', (
            SELECT COUNT(*) FROM prescriptions
            WHERE clinic_id = p_clinic_id
              AND status = 'pending'
        ),
        'revenue_this_month', (
            SELECT COALESCE(SUM(paid_amount), 0) FROM invoices
            WHERE clinic_id = p_clinic_id
              AND status IN ('paid', 'partially_paid')
              AND invoice_date >= DATE_TRUNC('month', CURRENT_DATE)
        ),
        'low_stock_medications', (
            SELECT COUNT(*) FROM medications
            WHERE clinic_id = p_clinic_id
              AND stock_quantity <= min_stock_alert
              AND is_active = TRUE
        )
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- FUNCTION: Get patient visit history
-- ============================================================================

CREATE OR REPLACE FUNCTION get_patient_visit_history(
    p_patient_id UUID,
    p_limit INT DEFAULT 20,
    p_offset INT DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_agg(visit_row) INTO v_result
    FROM (
        SELECT
            a.id AS appointment_id,
            a.appointment_date,
            a.start_time,
            a.end_time,
            a.status,
            a.type,
            a.complaint,
            u.full_name AS doctor_name,
            u.specialization AS doctor_specialization,
            mr.id AS medical_record_id,
            mr.assessment,
            mr.icd_10_codes
        FROM appointments a
        LEFT JOIN users u ON u.id = a.doctor_id
        LEFT JOIN medical_records mr ON mr.appointment_id = a.id
        WHERE a.patient_id = p_patient_id
        ORDER BY a.appointment_date DESC, a.start_time DESC
        LIMIT p_limit
        OFFSET p_offset
    ) AS visit_row;

    RETURN COALESCE(v_result, '[]'::JSON);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
