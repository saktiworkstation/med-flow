'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations';
import { getSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * ChangePasswordForm — Form ganti password untuk semua role.
 * Menggunakan supabase.auth.updateUser untuk update password.
 */
export default function ChangePasswordForm() {
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const supabase = getSupabaseClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSaving(true);
    try {
      // Verifikasi password lama dengan re-login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('User tidak ditemukan');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.current_password,
      });

      if (signInError) {
        toast.error('Password lama salah');
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (updateError) throw updateError;

      toast.success('Password berhasil diubah');
      reset();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Gagal mengubah password';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ganti Password</CardTitle>
        <CardDescription>Ubah password akun Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Password Lama</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('current_password')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-xs text-destructive">{errors.current_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">Password Baru</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('new_password')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-xs text-destructive">{errors.new_password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              {...register('confirm_password')}
            />
            {errors.confirm_password && (
              <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Ubah Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
