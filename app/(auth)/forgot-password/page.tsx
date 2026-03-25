'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, ArrowLeft, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { resetPassword } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
      toast.success('Email reset password telah dikirim');
    } catch {
      toast.error('Gagal mengirim email reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">MedFlow</span>
        </div>

        {sent ? (
          <div className="rounded-xl border bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Cek Email Anda</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Kami telah mengirim link untuk reset password ke email Anda.
            </p>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold">Lupa Password</h2>
              <p className="mt-1 text-muted-foreground">
                Masukkan email Anda untuk menerima link reset password
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Link Reset
              </Button>
            </form>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
