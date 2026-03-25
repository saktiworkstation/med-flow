'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Eye, EyeOff, Loader2, Building } from 'lucide-react';
import { toast } from 'sonner';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      // Step 1: Panggil API signup (create auth user + clinic + user record)
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          password: data.password,
          clinic_name: data.clinic_name,
          clinic_address: data.clinic_address,
          clinic_phone: data.clinic_phone,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal mendaftar');
      }

      // Step 2: Login otomatis setelah signup berhasil
      await signIn(data.email, data.password);

      toast.success('Pendaftaran berhasil! Selamat datang di MedFlow.');
      router.push('/welcome');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan saat mendaftar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">MedFlow</h1>
              <p className="text-xs text-muted-foreground">Healthcare Management Platform</p>
            </div>
          </div>

          <h2 className="mb-2 text-2xl font-bold">Daftar Klinik Baru</h2>
          <p className="mb-8 text-muted-foreground">
            Buat akun untuk mendaftarkan klinik Anda
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Data Pemilik */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Data Pemilik
              </h3>

              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  placeholder="Dr. Budi Santoso"
                  {...register('full_name')}
                />
                {errors.full_name && (
                  <p className="text-xs text-destructive">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="budi@klinik.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...register('confirm_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Data Klinik */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                <Building className="h-4 w-4" />
                Data Klinik
              </h3>

              <div className="space-y-2">
                <Label htmlFor="clinic_name">Nama Klinik</Label>
                <Input
                  id="clinic_name"
                  placeholder="Klinik Sehat Sentosa"
                  {...register('clinic_name')}
                />
                {errors.clinic_name && (
                  <p className="text-xs text-destructive">{errors.clinic_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic_address">Alamat Klinik</Label>
                <Input
                  id="clinic_address"
                  placeholder="Jl. Kesehatan No. 123, Jakarta"
                  {...register('clinic_address')}
                />
                {errors.clinic_address && (
                  <p className="text-xs text-destructive">{errors.clinic_address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic_phone">Telepon Klinik</Label>
                <Input
                  id="clinic_phone"
                  placeholder="+62211234567"
                  {...register('clinic_phone')}
                />
                {errors.clinic_phone && (
                  <p className="text-xs text-destructive">{errors.clinic_phone.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Daftar Sekarang
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel — Hero */}
      <div className="hidden bg-gradient-to-br from-primary/90 via-primary to-teal-700 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center text-white"
        >
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
            <Activity className="h-12 w-12" />
          </div>
          <h2 className="mb-4 text-4xl font-bold">MedFlow</h2>
          <p className="mb-6 text-lg text-white/80">
            Mulai kelola klinik Anda secara digital.
            <br />
            Daftar gratis dan langsung gunakan.
          </p>
          <div className="mx-auto grid max-w-sm grid-cols-2 gap-4 text-left text-sm">
            {[
              'Rekam Medis Elektronik',
              'Manajemen Jadwal',
              'Resep & Farmasi',
              'Tagihan & Pembayaran',
              'Analitik Real-time',
              'Multi-role Access',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white/90">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
