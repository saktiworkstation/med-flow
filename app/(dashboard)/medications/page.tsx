'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useMedications, useCreateMedication } from '@/hooks/useMedications';
import { medicationSchema, type MedicationFormData } from '@/lib/validations';
import { formatCurrency, getStockColor } from '@/lib/utils';
import { MEDICATION_CATEGORY_LABELS } from '@/lib/constants';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Medication } from '@/types/database';

const columnHelper = createColumnHelper<Medication>();

export default function MedicationsPage() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: medications, isLoading } = useMedications(user?.clinic_id);
  const createMedication = useCreateMedication();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema) as any,
    defaultValues: { category: 'tablet', is_active: true, stock_quantity: 0, min_stock_alert: 10, price_per_unit: 0 },
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Nama Obat',
        cell: (info) => (
          <div>
            <p className="font-medium">{info.getValue()}</p>
            <p className="text-xs text-muted-foreground">{info.row.original.generic_name}</p>
          </div>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Kategori',
        cell: (info) => (
          <Badge variant="outline" className="text-xs">
            {MEDICATION_CATEGORY_LABELS[info.getValue()] ?? info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('stock_quantity', {
        header: 'Stok',
        cell: (info) => {
          const med = info.row.original;
          return (
            <span className={`font-mono font-bold ${getStockColor(med.stock_quantity, med.min_stock_alert)}`}>
              {med.stock_quantity} <span className="text-xs font-normal">{med.unit}</span>
            </span>
          );
        },
      }),
      columnHelper.accessor('min_stock_alert', {
        header: 'Min. Alert',
        cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
      }),
      columnHelper.accessor('price_per_unit', {
        header: 'Harga',
        cell: (info) => (
          <span className="font-mono text-sm">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('manufacturer', {
        header: 'Produsen',
        cell: (info) => info.getValue() ?? '-',
      }),
    ],
    []
  );

  const onSubmit = async (data: MedicationFormData) => {
    if (!user?.clinic_id) return;
    try {
      await createMedication.mutateAsync({ clinicId: user.clinic_id, data });
      toast.success('Obat berhasil ditambahkan');
      setDialogOpen(false);
      reset();
    } catch {
      toast.error('Gagal menambahkan obat');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Obat</h1>
          <p className="text-muted-foreground">
            Kelola inventaris obat klinik ({medications?.length ?? 0} item)
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Obat
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
          data={medications ?? []}
          searchKey="name"
          searchPlaceholder="Cari obat..."
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Obat</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Nama Obat *</Label>
                <Input {...register('name')} placeholder="Nama obat" />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Nama Generik</Label>
                <Input {...register('generic_name')} placeholder="Nama generik" />
              </div>

              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select onValueChange={(v) => setValue('category', v as MedicationFormData['category'])} defaultValue="tablet">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(MEDICATION_CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Satuan *</Label>
                <Input {...register('unit')} placeholder="tablet, ml, tube" />
              </div>

              <div className="space-y-2">
                <Label>Stok Awal</Label>
                <Input type="number" {...register('stock_quantity', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Min. Alert</Label>
                <Input type="number" {...register('min_stock_alert', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Harga per Satuan (Rp)</Label>
                <Input type="number" {...register('price_per_unit', { valueAsNumber: true })} />
              </div>

              <div className="space-y-2">
                <Label>Produsen</Label>
                <Input {...register('manufacturer')} placeholder="Nama produsen" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={createMedication.isPending}>
                {createMedication.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
