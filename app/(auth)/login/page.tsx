'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Login berhasil!');
      router.push('/');
    } catch {
      toast.error('Email atau password salah');
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

          <h2 className="mb-2 text-2xl font-bold">Selamat Datang</h2>
          <p className="mb-8 text-muted-foreground">
            Masuk ke akun Anda untuk mengelola klinik
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="dokter@klinik.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Lupa password?
                </Link>
              </div>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Daftar
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Platform manajemen klinik terpadu untuk fasilitas kesehatan Indonesia
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
            Kelola klinik Anda dengan efisien.
            <br />
            Dari pendaftaran pasien hingga farmasi.
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
