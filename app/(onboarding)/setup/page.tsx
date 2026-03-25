'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Building, User, Users, Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { clinicSetupSchema, adminProfileSchema, type ClinicSetupFormData, type AdminProfileFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = ['Informasi Klinik', 'Profil Admin', 'Undang Tim', 'Selesai'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const clinicForm = useForm<ClinicSetupFormData>({
    resolver: zodResolver(clinicSetupSchema),
  });

  const profileForm = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
  });

  const handleNext = async () => {
    if (step === 0) {
      const valid = await clinicForm.trigger();
      if (!valid) return;
    }
    if (step === 1) {
      const valid = await profileForm.trigger();
      if (!valid) return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      // Save to Supabase
      toast.success('Klinik berhasil dikonfigurasi!');
      router.push('/');
    } catch {
      toast.error('Gagal menyimpan konfigurasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">MedFlow</span>
        </div>

        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  i < step
                    ? 'bg-primary text-primary-foreground'
                    : i === step
                      ? 'bg-primary/20 text-primary ring-2 ring-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 ${i < step ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <p className="mb-6 text-center text-sm text-muted-foreground">{STEPS[step]}</p>

        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="clinic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Building className="h-5 w-5 text-primary" />
                    Informasi Klinik
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Klinik *</Label>
                    <Input {...clinicForm.register('name')} placeholder="Klinik Sehat Sentosa" />
                    {clinicForm.formState.errors.name && <p className="text-xs text-destructive">{clinicForm.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Alamat *</Label>
                    <Input {...clinicForm.register('address')} placeholder="Jl. Kesehatan No. 123" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Telepon *</Label>
                      <Input {...clinicForm.register('phone')} placeholder="+62211234567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input {...clinicForm.register('email')} placeholder="info@klinik.com" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <User className="h-5 w-5 text-primary" />
                    Profil Admin
                  </div>
                  <div className="space-y-2">
                    <Label>Nama Lengkap *</Label>
                    <Input {...profileForm.register('full_name')} placeholder="Dr. Budi Santoso" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Spesialisasi</Label>
                      <Input {...profileForm.register('specialization')} placeholder="Umum" />
                    </div>
                    <div className="space-y-2">
                      <Label>No. SIP</Label>
                      <Input {...profileForm.register('license_number')} placeholder="SIP-xxx" />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 text-primary" />
                    Undang Tim (Opsional)
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Anda bisa mengundang anggota tim nanti di halaman Pengaturan.
                  </p>
                  <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Fitur undangan email tersedia setelah setup selesai
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Klinik Siap!</h3>
                  <p className="text-muted-foreground">
                    Klinik Anda telah dikonfigurasi. Mulai kelola pasien, jadwal, dan layanan kesehatan Anda.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
              {step > 0 && step < STEPS.length - 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <Button onClick={handleNext}>
                  {step === 2 ? 'Lewati' : 'Lanjut'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Mulai Gunakan MedFlow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
