'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createColumnHelper } from '@tanstack/react-table';
import {
  UserPlus,
  Search,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { usePatients, useCreatePatient } from '@/hooks/usePatients';
import { patientSchema, type PatientFormData } from '@/lib/validations';
import { calculateAge, getGenderLabel, formatDate } from '@/lib/utils';
import { BLOOD_TYPES } from '@/lib/utils';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import type { Patient } from '@/types/database';

const columnHelper = createColumnHelper<Patient>();

export default function PatientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('new') === 'true');

  const { data: patients, isLoading } = usePatients(user?.clinic_id, search);
  const createPatient = useCreatePatient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema) as any,
    defaultValues: { gender: 'male', allergies: [] },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('medical_record_number', {
        header: 'No. RM',
        cell: (info) => (
          <span className="font-mono text-xs">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('full_name', {
        header: 'Nama Pasien',
        cell: (info) => (
          <div>
            <p className="font-medium">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">
              {info.row.original.phone ?? '-'}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('gender', {
        header: 'L/P',
        cell: (info) => getGenderLabel(info.getValue()),
      }),
      columnHelper.accessor('date_of_birth', {
        header: 'Usia',
        cell: (info) => `${calculateAge(info.getValue())} tahun`,
      }),
      columnHelper.accessor('blood_type', {
        header: 'Gol. Darah',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('allergies', {
        header: 'Alergi',
        cell: (info) => {
          const allergies = info.getValue();
          if (!allergies || allergies.length === 0) return <span className="text-muted-foreground">-</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {allergies.slice(0, 2).map((a) => (
                <Badge key={a} variant="destructive" className="text-[10px]">
                  {a}
                </Badge>
              ))}
              {allergies.length > 2 && (
                <Badge variant="outline" className="text-[10px]">+{allergies.length - 2}</Badge>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('insurance_provider', {
        header: 'Asuransi',
        cell: (info) => info.getValue() ?? <span className="text-muted-foreground">-</span>,
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/patients/${info.row.original.id}`);
              }}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [router]
  );

  const onSubmit = async (data: PatientFormData) => {
    if (!user?.clinic_id) return;
    try {
      await createPatient.mutateAsync({ clinicId: user.clinic_id, data });
      toast.success('Pasien berhasil ditambahkan');
      setDialogOpen(false);
      reset();
    } catch {
      toast.error('Gagal menambahkan pasien');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pasien</h1>
          <p className="text-muted-foreground">
            Kelola data pasien klinik ({patients?.length ?? 0} pasien)
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Pasien Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={patients ?? []}
          searchKey="full_name"
          searchPlaceholder="Cari nama, no. RM, atau telepon..."
          onRowClick={(row) => router.push(`/patients/${row.id}`)}
        />
      )}

      {/* New Patient Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Pasien Baru</DialogTitle>
            <DialogDescription>Isi data pasien di bawah ini</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nama Lengkap *</Label>
                <Input {...register('full_name')} placeholder="Nama lengkap pasien" />
                {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tanggal Lahir *</Label>
                <Input type="date" {...register('date_of_birth')} />
                {errors.date_of_birth && <p className="text-xs text-destructive">{errors.date_of_birth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Jenis Kelamin *</Label>
                <Select onValueChange={(v) => setValue('gender', v as 'male' | 'female')} defaultValue="male">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Golongan Darah</Label>
                <Select onValueChange={(v) => setValue('blood_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input {...register('phone')} placeholder="+628xxxxxxxxxx" />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register('email')} type="email" placeholder="email@contoh.com" />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Alamat</Label>
                <Textarea {...register('address')} placeholder="Alamat lengkap" rows={2} />
              </div>

              <div className="space-y-2">
                <Label>Kontak Darurat</Label>
                <Input {...register('emergency_contact_name')} placeholder="Nama" />
              </div>

              <div className="space-y-2">
                <Label>No. Kontak Darurat</Label>
                <Input {...register('emergency_contact_phone')} placeholder="+628xxx" />
              </div>

              <div className="space-y-2">
                <Label>Asuransi</Label>
                <Input {...register('insurance_provider')} placeholder="BPJS / Asuransi Swasta" />
              </div>

              <div className="space-y-2">
                <Label>No. Asuransi</Label>
                <Input {...register('insurance_number')} placeholder="Nomor polis" />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Catatan</Label>
                <Textarea {...register('notes')} placeholder="Catatan tambahan" rows={2} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={createPatient.isPending}>
                {createPatient.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
