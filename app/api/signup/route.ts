import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';

/**
 * POST /api/signup
 *
 * Mendaftarkan clinic owner baru.
 * Flow: create auth user → create clinic → create user record.
 * Menggunakan service role key untuk bypass RLS.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, password, clinic_name, clinic_address, clinic_phone } = body;

    // Validasi server-side sederhana
    if (!full_name || !email || !password || !clinic_name) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Step 1: Buat auth user via admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm agar bisa langsung login
    });

    if (authError) {
      // Handle duplicate email
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'Email sudah terdaftar. Silakan gunakan email lain.' },
          { status: 409 }
        );
      }
      throw authError;
    }

    const userId = authData.user.id;

    // Step 2: Buat clinic
    // Generate slug unik dari nama klinik
    const slug =
      clinic_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).substring(2, 7);

    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        name: clinic_name,
        slug,
        address: clinic_address || null,
        phone: clinic_phone || null,
      })
      .select()
      .single();

    if (clinicError) {
      // Rollback: hapus auth user
      await supabase.auth.admin.deleteUser(userId);
      throw clinicError;
    }

    // Step 3: Buat user record dengan role clinic_owner
    const { error: userError } = await supabase.from('users').insert({
      id: userId,
      clinic_id: clinic.id,
      role: 'clinic_owner',
      full_name,
      email,
      is_active: true,
    });

    if (userError) {
      // Rollback: hapus clinic dan auth user
      await supabase.from('clinics').delete().eq('id', clinic.id);
      await supabase.auth.admin.deleteUser(userId);
      throw userError;
    }

    return NextResponse.json({ success: true, clinic_id: clinic.id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
