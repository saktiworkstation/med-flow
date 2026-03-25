-- ============================================================================
-- MedFlow Healthcare Platform - Row Level Security Policies
-- Migration: 20240101000001_rls_policies.sql
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS for RLS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_clinic_id()
RETURNS UUID AS $$
    SELECT clinic_id FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
    SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- CLINICS POLICIES
-- ============================================================================

-- Super admin can see all clinics
CREATE POLICY clinics_super_admin_select ON clinics
    FOR SELECT
    TO authenticated
    USING (get_user_role() = 'super_admin');

-- Super admin can manage all clinics
CREATE POLICY clinics_super_admin_all ON clinics
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Users can view their own clinic
CREATE POLICY clinics_own_select ON clinics
    FOR SELECT
    TO authenticated
    USING (id = get_user_clinic_id());

-- Clinic owner can update their own clinic
CREATE POLICY clinics_owner_update ON clinics
    FOR UPDATE
    TO authenticated
    USING (
        id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- ============================================================================
-- USERS POLICIES
-- ============================================================================

-- Super admin: full access to all users
CREATE POLICY users_super_admin_all ON users
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access to users in own clinic
CREATE POLICY users_clinic_owner_all ON users
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- All authenticated users: read users in own clinic
CREATE POLICY users_same_clinic_select ON users
    FOR SELECT
    TO authenticated
    USING (clinic_id = get_user_clinic_id());

-- Users can update their own profile
CREATE POLICY users_self_update ON users
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ============================================================================
-- PATIENTS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY patients_super_admin_all ON patients
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic
CREATE POLICY patients_clinic_owner_all ON patients
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read/write patients in own clinic
CREATE POLICY patients_doctor_select ON patients
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

CREATE POLICY patients_doctor_insert ON patients
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

CREATE POLICY patients_doctor_update ON patients
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

-- Nurse: read patients in own clinic
CREATE POLICY patients_nurse_select ON patients
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
    );

-- Receptionist: read/write patients in own clinic
CREATE POLICY patients_receptionist_select ON patients
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY patients_receptionist_insert ON patients
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY patients_receptionist_update ON patients
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

-- Pharmacist: read patients in own clinic (to view prescription context)
CREATE POLICY patients_pharmacist_select ON patients
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

-- ============================================================================
-- APPOINTMENTS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY appointments_super_admin_all ON appointments
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic
CREATE POLICY appointments_clinic_owner_all ON appointments
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read/write own appointments
CREATE POLICY appointments_doctor_select ON appointments
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

CREATE POLICY appointments_doctor_insert ON appointments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

CREATE POLICY appointments_doctor_update ON appointments
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

-- Nurse: read appointments in own clinic
CREATE POLICY appointments_nurse_select ON appointments
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
    );

-- Receptionist: read/write appointments in own clinic
CREATE POLICY appointments_receptionist_select ON appointments
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY appointments_receptionist_insert ON appointments
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY appointments_receptionist_update ON appointments
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

-- ============================================================================
-- MEDICAL RECORDS POLICIES
-- Level 3: Confidential records only accessible by writing doctor + clinic_owner
-- ============================================================================

-- Super admin: full access
CREATE POLICY medical_records_super_admin_all ON medical_records
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic (including confidential)
CREATE POLICY medical_records_clinic_owner_all ON medical_records
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read/write own records; confidential records only if they are the writing doctor
CREATE POLICY medical_records_doctor_select ON medical_records
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND (
            is_confidential = FALSE
            OR doctor_id = auth.uid()
        )
    );

CREATE POLICY medical_records_doctor_insert ON medical_records
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

CREATE POLICY medical_records_doctor_update ON medical_records
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

-- Nurse: read non-confidential records in own clinic (for vital signs context)
CREATE POLICY medical_records_nurse_select ON medical_records
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
        AND is_confidential = FALSE
    );

-- Nurse: can update vital_signs on non-confidential records
-- Note: application layer should enforce that nurses only update vital_signs column
CREATE POLICY medical_records_nurse_update ON medical_records
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
        AND is_confidential = FALSE
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
        AND is_confidential = FALSE
    );

-- Receptionist: NO access to medical records (explicitly none)
-- Pharmacist: NO access to medical records (explicitly none)

-- ============================================================================
-- PRESCRIPTIONS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY prescriptions_super_admin_all ON prescriptions
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic
CREATE POLICY prescriptions_clinic_owner_all ON prescriptions
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read/write prescriptions in own clinic (own prescriptions)
CREATE POLICY prescriptions_doctor_select ON prescriptions
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

CREATE POLICY prescriptions_doctor_insert ON prescriptions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

CREATE POLICY prescriptions_doctor_update ON prescriptions
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
        AND doctor_id = auth.uid()
    );

-- Pharmacist: read prescriptions in own clinic
CREATE POLICY prescriptions_pharmacist_select ON prescriptions
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

-- Pharmacist: update prescription status (dispense)
CREATE POLICY prescriptions_pharmacist_update ON prescriptions
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

-- ============================================================================
-- PRESCRIPTION ITEMS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY prescription_items_super_admin_all ON prescription_items
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access via prescription's clinic
CREATE POLICY prescription_items_clinic_owner_all ON prescription_items
    FOR ALL
    TO authenticated
    USING (
        get_user_role() = 'clinic_owner'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
        )
    )
    WITH CHECK (
        get_user_role() = 'clinic_owner'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
        )
    );

-- Doctor: read/write prescription items for prescriptions in own clinic
CREATE POLICY prescription_items_doctor_select ON prescription_items
    FOR SELECT
    TO authenticated
    USING (
        get_user_role() = 'doctor'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
        )
    );

CREATE POLICY prescription_items_doctor_insert ON prescription_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_role() = 'doctor'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
            AND p.doctor_id = auth.uid()
        )
    );

CREATE POLICY prescription_items_doctor_update ON prescription_items
    FOR UPDATE
    TO authenticated
    USING (
        get_user_role() = 'doctor'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
            AND p.doctor_id = auth.uid()
        )
    )
    WITH CHECK (
        get_user_role() = 'doctor'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
            AND p.doctor_id = auth.uid()
        )
    );

-- Pharmacist: read prescription items in own clinic
CREATE POLICY prescription_items_pharmacist_select ON prescription_items
    FOR SELECT
    TO authenticated
    USING (
        get_user_role() = 'pharmacist'
        AND EXISTS (
            SELECT 1 FROM prescriptions p
            WHERE p.id = prescription_items.prescription_id
            AND p.clinic_id = get_user_clinic_id()
        )
    );

-- ============================================================================
-- MEDICATIONS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY medications_super_admin_all ON medications
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic
CREATE POLICY medications_clinic_owner_all ON medications
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read-only medications in own clinic
CREATE POLICY medications_doctor_select ON medications
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

-- Pharmacist: read/write medications in own clinic
CREATE POLICY medications_pharmacist_select ON medications
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

CREATE POLICY medications_pharmacist_insert ON medications
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

CREATE POLICY medications_pharmacist_update ON medications
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'pharmacist'
    );

-- Nurse: read medications (for reference)
CREATE POLICY medications_nurse_select ON medications
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'nurse'
    );

-- Receptionist: read medications (for invoicing)
CREATE POLICY medications_receptionist_select ON medications
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

-- ============================================================================
-- INVOICES POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY invoices_super_admin_all ON invoices
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access in own clinic
CREATE POLICY invoices_clinic_owner_all ON invoices
    FOR ALL
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Doctor: read-only invoices in own clinic
CREATE POLICY invoices_doctor_select ON invoices
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'doctor'
    );

-- Receptionist: read/write invoices in own clinic
CREATE POLICY invoices_receptionist_select ON invoices
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY invoices_receptionist_insert ON invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

CREATE POLICY invoices_receptionist_update ON invoices
    FOR UPDATE
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    )
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'receptionist'
    );

-- ============================================================================
-- INVOICE ITEMS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY invoice_items_super_admin_all ON invoice_items
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Clinic owner: full access via invoice's clinic
CREATE POLICY invoice_items_clinic_owner_all ON invoice_items
    FOR ALL
    TO authenticated
    USING (
        get_user_role() = 'clinic_owner'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    )
    WITH CHECK (
        get_user_role() = 'clinic_owner'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    );

-- Doctor: read-only invoice items
CREATE POLICY invoice_items_doctor_select ON invoice_items
    FOR SELECT
    TO authenticated
    USING (
        get_user_role() = 'doctor'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    );

-- Receptionist: read/write invoice items
CREATE POLICY invoice_items_receptionist_select ON invoice_items
    FOR SELECT
    TO authenticated
    USING (
        get_user_role() = 'receptionist'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    );

CREATE POLICY invoice_items_receptionist_insert ON invoice_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        get_user_role() = 'receptionist'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    );

CREATE POLICY invoice_items_receptionist_update ON invoice_items
    FOR UPDATE
    TO authenticated
    USING (
        get_user_role() = 'receptionist'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    )
    WITH CHECK (
        get_user_role() = 'receptionist'
        AND EXISTS (
            SELECT 1 FROM invoices i
            WHERE i.id = invoice_items.invoice_id
            AND i.clinic_id = get_user_clinic_id()
        )
    );

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

-- Super admin: read all
CREATE POLICY audit_logs_super_admin_select ON audit_logs
    FOR SELECT
    TO authenticated
    USING (get_user_role() = 'super_admin');

-- Clinic owner: read own clinic logs
CREATE POLICY audit_logs_clinic_owner_select ON audit_logs
    FOR SELECT
    TO authenticated
    USING (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );

-- Insert policy for the audit trigger function (runs as SECURITY DEFINER)
-- No user-facing insert policy needed; triggers bypass RLS via SECURITY DEFINER.

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Super admin: full access
CREATE POLICY notifications_super_admin_all ON notifications
    FOR ALL
    TO authenticated
    USING (get_user_role() = 'super_admin')
    WITH CHECK (get_user_role() = 'super_admin');

-- Users can read their own notifications
CREATE POLICY notifications_own_select ON notifications
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY notifications_own_update ON notifications
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Clinic owner: can insert notifications for users in own clinic
CREATE POLICY notifications_clinic_owner_insert ON notifications
    FOR INSERT
    TO authenticated
    WITH CHECK (
        clinic_id = get_user_clinic_id()
        AND get_user_role() = 'clinic_owner'
    );
