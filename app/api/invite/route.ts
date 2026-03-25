import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * Generate random alphanumeric password.
 */
function generatePassword(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * POST /api/invite
 *
 * Invite staff baru ke klinik.
 * Hanya bisa dilakukan oleh clinic_owner.
 *
 * Body: { email, full_name, role, specialization?, license_number? }
 * Returns: { success: true, temporary_password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name, role, specialization, license_number } = body;

    // Validasi input
    if (!email || !full_name || !role) {
      return NextResponse.json(
        { error: 'Email, nama lengkap, dan role wajib diisi' },
        { status: 400 }
      );
    }

    const validRoles = ['doctor', 'nurse', 'receptionist', 'pharmacist'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Role tidak valid' },
        { status: 400 }
      );
    }

    // Verifikasi bahwa user yang request adalah clinic_owner
    const serverSupabase = createServerSupabaseClient();
    const { data: { user: authUser } } = await serverSupabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized: Silakan login terlebih dahulu' },
        { status: 401 }
      );
    }

    // Ambil data user dari tabel users untuk cek role dan clinic_id
    const adminSupabase = createAdminClient();

    const { data: currentUser, error: userError } = await adminSupabase
      .from('users')
      .select('id, role, clinic_id')
      .eq('id', authUser.id)
      .single();

    if (userError || !currentUser) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    if (currentUser.role !== 'clinic_owner') {
      return NextResponse.json(
        { error: 'Forbidden: Hanya clinic owner yang bisa mengundang staff' },
        { status: 403 }
      );
    }

    // Generate temporary password
    const temporaryPassword = generatePassword(8);

    // Buat auth user via admin API
    const { data: newAuthUser, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'Email sudah terdaftar di sistem' },
          { status: 409 }
        );
      }
      throw authError;
    }

    // Insert ke tabel users
    const { error: insertError } = await adminSupabase.from('users').insert({
      id: newAuthUser.user.id,
      clinic_id: currentUser.clinic_id,
      role,
      full_name,
      email,
      specialization: specialization || null,
      license_number: license_number || null,
      is_active: true,
    });

    if (insertError) {
      // Rollback: hapus auth user
      await adminSupabase.auth.admin.deleteUser(newAuthUser.user.id);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      temporary_password: temporaryPassword,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan saat mengundang staff';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/invite
 *
 * Update user (role, is_active) atau soft delete.
 * Hanya bisa dilakukan oleh clinic_owner.
 *
 * Body: { user_id, role?, is_active?, delete?: boolean }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, role, is_active, delete: softDelete } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id wajib diisi' }, { status: 400 });
    }

    // Verifikasi clinic_owner
    const serverSupabase = createServerSupabaseClient();
    const { data: { user: authUser } } = await serverSupabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    const { data: currentUser } = await adminSupabase
      .from('users')
      .select('id, role, clinic_id')
      .eq('id', authUser.id)
      .single();

    if (!currentUser || currentUser.role !== 'clinic_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Pastikan target user ada di klinik yang sama
    const { data: targetUser } = await adminSupabase
      .from('users')
      .select('id, clinic_id')
      .eq('id', user_id)
      .single();

    if (!targetUser || targetUser.clinic_id !== currentUser.clinic_id) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Jangan izinkan edit diri sendiri
    if (user_id === currentUser.id) {
      return NextResponse.json(
        { error: 'Tidak bisa mengubah akun sendiri' },
        { status: 400 }
      );
    }

    if (softDelete) {
      // Soft delete: nonaktifkan user
      await adminSupabase
        .from('users')
        .update({ is_active: false })
        .eq('id', user_id);

      // Disable auth user agar tidak bisa login
      await adminSupabase.auth.admin.updateUserById(user_id, {
        ban_duration: '876000h', // ~100 tahun
      });

      return NextResponse.json({ success: true });
    }

    // Update fields
    const updateData: Record<string, unknown> = {};
    if (role !== undefined) {
      const validRoles = ['doctor', 'nurse', 'receptionist', 'pharmacist'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (is_active !== undefined) {
      updateData.is_active = is_active;

      // Jika dinonaktifkan, ban auth user; jika diaktifkan, unban
      if (!is_active) {
        await adminSupabase.auth.admin.updateUserById(user_id, {
          ban_duration: '876000h',
        });
      } else {
        await adminSupabase.auth.admin.updateUserById(user_id, {
          ban_duration: 'none',
        });
      }
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await adminSupabase
        .from('users')
        .update(updateData)
        .eq('id', user_id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Terjadi kesalahan';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
