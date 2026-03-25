'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments, useCreateAppointment, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { appointmentSchema, type AppointmentFormData } from '@/lib/validations';
import { formatTime, getAppointmentStatusColor } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_TYPE_LABELS, APPOINTMENT_STATUS_FLOW, generateTimeSlots } from '@/lib/constants';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import PatientCombobox from '@/components/shared/PatientCombobox';
import DoctorCombobox from '@/components/shared/DoctorCombobox';
import type { AppointmentStatus } from '@/types/database';

export default function AppointmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('new') === 'true');
  const [view, setView] = useState<'week' | 'day'>('week');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const { data: appointments, isLoading } = useAppointments(user?.clinic_id, { date: dateStr });
  const createAppointment = useCreateAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = generateTimeSlots(8, 20, 30);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: { type: 'consultation' },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    if (!user?.clinic_id) return;
    try {
      await createAppointment.mutateAsync({ clinicId: user.clinic_id, data });
      toast.success('Jadwal berhasil dibuat');
      setDialogOpen(false);
      reset();
    } catch {
      toast.error('Gagal membuat jadwal');
    }
  };

  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Status diubah ke ${APPOINTMENT_STATUS_LABELS[status]}`);
    } catch {
      toast.error('Gagal mengubah status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jadwal</h1>
          <p className="text-muted-foreground">Kelola jadwal kunjungan pasien</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Jadwal Baru
        </Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate((d) => addDays(d, -7))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">
                {format(weekStart, 'dd MMM', { locale: idLocale })} —{' '}
                {format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: idLocale })}
              </h3>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedDate((d) => addDays(d, 7))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1">
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
              >
                Minggu
              </Button>
              <Button
                variant={view === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
              >
                Hari
              </Button>
            </div>
          </div>

          {/* Week day selector */}
          <div className="mt-4 grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`rounded-lg p-2 text-center transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : isToday
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                  }`}
                >
                  <p className="text-xs">{format(day, 'EEE', { locale: idLocale })}</p>
                  <p className="text-lg font-bold">{format(day, 'd')}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Jadwal — {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: idLocale })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-2">
                {appointments.map((apt, idx) => {
                  const nextStatuses = APPOINTMENT_STATUS_FLOW[apt.status] ?? [];
                  return (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-center">
                          <p className="font-mono text-sm font-bold">{formatTime(apt.start_time)}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {formatTime(apt.end_time)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{apt.patient?.full_name ?? 'Pasien'}</p>
                          <p className="text-sm text-muted-foreground">
                            Dr. {apt.doctor?.full_name ?? 'Dokter'} &bull;{' '}
                            {APPOINTMENT_TYPE_LABELS[apt.type] ?? apt.type}
                          </p>
                          {apt.complaint && (
                            <p className="mt-1 text-xs text-muted-foreground">{apt.complaint}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={apt.status}
                          colorClass={getAppointmentStatusColor(apt.status)}
                          label={APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                          pulse={apt.status === 'in_progress'}
                        />
                        {nextStatuses.length > 0 && (
                          <Select
                            onValueChange={(v) => handleStatusUpdate(apt.id, v as AppointmentStatus)}
                          >
                            <SelectTrigger className="h-8 w-28 text-xs">
                              <SelectValue placeholder="Ubah" />
                            </SelectTrigger>
                            <SelectContent>
                              {nextStatuses.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {APPOINTMENT_STATUS_LABELS[s]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                <p className="text-sm">Tidak ada jadwal untuk tanggal ini</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* New Appointment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Buat Jadwal Baru</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Pasien</Label>
              <PatientCombobox
                clinicId={user?.clinic_id}
                value={watch('patient_id')}
                onSelect={(id) => setValue('patient_id', id, { shouldValidate: true })}
              />
              {errors.patient_id && <p className="text-xs text-destructive">{errors.patient_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Dokter</Label>
              <DoctorCombobox
                clinicId={user?.clinic_id}
                value={watch('doctor_id')}
                onSelect={(id) => setValue('doctor_id', id, { shouldValidate: true })}
              />
              {errors.doctor_id && <p className="text-xs text-destructive">{errors.doctor_id.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input type="date" {...register('appointment_date')} />
              </div>
              <div className="space-y-2">
                <Label>Mulai</Label>
                <Select onValueChange={(v) => setValue('start_time', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Selesai</Label>
                <Select onValueChange={(v) => setValue('end_time', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipe</Label>
              <Select onValueChange={(v) => setValue('type', v as AppointmentFormData['type'])} defaultValue="consultation">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(APPOINTMENT_TYPE_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Keluhan</Label>
              <Textarea {...register('complaint')} placeholder="Keluhan utama pasien" rows={2} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createAppointment.isPending}>
                {createAppointment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
