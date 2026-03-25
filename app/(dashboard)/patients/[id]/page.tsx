'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Calendar,
  FileText,
  Receipt,
  AlertTriangle,
  Droplets,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePatient } from '@/hooks/usePatients';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { calculateAge, getGenderLabel, formatDate, formatDateTime, formatTime, formatCurrency, getAppointmentStatusColor, getInvoiceStatusColor, getPrescriptionStatusColor, getInitials } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS, PRESCRIPTION_STATUS_LABELS, INVOICE_STATUS_LABELS } from '@/lib/constants';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const { data: patient, isLoading } = usePatient(id);

  const { data: records } = useQuery({
    queryKey: ['patient-records', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*, doctor:users(full_name)')
        .eq('patient_id', id!)
        .order('record_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: appointments } = useQuery({
    queryKey: ['patient-appointments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctor:users(full_name)')
        .eq('patient_id', id!)
        .order('appointment_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: prescriptions } = useQuery({
    queryKey: ['patient-prescriptions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, doctor:users(full_name), items:prescription_items(*, medication:medications(name))')
        .eq('patient_id', id!)
        .order('prescription_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: invoices } = useQuery({
    queryKey: ['patient-invoices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('patient_id', id!)
        .order('invoice_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Pasien tidak ditemukan</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Patient Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src={patient.photo_url ?? undefined} />
              <AvatarFallback className="text-xl">{getInitials(patient.full_name)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{patient.full_name}</h1>
                  <Badge variant="outline" className="font-mono text-xs">
                    {patient.medical_record_number}
                  </Badge>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {getGenderLabel(patient.gender)} &bull; {calculateAge(patient.date_of_birth)} tahun &bull;{' '}
                  {formatDate(patient.date_of_birth)}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                {patient.blood_type && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Droplets className="h-4 w-4 text-red-500" />
                    Gol. Darah: <span className="font-semibold text-foreground">{patient.blood_type}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {patient.phone}
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {patient.email}
                  </div>
                )}
              </div>

              {/* Allergies */}
              {patient.allergies && patient.allergies.length > 0 && (
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Alergi:</span>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((a) => (
                      <Badge key={a} variant="destructive" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Insurance */}
            {patient.insurance_provider && (
              <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Shield className="h-4 w-4 text-primary" />
                  Asuransi
                </div>
                <p className="mt-1">{patient.insurance_provider}</p>
                <p className="font-mono text-xs text-muted-foreground">{patient.insurance_number}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="records">Rekam Medis</TabsTrigger>
          <TabsTrigger value="appointments">Kunjungan</TabsTrigger>
          <TabsTrigger value="prescriptions">Resep</TabsTrigger>
          <TabsTrigger value="invoices">Tagihan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {patient.address && (
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{patient.address}</span>
                  </div>
                )}
                {patient.emergency_contact_name && (
                  <div>
                    <p className="font-medium">Kontak Darurat</p>
                    <p className="text-muted-foreground">
                      {patient.emergency_contact_name} — {patient.emergency_contact_phone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {patient.notes ?? 'Tidak ada catatan'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kunjungan Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              {appointments && appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div>
                        <p className="font-medium">{formatDate(apt.appointment_date)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(apt.start_time)} — Dr. {apt.doctor?.full_name}
                        </p>
                      </div>
                      <StatusBadge
                        status={apt.status}
                        colorClass={getAppointmentStatusColor(apt.status)}
                        label={APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada kunjungan</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Rekam Medis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {records && records.length > 0 ? (
                <div className="space-y-4">
                  {records.map((rec: any) => (
                    <div key={rec.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{formatDateTime(rec.record_date)}</p>
                          <p className="text-xs text-muted-foreground">Dr. {rec.doctor?.full_name}</p>
                        </div>
                        {rec.is_confidential && (
                          <Badge variant="destructive" className="text-xs">Rahasia</Badge>
                        )}
                      </div>
                      {rec.assessment && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">Assessment</p>
                          <p className="text-sm">{rec.assessment}</p>
                        </div>
                      )}
                      {rec.icd_10_codes && rec.icd_10_codes.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {rec.icd_10_codes.map((code: string) => (
                            <Badge key={code} variant="outline" className="text-xs font-mono">{code}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada rekam medis</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Riwayat Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments && appointments.length > 0 ? (
                <div className="space-y-2">
                  {appointments.map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="text-center">
                          <p className="font-mono text-xs font-bold">{formatTime(apt.start_time)}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{formatTime(apt.end_time)}</p>
                        </div>
                        <div>
                          <p className="font-medium">{formatDate(apt.appointment_date)}</p>
                          <p className="text-xs text-muted-foreground">
                            Dr. {apt.doctor?.full_name}
                            {apt.complaint && ` — ${apt.complaint}`}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        status={apt.status}
                        colorClass={getAppointmentStatusColor(apt.status)}
                        label={APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada riwayat kunjungan</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resep Obat</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions && prescriptions.length > 0 ? (
                <div className="space-y-4">
                  {prescriptions.map((rx: any) => (
                    <div key={rx.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{formatDateTime(rx.prescription_date)}</p>
                          <p className="text-xs text-muted-foreground">Dr. {rx.doctor?.full_name}</p>
                        </div>
                        <StatusBadge
                          status={rx.status}
                          colorClass={getPrescriptionStatusColor(rx.status)}
                          label={PRESCRIPTION_STATUS_LABELS[rx.status] ?? rx.status}
                        />
                      </div>
                      {rx.items && rx.items.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {rx.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                              <span>{item.medication?.name ?? 'Obat'} — {item.dosage}</span>
                              <span className="font-mono">{item.quantity}x</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada resep</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt className="h-5 w-5" />
                Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices && invoices.length > 0 ? (
                <div className="space-y-2">
                  {invoices.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                      <div>
                        <p className="font-mono text-xs">{inv.invoice_number}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(inv.invoice_date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{formatCurrency(inv.total_amount)}</span>
                        <StatusBadge
                          status={inv.status}
                          colorClass={getInvoiceStatusColor(inv.status)}
                          label={INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada tagihan</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
