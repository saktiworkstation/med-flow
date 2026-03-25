import { z } from 'zod';

// ── Common ─────────────────────────────

const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;

// ── Auth ───────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ── Clinic Onboarding ──────────────────

export const clinicSetupSchema = z.object({
  name: z.string().min(2, 'Nama klinik minimal 2 karakter'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  phone: z.string().regex(phoneRegex, 'Nomor telepon tidak valid'),
  email: z.string().email('Email tidak valid'),
});

export type ClinicSetupFormData = z.infer<typeof clinicSetupSchema>;

export const adminProfileSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().regex(phoneRegex, 'Nomor telepon tidak valid').optional().or(z.literal('')),
  specialization: z.string().optional(),
  license_number: z.string().optional(),
});

export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;

// ── Patient ────────────────────────────

export const patientSchema = z.object({
  full_name: z.string().min(2, 'Nama pasien minimal 2 karakter'),
  date_of_birth: z.string().min(1, 'Tanggal lahir wajib diisi'),
  gender: z.enum(['male', 'female'], { required_error: 'Jenis kelamin wajib dipilih' }),
  blood_type: z.string().optional().nullable(),
  phone: z.string().regex(phoneRegex, 'Nomor telepon tidak valid').optional().or(z.literal('')).nullable(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')).nullable(),
  address: z.string().optional().nullable(),
  emergency_contact_name: z.string().optional().nullable(),
  emergency_contact_phone: z.string().optional().nullable(),
  allergies: z.array(z.string()).default([]),
  insurance_provider: z.string().optional().nullable(),
  insurance_number: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PatientFormData = z.infer<typeof patientSchema>;

// ── Appointment ────────────────────────

export const appointmentSchema = z.object({
  patient_id: z.string().uuid('Pilih pasien'),
  doctor_id: z.string().uuid('Pilih dokter'),
  appointment_date: z.string().min(1, 'Tanggal wajib diisi'),
  start_time: z.string().min(1, 'Waktu mulai wajib diisi'),
  end_time: z.string().min(1, 'Waktu selesai wajib diisi'),
  type: z.enum(['consultation', 'follow_up', 'emergency', 'procedure']),
  complaint: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// ── Medical Record (SOAP) ──────────────

export const medicalRecordSchema = z.object({
  patient_id: z.string().uuid('Pilih pasien'),
  appointment_id: z.string().uuid().optional().nullable(),
  subjective: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  assessment: z.string().optional().nullable(),
  plan: z.string().optional().nullable(),
  vital_signs: z.object({
    blood_pressure_systolic: z.number().min(0).max(300).optional(),
    blood_pressure_diastolic: z.number().min(0).max(200).optional(),
    heart_rate: z.number().min(0).max(300).optional(),
    temperature: z.number().min(30).max(45).optional(),
    weight: z.number().min(0).max(500).optional(),
    height: z.number().min(0).max(300).optional(),
    respiratory_rate: z.number().min(0).max(100).optional(),
    oxygen_saturation: z.number().min(0).max(100).optional(),
  }).default({}),
  icd_10_codes: z.array(z.string()).default([]),
  is_confidential: z.boolean().default(false),
});

export type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

// ── Prescription ───────────────────────

export const prescriptionItemSchema = z.object({
  medication_id: z.string().uuid('Pilih obat'),
  dosage: z.string().min(1, 'Dosis wajib diisi'),
  quantity: z.number().min(1, 'Jumlah minimal 1'),
  frequency: z.string().min(1, 'Frekuensi wajib diisi'),
  duration_days: z.number().min(1, 'Durasi minimal 1 hari'),
  instructions: z.string().optional().nullable(),
});

export const prescriptionSchema = z.object({
  patient_id: z.string().uuid('Pilih pasien'),
  medical_record_id: z.string().uuid('Pilih rekam medis'),
  notes: z.string().optional().nullable(),
  items: z.array(prescriptionItemSchema).min(1, 'Minimal 1 item obat'),
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

// ── Medication ─────────────────────────

export const medicationSchema = z.object({
  name: z.string().min(2, 'Nama obat minimal 2 karakter'),
  generic_name: z.string().optional().nullable(),
  category: z.enum(['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'other']),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  stock_quantity: z.number().min(0, 'Stok tidak boleh negatif'),
  min_stock_alert: z.number().min(0, 'Minimal alert tidak boleh negatif'),
  price_per_unit: z.number().min(0, 'Harga tidak boleh negatif'),
  manufacturer: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;

// ── Invoice ────────────────────────────

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  category: z.enum(['consultation', 'procedure', 'medication', 'lab_test', 'other']),
  quantity: z.number().min(1, 'Jumlah minimal 1'),
  unit_price: z.number().min(0, 'Harga tidak boleh negatif'),
});

export const invoiceSchema = z.object({
  patient_id: z.string().uuid('Pilih pasien'),
  appointment_id: z.string().uuid().optional().nullable(),
  due_date: z.string().min(1, 'Tanggal jatuh tempo wajib diisi'),
  discount_amount: z.number().min(0).default(0),
  payment_method: z.enum(['cash', 'transfer', 'card', 'insurance', 'qris']).optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(invoiceItemSchema).min(1, 'Minimal 1 item tagihan'),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// ── Team Invite ────────────────────────

export const inviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
  role: z.enum(['doctor', 'nurse', 'receptionist', 'pharmacist']),
  full_name: z.string().min(2, 'Nama minimal 2 karakter'),
});

export type InviteFormData = z.infer<typeof inviteSchema>;
