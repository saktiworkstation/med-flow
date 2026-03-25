-- ═══════════════════════════════════════
-- MedFlow Seed Data
-- Realistic Indonesian Healthcare Data
-- ═══════════════════════════════════════

-- Fixed UUIDs for consistency
-- Clinic: 550e8400-e29b-41d4-a716-446655440000
-- Users: 550e8400-e29b-41d4-a716-44665544000X

-- ── Auth Users (Supabase auth.users) ──
-- Password for all: MedFlow123!

INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, aud, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000000', 'budi@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Budi Santoso, Sp.PD"}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440002', '00000000-0000-0000-0000-000000000000', 'siti@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Siti Rahayu"}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440003', '00000000-0000-0000-0000-000000000000', 'ahmad@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ahmad Wijaya, Sp.A"}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000000', 'dewi@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dewi Lestari, A.Md.Kep"}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440005', '00000000-0000-0000-0000-000000000000', 'rina@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rina Wulandari"}', 'authenticated', 'authenticated'),
('550e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000000', 'hendra@kliniksehatsentosa.co.id', crypt('MedFlow123!', gen_salt('bf')), NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hendra Gunawan, S.Farm, Apt"}', 'authenticated', 'authenticated');

-- Auth identities (wajib untuk login via email)
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440001', 'budi@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440001', 'email', 'budi@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440002', 'siti@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440002', 'email', 'siti@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440003', 'ahmad@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440003', 'email', 'ahmad@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440004', 'dewi@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440004', 'email', 'dewi@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440005', 'rina@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440005', 'email', 'rina@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW()),
(gen_random_uuid(), '550e8400-e29b-41d4-a716-446655440006', 'hendra@kliniksehatsentosa.co.id', jsonb_build_object('sub', '550e8400-e29b-41d4-a716-446655440006', 'email', 'hendra@kliniksehatsentosa.co.id', 'email_verified', true, 'phone_verified', false), 'email', NOW(), NOW(), NOW());

-- ── Clinic ─────────────────────────────

INSERT INTO clinics (id, name, slug, address, phone, email, subscription_plan, settings) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Klinik Sehat Sentosa', 'klinik-sehat-sentosa',
 'Jl. Kesehatan No. 123, Kebayoran Baru, Jakarta Selatan 12160',
 '+62211234567', 'info@kliniksehatsentosa.co.id', 'pro',
 '{"operating_hours": {"monday": {"open": "08:00", "close": "20:00", "is_open": true}, "tuesday": {"open": "08:00", "close": "20:00", "is_open": true}, "wednesday": {"open": "08:00", "close": "20:00", "is_open": true}, "thursday": {"open": "08:00", "close": "20:00", "is_open": true}, "friday": {"open": "08:00", "close": "20:00", "is_open": true}, "saturday": {"open": "08:00", "close": "15:00", "is_open": true}, "sunday": {"open": "08:00", "close": "12:00", "is_open": false}}, "consultation_fee": 150000, "tax_rate": 0.11, "currency": "IDR", "timezone": "Asia/Jakarta", "appointment_duration_minutes": 30}'
);

-- ── Users ──────────────────────────────

INSERT INTO users (id, clinic_id, role, full_name, email, phone, specialization, license_number, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'clinic_owner', 'Dr. Budi Santoso, Sp.PD', 'budi@kliniksehatsentosa.co.id', '+6281234567001', 'Penyakit Dalam', 'SIP-001/JKT/2020', true),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'doctor', 'Dr. Siti Rahayu', 'siti@kliniksehatsentosa.co.id', '+6281234567002', 'Umum', 'SIP-002/JKT/2021', true),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'doctor', 'Dr. Ahmad Wijaya, Sp.A', 'ahmad@kliniksehatsentosa.co.id', '+6281234567003', 'Anak', 'SIP-003/JKT/2021', true),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'nurse', 'Dewi Lestari, A.Md.Kep', 'dewi@kliniksehatsentosa.co.id', '+6281234567004', NULL, 'STR-N-004/2022', true),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'receptionist', 'Rina Wulandari', 'rina@kliniksehatsentosa.co.id', '+6281234567005', NULL, NULL, true),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'pharmacist', 'Hendra Gunawan, S.Farm, Apt', 'hendra@kliniksehatsentosa.co.id', '+6281234567006', NULL, 'SIPA-006/JKT/2021', true);

-- ── Patients (50) ──────────────────────

INSERT INTO patients (id, clinic_id, medical_record_number, full_name, date_of_birth, gender, blood_type, phone, email, address, emergency_contact_name, emergency_contact_phone, allergies, insurance_provider, insurance_number, notes) VALUES
('a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240115-0001', 'Agus Setiawan', '1985-03-15', 'male', 'O+', '+6281300000001', 'agus@email.com', 'Jl. Sudirman No. 45, Jakarta Selatan', 'Ratna Setiawan', '+6281300000101', ARRAY['Penisilin'], 'BPJS Kesehatan', '0001234567890', NULL),
('a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240115-0002', 'Sari Dewi Putri', '1990-07-22', 'female', 'A+', '+6281300000002', NULL, 'Jl. Gatot Subroto No. 12, Jakarta Selatan', 'Bambang Putro', '+6281300000102', ARRAY[]::TEXT[], 'Prudential', 'PRU-987654', NULL),
('a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240116-0001', 'Muhammad Rizki', '1978-11-03', 'male', 'B+', '+6281300000003', 'rizki@email.com', 'Jl. Rasuna Said No. 8, Kuningan', 'Fatimah Rizki', '+6281300000103', ARRAY['Aspirin', 'Sulfa'], NULL, NULL, 'Pasien hipertensi kronik'),
('a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240116-0002', 'Ani Yulianti', '1995-02-14', 'female', 'AB-', '+6281300000004', NULL, 'Jl. Kemang Raya No. 20, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567891', NULL),
('a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240117-0001', 'Bambang Widodo', '1970-08-30', 'male', 'A-', '+6281300000005', NULL, 'Jl. Tendean No. 55, Jakarta Selatan', 'Siti Widodo', '+6281300000105', ARRAY['Ibuprofen'], NULL, NULL, 'DM tipe 2, kontrol rutin'),
('a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240117-0002', 'Dewi Anggraini', '1988-12-01', 'female', 'O-', '+6281300000006', 'dewi.a@email.com', 'Jl. Wolter Monginsidi No. 33, Kebayoran', NULL, NULL, ARRAY[]::TEXT[], 'AXA Mandiri', 'AXA-112233', NULL),
('a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240118-0001', 'Eko Prasetyo', '1982-05-20', 'male', 'B-', '+6281300000007', NULL, 'Jl. Panglima Polim No. 10, Jakarta', 'Wati Prasetyo', '+6281300000107', ARRAY['Amoksisilin'], 'BPJS Kesehatan', '0001234567892', NULL),
('a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240118-0002', 'Fitri Handayani', '1992-09-10', 'female', 'A+', '+6281300000008', NULL, 'Jl. Senopati No. 67, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240119-0001', 'Gunawan Pratama', '1975-01-25', 'male', 'O+', '+6281300000009', NULL, 'Jl. Blok M No. 15, Jakarta Selatan', 'Linda Pratama', '+6281300000109', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567893', 'Asma kronik'),
('a0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240119-0002', 'Heni Kurniawati', '1998-04-18', 'female', 'B+', '+6281300000010', 'heni@email.com', 'Jl. Melawai No. 22, Blok M', NULL, NULL, ARRAY['Kodein'], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240120-0001', 'Irfan Hakim', '1983-06-12', 'male', 'AB+', '+6281300000011', NULL, 'Jl. Cipete Raya No. 44, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'Allianz', 'ALZ-445566', NULL),
('a0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240120-0002', 'Jamilah Zahra', '2001-10-05', 'female', 'O+', '+6281300000012', NULL, 'Jl. Radio Dalam No. 77, Jakarta', 'Ahmad Zahra', '+6281300000112', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567894', NULL),
('a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240121-0001', 'Kurniawan Saputra', '1979-02-28', 'male', 'A+', '+6281300000013', NULL, 'Jl. Fatmawati No. 99, Jakarta', NULL, NULL, ARRAY['Penisilin', 'Seafood'], NULL, NULL, 'Kolesterol tinggi'),
('a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240121-0002', 'Lestari Ningrum', '1993-08-08', 'female', 'B+', '+6281300000014', NULL, 'Jl. Cilandak KKO No. 5, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'Prudential', 'PRU-654321', NULL),
('a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240122-0001', 'Mulyono Hadi', '1968-12-20', 'male', 'O-', '+6281300000015', NULL, 'Jl. TB Simatupang No. 18, Jakarta', 'Sri Hadi', '+6281300000115', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567895', 'Riwayat stroke'),
('a0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240122-0002', 'Nadia Safitri', '1997-05-30', 'female', 'A-', '+6281300000016', 'nadia@email.com', 'Jl. Ampera Raya No. 28, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240123-0001', 'Oscar Firmansyah', '1986-07-14', 'male', 'B-', '+6281300000017', NULL, 'Jl. Pejaten Barat No. 41, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567896', NULL),
('a0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240123-0002', 'Putri Maharani', '1994-11-11', 'female', 'AB+', '+6281300000018', NULL, 'Jl. Mampang Prapatan No. 66, Jakarta', 'Rudi Maharani', '+6281300000118', ARRAY['Latex'], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240124-0001', 'Rudi Hermawan', '1973-03-07', 'male', 'O+', '+6281300000019', NULL, 'Jl. Kalibata No. 34, Jakarta Selatan', 'Yuni Hermawan', '+6281300000119', ARRAY['NSAID'], 'BPJS Kesehatan', '0001234567897', 'Gout arthritis'),
('a0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240124-0002', 'Siska Amelia', '2000-01-20', 'female', 'A+', '+6281300000020', 'siska@email.com', 'Jl. Pasar Minggu No. 52, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240125-0001', 'Taufik Hidayat', '1981-09-25', 'male', 'B+', '+6281300000021', NULL, 'Jl. Condet Raya No. 73, Jakarta Timur', NULL, NULL, ARRAY[]::TEXT[], 'Manulife', 'MNL-778899', NULL),
('a0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240125-0002', 'Umi Kulsum', '1989-04-03', 'female', 'O+', '+6281300000022', NULL, 'Jl. Dewi Sartika No. 15, Jakarta Timur', 'Hasan Kulsum', '+6281300000122', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567898', NULL),
('a0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240126-0001', 'Vino Bastian', '1976-06-18', 'male', 'A+', '+6281300000023', NULL, 'Jl. Otista Raya No. 88, Jakarta Timur', NULL, NULL, ARRAY['Sulfonamide'], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240126-0002', 'Winda Permata', '1996-12-09', 'female', 'AB-', '+6281300000024', NULL, 'Jl. Casablanca No. 29, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], 'AIA', 'AIA-223344', NULL),
('a0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240127-0001', 'Yoga Pratama', '1984-10-15', 'male', 'O-', '+6281300000025', 'yoga@email.com', 'Jl. Kuningan No. 42, Jakarta Selatan', 'Nina Pratama', '+6281300000125', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567899', NULL),
('a0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240127-0002', 'Zahra Azzahra', '2003-03-22', 'female', 'B+', '+6281300000026', NULL, 'Jl. Tebet Raya No. 57, Jakarta Selatan', 'Mahmud Azzahra', '+6281300000126', ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240128-0001', 'Arif Rahman', '1991-07-07', 'male', 'A-', '+6281300000027', NULL, 'Jl. Pancoran No. 61, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240128-0002', 'Bella Oktaviani', '1987-08-14', 'female', 'O+', '+6281300000028', NULL, 'Jl. Warung Buncit No. 33, Jakarta', NULL, NULL, ARRAY['Metformin'], 'BPJS Kesehatan', '0001234567900', 'DM tipe 2'),
('a0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240129-0001', 'Cahyo Nugroho', '1980-01-30', 'male', 'B+', '+6281300000029', NULL, 'Jl. Bangka Raya No. 19, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240129-0002', 'Diana Puspita', '1999-05-25', 'female', 'A+', '+6281300000030', 'diana@email.com', 'Jl. Duren Tiga No. 46, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], 'Prudential', 'PRU-112233', NULL),
('a0000000-0000-0000-0000-000000000031', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240130-0001', 'Erik Subagyo', '1974-11-18', 'male', 'AB+', '+6281300000031', NULL, 'Jl. Buncit Raya No. 78, Jakarta', 'Ika Subagyo', '+6281300000131', ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567901', NULL),
('a0000000-0000-0000-0000-000000000032', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240130-0002', 'Fitriani Rahmawati', '1993-02-09', 'female', 'O+', '+6281300000032', NULL, 'Jl. Kemang Timur No. 14, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240131-0001', 'Galih Purnomo', '1988-04-22', 'male', 'A+', '+6281300000033', NULL, 'Jl. Prapanca Raya No. 50, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240131-0002', 'Hasna Wulandari', '2002-09-13', 'female', 'B-', '+6281300000034', NULL, 'Jl. Cipete Utara No. 25, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567902', NULL),
('a0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240201-0001', 'Ilham Saputra', '1977-12-05', 'male', 'O+', '+6281300000035', NULL, 'Jl. Pertanian Raya No. 62, Jakarta', NULL, NULL, ARRAY['ACE Inhibitor'], NULL, NULL, 'Hipertensi stage 2'),
('a0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240201-0002', 'Julia Paramita', '1995-06-28', 'female', 'A+', '+6281300000036', NULL, 'Jl. Siaga Raya No. 37, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'AXA Mandiri', 'AXA-556677', NULL),
('a0000000-0000-0000-0000-000000000037', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240202-0001', 'Kevin Darmawan', '1986-08-16', 'male', 'B+', '+6281300000037', NULL, 'Jl. Hang Lekir No. 11, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567903', NULL),
('a0000000-0000-0000-0000-000000000038', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240202-0002', 'Larasati Dewi', '1990-03-04', 'female', 'AB+', '+6281300000038', NULL, 'Jl. Barito No. 44, Jakarta Selatan', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000039', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240203-0001', 'Maulana Ibrahim', '1971-10-20', 'male', 'O-', '+6281300000039', NULL, 'Jl. Pakubuwono No. 89, Jakarta', 'Siti Ibrahim', '+6281300000139', ARRAY[]::TEXT[], NULL, NULL, 'COPD'),
('a0000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240203-0002', 'Novita Sari', '1998-07-17', 'female', 'A+', '+6281300000040', 'novita@email.com', 'Jl. Senayan No. 23, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567904', NULL),
('a0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240204-0001', 'Panji Wicaksono', '1983-05-09', 'male', 'B+', '+6281300000041', NULL, 'Jl. Dharmawangsa No. 35, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000042', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240204-0002', 'Qori Aisyah', '2004-01-12', 'female', 'O+', '+6281300000042', NULL, 'Jl. Trunojoyo No. 18, Jakarta', 'Faisal Aisyah', '+6281300000142', ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000043', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240205-0001', 'Rama Aditya', '1979-09-30', 'male', 'A-', '+6281300000043', NULL, 'Jl. Wijaya No. 51, Jakarta', NULL, NULL, ARRAY['Erythromycin'], 'BPJS Kesehatan', '0001234567905', NULL),
('a0000000-0000-0000-0000-000000000044', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240205-0002', 'Selvi Anggraeni', '1996-11-24', 'female', 'B-', '+6281300000044', NULL, 'Jl. Permata Hijau No. 9, Jakarta', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000045', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240206-0001', 'Tommy Surya', '1985-02-17', 'male', 'O+', '+6281300000045', NULL, 'Jl. Simprug No. 65, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'Allianz', 'ALZ-998877', NULL),
('a0000000-0000-0000-0000-000000000046', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240206-0002', 'Ulfa Mariana', '1992-06-08', 'female', 'A+', '+6281300000046', NULL, 'Jl. Pondok Indah No. 31, Jakarta', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567906', NULL),
('a0000000-0000-0000-0000-000000000047', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240207-0001', 'Wahyu Santoso', '1972-08-21', 'male', 'AB-', '+6281300000047', NULL, 'Jl. Lebak Bulus No. 40, Jakarta', 'Dina Santoso', '+6281300000147', ARRAY[]::TEXT[], NULL, NULL, 'Riwayat jantung koroner'),
('a0000000-0000-0000-0000-000000000048', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240207-0002', 'Xena Oktavia', '2001-04-15', 'female', 'O-', '+6281300000048', NULL, 'Jl. Ciputat Raya No. 55, Tangerang Selatan', NULL, NULL, ARRAY[]::TEXT[], NULL, NULL, NULL),
('a0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240208-0001', 'Yusuf Maulana', '1987-10-02', 'male', 'B+', '+6281300000049', NULL, 'Jl. BSD Raya No. 72, Tangerang Selatan', NULL, NULL, ARRAY[]::TEXT[], 'BPJS Kesehatan', '0001234567907', NULL),
('a0000000-0000-0000-0000-000000000050', '550e8400-e29b-41d4-a716-446655440000', 'MR-20240208-0002', 'Zaskia Mecca', '1994-12-28', 'female', 'A+', '+6281300000050', 'zaskia@email.com', 'Jl. Bintaro Utama No. 16, Tangerang Selatan', NULL, NULL, ARRAY[]::TEXT[], 'Prudential', 'PRU-445566', NULL);

-- ── Medications (40) ───────────────────

INSERT INTO medications (id, clinic_id, name, generic_name, category, unit, stock_quantity, min_stock_alert, price_per_unit, manufacturer, is_active) VALUES
('b0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'Paracetamol 500mg', 'Paracetamol', 'tablet', 'tablet', 500, 50, 500, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'Amoxicillin 500mg', 'Amoxicillin', 'capsule', 'kapsul', 300, 30, 1500, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'Omeprazole 20mg', 'Omeprazole', 'capsule', 'kapsul', 200, 20, 3000, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'Amlodipine 5mg', 'Amlodipine', 'tablet', 'tablet', 250, 25, 2000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'Metformin 500mg', 'Metformin', 'tablet', 'tablet', 400, 40, 1000, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'Cetirizine 10mg', 'Cetirizine', 'tablet', 'tablet', 350, 30, 800, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'Ibuprofen 400mg', 'Ibuprofen', 'tablet', 'tablet', 280, 30, 1200, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'Lansoprazole 30mg', 'Lansoprazole', 'capsule', 'kapsul', 150, 15, 4000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'Captopril 25mg', 'Captopril', 'tablet', 'tablet', 180, 20, 900, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'Simvastatin 20mg', 'Simvastatin', 'tablet', 'tablet', 220, 25, 2500, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'Salbutamol Inhaler', 'Salbutamol', 'inhaler', 'pcs', 15, 5, 45000, 'GlaxoSmithKline', true),
('b0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'Ambroxol Sirup 60ml', 'Ambroxol', 'syrup', 'botol', 40, 10, 15000, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'Dexamethasone 0.5mg', 'Dexamethasone', 'tablet', 'tablet', 300, 30, 700, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'Ciprofloxacin 500mg', 'Ciprofloxacin', 'tablet', 'tablet', 100, 15, 3500, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'Ranitidine 150mg', 'Ranitidine', 'tablet', 'tablet', 200, 20, 1500, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'Loratadine 10mg', 'Loratadine', 'tablet', 'tablet', 250, 25, 1000, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'Betahistine 6mg', 'Betahistine', 'tablet', 'tablet', 150, 15, 2000, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'Domperidone 10mg', 'Domperidone', 'tablet', 'tablet', 180, 20, 1200, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'Diclofenac Gel 20g', 'Diclofenac', 'cream', 'tube', 25, 5, 25000, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'Cefadroxil 500mg', 'Cefadroxil', 'capsule', 'kapsul', 120, 15, 4500, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', 'Mefenamic Acid 500mg', 'Asam Mefenamat', 'tablet', 'tablet', 300, 30, 800, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', 'Methylprednisolone 4mg', 'Methylprednisolone', 'tablet', 'tablet', 160, 15, 2500, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', 'OBH Combi Sirup 60ml', 'Dextromethorphan', 'syrup', 'botol', 35, 10, 18000, 'Combiphar', true),
('b0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', 'Antacid DOEN', 'Al/Mg Hydroxide', 'tablet', 'tablet', 400, 40, 400, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', 'Vitamin B Complex', 'Vitamin B Complex', 'tablet', 'tablet', 500, 50, 300, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', 'Vitamin C 500mg', 'Ascorbic Acid', 'tablet', 'tablet', 450, 40, 500, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', 'Clopidogrel 75mg', 'Clopidogrel', 'tablet', 'tablet', 80, 10, 8000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', 'Glimepiride 2mg', 'Glimepiride', 'tablet', 'tablet', 120, 15, 3000, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', 'Tetes Mata Cendo', 'Chloramphenicol', 'drops', 'botol', 20, 5, 12000, 'Cendo', true),
('b0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', 'Ketoconazole Cream 15g', 'Ketoconazole', 'cream', 'tube', 18, 5, 22000, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000031', '550e8400-e29b-41d4-a716-446655440000', 'Loperamide 2mg', 'Loperamide', 'tablet', 'tablet', 200, 20, 600, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000032', '550e8400-e29b-41d4-a716-446655440000', 'Bisoprolol 5mg', 'Bisoprolol', 'tablet', 'tablet', 100, 10, 5000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440000', 'Losartan 50mg', 'Losartan', 'tablet', 'tablet', 150, 15, 4000, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440000', 'Gabapentin 300mg', 'Gabapentin', 'capsule', 'kapsul', 60, 10, 6000, 'Kalbe Farma', true),
('b0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440000', 'Fluconazole 150mg', 'Fluconazole', 'capsule', 'kapsul', 30, 5, 15000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440000', 'Azithromycin 500mg', 'Azithromycin', 'tablet', 'tablet', 90, 10, 8000, 'Sanbe Farma', true),
('b0000000-0000-0000-0000-000000000037', '550e8400-e29b-41d4-a716-446655440000', 'NaCl 0.9% Infus 500ml', 'Sodium Chloride', 'injection', 'botol', 50, 10, 15000, 'Otsuka', true),
('b0000000-0000-0000-0000-000000000038', '550e8400-e29b-41d4-a716-446655440000', 'Ranitidin Injeksi', 'Ranitidine', 'injection', 'ampul', 40, 8, 8000, 'Kimia Farma', true),
('b0000000-0000-0000-0000-000000000039', '550e8400-e29b-41d4-a716-446655440000', 'Ondansetron 4mg', 'Ondansetron', 'tablet', 'tablet', 80, 10, 5000, 'Dexa Medica', true),
('b0000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440000', 'Tramadol 50mg', 'Tramadol', 'capsule', 'kapsul', 50, 10, 3500, 'Kimia Farma', true);

-- ── Notifications (sample) ─────────────

INSERT INTO notifications (clinic_id, user_id, type, title, message, is_read, action_url) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'low_stock', 'Stok Obat Rendah', 'Salbutamol Inhaler tersisa 15 unit, di bawah batas minimum 5.', false, '/medications'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'new_patient', 'Pasien Baru Terdaftar', 'Zaskia Mecca telah terdaftar sebagai pasien baru.', false, '/patients'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'appointment_reminder', 'Pengingat Jadwal', 'Anda memiliki 5 jadwal pasien hari ini.', false, '/appointments'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'payment_due', 'Tagihan Jatuh Tempo', '3 tagihan akan jatuh tempo minggu ini.', false, '/invoices'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'system', 'Resep Baru', 'Ada 2 resep baru menunggu untuk di-dispense.', false, '/pharmacy'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'system', 'Update Sistem', 'MedFlow versi 2.0 tersedia dengan fitur analitik baru.', true, NULL),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'appointment_reminder', 'Jadwal Besok', 'Anda memiliki 3 jadwal pasien besok, dimulai pukul 09:00.', false, '/appointments'),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'system', 'Tugas Baru', 'Ada 4 pasien yang perlu pemeriksaan tanda vital hari ini.', false, '/appointments');

-- ═══════════════════════════════════════
-- Appointments (100)
-- ═══════════════════════════════════════

INSERT INTO appointments (id, clinic_id, patient_id, doctor_id, appointment_date, start_time, end_time, status, type, complaint, notes, created_at, updated_at) VALUES
-- January 2024
('c0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', '08:00', '08:30', 'completed', 'consultation', 'Nyeri ulu hati dan mual selama 3 hari', 'Pasien datang dengan keluhan dispepsia', '2024-01-15 07:45:00+07', '2024-01-15 08:35:00+07'),
('c0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15', '08:30', '09:00', 'completed', 'consultation', 'Batuk berdahak 1 minggu', 'Suspect ISPA', '2024-01-15 08:15:00+07', '2024-01-15 09:05:00+07'),
('c0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol tekanan darah rutin', 'TD masih belum terkontrol optimal', '2024-01-15 08:50:00+07', '2024-01-15 09:35:00+07'),
('c0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440003', '2024-01-15', '09:00', '09:30', 'completed', 'consultation', 'Demam tinggi pada anak 3 hari', 'Anak usia 5 tahun, suspect dengue', '2024-01-15 08:55:00+07', '2024-01-15 09:40:00+07'),
('c0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', '2024-01-15', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol gula darah', 'DM tipe 2 terkontrol', '2024-01-15 09:50:00+07', '2024-01-15 10:35:00+07'),
('c0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15', '10:00', '10:30', 'cancelled', 'consultation', 'Sakit kepala berulang', 'Pasien membatalkan via telepon', '2024-01-14 16:00:00+07', '2024-01-15 07:30:00+07'),
('c0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16', '08:00', '08:30', 'completed', 'consultation', 'Nyeri sendi lutut kanan', 'Suspect osteoarthritis', '2024-01-16 07:50:00+07', '2024-01-16 08:40:00+07'),
('c0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440002', '2024-01-16', '08:30', '09:00', 'completed', 'consultation', 'Ruam kulit gatal di tangan', 'Dermatitis kontak', '2024-01-16 08:20:00+07', '2024-01-16 09:10:00+07'),
('c0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440001', '2024-01-16', '09:30', '10:00', 'completed', 'follow_up', 'Kontrol asma', 'Asma terkontrol sebagian', '2024-01-16 09:20:00+07', '2024-01-16 10:05:00+07'),
('c0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440003', '2024-01-16', '10:00', '10:30', 'no_show', 'consultation', 'Sakit tenggorokan', 'Pasien tidak datang tanpa konfirmasi', '2024-01-15 14:00:00+07', '2024-01-16 10:30:00+07'),
('c0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440002', '2024-01-17', '08:00', '08:30', 'completed', 'consultation', 'Diare 2 hari', 'Gastroenteritis akut', '2024-01-17 07:55:00+07', '2024-01-17 08:35:00+07'),
('c0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440003', '2024-01-17', '09:00', '09:30', 'completed', 'consultation', 'Vaksinasi anak', 'Imunisasi DPT booster', '2024-01-17 08:50:00+07', '2024-01-17 09:25:00+07'),
('c0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440001', '2024-01-17', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol kolesterol', 'Kolesterol membaik dengan statin', '2024-01-17 09:55:00+07', '2024-01-17 10:40:00+07'),
('c0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', '2024-01-17', '11:00', '11:30', 'completed', 'consultation', 'Pusing dan lemas', 'Anemia defisiensi besi', '2024-01-17 10:50:00+07', '2024-01-17 11:35:00+07'),
('c0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440001', '2024-01-18', '08:00', '08:30', 'completed', 'emergency', 'Nyeri dada tiba-tiba', 'EKG normal, suspect GERD', '2024-01-18 08:00:00+07', '2024-01-18 08:45:00+07'),
('c0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440002', '2024-01-18', '09:00', '09:30', 'completed', 'consultation', 'Nyeri haid berlebih', 'Dismenore primer', '2024-01-18 08:55:00+07', '2024-01-18 09:35:00+07'),
('c0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440001', '2024-01-18', '10:00', '10:30', 'cancelled', 'follow_up', 'Kontrol pasca operasi', 'Dibatalkan karena hujan deras', '2024-01-17 20:00:00+07', '2024-01-18 07:00:00+07'),
('c0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440003', '2024-01-18', '10:30', '11:00', 'completed', 'consultation', 'Anak rewel dan tidak mau makan', 'Stomatitis aftosa', '2024-01-18 10:25:00+07', '2024-01-18 11:05:00+07'),
('c0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440001', '2024-01-19', '08:30', '09:00', 'completed', 'follow_up', 'Kontrol asam urat', 'Gout terkontrol, lanjutkan allopurinol', '2024-01-19 08:25:00+07', '2024-01-19 09:10:00+07'),
('c0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440002', '2024-01-19', '09:00', '09:30', 'completed', 'consultation', 'Mata merah dan gatal', 'Konjungtivitis alergi', '2024-01-19 08:55:00+07', '2024-01-19 09:35:00+07'),
('c0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440001', '2024-01-22', '08:00', '08:30', 'completed', 'consultation', 'Kesemutan tangan dan kaki', 'Neuropati perifer', '2024-01-22 07:55:00+07', '2024-01-22 08:40:00+07'),
('c0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440002', '2024-01-22', '09:00', '09:30', 'completed', 'consultation', 'Sering buang air kecil', 'Suspect ISK', '2024-01-22 08:50:00+07', '2024-01-22 09:35:00+07'),
('c0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440003', '2024-01-22', '09:30', '10:00', 'completed', 'consultation', 'Anak batuk pilek 5 hari', 'Common cold, terapi simptomatik', '2024-01-22 09:25:00+07', '2024-01-22 10:05:00+07'),
('c0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440001', '2024-01-22', '10:30', '11:00', 'no_show', 'follow_up', 'Kontrol diabetes', 'Pasien tidak hadir', '2024-01-20 10:00:00+07', '2024-01-22 11:00:00+07'),
('c0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440002', '2024-01-23', '08:00', '08:30', 'completed', 'consultation', 'Sesak napas saat aktivitas', 'Bronkitis kronik', '2024-01-23 07:55:00+07', '2024-01-23 08:40:00+07'),
('c0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440001', '2024-01-23', '09:00', '09:30', 'completed', 'procedure', 'Pemasangan infus', 'Dehidrasi sedang akibat diare', '2024-01-23 08:50:00+07', '2024-01-23 10:00:00+07'),
('c0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440003', '2024-01-23', '10:00', '10:30', 'completed', 'consultation', 'Ruam popok pada bayi', 'Diaper dermatitis', '2024-01-23 09:55:00+07', '2024-01-23 10:30:00+07'),
('c0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440002', '2024-01-24', '08:00', '08:30', 'completed', 'consultation', 'Nyeri punggung bawah', 'Low back pain, muscle strain', '2024-01-24 07:55:00+07', '2024-01-24 08:35:00+07'),
('c0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440001', '2024-01-24', '09:00', '09:30', 'completed', 'consultation', 'Vertigo berulang', 'BPPV, manuver Epley dilakukan', '2024-01-24 08:55:00+07', '2024-01-24 09:40:00+07'),
('c0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440002', '2024-01-24', '10:00', '10:30', 'cancelled', 'consultation', 'Alergi kulit', 'Pasien reschedule ke minggu depan', '2024-01-23 15:00:00+07', '2024-01-24 07:00:00+07'),
-- February 2024
('c0000000-0000-0000-0000-000000000031', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol dispepsia', 'Gejala membaik dengan PPI', '2024-02-01 07:50:00+07', '2024-02-01 08:35:00+07'),
('c0000000-0000-0000-0000-000000000032', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000031', '550e8400-e29b-41d4-a716-446655440002', '2024-02-01', '08:30', '09:00', 'completed', 'consultation', 'Insomnia kronik', 'Gangguan tidur 2 bulan', '2024-02-01 08:25:00+07', '2024-02-01 09:05:00+07'),
('c0000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000032', '550e8400-e29b-41d4-a716-446655440003', '2024-02-01', '09:30', '10:00', 'completed', 'consultation', 'Anak demam setelah imunisasi', 'KIPI ringan, observasi', '2024-02-01 09:25:00+07', '2024-02-01 10:05:00+07'),
('c0000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440001', '2024-02-01', '10:30', '11:00', 'completed', 'consultation', 'Tremor tangan', 'Essential tremor', '2024-02-01 10:25:00+07', '2024-02-01 11:05:00+07'),
('c0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440002', '2024-02-02', '08:00', '08:30', 'completed', 'consultation', 'Bengkak di leher', 'Limfadenopati, perlu USG', '2024-02-02 07:55:00+07', '2024-02-02 08:40:00+07'),
('c0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440001', '2024-02-02', '09:00', '09:30', 'completed', 'emergency', 'Reaksi alergi makanan', 'Urtikaria akut, antihistamin IV', '2024-02-02 09:00:00+07', '2024-02-02 09:45:00+07'),
('c0000000-0000-0000-0000-000000000037', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', '2024-02-05', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol hipertensi', 'TD 130/85, dosis amlodipine ditambah', '2024-02-05 07:55:00+07', '2024-02-05 08:40:00+07'),
('c0000000-0000-0000-0000-000000000038', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440002', '2024-02-05', '09:00', '09:30', 'completed', 'consultation', 'Keputihan abnormal', 'Kandidosis vaginal', '2024-02-05 08:55:00+07', '2024-02-05 09:35:00+07'),
('c0000000-0000-0000-0000-000000000039', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000037', '550e8400-e29b-41d4-a716-446655440003', '2024-02-05', '10:00', '10:30', 'no_show', 'consultation', 'Tumbuh kembang anak', 'Tidak hadir tanpa kabar', '2024-02-04 10:00:00+07', '2024-02-05 10:30:00+07'),
('c0000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000038', '550e8400-e29b-41d4-a716-446655440001', '2024-02-06', '08:00', '08:30', 'completed', 'consultation', 'Telinga berdenging', 'Tinnitus, rujuk THT', '2024-02-06 07:50:00+07', '2024-02-06 08:40:00+07'),
('c0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000039', '550e8400-e29b-41d4-a716-446655440002', '2024-02-06', '09:00', '09:30', 'completed', 'consultation', 'Jerawat parah di wajah', 'Acne vulgaris grade III', '2024-02-06 08:55:00+07', '2024-02-06 09:40:00+07'),
('c0000000-0000-0000-0000-000000000042', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440003', '2024-02-06', '10:00', '10:30', 'completed', 'consultation', 'Anak sering mimisan', 'Epistaksis anterior, cauterisasi', '2024-02-06 09:55:00+07', '2024-02-06 10:40:00+07'),
('c0000000-0000-0000-0000-000000000043', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440001', '2024-02-07', '08:00', '08:30', 'completed', 'procedure', 'Jahit luka di lengan', 'Luka robek 5cm, 6 jahitan', '2024-02-07 08:00:00+07', '2024-02-07 08:50:00+07'),
('c0000000-0000-0000-0000-000000000044', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000042', '550e8400-e29b-41d4-a716-446655440002', '2024-02-07', '09:30', '10:00', 'completed', 'consultation', 'Kram perut berulang', 'Irritable bowel syndrome', '2024-02-07 09:25:00+07', '2024-02-07 10:05:00+07'),
('c0000000-0000-0000-0000-000000000045', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000043', '550e8400-e29b-41d4-a716-446655440001', '2024-02-08', '08:00', '08:30', 'completed', 'consultation', 'Bengkak kaki bilateral', 'Edema tungkai, cek fungsi ginjal', '2024-02-08 07:55:00+07', '2024-02-08 08:40:00+07'),
('c0000000-0000-0000-0000-000000000046', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000044', '550e8400-e29b-41d4-a716-446655440003', '2024-02-08', '09:00', '09:30', 'completed', 'consultation', 'Anak diare 3 hari', 'Diare akut tanpa dehidrasi', '2024-02-08 08:55:00+07', '2024-02-08 09:35:00+07'),
('c0000000-0000-0000-0000-000000000047', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', '2024-02-12', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol DM bulanan', 'HbA1c 7.2%, target belum tercapai', '2024-02-12 07:50:00+07', '2024-02-12 08:40:00+07'),
('c0000000-0000-0000-0000-000000000048', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000045', '550e8400-e29b-41d4-a716-446655440002', '2024-02-12', '09:00', '09:30', 'cancelled', 'consultation', 'Nyeri perut bawah', 'Reschedule oleh pasien', '2024-02-11 18:00:00+07', '2024-02-12 07:00:00+07'),
('c0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000046', '550e8400-e29b-41d4-a716-446655440001', '2024-02-12', '10:00', '10:30', 'completed', 'consultation', 'Sulit menelan', 'Faringitis akut', '2024-02-12 09:55:00+07', '2024-02-12 10:35:00+07'),
('c0000000-0000-0000-0000-000000000050', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000047', '550e8400-e29b-41d4-a716-446655440003', '2024-02-12', '11:00', '11:30', 'completed', 'consultation', 'Berat badan anak kurang', 'Failure to thrive, perlu gizi konsul', '2024-02-12 10:55:00+07', '2024-02-12 11:35:00+07'),
('c0000000-0000-0000-0000-000000000051', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000048', '550e8400-e29b-41d4-a716-446655440002', '2024-02-13', '08:00', '08:30', 'completed', 'consultation', 'Gatal seluruh badan', 'Pruritus generalisata, cek fungsi hati', '2024-02-13 07:55:00+07', '2024-02-13 08:40:00+07'),
('c0000000-0000-0000-0000-000000000052', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440001', '2024-02-13', '09:00', '09:30', 'completed', 'emergency', 'Sesak napas akut', 'Asma eksaserbasi akut, nebulisasi', '2024-02-13 09:00:00+07', '2024-02-13 09:50:00+07'),
('c0000000-0000-0000-0000-000000000053', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000050', '550e8400-e29b-41d4-a716-446655440002', '2024-02-13', '10:00', '10:30', 'completed', 'consultation', 'Hidung tersumbat kronik', 'Rinitis alergi', '2024-02-13 09:55:00+07', '2024-02-13 10:35:00+07'),
('c0000000-0000-0000-0000-000000000054', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440001', '2024-02-14', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol lutut', 'Perbaikan dengan fisioterapi', '2024-02-14 07:55:00+07', '2024-02-14 08:35:00+07'),
('c0000000-0000-0000-0000-000000000055', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440002', '2024-02-14', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol ISPA', 'Batuk sudah berkurang', '2024-02-14 08:55:00+07', '2024-02-14 09:35:00+07'),
('c0000000-0000-0000-0000-000000000056', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15', '08:30', '09:00', 'completed', 'follow_up', 'Kontrol jantung rutin', 'EKG stabil, lanjut terapi', '2024-02-15 08:25:00+07', '2024-02-15 09:05:00+07'),
('c0000000-0000-0000-0000-000000000057', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440002', '2024-02-15', '09:30', '10:00', 'completed', 'consultation', 'Alergi kulit (reschedule)', 'Dermatitis atopik', '2024-02-15 09:25:00+07', '2024-02-15 10:05:00+07'),
('c0000000-0000-0000-0000-000000000058', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440003', '2024-02-15', '10:30', '11:00', 'completed', 'follow_up', 'Kontrol pasca dengue', 'Trombosit sudah normal', '2024-02-15 10:25:00+07', '2024-02-15 11:00:00+07'),
('c0000000-0000-0000-0000-000000000059', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440001', '2024-02-19', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol asma bulanan', 'Asma terkontrol baik', '2024-02-19 07:55:00+07', '2024-02-19 08:35:00+07'),
('c0000000-0000-0000-0000-000000000060', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440002', '2024-02-19', '09:00', '09:30', 'no_show', 'follow_up', 'Kontrol gastroenteritis', 'Pasien tidak datang', '2024-02-18 10:00:00+07', '2024-02-19 09:30:00+07'),
-- March 2024
('c0000000-0000-0000-0000-000000000061', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', '2024-03-01', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol dispepsia rutin', 'Gejala hilang, stop PPI', '2024-03-01 07:50:00+07', '2024-03-01 08:35:00+07'),
('c0000000-0000-0000-0000-000000000062', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440002', '2024-03-01', '08:30', '09:00', 'completed', 'consultation', 'Sakit tenggorokan dan demam', 'Tonsilofaringitis akut', '2024-03-01 08:25:00+07', '2024-03-01 09:05:00+07'),
('c0000000-0000-0000-0000-000000000063', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440002', '2024-03-01', '09:30', '10:00', 'completed', 'follow_up', 'Kontrol mata', 'Konjungtivitis sembuh', '2024-03-01 09:25:00+07', '2024-03-01 10:00:00+07'),
('c0000000-0000-0000-0000-000000000064', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440003', '2024-03-01', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol pasca imunisasi', 'Tidak ada KIPI lanjutan', '2024-03-01 09:55:00+07', '2024-03-01 10:25:00+07'),
('c0000000-0000-0000-0000-000000000065', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', '2024-03-04', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol hipertensi rutin', 'TD 125/80, perbaikan', '2024-03-04 07:50:00+07', '2024-03-04 08:35:00+07'),
('c0000000-0000-0000-0000-000000000066', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440002', '2024-03-04', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol bronkitis', 'Membaik, lanjut terapi inhaler', '2024-03-04 08:55:00+07', '2024-03-04 09:35:00+07'),
('c0000000-0000-0000-0000-000000000067', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440001', '2024-03-04', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol kolesterol rutin', 'LDL turun ke 120, target tercapai', '2024-03-04 09:55:00+07', '2024-03-04 10:35:00+07'),
('c0000000-0000-0000-0000-000000000068', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440002', '2024-03-05', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol nyeri punggung', 'Membaik dengan fisioterapi', '2024-03-05 07:55:00+07', '2024-03-05 08:35:00+07'),
('c0000000-0000-0000-0000-000000000069', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440001', '2024-03-05', '09:00', '09:30', 'completed', 'follow_up', 'Angkat jahitan', 'Luka sembuh baik, jahitan diangkat', '2024-03-05 08:55:00+07', '2024-03-05 09:30:00+07'),
('c0000000-0000-0000-0000-000000000070', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000046', '550e8400-e29b-41d4-a716-446655440003', '2024-03-05', '10:00', '10:30', 'completed', 'consultation', 'Anak sering sakit', 'Imunodefisiensi? Cek lab lengkap', '2024-03-05 09:55:00+07', '2024-03-05 10:40:00+07'),
('c0000000-0000-0000-0000-000000000071', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', '2024-03-06', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol anemia', 'Hb naik ke 11.5, lanjut Fe', '2024-03-06 07:55:00+07', '2024-03-06 08:35:00+07'),
('c0000000-0000-0000-0000-000000000072', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440001', '2024-03-06', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol gout', 'Asam urat 6.5, terkontrol', '2024-03-06 08:55:00+07', '2024-03-06 09:35:00+07'),
('c0000000-0000-0000-0000-000000000073', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440001', '2024-03-07', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol neuropati', 'Perbaikan dengan gabapentin', '2024-03-07 07:55:00+07', '2024-03-07 08:35:00+07'),
('c0000000-0000-0000-0000-000000000074', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440002', '2024-03-07', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol ISK', 'Kultur urine bersih', '2024-03-07 08:55:00+07', '2024-03-07 09:30:00+07'),
('c0000000-0000-0000-0000-000000000075', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440002', '2024-03-07', '10:00', '10:30', 'cancelled', 'consultation', 'Nyeri pinggang', 'Pasien batalkan', '2024-03-06 17:00:00+07', '2024-03-07 07:00:00+07'),
('c0000000-0000-0000-0000-000000000076', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440001', '2024-03-08', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol vertigo', 'Tidak kambuh, stop betahistine', '2024-03-08 07:55:00+07', '2024-03-08 08:30:00+07'),
('c0000000-0000-0000-0000-000000000077', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', '2024-03-11', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol DM rutin', 'HbA1c 6.8%, membaik', '2024-03-11 07:55:00+07', '2024-03-11 08:35:00+07'),
('c0000000-0000-0000-0000-000000000078', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440002', '2024-03-11', '09:00', '09:30', 'completed', 'consultation', 'Jerawat membandel', 'Acne vulgaris, rujuk dermatologi', '2024-03-11 08:55:00+07', '2024-03-11 09:35:00+07'),
('c0000000-0000-0000-0000-000000000079', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000042', '550e8400-e29b-41d4-a716-446655440002', '2024-03-11', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol IBS', 'Gejala terkontrol dengan diet', '2024-03-11 09:55:00+07', '2024-03-11 10:35:00+07'),
('c0000000-0000-0000-0000-000000000080', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000044', '550e8400-e29b-41d4-a716-446655440003', '2024-03-11', '11:00', '11:30', 'completed', 'follow_up', 'Kontrol diare anak', 'Diare teratasi, gizi membaik', '2024-03-11 10:55:00+07', '2024-03-11 11:30:00+07'),
('c0000000-0000-0000-0000-000000000081', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440001', '2024-03-12', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol jantung', 'Stabil, lanjut terapi', '2024-03-12 07:55:00+07', '2024-03-12 08:35:00+07'),
('c0000000-0000-0000-0000-000000000082', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440001', '2024-03-12', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol tremor', 'Tremor berkurang dengan propranolol', '2024-03-12 08:55:00+07', '2024-03-12 09:35:00+07'),
('c0000000-0000-0000-0000-000000000083', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000050', '550e8400-e29b-41d4-a716-446655440002', '2024-03-12', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol rinitis', 'Gejala berkurang dengan antihistamin', '2024-03-12 09:55:00+07', '2024-03-12 10:30:00+07'),
('c0000000-0000-0000-0000-000000000084', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440002', '2024-03-13', '08:00', '08:30', 'completed', 'consultation', 'Nyeri perut kanan bawah', 'Suspect apendisitis, rujuk RS', '2024-03-13 08:00:00+07', '2024-03-13 08:45:00+07'),
('c0000000-0000-0000-0000-000000000085', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000043', '550e8400-e29b-41d4-a716-446655440001', '2024-03-13', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol fungsi ginjal', 'Kreatinin normal, edema berkurang', '2024-03-13 08:55:00+07', '2024-03-13 09:35:00+07'),
('c0000000-0000-0000-0000-000000000086', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440003', '2024-03-13', '10:00', '10:30', 'no_show', 'follow_up', 'Kontrol stomatitis anak', 'Tidak hadir', '2024-03-12 15:00:00+07', '2024-03-13 10:30:00+07'),
('c0000000-0000-0000-0000-000000000087', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440001', '2024-03-14', '08:00', '08:30', 'completed', 'follow_up', 'Kontrol alergi', 'Tidak ada reaksi berulang', '2024-03-14 07:55:00+07', '2024-03-14 08:30:00+07'),
('c0000000-0000-0000-0000-000000000088', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440002', '2024-03-14', '09:00', '09:30', 'completed', 'follow_up', 'Kontrol limfadenopati', 'USG normal, observasi', '2024-03-14 08:55:00+07', '2024-03-14 09:35:00+07'),
('c0000000-0000-0000-0000-000000000089', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440001', '2024-03-14', '10:00', '10:30', 'completed', 'follow_up', 'Kontrol pasca dehidrasi', 'Kondisi baik, hidrasi cukup', '2024-03-14 09:55:00+07', '2024-03-14 10:30:00+07'),
('c0000000-0000-0000-0000-000000000090', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440003', '2024-03-14', '11:00', '11:30', 'completed', 'follow_up', 'Kontrol epistaksis', 'Tidak kambuh, selaput lendir baik', '2024-03-14 10:55:00+07', '2024-03-14 11:25:00+07'),
-- Scheduled / upcoming appointments
('c0000000-0000-0000-0000-000000000091', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15', '08:00', '08:30', 'scheduled', 'follow_up', 'Kontrol hipertensi', NULL, '2024-03-10 10:00:00+07', '2024-03-10 10:00:00+07'),
('c0000000-0000-0000-0000-000000000092', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15', '09:00', '09:30', 'scheduled', 'follow_up', 'Kontrol DM', NULL, '2024-03-11 08:35:00+07', '2024-03-11 08:35:00+07'),
('c0000000-0000-0000-0000-000000000093', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440002', '2024-03-15', '08:30', '09:00', 'confirmed', 'consultation', 'Sakit gigi', NULL, '2024-03-13 14:00:00+07', '2024-03-14 09:00:00+07'),
('c0000000-0000-0000-0000-000000000094', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440003', '2024-03-15', '09:00', '09:30', 'confirmed', 'follow_up', 'Kontrol tumbuh kembang', NULL, '2024-03-12 16:00:00+07', '2024-03-14 08:00:00+07'),
('c0000000-0000-0000-0000-000000000095', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440002', '2024-03-15', '10:00', '10:30', 'scheduled', 'follow_up', 'Kontrol keputihan', NULL, '2024-03-05 09:35:00+07', '2024-03-05 09:35:00+07'),
('c0000000-0000-0000-0000-000000000096', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15', '10:00', '10:30', 'confirmed', 'follow_up', 'Kontrol asma', NULL, '2024-02-19 08:35:00+07', '2024-03-14 10:00:00+07'),
('c0000000-0000-0000-0000-000000000097', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000048', '550e8400-e29b-41d4-a716-446655440002', '2024-03-15', '11:00', '11:30', 'in_progress', 'follow_up', 'Kontrol fungsi hati', NULL, '2024-02-13 08:40:00+07', '2024-03-15 11:00:00+07'),
('c0000000-0000-0000-0000-000000000098', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000047', '550e8400-e29b-41d4-a716-446655440003', '2024-03-15', '10:30', '11:00', 'in_progress', 'follow_up', 'Kontrol gizi anak', NULL, '2024-02-12 11:35:00+07', '2024-03-15 10:30:00+07'),
('c0000000-0000-0000-0000-000000000099', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15', '11:00', '11:30', 'scheduled', 'follow_up', 'Kontrol asma pasca eksaserbasi', NULL, '2024-02-13 09:50:00+07', '2024-02-13 09:50:00+07'),
('c0000000-0000-0000-0000-000000000100', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440001', '2024-03-15', '14:00', '14:30', 'scheduled', 'follow_up', 'Kontrol kolesterol 3 bulanan', NULL, '2024-03-04 10:35:00+07', '2024-03-04 10:35:00+07');

-- ═══════════════════════════════════════
-- Medical Records (30) - SOAP format
-- ═══════════════════════════════════════

INSERT INTO medical_records (id, clinic_id, patient_id, doctor_id, appointment_id, record_date, subjective, objective, assessment, plan, vital_signs, icd_10_codes, attachments, is_confidential, created_at, updated_at) VALUES
('d0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000001', '2024-01-15 08:30:00+07',
 'Pasien mengeluh nyeri ulu hati dan mual selama 3 hari. Nyeri memburuk setelah makan pedas. Tidak ada muntah darah.',
 'Abdomen: nyeri tekan epigastrium, tidak ada defans muskuler. Bising usus normal. Tidak ada hepatomegali.',
 'Dispepsia fungsional. DD: Gastritis erosif, GERD.',
 'Omeprazole 20mg 2x1 sebelum makan selama 14 hari. Antasida 3x1 setelah makan. Edukasi diet: hindari makanan pedas, asam, kopi. Kontrol 2 minggu.',
 '{"tekanan_darah": "120/80", "nadi": 78, "suhu": 36.5, "pernapasan": 18, "berat_badan": 72, "tinggi_badan": 170}',
 ARRAY['K30', 'R10.1'], ARRAY[]::TEXT[], false, '2024-01-15 08:35:00+07', '2024-01-15 08:35:00+07'),

('d0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000002', '2024-01-15 09:00:00+07',
 'Batuk berdahak warna putih kekuningan selama 1 minggu. Pilek dan demam ringan. Tidak sesak napas.',
 'Faring hiperemis, tonsil T1-T1 tenang. Ronki basah kasar di kedua lapang paru. Tidak ada wheezing.',
 'ISPA (Infeksi Saluran Pernapasan Akut) - Bronkitis akut.',
 'Ambroxol 30mg 3x1. Paracetamol 500mg 3x1 jika demam. Salbutamol 2mg 3x1 jika batuk berat. Istirahat cukup, minum air hangat. Kontrol jika tidak membaik 5 hari.',
 '{"tekanan_darah": "110/70", "nadi": 82, "suhu": 37.8, "pernapasan": 20, "berat_badan": 55, "tinggi_badan": 160}',
 ARRAY['J20.9', 'J06.9'], ARRAY[]::TEXT[], false, '2024-01-15 09:05:00+07', '2024-01-15 09:05:00+07'),

('d0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000003', '2024-01-15 09:30:00+07',
 'Kontrol tekanan darah rutin. Masih sering pusing terutama pagi hari. Minum obat teratur. Kurang olahraga.',
 'TD 145/95 mmHg. Nadi 80x/menit reguler. Jantung: BJ I-II reguler, tidak ada murmur. Edema tungkai minimal.',
 'Hipertensi grade I, belum terkontrol optimal.',
 'Amlodipine 10mg dinaikkan dari 5mg, 1x1 pagi. Candesartan 8mg 1x1 pagi (tambahan). Diet rendah garam. Olahraga jalan 30 menit 3x seminggu. Kontrol 2 minggu.',
 '{"tekanan_darah": "145/95", "nadi": 80, "suhu": 36.6, "pernapasan": 18, "berat_badan": 85, "tinggi_badan": 168}',
 ARRAY['I10'], ARRAY[]::TEXT[], false, '2024-01-15 09:35:00+07', '2024-01-15 09:35:00+07'),

('d0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440003', 'c0000000-0000-0000-0000-000000000004', '2024-01-15 09:40:00+07',
 'Anak perempuan 5 tahun demam tinggi 3 hari. Demam naik-turun. Nafsu makan menurun. Nyeri otot dan sendi. Tidak ada ruam.',
 'Anak tampak lemas. Petechiae di lengan kanan. Rumple Leede positif. Hepar teraba 1cm BAC. Tourniquet test positif.',
 'Demam Dengue. DD: Demam Berdarah Dengue grade I.',
 'Cek darah lengkap serial. Paracetamol 250mg 3x1 (15mg/kgBB). Minum banyak air, jus buah. Kompres hangat. Tirah baring. Kontrol besok dengan hasil lab. Ke IGD jika mimisan, muntah terus, atau nyeri perut hebat.',
 '{"tekanan_darah": "90/60", "nadi": 110, "suhu": 39.2, "pernapasan": 24, "berat_badan": 18, "tinggi_badan": 108}',
 ARRAY['A90'], ARRAY[]::TEXT[], false, '2024-01-15 09:40:00+07', '2024-01-15 09:40:00+07'),

('d0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000005', '2024-01-15 10:30:00+07',
 'Kontrol gula darah bulanan. Minum metformin teratur. Diet sudah dijaga. Kadang lupa makan tepat waktu.',
 'GDS 185 mg/dL. Kaki: sensasi normal, tidak ada luka. Funduskopi dalam batas normal.',
 'Diabetes Mellitus tipe 2, terkontrol sebagian.',
 'Metformin 500mg 3x1 (lanjutkan). Glimepiride 2mg 1x1 sebelum makan pagi (tambahan). Cek HbA1c bulan depan. Edukasi pola makan teratur dan olahraga. Kontrol 1 bulan.',
 '{"tekanan_darah": "130/85", "nadi": 76, "suhu": 36.5, "pernapasan": 18, "berat_badan": 78, "tinggi_badan": 165, "gula_darah_sewaktu": 185}',
 ARRAY['E11.9'], ARRAY[]::TEXT[], false, '2024-01-15 10:35:00+07', '2024-01-15 10:35:00+07'),

('d0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000007', '2024-01-16 08:40:00+07',
 'Nyeri sendi lutut kanan 2 minggu. Memburuk saat naik tangga. Tidak ada riwayat trauma. Kaku pagi hari sekitar 15 menit.',
 'Lutut kanan: tidak ada efusi, krepitasi saat fleksi, ROM terbatas 10-120 derajat. Tes McMurray negatif.',
 'Osteoarthritis lutut kanan grade II.',
 'Meloxicam 15mg 1x1 setelah makan. Glucosamine 500mg 3x1. Fisioterapi 2x seminggu. Kompres hangat. Kurangi aktivitas naik turun tangga. Kontrol 1 bulan.',
 '{"tekanan_darah": "125/80", "nadi": 74, "suhu": 36.4, "pernapasan": 17, "berat_badan": 80, "tinggi_badan": 172}',
 ARRAY['M17.1'], ARRAY[]::TEXT[], false, '2024-01-16 08:40:00+07', '2024-01-16 08:40:00+07'),

('d0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000008', '2024-01-16 09:10:00+07',
 'Ruam gatal di kedua tangan sejak 5 hari lalu. Baru ganti sabun cuci piring. Semakin gatal jika terkena air.',
 'Plak eritematosa, vesikel kecil, ekskoriasi di dorsum manus bilateral. Batas tegas sesuai area kontak.',
 'Dermatitis kontak iritan.',
 'Hindari kontak dengan sabun iritan, gunakan sarung tangan. Betamethasone cream 0.1% 2x/hari tipis di area lesi selama 7 hari. Cetirizine 10mg 1x1 malam. Kontrol 1 minggu jika tidak membaik.',
 '{"tekanan_darah": "115/75", "nadi": 76, "suhu": 36.5, "pernapasan": 18, "berat_badan": 52, "tinggi_badan": 158}',
 ARRAY['L24.9'], ARRAY[]::TEXT[], false, '2024-01-16 09:10:00+07', '2024-01-16 09:10:00+07'),

('d0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000009', '2024-01-16 10:05:00+07',
 'Kontrol asma. Sesak jarang kambuh, sekitar 1x seminggu. Inhaler digunakan saat sesak. Tidur kadang terganggu.',
 'Paru: wheezing ekspirasi minimal bilateral. Peak flow 75% predicted. SpO2 97%.',
 'Asma bronkial persisten ringan, terkontrol sebagian.',
 'Budesonide inhaler 200mcg 2x1 (lanjutkan). Salbutamol inhaler PRN. Hindari pemicu: debu, asap rokok. Kontrol 1 bulan.',
 '{"tekanan_darah": "120/75", "nadi": 80, "suhu": 36.5, "pernapasan": 20, "berat_badan": 70, "tinggi_badan": 167, "spo2": 97}',
 ARRAY['J45.2'], ARRAY[]::TEXT[], false, '2024-01-16 10:05:00+07', '2024-01-16 10:05:00+07'),

('d0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000011', '2024-01-17 08:35:00+07',
 'Diare cair 6x sehari selama 2 hari. Mual, muntah 2x. Makan nasi goreng di warung kemarin. Badan lemas.',
 'Turgor kulit sedikit menurun. Bising usus meningkat. Nyeri tekan difus abdomen tanpa defans.',
 'Gastroenteritis akut. Dehidrasi ringan-sedang.',
 'Oralit setiap BAB cair. Loperamide 2mg jika diare >3x. Ondansetron 4mg 2x1 untuk mual. Zinc 20mg 1x1. Diet lunak. Banyak minum. Kontrol jika tidak membaik 2 hari.',
 '{"tekanan_darah": "105/65", "nadi": 92, "suhu": 37.5, "pernapasan": 20, "berat_badan": 68, "tinggi_badan": 175}',
 ARRAY['A09', 'E86.0'], ARRAY[]::TEXT[], false, '2024-01-17 08:35:00+07', '2024-01-17 08:35:00+07'),

('d0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000013', '2024-01-17 10:40:00+07',
 'Kontrol kolesterol. Sudah minum simvastatin 3 bulan. Diet sudah diatur. Masih makan gorengan 2-3x seminggu.',
 'Lab: Total kolesterol 220, LDL 145, HDL 45, Trigliserida 180. BMI 27.5 (overweight).',
 'Dislipidemia, perbaikan parsial dengan statin.',
 'Simvastatin 20mg 1x1 malam (lanjutkan). Diet rendah lemak jenuh, kurangi gorengan. Olahraga aerobik 150 menit/minggu. Target LDL <130. Kontrol 3 bulan dengan lab.',
 '{"tekanan_darah": "130/85", "nadi": 76, "suhu": 36.4, "pernapasan": 18, "berat_badan": 82, "tinggi_badan": 173}',
 ARRAY['E78.5'], ARRAY[]::TEXT[], false, '2024-01-17 10:40:00+07', '2024-01-17 10:40:00+07'),

('d0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000014', '2024-01-17 11:35:00+07',
 'Pusing dan lemas sudah 2 minggu. Sering capek meskipun tidur cukup. Haid banyak tiap bulan. Makan kurang nafsu.',
 'Konjungtiva anemis bilateral. Kuku sendok. Hepatosplenomegali tidak ada. Lab: Hb 9.2 g/dL, MCV 68 fL, Fe serum 25 mcg/dL.',
 'Anemia defisiensi besi. Suspect menorrhagia sebagai penyebab.',
 'Ferrous sulfate 300mg 2x1 sebelum makan. Vitamin C 500mg 1x1 (meningkatkan absorpsi Fe). Asam mefenamat 500mg 3x1 saat haid. Cek Hb ulang 1 bulan. Rujuk Obgyn jika menorrhagia berlanjut.',
 '{"tekanan_darah": "100/60", "nadi": 88, "suhu": 36.5, "pernapasan": 20, "berat_badan": 50, "tinggi_badan": 155}',
 ARRAY['D50.9', 'N92.0'], ARRAY[]::TEXT[], false, '2024-01-17 11:35:00+07', '2024-01-17 11:35:00+07'),

('d0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000015', '2024-01-18 08:45:00+07',
 'Nyeri dada kiri tiba-tiba saat istirahat. Durasi 15 menit. Terasa seperti terbakar. Menjalar ke ulu hati. Ada riwayat stroke.',
 'EKG: sinus rhythm, tidak ada ST elevasi. Troponin negatif. Nyeri tekan epigastrium. Tidak ada diaphoresis.',
 'GERD dengan nyeri dada non-kardiak. DD: ACS (ruled out).',
 'Lansoprazole 30mg 2x1 sebelum makan. Sucralfat syrup 3x1. Hindari makan sebelum tidur. Tidur dengan kepala ditinggikan 30 derajat. Cek cardiac enzym serial. Jika nyeri dada berulang, segera ke IGD.',
 '{"tekanan_darah": "150/90", "nadi": 88, "suhu": 36.6, "pernapasan": 22, "berat_badan": 75, "tinggi_badan": 166}',
 ARRAY['K21.0', 'R07.9'], ARRAY[]::TEXT[], false, '2024-01-18 08:45:00+07', '2024-01-18 08:45:00+07'),

('d0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000016', '2024-01-18 09:35:00+07',
 'Nyeri perut bawah saat haid sejak menarche. Intensitas 8/10. Mual, kadang muntah. Tidak bisa beraktivitas hari pertama haid.',
 'Nyeri tekan suprapubik. Tidak ada massa. Siklus haid teratur 28 hari, durasi 5-7 hari.',
 'Dismenore primer.',
 'Asam mefenamat 500mg 3x1 mulai 1 hari sebelum haid. Vitamin B6 50mg 1x1. Kompres hangat perut bawah. Olahraga ringan teratur. Pertimbangkan kontrasepsi hormonal jika tidak membaik.',
 '{"tekanan_darah": "110/70", "nadi": 80, "suhu": 36.5, "pernapasan": 18, "berat_badan": 48, "tinggi_badan": 157}',
 ARRAY['N94.4'], ARRAY[]::TEXT[], true, '2024-01-18 09:35:00+07', '2024-01-18 09:35:00+07'),

('d0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000019', '2024-01-19 09:10:00+07',
 'Kontrol asam urat. Nyeri jempol kaki sudah tidak kambuh 2 bulan. Minum allopurinol teratur. Diet sudah dijaga.',
 'Sendi MTP I bilateral: tidak bengkak, tidak nyeri. Lab: asam urat 6.8 mg/dL (sebelumnya 9.2).',
 'Gout arthritis, terkontrol dengan allopurinol.',
 'Allopurinol 300mg 1x1 (lanjutkan). Diet rendah purin. Minum air putih 2-3 liter/hari. Hindari alkohol dan jeroan. Kontrol 3 bulan.',
 '{"tekanan_darah": "130/80", "nadi": 74, "suhu": 36.4, "pernapasan": 18, "berat_badan": 76, "tinggi_badan": 170}',
 ARRAY['M10.9'], ARRAY[]::TEXT[], false, '2024-01-19 09:10:00+07', '2024-01-19 09:10:00+07'),

('d0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000021', '2024-01-22 08:40:00+07',
 'Kesemutan dan kebas di tangan dan kaki sejak 1 bulan. Terutama malam hari. Rasa seperti ditusuk jarum.',
 'Sensasi getar menurun di jari kaki. Refleks ankle menurun bilateral. Monofilament test abnormal.',
 'Neuropati perifer. DD: Neuropati diabetik, defisiensi B12.',
 'Gabapentin 300mg 1x1 malam, titrasi ke 300mg 3x1 jika toleransi baik. Vitamin B kompleks 3x1. Cek GDS, HbA1c, B12. Kontrol 2 minggu.',
 '{"tekanan_darah": "125/80", "nadi": 76, "suhu": 36.5, "pernapasan": 18, "berat_badan": 70, "tinggi_badan": 168}',
 ARRAY['G62.9'], ARRAY[]::TEXT[], false, '2024-01-22 08:40:00+07', '2024-01-22 08:40:00+07'),

('d0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000022', '2024-01-22 09:35:00+07',
 'Sering buang air kecil 10-12x sehari, terasa panas. Nyeri di perut bawah. Kadang urine keruh.',
 'Nyeri tekan suprapubik. Nyeri ketok CVA negatif. Urinalisis: leukosit +++, nitrit positif, eritrosit +.',
 'Infeksi saluran kemih (ISK) bawah - sistitis akut.',
 'Ciprofloxacin 500mg 2x1 selama 3 hari. Phenazopyridine 200mg 3x1 selama 2 hari (untuk nyeri). Banyak minum air putih. Jangan menahan BAK. Kontrol 1 minggu dengan urinalisis ulang.',
 '{"tekanan_darah": "118/75", "nadi": 82, "suhu": 37.2, "pernapasan": 18, "berat_badan": 58, "tinggi_badan": 162}',
 ARRAY['N30.0'], ARRAY[]::TEXT[], true, '2024-01-22 09:35:00+07', '2024-01-22 09:35:00+07'),

('d0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000025', '2024-01-23 08:40:00+07',
 'Sesak napas saat aktivitas ringan seperti naik tangga. Batuk berdahak putih pagi hari. Riwayat merokok 20 tahun.',
 'Barrel chest. Perkusi hipersonor. Ronki basah dan wheezing bilateral. SpO2 93%.',
 'Bronkitis kronik. DD: PPOK.',
 'Salbutamol inhaler 2 puff 3x/hari. N-acetylcysteine 200mg 3x1. Berhenti merokok (wajib). Spirometri untuk konfirmasi PPOK. Rujuk paru jika SpO2 <90%. Kontrol 2 minggu.',
 '{"tekanan_darah": "135/85", "nadi": 88, "suhu": 36.6, "pernapasan": 24, "berat_badan": 65, "tinggi_badan": 170, "spo2": 93}',
 ARRAY['J42', 'J44.1'], ARRAY[]::TEXT[], false, '2024-01-23 08:40:00+07', '2024-01-23 08:40:00+07'),

('d0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000028', '2024-01-24 08:35:00+07',
 'Nyeri punggung bawah sejak angkat galon air kemarin. Nyeri bertambah saat membungkuk. Tidak menjalar ke kaki.',
 'Spasme otot paravertebral lumbal. Straight leg raising negatif bilateral. Tidak ada defisit neurologis.',
 'Low back pain akut - muscle strain.',
 'Diclofenac 50mg 3x1 setelah makan selama 5 hari. Eperisone 50mg 3x1 sebagai muscle relaxant. Kompres hangat. Hindari mengangkat berat. Tirah baring 1-2 hari. Kontrol jika tidak membaik.',
 '{"tekanan_darah": "120/80", "nadi": 78, "suhu": 36.5, "pernapasan": 18, "berat_badan": 74, "tinggi_badan": 171}',
 ARRAY['M54.5'], ARRAY[]::TEXT[], false, '2024-01-24 08:35:00+07', '2024-01-24 08:35:00+07'),

('d0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000029', '2024-01-24 09:40:00+07',
 'Vertigo berputar saat bangun tidur pagi ini. Mual, hampir muntah. Memburuk saat menoleh ke kanan.',
 'Dix-Hallpike test positif ke kanan. Nistagmus rotatorik. Romberg test positif. Tidak ada defisit saraf kranial.',
 'BPPV (Benign Paroxysmal Positional Vertigo) kanal posterior kanan.',
 'Manuver Epley dilakukan - berhasil. Betahistine 24mg 2x1 selama 7 hari. Dimenhidrinat 50mg 3x1 PRN mual. Hindari gerakan kepala mendadak. Latihan Brandt-Daroff di rumah. Kontrol 1 minggu.',
 '{"tekanan_darah": "130/80", "nadi": 84, "suhu": 36.5, "pernapasan": 18, "berat_badan": 68, "tinggi_badan": 165}',
 ARRAY['H81.1'], ARRAY[]::TEXT[], false, '2024-01-24 09:40:00+07', '2024-01-24 09:40:00+07'),

('d0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000036', '2024-02-02 09:45:00+07',
 'Reaksi alergi setelah makan udang 2 jam lalu. Gatal seluruh badan. Bengkak di bibir. Tidak sesak.',
 'Urtikaria generalisata. Angioedema bibir inferior. Tidak ada stridor. SpO2 98%. TD stabil.',
 'Reaksi alergi akut - urtikaria dan angioedema. Tanpa anafilaksis.',
 'Dexamethasone 5mg IV. Diphenhydramine 50mg IM. Cetirizine 10mg 1x1 selama 5 hari. Methylprednisolone 8mg 2x1 selama 3 hari lalu taper. Hindari seafood terutama udang. Bawa antihistamin darurat. Observasi 2 jam.',
 '{"tekanan_darah": "125/80", "nadi": 96, "suhu": 36.8, "pernapasan": 20, "berat_badan": 60, "tinggi_badan": 163}',
 ARRAY['T78.2', 'L50.0'], ARRAY[]::TEXT[], false, '2024-02-02 09:45:00+07', '2024-02-02 09:45:00+07'),

('d0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000037', '2024-02-05 08:40:00+07',
 'Kontrol hipertensi 2 minggu. Sudah minum amlodipine 10mg dan candesartan. Pusing berkurang. Mulai jalan pagi.',
 'TD 130/85 mmHg. Nadi 76x/menit. Edema tungkai berkurang.',
 'Hipertensi grade I, perbaikan dengan dual therapy.',
 'Amlodipine 10mg 1x1 dan Candesartan 8mg 1x1 (lanjutkan). Teruskan olahraga. Diet DASH. Kontrol 1 bulan.',
 '{"tekanan_darah": "130/85", "nadi": 76, "suhu": 36.5, "pernapasan": 18, "berat_badan": 84, "tinggi_badan": 168}',
 ARRAY['I10'], ARRAY[]::TEXT[], false, '2024-02-05 08:40:00+07', '2024-02-05 08:40:00+07'),

('d0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000038', '2024-02-05 09:35:00+07',
 'Keputihan banyak berwarna putih seperti susu, gatal area kemaluan 1 minggu. Tidak berbau.',
 'Discharge vaginal putih kental. Eritema vulva. KOH preparation: pseudohyphae positif.',
 'Kandidosis vulvovaginal.',
 'Fluconazole 150mg dosis tunggal oral. Clotrimazole cream vaginal 1% setiap malam 7 hari. Hindari celana ketat. Jaga kebersihan area genital. Kontrol 2 minggu jika tidak membaik.',
 '{"tekanan_darah": "110/70", "nadi": 78, "suhu": 36.6, "pernapasan": 18, "berat_badan": 56, "tinggi_badan": 159}',
 ARRAY['B37.3'], ARRAY[]::TEXT[], true, '2024-02-05 09:35:00+07', '2024-02-05 09:35:00+07'),

('d0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000043', '2024-02-07 08:50:00+07',
 'Luka robek di lengan kiri karena terjatuh dari motor 1 jam lalu. Perdarahan aktif. Tidak ada fraktur.',
 'Luka laserasi 5cm di lengan kiri anterior, kedalaman 0.5cm. Tepi ireguler. Tidak ada benda asing. Neurovaskular distal baik.',
 'Vulnus laceratum regio antebrachii sinistra.',
 'Wound debridement dan hecting 6 jahitan (silk 3-0). Profilaksis tetanus (ATS 1500IU IM). Amoxicillin 500mg 3x1 selama 5 hari. Asam mefenamat 500mg 3x1 PRN nyeri. Ganti perban tiap 2 hari. Angkat jahitan 7-10 hari.',
 '{"tekanan_darah": "130/85", "nadi": 92, "suhu": 36.7, "pernapasan": 20, "berat_badan": 72, "tinggi_badan": 173}',
 ARRAY['S51.8', 'T14.1'], ARRAY[]::TEXT[], false, '2024-02-07 08:50:00+07', '2024-02-07 08:50:00+07'),

('d0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000047', '2024-02-12 08:40:00+07',
 'Kontrol DM bulanan. Minum obat teratur. Diet dijaga. HbA1c bulan ini 7.2%. Kadang hipoglikemia ringan siang hari.',
 'GDS 145 mg/dL (membaik). Kaki: inspeksi normal. Sensibilitas baik.',
 'DM tipe 2, perbaikan tapi HbA1c belum target. Hipoglikemia ringan karena glimepiride.',
 'Metformin 500mg 3x1 (lanjutkan). Glimepiride turunkan ke 1mg 1x1. Target HbA1c <7%. Edukasi tanda hipoglikemia, bawa permen. Kontrol 1 bulan.',
 '{"tekanan_darah": "128/82", "nadi": 74, "suhu": 36.5, "pernapasan": 18, "berat_badan": 77, "tinggi_badan": 165, "gula_darah_sewaktu": 145}',
 ARRAY['E11.65'], ARRAY[]::TEXT[], false, '2024-02-12 08:40:00+07', '2024-02-12 08:40:00+07'),

('d0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000052', '2024-02-13 09:50:00+07',
 'Sesak napas mendadak sejak 30 menit lalu. Riwayat asma sejak kecil. Terpicu debu saat bersih-bersih rumah.',
 'Pasien tampak sesak, posisi tripod. Wheezing bilateral, ekspirasi memanjang. RR 28x/menit. SpO2 91%. Retraksi interkostal.',
 'Asma eksaserbasi akut sedang.',
 'Nebulisasi salbutamol + ipratropium bromide, 3 siklus. Dexamethasone 5mg IV. Oksigen nasal kanul 3L/menit. Methylprednisolone 16mg 2x1 selama 5 hari lalu taper. Budesonide inhaler 400mcg 2x1 maintenance. Observasi 2 jam.',
 '{"tekanan_darah": "140/90", "nadi": 110, "suhu": 36.8, "pernapasan": 28, "berat_badan": 65, "tinggi_badan": 162, "spo2": 91}',
 ARRAY['J45.31'], ARRAY[]::TEXT[], false, '2024-02-13 09:50:00+07', '2024-02-13 09:50:00+07'),

('d0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000065', '2024-03-04 08:35:00+07',
 'Kontrol hipertensi rutin bulanan. Minum obat teratur. Sudah rutin jalan pagi. Pusing sudah jarang.',
 'TD 125/80 mmHg. Nadi 72x/menit. Tidak ada edema. BB turun 1kg.',
 'Hipertensi grade I, terkontrol baik dengan dual therapy.',
 'Amlodipine 10mg 1x1 dan Candesartan 8mg 1x1 (lanjutkan). Pertahankan gaya hidup sehat. Kontrol 1 bulan.',
 '{"tekanan_darah": "125/80", "nadi": 72, "suhu": 36.4, "pernapasan": 17, "berat_badan": 83, "tinggi_badan": 168}',
 ARRAY['I10'], ARRAY[]::TEXT[], false, '2024-03-04 08:35:00+07', '2024-03-04 08:35:00+07'),

('d0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000067', '2024-03-04 10:35:00+07',
 'Kontrol kolesterol 3 bulan. Minum simvastatin teratur. Sudah kurangi gorengan. Olahraga 2x seminggu.',
 'Lab: Total kolesterol 195, LDL 120, HDL 50, Trigliserida 150. BMI 26.8.',
 'Dislipidemia, target LDL tercapai (<130).',
 'Simvastatin 20mg 1x1 malam (lanjutkan). Pertahankan diet dan olahraga. Kontrol 3 bulan.',
 '{"tekanan_darah": "128/82", "nadi": 74, "suhu": 36.5, "pernapasan": 18, "berat_badan": 80, "tinggi_badan": 173}',
 ARRAY['E78.5'], ARRAY[]::TEXT[], false, '2024-03-04 10:35:00+07', '2024-03-04 10:35:00+07'),

('d0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000084', '2024-03-13 08:45:00+07',
 'Nyeri perut kanan bawah sejak tadi malam. Semakin memberat. Mual, nafsu makan hilang. Demam ringan.',
 'McBurney point tenderness positif. Rovsing sign positif. Psoas sign positif. Rebound tenderness positif. Lab: Leukosit 14.500.',
 'Suspect Apendisitis akut. Perlu konfirmasi USG dan tindakan bedah.',
 'Puasakan pasien. Infus RL 20 tpm. Ketorolac 30mg IV untuk nyeri. Ceftriaxone 1g IV profilaksis. USG abdomen stat. Rujuk bedah RS untuk appendectomy. Surat rujukan diberikan.',
 '{"tekanan_darah": "130/85", "nadi": 96, "suhu": 38.1, "pernapasan": 22, "berat_badan": 52, "tinggi_badan": 160}',
 ARRAY['K35.8'], ARRAY[]::TEXT[], false, '2024-03-13 08:45:00+07', '2024-03-13 08:45:00+07'),

('d0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', 'c0000000-0000-0000-0000-000000000077', '2024-03-11 08:35:00+07',
 'Kontrol DM rutin. Minum obat teratur. Tidak ada hipoglikemia lagi setelah dosis glimepiride diturunkan. HbA1c 6.8%.',
 'GDS 130 mg/dL. Kaki: inspeksi normal. Monofilament test normal.',
 'DM tipe 2, terkontrol baik. HbA1c mencapai target <7%.',
 'Metformin 500mg 3x1 dan Glimepiride 1mg 1x1 (lanjutkan). Pertahankan pola hidup sehat. Kontrol 3 bulan.',
 '{"tekanan_darah": "125/80", "nadi": 72, "suhu": 36.4, "pernapasan": 18, "berat_badan": 76, "tinggi_badan": 165, "gula_darah_sewaktu": 130}',
 ARRAY['E11.65'], ARRAY[]::TEXT[], false, '2024-03-11 08:35:00+07', '2024-03-11 08:35:00+07'),

('d0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', 'c0000000-0000-0000-0000-000000000071', '2024-03-06 08:35:00+07',
 'Kontrol anemia. Sudah minum tablet besi 1 bulan. Lemas berkurang. Haid bulan ini tidak terlalu banyak.',
 'Konjungtiva tidak anemis. Lab: Hb 11.5 g/dL (naik dari 9.2), MCV 75 fL, Fe serum 45 mcg/dL.',
 'Anemia defisiensi besi, perbaikan signifikan.',
 'Ferrous sulfate 300mg 2x1 (lanjutkan 2 bulan lagi). Vitamin C 500mg 1x1. Cek Hb ulang 2 bulan. Evaluasi Obgyn jika menorrhagia kambuh.',
 '{"tekanan_darah": "110/70", "nadi": 78, "suhu": 36.5, "pernapasan": 18, "berat_badan": 51, "tinggi_badan": 155}',
 ARRAY['D50.9'], ARRAY[]::TEXT[], false, '2024-03-06 08:35:00+07', '2024-03-06 08:35:00+07');

-- ═══════════════════════════════════════
-- Prescriptions (20) with Prescription Items
-- ═══════════════════════════════════════

INSERT INTO prescriptions (id, clinic_id, patient_id, doctor_id, medical_record_id, prescription_date, status, notes, created_at, updated_at) VALUES
('e0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000001', '2024-01-15 08:35:00+07', 'dispensed', 'Obat dispepsia', '2024-01-15 08:35:00+07', '2024-01-15 09:00:00+07'),
('e0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000002', '2024-01-15 09:05:00+07', 'dispensed', 'Obat ISPA', '2024-01-15 09:05:00+07', '2024-01-15 09:30:00+07'),
('e0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000003', '2024-01-15 09:35:00+07', 'dispensed', 'Obat hipertensi - dosis naik', '2024-01-15 09:35:00+07', '2024-01-15 10:00:00+07'),
('e0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440003', 'd0000000-0000-0000-0000-000000000004', '2024-01-15 09:40:00+07', 'dispensed', 'Obat demam dengue anak', '2024-01-15 09:40:00+07', '2024-01-15 10:10:00+07'),
('e0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000005', '2024-01-15 10:35:00+07', 'dispensed', 'Obat DM - tambah glimepiride', '2024-01-15 10:35:00+07', '2024-01-15 11:00:00+07'),
('e0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000006', '2024-01-16 08:40:00+07', 'dispensed', 'Obat osteoarthritis', '2024-01-16 08:40:00+07', '2024-01-16 09:10:00+07'),
('e0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000007', '2024-01-16 09:10:00+07', 'dispensed', 'Obat dermatitis kontak', '2024-01-16 09:10:00+07', '2024-01-16 09:40:00+07'),
('e0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000009', '2024-01-17 08:35:00+07', 'dispensed', 'Obat gastroenteritis', '2024-01-17 08:35:00+07', '2024-01-17 09:00:00+07'),
('e0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000011', '2024-01-17 11:35:00+07', 'dispensed', 'Obat anemia defisiensi besi', '2024-01-17 11:35:00+07', '2024-01-17 12:00:00+07'),
('e0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000012', '2024-01-18 08:45:00+07', 'dispensed', 'Obat GERD', '2024-01-18 08:45:00+07', '2024-01-18 09:15:00+07'),
('e0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000016', '2024-01-22 09:35:00+07', 'dispensed', 'Antibiotik ISK', '2024-01-22 09:35:00+07', '2024-01-22 10:00:00+07'),
('e0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000017', '2024-01-23 08:40:00+07', 'dispensed', 'Obat bronkitis', '2024-01-23 08:40:00+07', '2024-01-23 09:00:00+07'),
('e0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000018', '2024-01-24 08:35:00+07', 'dispensed', 'Obat LBP', '2024-01-24 08:35:00+07', '2024-01-24 09:00:00+07'),
('e0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000019', '2024-01-24 09:40:00+07', 'dispensed', 'Obat BPPV', '2024-01-24 09:40:00+07', '2024-01-24 10:00:00+07'),
('e0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000020', '2024-02-02 09:45:00+07', 'dispensed', 'Obat alergi akut', '2024-02-02 09:45:00+07', '2024-02-02 10:15:00+07'),
('e0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000022', '2024-02-05 09:35:00+07', 'dispensed', 'Obat kandidosis vaginal', '2024-02-05 09:35:00+07', '2024-02-05 10:00:00+07'),
('e0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000023', '2024-02-07 08:50:00+07', 'partially_dispensed', 'Obat luka jahit - ATS dari stok RS', '2024-02-07 08:50:00+07', '2024-02-07 09:20:00+07'),
('e0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440001', 'd0000000-0000-0000-0000-000000000025', '2024-02-13 09:50:00+07', 'dispensed', 'Obat asma eksaserbasi', '2024-02-13 09:50:00+07', '2024-02-13 10:20:00+07'),
('e0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000028', '2024-03-13 08:45:00+07', 'pending', 'Obat pre-rujuk apendisitis', '2024-03-13 08:45:00+07', '2024-03-13 08:45:00+07'),
('e0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440002', 'd0000000-0000-0000-0000-000000000030', '2024-03-06 08:35:00+07', 'partially_dispensed', 'Obat anemia lanjutan - vitamin C habis stok', '2024-03-06 08:35:00+07', '2024-03-06 09:00:00+07');

-- Prescription Items
INSERT INTO prescription_items (id, prescription_id, medication_id, dosage, frequency, duration_days, quantity, instructions, created_at) VALUES
-- Rx 1: Dispepsia
('e1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000013', '20mg', '2x sehari sebelum makan', 14, 28, 'Diminum 30 menit sebelum makan', '2024-01-15 08:35:00+07'),
('e1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000014', '500mg', '3x sehari setelah makan', 14, 42, NULL, '2024-01-15 08:35:00+07'),
-- Rx 2: ISPA
('e1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000030', '30mg', '3x sehari', 7, 21, 'Pengencer dahak', '2024-01-15 09:05:00+07'),
('e1000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', '500mg', '3x sehari jika demam >38C', 7, 21, 'Jangan melebihi 4g/hari', '2024-01-15 09:05:00+07'),
('e1000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000017', '2mg', '3x sehari jika batuk berat', 5, 15, NULL, '2024-01-15 09:05:00+07'),
-- Rx 3: Hipertensi
('e1000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', '10mg', '1x sehari pagi', 30, 30, 'Dosis dinaikkan dari 5mg', '2024-01-15 09:35:00+07'),
('e1000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000020', '8mg', '1x sehari pagi', 30, 30, 'Obat baru ditambahkan', '2024-01-15 09:35:00+07'),
-- Rx 4: Dengue anak
('e1000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', '250mg', '3x sehari jika demam >38C', 5, 15, 'Dosis anak 15mg/kgBB', '2024-01-15 09:40:00+07'),
-- Rx 5: DM
('e1000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', '500mg', '3x sehari setelah makan', 30, 90, 'Lanjutkan', '2024-01-15 10:35:00+07'),
('e1000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000019', '2mg', '1x sehari sebelum makan pagi', 30, 30, 'Obat baru', '2024-01-15 10:35:00+07'),
-- Rx 6: Osteoarthritis
('e1000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000024', '15mg', '1x sehari setelah makan', 14, 14, NULL, '2024-01-16 08:40:00+07'),
('e1000000-0000-0000-0000-000000000012', 'e0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000031', '500mg', '3x sehari', 30, 90, 'Suplemen sendi', '2024-01-16 08:40:00+07'),
-- Rx 7: Dermatitis kontak
('e1000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000010', '10mg', '1x sehari malam', 7, 7, NULL, '2024-01-16 09:10:00+07'),
-- Rx 8: Gastroenteritis
('e1000000-0000-0000-0000-000000000014', 'e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000039', '4mg', '2x sehari', 3, 6, 'Untuk mual', '2024-01-17 08:35:00+07'),
('e1000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000032', '20mg', '1x sehari', 10, 10, 'Zinc suplementasi', '2024-01-17 08:35:00+07'),
-- Rx 9: Anemia
('e1000000-0000-0000-0000-000000000016', 'e0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000033', '300mg', '2x sehari sebelum makan', 30, 60, 'Minum dengan air jeruk', '2024-01-17 11:35:00+07'),
('e1000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000015', '500mg', '1x sehari', 30, 30, 'Meningkatkan absorpsi Fe', '2024-01-17 11:35:00+07'),
('e1000000-0000-0000-0000-000000000018', 'e0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002', '500mg', '3x sehari saat haid', 5, 15, 'Untuk nyeri haid', '2024-01-17 11:35:00+07'),
-- Rx 10: GERD
('e1000000-0000-0000-0000-000000000019', 'e0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000013', '30mg', '2x sehari sebelum makan', 14, 28, 'Lansoprazole pengganti omeprazole', '2024-01-18 08:45:00+07'),
-- Rx 11: ISK
('e1000000-0000-0000-0000-000000000020', 'e0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000008', '500mg', '2x sehari', 3, 6, 'Habiskan antibiotik', '2024-01-22 09:35:00+07'),
-- Rx 12: Bronkitis
('e1000000-0000-0000-0000-000000000021', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000017', '2 puff', '3x sehari', 14, 1, 'Inhaler salbutamol', '2024-01-23 08:40:00+07'),
('e1000000-0000-0000-0000-000000000022', 'e0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000030', '200mg', '3x sehari', 14, 42, 'Pengencer dahak', '2024-01-23 08:40:00+07'),
-- Rx 13: Low Back Pain
('e1000000-0000-0000-0000-000000000023', 'e0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000005', '50mg', '3x sehari setelah makan', 5, 15, 'Tidak boleh perut kosong', '2024-01-24 08:35:00+07'),
-- Rx 14: BPPV
('e1000000-0000-0000-0000-000000000024', 'e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000026', '24mg', '2x sehari', 7, 14, NULL, '2024-01-24 09:40:00+07'),
('e1000000-0000-0000-0000-000000000025', 'e0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000027', '50mg', '3x sehari jika mual', 5, 15, 'PRN', '2024-01-24 09:40:00+07'),
-- Rx 15: Alergi akut
('e1000000-0000-0000-0000-000000000026', 'e0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000010', '10mg', '1x sehari', 5, 5, NULL, '2024-02-02 09:45:00+07'),
('e1000000-0000-0000-0000-000000000027', 'e0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000023', '8mg', '2x sehari lalu taper', 5, 10, 'Taper: 8mg 3 hari, 4mg 2 hari', '2024-02-02 09:45:00+07'),
-- Rx 16: Kandidosis
('e1000000-0000-0000-0000-000000000028', 'e0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000035', '150mg', 'Dosis tunggal', 1, 1, NULL, '2024-02-05 09:35:00+07'),
-- Rx 17: Luka jahit
('e1000000-0000-0000-0000-000000000029', 'e0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000006', '500mg', '3x sehari', 5, 15, 'Habiskan antibiotik', '2024-02-07 08:50:00+07'),
('e1000000-0000-0000-0000-000000000030', 'e0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000002', '500mg', '3x sehari jika nyeri', 5, 15, 'PRN nyeri', '2024-02-07 08:50:00+07'),
-- Rx 18: Asma eksaserbasi
('e1000000-0000-0000-0000-000000000031', 'e0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000023', '16mg', '2x sehari lalu taper', 7, 14, 'Taper off', '2024-02-13 09:50:00+07'),
('e1000000-0000-0000-0000-000000000032', 'e0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000017', '2 puff', '4x sehari', 7, 1, 'Salbutamol inhaler', '2024-02-13 09:50:00+07'),
-- Rx 19: Pre-rujuk apendisitis
('e1000000-0000-0000-0000-000000000033', 'e0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000037', '500ml', 'Drip 20 tpm', 1, 1, 'NaCl 0.9% infus', '2024-03-13 08:45:00+07'),
-- Rx 20: Anemia lanjutan
('e1000000-0000-0000-0000-000000000034', 'e0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000033', '300mg', '2x sehari sebelum makan', 60, 120, 'Lanjut 2 bulan lagi', '2024-03-06 08:35:00+07'),
('e1000000-0000-0000-0000-000000000035', 'e0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000015', '500mg', '1x sehari', 60, 60, 'Stok habis, pasien beli luar', '2024-03-06 08:35:00+07');

-- ═══════════════════════════════════════
-- Invoices (30) with Invoice Items
-- ═══════════════════════════════════════

INSERT INTO invoices (id, clinic_id, patient_id, appointment_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, discount_amount, total_amount, paid_amount, payment_method, notes) VALUES
('f0000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'INV-20240115-001', '2024-01-15 08:35:00+07', '2024-01-22', 'paid', 200000, 22000, 0, 222000, 222000, 'insurance', 'Klaim BPJS'),
('f0000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'INV-20240115-002', '2024-01-15 09:05:00+07', '2024-01-22', 'paid', 225000, 24750, 0, 249750, 249750, 'insurance', 'Klaim Prudential'),
('f0000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'INV-20240115-003', '2024-01-15 09:35:00+07', '2024-01-22', 'paid', 250000, 27500, 0, 277500, 277500, 'cash', NULL),
('f0000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'INV-20240115-004', '2024-01-15 09:40:00+07', '2024-01-22', 'paid', 175000, 19250, 0, 194250, 194250, 'cash', NULL),
('f0000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'INV-20240115-005', '2024-01-15 10:35:00+07', '2024-01-22', 'paid', 280000, 30800, 0, 310800, 310800, 'insurance', 'Klaim BPJS'),
('f0000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000007', 'INV-20240116-001', '2024-01-16 08:40:00+07', '2024-01-23', 'paid', 350000, 38500, 0, 388500, 388500, 'insurance', 'Klaim BPJS'),
('f0000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000008', 'INV-20240116-002', '2024-01-16 09:10:00+07', '2024-01-23', 'paid', 185000, 20350, 0, 205350, 205350, 'cash', NULL),
('f0000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000011', 'INV-20240117-001', '2024-01-17 08:35:00+07', '2024-01-24', 'paid', 195000, 21450, 0, 216450, 216450, 'transfer', 'Transfer BCA'),
('f0000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000013', 'INV-20240117-002', '2024-01-17 10:40:00+07', '2024-01-24', 'paid', 300000, 33000, 0, 333000, 333000, 'cash', 'Termasuk biaya lab'),
('f0000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000014', 'INV-20240117-003', '2024-01-17 11:35:00+07', '2024-01-24', 'paid', 275000, 30250, 0, 305250, 305250, 'qris', 'GoPay'),
('f0000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000015', 'INV-20240118-001', '2024-01-18 08:45:00+07', '2024-01-25', 'paid', 450000, 49500, 0, 499500, 499500, 'insurance', 'Klaim BPJS, termasuk EKG'),
('f0000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000022', 'INV-20240122-001', '2024-01-22 09:35:00+07', '2024-01-29', 'paid', 235000, 25850, 0, 260850, 260850, 'cash', NULL),
('f0000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000025', 'INV-20240123-001', '2024-01-23 08:40:00+07', '2024-01-30', 'paid', 320000, 35200, 0, 355200, 355200, 'transfer', 'Transfer Mandiri'),
('f0000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000028', 'INV-20240124-001', '2024-01-24 08:35:00+07', '2024-01-31', 'paid', 210000, 23100, 0, 233100, 233100, 'cash', NULL),
('f0000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000029', 'INV-20240124-002', '2024-01-24 09:40:00+07', '2024-01-31', 'paid', 275000, 30250, 0, 305250, 305250, 'qris', 'OVO'),
('f0000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000035', 'c0000000-0000-0000-0000-000000000036', 'INV-20240202-001', '2024-02-02 09:45:00+07', '2024-02-09', 'paid', 500000, 55000, 0, 555000, 555000, 'cash', 'Termasuk obat injeksi'),
('f0000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000037', 'INV-20240205-001', '2024-02-05 08:40:00+07', '2024-02-12', 'paid', 250000, 27500, 0, 277500, 277500, 'cash', NULL),
('f0000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000036', 'c0000000-0000-0000-0000-000000000038', 'INV-20240205-002', '2024-02-05 09:35:00+07', '2024-02-12', 'paid', 200000, 22000, 0, 222000, 222000, 'transfer', 'Transfer BNI'),
('f0000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000041', 'c0000000-0000-0000-0000-000000000043', 'INV-20240207-001', '2024-02-07 08:50:00+07', '2024-02-14', 'paid', 650000, 71500, 0, 721500, 721500, 'insurance', 'Klaim Allianz'),
('f0000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000047', 'INV-20240212-001', '2024-02-12 08:40:00+07', '2024-02-19', 'paid', 280000, 30800, 0, 310800, 310800, 'insurance', 'Klaim BPJS'),
('f0000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000049', 'c0000000-0000-0000-0000-000000000052', 'INV-20240213-001', '2024-02-13 09:50:00+07', '2024-02-20', 'paid', 750000, 82500, 0, 832500, 832500, 'cash', 'Termasuk nebulisasi'),
('f0000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000065', 'INV-20240304-001', '2024-03-04 08:35:00+07', '2024-03-11', 'paid', 250000, 27500, 0, 277500, 277500, 'cash', NULL),
('f0000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000067', 'INV-20240304-002', '2024-03-04 10:35:00+07', '2024-03-11', 'paid', 300000, 33000, 0, 333000, 333000, 'cash', 'Termasuk lab lipid'),
('f0000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000071', 'INV-20240306-001', '2024-03-06 08:35:00+07', '2024-03-13', 'paid', 225000, 24750, 0, 249750, 249750, 'qris', 'DANA'),
('f0000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000077', 'INV-20240311-001', '2024-03-11 08:35:00+07', '2024-03-18', 'paid', 230000, 25300, 0, 255300, 255300, 'insurance', 'Klaim BPJS'),
('f0000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000084', 'INV-20240313-001', '2024-03-13 08:45:00+07', '2024-03-20', 'sent', 850000, 93500, 0, 943500, 0, NULL, 'Menunggu proses asuransi'),
('f0000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000081', 'INV-20240312-001', '2024-03-12 08:35:00+07', '2024-03-19', 'overdue', 200000, 22000, 0, 222000, 0, NULL, 'Pasien belum bayar'),
('f0000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000050', 'c0000000-0000-0000-0000-000000000083', 'INV-20240312-002', '2024-03-12 10:30:00+07', '2024-03-19', 'sent', 175000, 19250, 0, 194250, 0, NULL, NULL),
('f0000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000078', 'INV-20240311-002', '2024-03-11 09:35:00+07', '2024-03-18', 'cancelled', 175000, 19250, 0, 194250, 0, NULL, 'Pasien minta rujukan saja'),
('f0000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-0000-0000-000000000048', 'c0000000-0000-0000-0000-000000000097', 'INV-20240315-001', '2024-03-15 11:30:00+07', '2024-03-22', 'draft', 200000, 22000, 0, 222000, 0, NULL, 'Masih dalam proses pemeriksaan');

-- Invoice Items
INSERT INTO invoice_items (id, invoice_id, description, category, quantity, unit_price, total_price, created_at) VALUES
-- Invoice 1
('f1000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-15 08:35:00+07'),
('f1000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'Omeprazole 20mg (28 tablet)', 'medication', 1, 50000, 50000, '2024-01-15 08:35:00+07'),
-- Invoice 2
('f1000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-15 09:05:00+07'),
('f1000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000002', 'Paket Obat ISPA', 'medication', 1, 125000, 125000, '2024-01-15 09:05:00+07'),
-- Invoice 3
('f1000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000003', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-15 09:35:00+07'),
('f1000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000003', 'Amlodipine 10mg (30 tablet)', 'medication', 1, 45000, 45000, '2024-01-15 09:35:00+07'),
('f1000000-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000003', 'Candesartan 8mg (30 tablet)', 'medication', 1, 55000, 55000, '2024-01-15 09:35:00+07'),
-- Invoice 4
('f1000000-0000-0000-0000-000000000008', 'f0000000-0000-0000-0000-000000000004', 'Konsultasi Dokter Spesialis Anak', 'consultation', 1, 150000, 150000, '2024-01-15 09:40:00+07'),
('f1000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000004', 'Paracetamol Sirup 250mg', 'medication', 1, 25000, 25000, '2024-01-15 09:40:00+07'),
-- Invoice 5
('f1000000-0000-0000-0000-000000000010', 'f0000000-0000-0000-0000-000000000005', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-15 10:35:00+07'),
('f1000000-0000-0000-0000-000000000011', 'f0000000-0000-0000-0000-000000000005', 'Metformin 500mg (90 tablet)', 'medication', 1, 45000, 45000, '2024-01-15 10:35:00+07'),
('f1000000-0000-0000-0000-000000000012', 'f0000000-0000-0000-0000-000000000005', 'Glimepiride 2mg (30 tablet)', 'medication', 1, 85000, 85000, '2024-01-15 10:35:00+07'),
-- Invoice 6
('f1000000-0000-0000-0000-000000000013', 'f0000000-0000-0000-0000-000000000006', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-16 08:40:00+07'),
('f1000000-0000-0000-0000-000000000014', 'f0000000-0000-0000-0000-000000000006', 'Meloxicam 15mg (14 tablet)', 'medication', 1, 70000, 70000, '2024-01-16 08:40:00+07'),
('f1000000-0000-0000-0000-000000000015', 'f0000000-0000-0000-0000-000000000006', 'Glucosamine 500mg (90 kapsul)', 'medication', 1, 130000, 130000, '2024-01-16 08:40:00+07'),
-- Invoice 7
('f1000000-0000-0000-0000-000000000016', 'f0000000-0000-0000-0000-000000000007', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-16 09:10:00+07'),
('f1000000-0000-0000-0000-000000000017', 'f0000000-0000-0000-0000-000000000007', 'Cetirizine 10mg (7 tablet)', 'medication', 1, 35000, 35000, '2024-01-16 09:10:00+07'),
('f1000000-0000-0000-0000-000000000018', 'f0000000-0000-0000-0000-000000000007', 'Betamethasone Cream 0.1%', 'medication', 1, 50000, 50000, '2024-01-16 09:10:00+07'),
-- Invoice 8
('f1000000-0000-0000-0000-000000000019', 'f0000000-0000-0000-0000-000000000008', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-17 08:35:00+07'),
('f1000000-0000-0000-0000-000000000020', 'f0000000-0000-0000-0000-000000000008', 'Paket Obat Diare', 'medication', 1, 95000, 95000, '2024-01-17 08:35:00+07'),
-- Invoice 9
('f1000000-0000-0000-0000-000000000021', 'f0000000-0000-0000-0000-000000000009', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-17 10:40:00+07'),
('f1000000-0000-0000-0000-000000000022', 'f0000000-0000-0000-0000-000000000009', 'Pemeriksaan Profil Lipid', 'other', 1, 120000, 120000, '2024-01-17 10:40:00+07'),
('f1000000-0000-0000-0000-000000000023', 'f0000000-0000-0000-0000-000000000009', 'Simvastatin 20mg (30 tablet)', 'medication', 1, 30000, 30000, '2024-01-17 10:40:00+07'),
-- Invoice 10
('f1000000-0000-0000-0000-000000000024', 'f0000000-0000-0000-0000-000000000010', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-17 11:35:00+07'),
('f1000000-0000-0000-0000-000000000025', 'f0000000-0000-0000-0000-000000000010', 'Pemeriksaan Darah Lengkap', 'other', 1, 75000, 75000, '2024-01-17 11:35:00+07'),
('f1000000-0000-0000-0000-000000000026', 'f0000000-0000-0000-0000-000000000010', 'Paket Obat Anemia', 'medication', 1, 100000, 100000, '2024-01-17 11:35:00+07'),
-- Invoice 11
('f1000000-0000-0000-0000-000000000027', 'f0000000-0000-0000-0000-000000000011', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-18 08:45:00+07'),
('f1000000-0000-0000-0000-000000000028', 'f0000000-0000-0000-0000-000000000011', 'EKG (Elektrokardiografi)', 'procedure', 1, 200000, 200000, '2024-01-18 08:45:00+07'),
('f1000000-0000-0000-0000-000000000029', 'f0000000-0000-0000-0000-000000000011', 'Paket Obat GERD', 'medication', 1, 100000, 100000, '2024-01-18 08:45:00+07'),
-- Invoice 12
('f1000000-0000-0000-0000-000000000030', 'f0000000-0000-0000-0000-000000000012', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-22 09:35:00+07'),
('f1000000-0000-0000-0000-000000000031', 'f0000000-0000-0000-0000-000000000012', 'Urinalisis', 'other', 1, 50000, 50000, '2024-01-22 09:35:00+07'),
('f1000000-0000-0000-0000-000000000032', 'f0000000-0000-0000-0000-000000000012', 'Ciprofloxacin 500mg (6 tablet)', 'medication', 1, 85000, 85000, '2024-01-22 09:35:00+07'),
-- Invoice 13
('f1000000-0000-0000-0000-000000000033', 'f0000000-0000-0000-0000-000000000013', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-23 08:40:00+07'),
('f1000000-0000-0000-0000-000000000034', 'f0000000-0000-0000-0000-000000000013', 'Spirometri', 'other', 1, 150000, 150000, '2024-01-23 08:40:00+07'),
('f1000000-0000-0000-0000-000000000035', 'f0000000-0000-0000-0000-000000000013', 'Paket Obat Bronkitis', 'medication', 1, 70000, 70000, '2024-01-23 08:40:00+07'),
-- Invoice 14
('f1000000-0000-0000-0000-000000000036', 'f0000000-0000-0000-0000-000000000014', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-01-24 08:35:00+07'),
('f1000000-0000-0000-0000-000000000037', 'f0000000-0000-0000-0000-000000000014', 'Paket Obat Nyeri Punggung', 'medication', 1, 110000, 110000, '2024-01-24 08:35:00+07'),
-- Invoice 15
('f1000000-0000-0000-0000-000000000038', 'f0000000-0000-0000-0000-000000000015', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-01-24 09:40:00+07'),
('f1000000-0000-0000-0000-000000000039', 'f0000000-0000-0000-0000-000000000015', 'Tindakan Manuver Epley', 'procedure', 1, 75000, 75000, '2024-01-24 09:40:00+07'),
('f1000000-0000-0000-0000-000000000040', 'f0000000-0000-0000-0000-000000000015', 'Betahistine 24mg (14 tablet)', 'medication', 1, 50000, 50000, '2024-01-24 09:40:00+07'),
-- Invoice 16
('f1000000-0000-0000-0000-000000000041', 'f0000000-0000-0000-0000-000000000016', 'Konsultasi Dokter Spesialis (Emergency)', 'consultation', 1, 250000, 250000, '2024-02-02 09:45:00+07'),
('f1000000-0000-0000-0000-000000000042', 'f0000000-0000-0000-0000-000000000016', 'Injeksi Dexamethasone + Diphenhydramine', 'other', 1, 150000, 150000, '2024-02-02 09:45:00+07'),
('f1000000-0000-0000-0000-000000000043', 'f0000000-0000-0000-0000-000000000016', 'Paket Obat Anti-Alergi', 'medication', 1, 100000, 100000, '2024-02-02 09:45:00+07'),
-- Invoice 17
('f1000000-0000-0000-0000-000000000044', 'f0000000-0000-0000-0000-000000000017', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-02-05 08:40:00+07'),
('f1000000-0000-0000-0000-000000000045', 'f0000000-0000-0000-0000-000000000017', 'Obat Hipertensi (Amlodipine + Candesartan)', 'medication', 1, 100000, 100000, '2024-02-05 08:40:00+07'),
-- Invoice 18
('f1000000-0000-0000-0000-000000000046', 'f0000000-0000-0000-0000-000000000018', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-02-05 09:35:00+07'),
('f1000000-0000-0000-0000-000000000047', 'f0000000-0000-0000-0000-000000000018', 'Fluconazole 150mg (1 kapsul)', 'medication', 1, 15000, 15000, '2024-02-05 09:35:00+07'),
('f1000000-0000-0000-0000-000000000048', 'f0000000-0000-0000-0000-000000000018', 'Clotrimazole Cream Vaginal', 'medication', 1, 85000, 85000, '2024-02-05 09:35:00+07'),
-- Invoice 19
('f1000000-0000-0000-0000-000000000049', 'f0000000-0000-0000-0000-000000000019', 'Konsultasi Dokter Spesialis (Emergency)', 'consultation', 1, 250000, 250000, '2024-02-07 08:50:00+07'),
('f1000000-0000-0000-0000-000000000050', 'f0000000-0000-0000-0000-000000000019', 'Tindakan Jahit Luka (6 jahitan)', 'procedure', 1, 300000, 300000, '2024-02-07 08:50:00+07'),
('f1000000-0000-0000-0000-000000000051', 'f0000000-0000-0000-0000-000000000019', 'Paket Obat + ATS', 'medication', 1, 100000, 100000, '2024-02-07 08:50:00+07'),
-- Invoice 20
('f1000000-0000-0000-0000-000000000052', 'f0000000-0000-0000-0000-000000000020', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-02-12 08:40:00+07'),
('f1000000-0000-0000-0000-000000000053', 'f0000000-0000-0000-0000-000000000020', 'Paket Obat DM', 'medication', 1, 130000, 130000, '2024-02-12 08:40:00+07'),
-- Invoice 21
('f1000000-0000-0000-0000-000000000054', 'f0000000-0000-0000-0000-000000000021', 'Konsultasi Dokter Spesialis (Emergency)', 'consultation', 1, 250000, 250000, '2024-02-13 09:50:00+07'),
('f1000000-0000-0000-0000-000000000055', 'f0000000-0000-0000-0000-000000000021', 'Nebulisasi (3 siklus)', 'procedure', 3, 75000, 225000, '2024-02-13 09:50:00+07'),
('f1000000-0000-0000-0000-000000000056', 'f0000000-0000-0000-0000-000000000021', 'Oksigen + Paket Obat Asma', 'medication', 1, 275000, 275000, '2024-02-13 09:50:00+07'),
-- Invoice 22
('f1000000-0000-0000-0000-000000000057', 'f0000000-0000-0000-0000-000000000022', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-03-04 08:35:00+07'),
('f1000000-0000-0000-0000-000000000058', 'f0000000-0000-0000-0000-000000000022', 'Obat Hipertensi Rutin', 'medication', 1, 100000, 100000, '2024-03-04 08:35:00+07'),
-- Invoice 23
('f1000000-0000-0000-0000-000000000059', 'f0000000-0000-0000-0000-000000000023', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-03-04 10:35:00+07'),
('f1000000-0000-0000-0000-000000000060', 'f0000000-0000-0000-0000-000000000023', 'Pemeriksaan Profil Lipid', 'other', 1, 120000, 120000, '2024-03-04 10:35:00+07'),
('f1000000-0000-0000-0000-000000000061', 'f0000000-0000-0000-0000-000000000023', 'Simvastatin 20mg (30 tablet)', 'medication', 1, 30000, 30000, '2024-03-04 10:35:00+07'),
-- Invoice 24
('f1000000-0000-0000-0000-000000000062', 'f0000000-0000-0000-0000-000000000024', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-03-06 08:35:00+07'),
('f1000000-0000-0000-0000-000000000063', 'f0000000-0000-0000-0000-000000000024', 'Pemeriksaan Hb', 'other', 1, 50000, 50000, '2024-03-06 08:35:00+07'),
('f1000000-0000-0000-0000-000000000064', 'f0000000-0000-0000-0000-000000000024', 'Tablet Besi (60 tablet)', 'medication', 1, 75000, 75000, '2024-03-06 08:35:00+07'),
-- Invoice 25
('f1000000-0000-0000-0000-000000000065', 'f0000000-0000-0000-0000-000000000025', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-03-11 08:35:00+07'),
('f1000000-0000-0000-0000-000000000066', 'f0000000-0000-0000-0000-000000000025', 'Obat DM Rutin', 'medication', 1, 80000, 80000, '2024-03-11 08:35:00+07'),
-- Invoice 26
('f1000000-0000-0000-0000-000000000067', 'f0000000-0000-0000-0000-000000000026', 'Konsultasi Dokter Umum (Emergency)', 'consultation', 1, 200000, 200000, '2024-03-13 08:45:00+07'),
('f1000000-0000-0000-0000-000000000068', 'f0000000-0000-0000-0000-000000000026', 'USG Abdomen', 'other', 1, 350000, 350000, '2024-03-13 08:45:00+07'),
('f1000000-0000-0000-0000-000000000069', 'f0000000-0000-0000-0000-000000000026', 'Infus + Obat Injeksi', 'medication', 1, 300000, 300000, '2024-03-13 08:45:00+07'),
-- Invoice 27
('f1000000-0000-0000-0000-000000000070', 'f0000000-0000-0000-0000-000000000027', 'Konsultasi Dokter Spesialis', 'consultation', 1, 150000, 150000, '2024-03-12 08:35:00+07'),
('f1000000-0000-0000-0000-000000000071', 'f0000000-0000-0000-0000-000000000027', 'Obat Jantung Rutin', 'medication', 1, 50000, 50000, '2024-03-12 08:35:00+07'),
-- Invoice 28
('f1000000-0000-0000-0000-000000000072', 'f0000000-0000-0000-0000-000000000028', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-03-12 10:30:00+07'),
('f1000000-0000-0000-0000-000000000073', 'f0000000-0000-0000-0000-000000000028', 'Obat Antihistamin', 'medication', 1, 75000, 75000, '2024-03-12 10:30:00+07'),
-- Invoice 29
('f1000000-0000-0000-0000-000000000074', 'f0000000-0000-0000-0000-000000000029', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-03-11 09:35:00+07'),
('f1000000-0000-0000-0000-000000000075', 'f0000000-0000-0000-0000-000000000029', 'Surat Rujukan Dermatologi', 'other', 1, 75000, 75000, '2024-03-11 09:35:00+07'),
-- Invoice 30
('f1000000-0000-0000-0000-000000000076', 'f0000000-0000-0000-0000-000000000030', 'Konsultasi Dokter Umum', 'consultation', 1, 100000, 100000, '2024-03-15 11:30:00+07'),
('f1000000-0000-0000-0000-000000000077', 'f0000000-0000-0000-0000-000000000030', 'Pemeriksaan Fungsi Hati (SGOT/SGPT)', 'other', 1, 100000, 100000, '2024-03-15 11:30:00+07');

-- ═══════════════════════════════════════
-- Audit Logs (50)
-- ═══════════════════════════════════════

INSERT INTO audit_logs (id, clinic_id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at) VALUES
-- Patient registrations
('a1000000-0000-0000-0000-000000000001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'patients', 'a0000000-0000-0000-0000-000000000001', NULL, '{"full_name": "Agus Setiawan", "medical_record_number": "MR-20240115-0001"}', '192.168.1.10', '2024-01-15 07:30:00+07'),
('a1000000-0000-0000-0000-000000000002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'patients', 'a0000000-0000-0000-0000-000000000002', NULL, '{"full_name": "Sari Dewi Putri", "medical_record_number": "MR-20240115-0002"}', '192.168.1.10', '2024-01-15 07:35:00+07'),
('a1000000-0000-0000-0000-000000000003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'patients', 'a0000000-0000-0000-0000-000000000003', NULL, '{"full_name": "Muhammad Rizki", "medical_record_number": "MR-20240116-0001"}', '192.168.1.10', '2024-01-16 07:30:00+07'),
-- Appointment creation
('a1000000-0000-0000-0000-000000000004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'appointments', 'c0000000-0000-0000-0000-000000000001', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000001", "doctor_id": "550e8400-e29b-41d4-a716-446655440001", "status": "scheduled"}', '192.168.1.10', '2024-01-14 16:00:00+07'),
('a1000000-0000-0000-0000-000000000005', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'appointments', 'c0000000-0000-0000-0000-000000000002', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000002", "doctor_id": "550e8400-e29b-41d4-a716-446655440002", "status": "scheduled"}', '192.168.1.10', '2024-01-14 16:05:00+07'),
-- Appointment status updates
('a1000000-0000-0000-0000-000000000006', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'appointments', 'c0000000-0000-0000-0000-000000000001', '{"status": "scheduled"}', '{"status": "confirmed"}', '192.168.1.10', '2024-01-15 07:00:00+07'),
('a1000000-0000-0000-0000-000000000007', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440004', 'UPDATE', 'appointments', 'c0000000-0000-0000-0000-000000000001', '{"status": "confirmed"}', '{"status": "in_progress"}', '192.168.1.12', '2024-01-15 08:00:00+07'),
('a1000000-0000-0000-0000-000000000008', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'appointments', 'c0000000-0000-0000-0000-000000000001', '{"status": "in_progress"}', '{"status": "completed"}', '192.168.1.20', '2024-01-15 08:35:00+07'),
('a1000000-0000-0000-0000-000000000009', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'appointments', 'c0000000-0000-0000-0000-000000000006', '{"status": "scheduled"}', '{"status": "cancelled"}', '192.168.1.10', '2024-01-15 07:30:00+07'),
('a1000000-0000-0000-0000-000000000010', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'appointments', 'c0000000-0000-0000-0000-000000000010', '{"status": "scheduled"}', '{"status": "no_show"}', '192.168.1.10', '2024-01-16 10:30:00+07'),
-- Medical record creation
('a1000000-0000-0000-0000-000000000011', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000001', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000001", "icd_10_codes": ["K30", "R10.1"]}', '192.168.1.20', '2024-01-15 08:35:00+07'),
('a1000000-0000-0000-0000-000000000012', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000002', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000002", "icd_10_codes": ["J20.9", "J06.9"]}', '192.168.1.21', '2024-01-15 09:05:00+07'),
('a1000000-0000-0000-0000-000000000013', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000003', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000003", "icd_10_codes": ["I10"]}', '192.168.1.20', '2024-01-15 09:35:00+07'),
('a1000000-0000-0000-0000-000000000014', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000004', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000004", "icd_10_codes": ["A90"]}', '192.168.1.22', '2024-01-15 09:40:00+07'),
-- Prescription creation and dispensing
('a1000000-0000-0000-0000-000000000015', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'prescriptions', 'e0000000-0000-0000-0000-000000000001', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000001", "status": "pending"}', '192.168.1.20', '2024-01-15 08:35:00+07'),
('a1000000-0000-0000-0000-000000000016', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'prescriptions', 'e0000000-0000-0000-0000-000000000001', '{"status": "pending"}', '{"status": "dispensed"}', '192.168.1.30', '2024-01-15 09:00:00+07'),
('a1000000-0000-0000-0000-000000000017', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'INSERT', 'prescriptions', 'e0000000-0000-0000-0000-000000000002', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000002", "status": "pending"}', '192.168.1.21', '2024-01-15 09:05:00+07'),
('a1000000-0000-0000-0000-000000000018', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'prescriptions', 'e0000000-0000-0000-0000-000000000002', '{"status": "pending"}', '{"status": "dispensed"}', '192.168.1.30', '2024-01-15 09:30:00+07'),
-- Invoice creation and payment
('a1000000-0000-0000-0000-000000000019', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'invoices', 'f0000000-0000-0000-0000-000000000001', NULL, '{"invoice_number": "INV-20240115-001", "status": "pending", "total_amount": 222000}', '192.168.1.10', '2024-01-15 08:35:00+07'),
('a1000000-0000-0000-0000-000000000020', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'invoices', 'f0000000-0000-0000-0000-000000000001', '{"status": "pending", "payment_method": null}', '{"status": "paid", "payment_method": "bpjs"}', '192.168.1.10', '2024-01-15 09:00:00+07'),
('a1000000-0000-0000-0000-000000000021', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'invoices', 'f0000000-0000-0000-0000-000000000002', NULL, '{"invoice_number": "INV-20240115-002", "status": "pending", "total_amount": 249750}', '192.168.1.10', '2024-01-15 09:05:00+07'),
('a1000000-0000-0000-0000-000000000022', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'invoices', 'f0000000-0000-0000-0000-000000000002', '{"status": "pending", "payment_method": null}', '{"status": "paid", "payment_method": "insurance"}', '192.168.1.10', '2024-01-15 09:30:00+07'),
-- Medication stock updates
('a1000000-0000-0000-0000-000000000023', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000013', '{"stock_quantity": 200}', '{"stock_quantity": 172}', '192.168.1.30', '2024-01-15 09:00:00+07'),
('a1000000-0000-0000-0000-000000000024', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000001', '{"stock_quantity": 500}', '{"stock_quantity": 479}', '192.168.1.30', '2024-01-15 09:30:00+07'),
('a1000000-0000-0000-0000-000000000025', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000003', '{"stock_quantity": 300}', '{"stock_quantity": 270}', '192.168.1.30', '2024-01-15 10:00:00+07'),
('a1000000-0000-0000-0000-000000000026', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000004', '{"stock_quantity": 400}', '{"stock_quantity": 310}', '192.168.1.30', '2024-01-15 11:00:00+07'),
-- Patient data updates
('a1000000-0000-0000-0000-000000000027', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'patients', 'a0000000-0000-0000-0000-000000000003', '{"notes": null}', '{"notes": "Pasien hipertensi kronik"}', '192.168.1.10', '2024-01-15 09:40:00+07'),
('a1000000-0000-0000-0000-000000000028', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'patients', 'a0000000-0000-0000-0000-000000000005', '{"notes": null}', '{"notes": "DM tipe 2, kontrol rutin"}', '192.168.1.10', '2024-01-15 10:40:00+07'),
('a1000000-0000-0000-0000-000000000029', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'patients', 'a0000000-0000-0000-0000-000000000009', '{"phone": "+6281300000009"}', '{"phone": "+6281300000009", "email": "gunawan@email.com"}', '192.168.1.10', '2024-01-16 10:10:00+07'),
-- More appointment and record activities
('a1000000-0000-0000-0000-000000000030', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'appointments', 'c0000000-0000-0000-0000-000000000015', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000015", "type": "emergency", "status": "scheduled"}', '192.168.1.10', '2024-01-18 07:55:00+07'),
('a1000000-0000-0000-0000-000000000031', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000012', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000015", "icd_10_codes": ["K21.0", "R07.9"]}', '192.168.1.20', '2024-01-18 08:45:00+07'),
('a1000000-0000-0000-0000-000000000032', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'prescriptions', 'e0000000-0000-0000-0000-000000000010', '{"status": "pending"}', '{"status": "dispensed"}', '192.168.1.30', '2024-01-18 09:15:00+07'),
-- Notification creation
('a1000000-0000-0000-0000-000000000033', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'notifications', NULL, NULL, '{"type": "low_stock", "title": "Stok Obat Rendah", "user_id": "550e8400-e29b-41d4-a716-446655440001"}', '192.168.1.100', '2024-01-20 08:00:00+07'),
('a1000000-0000-0000-0000-000000000034', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'notifications', NULL, '{"is_read": false}', '{"is_read": true}', '192.168.1.20', '2024-01-20 10:00:00+07'),
-- February activities
('a1000000-0000-0000-0000-000000000035', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000020', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000035", "icd_10_codes": ["T78.2", "L50.0"]}', '192.168.1.20', '2024-02-02 09:45:00+07'),
('a1000000-0000-0000-0000-000000000036', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'prescriptions', 'e0000000-0000-0000-0000-000000000015', '{"status": "pending"}', '{"status": "dispensed"}', '192.168.1.30', '2024-02-02 10:15:00+07'),
('a1000000-0000-0000-0000-000000000037', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'invoices', 'f0000000-0000-0000-0000-000000000016', '{"status": "pending"}', '{"status": "paid", "payment_method": "cash"}', '192.168.1.10', '2024-02-02 10:30:00+07'),
('a1000000-0000-0000-0000-000000000038', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000023', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000041", "icd_10_codes": ["S51.8", "T14.1"]}', '192.168.1.20', '2024-02-07 08:50:00+07'),
('a1000000-0000-0000-0000-000000000039', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'prescriptions', 'e0000000-0000-0000-0000-000000000017', '{"status": "pending"}', '{"status": "partially_dispensed"}', '192.168.1.30', '2024-02-07 09:20:00+07'),
('a1000000-0000-0000-0000-000000000040', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'invoices', 'f0000000-0000-0000-0000-000000000019', '{"status": "pending"}', '{"status": "paid", "payment_method": "insurance"}', '192.168.1.10', '2024-02-10 10:00:00+07'),
('a1000000-0000-0000-0000-000000000041', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000025', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000049", "icd_10_codes": ["J45.31"]}', '192.168.1.20', '2024-02-13 09:50:00+07'),
('a1000000-0000-0000-0000-000000000042', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000017', '{"stock_quantity": 100}', '{"stock_quantity": 85}', '192.168.1.30', '2024-02-13 10:20:00+07'),
-- March activities
('a1000000-0000-0000-0000-000000000043', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'INSERT', 'medical_records', 'd0000000-0000-0000-0000-000000000028', NULL, '{"patient_id": "a0000000-0000-0000-0000-000000000006", "icd_10_codes": ["K35.8"]}', '192.168.1.21', '2024-03-13 08:45:00+07'),
('a1000000-0000-0000-0000-000000000044', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'INSERT', 'invoices', 'f0000000-0000-0000-0000-000000000026', NULL, '{"invoice_number": "INV-20240313-001", "status": "pending", "total_amount": 943500}', '192.168.1.10', '2024-03-13 08:45:00+07'),
('a1000000-0000-0000-0000-000000000045', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'UPDATE', 'invoices', 'f0000000-0000-0000-0000-000000000029', '{"status": "pending"}', '{"status": "cancelled"}', '192.168.1.10', '2024-03-11 12:00:00+07'),
-- Delete examples
('a1000000-0000-0000-0000-000000000046', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440005', 'DELETE', 'notifications', NULL, '{"type": "system", "title": "Test Notification", "is_read": true}', NULL, '192.168.1.10', '2024-02-01 08:00:00+07'),
('a1000000-0000-0000-0000-000000000047', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'DELETE', 'notifications', NULL, '{"type": "appointment_reminder", "title": "Pengingat Jadwal Lama", "is_read": true}', NULL, '192.168.1.20', '2024-02-15 09:00:00+07'),
-- User activity
('a1000000-0000-0000-0000-000000000048', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'users', '550e8400-e29b-41d4-a716-446655440004', '{"phone": "+6281234567004"}', '{"phone": "+6281234567104"}', '192.168.1.20', '2024-02-20 14:00:00+07'),
('a1000000-0000-0000-0000-000000000049', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'UPDATE', 'clinics', '550e8400-e29b-41d4-a716-446655440000', '{"subscription_plan": "basic"}', '{"subscription_plan": "pro"}', '192.168.1.20', '2024-01-10 10:00:00+07'),
('a1000000-0000-0000-0000-000000000050', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440006', 'UPDATE', 'medications', 'b0000000-0000-0000-0000-000000000015', '{"stock_quantity": 250}', '{"stock_quantity": 190}', '192.168.1.30', '2024-03-06 09:00:00+07');
