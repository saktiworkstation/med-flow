'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { FileText, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { formatDateTime, getPrescriptionStatusColor } from '@/lib/utils';
import { PRESCRIPTION_STATUS_LABELS } from '@/lib/constants';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Prescription } from '@/types/database';

const columnHelper = createColumnHelper<Prescription>();

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['prescriptions', user?.clinic_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, patient:patients(full_name), doctor:users(full_name)')
        .eq('clinic_id', user!.clinic_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!user?.clinic_id,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('prescription_date', {
        header: 'Tanggal',
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor((row) => (row.patient as unknown as { full_name: string })?.full_name, {
        id: 'patient_name',
        header: 'Pasien',
        cell: (info) => <span className="font-medium">{info.getValue() ?? '-'}</span>,
      }),
      columnHelper.accessor((row) => (row.doctor as unknown as { full_name: string })?.full_name, {
        id: 'doctor_name',
        header: 'Dokter',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <StatusBadge
            status={info.getValue()}
            colorClass={getPrescriptionStatusColor(info.getValue())}
            label={PRESCRIPTION_STATUS_LABELS[info.getValue()] ?? info.getValue()}
          />
        ),
      }),
      columnHelper.accessor('notes', {
        header: 'Catatan',
        cell: (info) => (
          <span className="text-muted-foreground">{info.getValue() ?? '-'}</span>
        ),
      }),
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resep</h1>
          <p className="text-muted-foreground">Kelola resep obat pasien</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Resep Baru
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
          data={prescriptions ?? []}
          searchKey="patient_name"
          searchPlaceholder="Cari resep..."
        />
      )}
    </div>
  );
}
