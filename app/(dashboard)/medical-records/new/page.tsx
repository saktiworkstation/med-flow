'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Stethoscope,
  Heart,
  Thermometer,
  Activity,
  Wind,
  Droplets,
  Scale,
  Ruler,
  Save,
  Loader2,
  Lock,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { medicalRecordSchema, type MedicalRecordFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { MedicalRecord } from '@/types/database';

function VitalGauge({ label, value, unit, icon: Icon, min, max, color }: {
  label: string;
  value?: number;
  unit: string;
  icon: React.ElementType;
  min: number;
  max: number;
  color: string;
}) {
  const percentage = value ? Math.min(((value - min) / (max - min)) * 100, 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="font-medium">{label}</span>
        </div>
        {value && (
          <span className="font-mono text-sm font-bold">
            {value} <span className="text-xs font-normal text-muted-foreground">{unit}</span>
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
}

export default function NewMedicalRecordPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseClient();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema) as any,
    defaultValues: {
      vital_signs: {},
      icd_10_codes: [],
      is_confidential: false,
    },
  });

  const vitalSigns = watch('vital_signs');

  // Auto-save draft every 30 seconds
  const formValues = watch();
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('medflow_record_draft', JSON.stringify(formValues));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [formValues]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('medflow_record_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as MedicalRecordFormData;
        if (parsed.subjective) setValue('subjective', parsed.subjective);
        if (parsed.objective) setValue('objective', parsed.objective);
        if (parsed.assessment) setValue('assessment', parsed.assessment);
        if (parsed.plan) setValue('plan', parsed.plan);
      } catch {
        // ignore
      }
    }
  }, [setValue]);

  const onSubmit = async (data: MedicalRecordFormData) => {
    if (!user) return;
    setSaving(true);
    try {
      const insertData = {
        clinic_id: user.clinic_id,
        doctor_id: user.id,
        patient_id: data.patient_id,
        appointment_id: data.appointment_id ?? null,
        record_date: new Date().toISOString(),
        subjective: data.subjective ?? null,
        objective: data.objective ?? null,
        assessment: data.assessment ?? null,
        plan: data.plan ?? null,
        vital_signs: data.vital_signs as Record<string, unknown>,
        icd_10_codes: data.icd_10_codes,
        attachments: [] as string[],
        is_confidential: data.is_confidential,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('medical_records') as any).insert(insertData);

      if (error) throw error;
      localStorage.removeItem('medflow_record_draft');
      toast.success('Rekam medis berhasil disimpan');
      router.push('/');
    } catch {
      toast.error('Gagal menyimpan rekam medis');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rekam Medis Baru</h1>
          <p className="text-muted-foreground">Buat catatan pemeriksaan pasien (format SOAP)</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          Auto-save aktif
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardContent className="flex gap-4 p-4">
            <div className="flex-1 space-y-2">
              <Label>ID Pasien *</Label>
              <Input {...register('patient_id')} placeholder="Pilih pasien (UUID)" />
              {errors.patient_id && <p className="text-xs text-destructive">{errors.patient_id.message}</p>}
            </div>
            <div className="flex-1 space-y-2">
              <Label>ID Jadwal (opsional)</Label>
              <Input {...register('appointment_id')} placeholder="UUID jadwal" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2 rounded-lg border p-2.5">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="confidential" className="cursor-pointer text-sm">Rahasia</Label>
                <Controller
                  name="is_confidential"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="confidential"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Form */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">S — Subjective</CardTitle>
              <CardDescription>Keluhan yang disampaikan pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('subjective')}
                placeholder="Pasien mengeluhkan..."
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">O — Objective</CardTitle>
              <CardDescription>Hasil pemeriksaan fisik & penunjang</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('objective')}
                placeholder="Hasil pemeriksaan..."
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">A — Assessment</CardTitle>
              <CardDescription>Diagnosis dan penilaian klinis</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('assessment')}
                placeholder="Diagnosis..."
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">P — Plan</CardTitle>
              <CardDescription>Rencana tindakan dan terapi</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('plan')}
                placeholder="Rencana terapi..."
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Tanda Vital
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-red-500" />
                  Tekanan Darah
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Sistolik"
                    {...register('vital_signs.blood_pressure_systolic', { valueAsNumber: true })}
                  />
                  <span className="flex items-center text-muted-foreground">/</span>
                  <Input
                    type="number"
                    placeholder="Diastolik"
                    {...register('vital_signs.blood_pressure_diastolic', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-red-500" />
                  Detak Jantung
                </Label>
                <Input
                  type="number"
                  placeholder="bpm"
                  {...register('vital_signs.heart_rate', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-amber-500" />
                  Suhu Tubuh
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="°C"
                  {...register('vital_signs.temperature', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-blue-500" />
                  Laju Napas
                </Label>
                <Input
                  type="number"
                  placeholder="/menit"
                  {...register('vital_signs.respiratory_rate', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  SpO2
                </Label>
                <Input
                  type="number"
                  placeholder="%"
                  {...register('vital_signs.oxygen_saturation', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-green-500" />
                  Berat Badan
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="kg"
                  {...register('vital_signs.weight', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Ruler className="h-4 w-4 text-green-500" />
                  Tinggi Badan
                </Label>
                <Input
                  type="number"
                  placeholder="cm"
                  {...register('vital_signs.height', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Vital Signs Visual Gauges */}
            <Separator className="my-6" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <VitalGauge label="Detak Jantung" value={vitalSigns?.heart_rate} unit="bpm" icon={Heart} min={40} max={200} color="text-red-500" />
              <VitalGauge label="Suhu" value={vitalSigns?.temperature} unit="°C" icon={Thermometer} min={35} max={42} color="text-amber-500" />
              <VitalGauge label="SpO2" value={vitalSigns?.oxygen_saturation} unit="%" icon={Droplets} min={80} max={100} color="text-blue-500" />
              <VitalGauge label="Napas" value={vitalSigns?.respiratory_rate} unit="/min" icon={Wind} min={8} max={40} color="text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Simpan Rekam Medis
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
