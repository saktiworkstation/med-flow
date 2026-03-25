'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Receipt, Printer } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvoices, useUpdateInvoiceStatus } from '@/hooks/useInvoices';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import { INVOICE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import type { Invoice, InvoiceStatus } from '@/types/database';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<Invoice>();

export default function InvoicesPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>(undefined);
  const { data: invoices, isLoading } = useInvoices(user?.clinic_id, statusFilter);
  const updateStatus = useUpdateInvoiceStatus();

  const handleStatusChange = async (id: string, status: InvoiceStatus) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status,
        paidAmount: status === 'paid' ? invoices?.find((i) => i.id === id)?.total_amount : undefined,
      });
      toast.success('Status tagihan diperbarui');
    } catch {
      toast.error('Gagal memperbarui status');
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('invoice_number', {
        header: 'No. Invoice',
        cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
      }),
      columnHelper.accessor((row) => (row.patient as unknown as { full_name: string })?.full_name, {
        id: 'patient_name',
        header: 'Pasien',
        cell: (info) => <span className="font-medium">{info.getValue() ?? '-'}</span>,
      }),
      columnHelper.accessor('invoice_date', {
        header: 'Tanggal',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor('total_amount', {
        header: 'Total',
        cell: (info) => (
          <span className="font-mono font-bold">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('paid_amount', {
        header: 'Dibayar',
        cell: (info) => (
          <span className="font-mono">{formatCurrency(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <StatusBadge
            status={info.getValue()}
            colorClass={getInvoiceStatusColor(info.getValue())}
            label={INVOICE_STATUS_LABELS[info.getValue()] ?? info.getValue()}
          />
        ),
      }),
      columnHelper.accessor('payment_method', {
        header: 'Metode',
        cell: (info) => {
          const v = info.getValue();
          return v ? (
            <Badge variant="outline" className="text-xs">
              {PAYMENT_METHOD_LABELS[v] ?? v}
            </Badge>
          ) : '-';
        },
      }),
      columnHelper.display({
        id: 'actions',
        cell: (info) => {
          const inv = info.row.original;
          if (inv.status === 'paid' || inv.status === 'cancelled') return null;
          return (
            <Select onValueChange={(v) => handleStatusChange(inv.id, v as InvoiceStatus)}>
              <SelectTrigger className="h-7 w-24 text-xs">
                <SelectValue placeholder="Ubah" />
              </SelectTrigger>
              <SelectContent>
                {inv.status === 'draft' && <SelectItem value="sent">Kirim</SelectItem>}
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="cancelled">Batal</SelectItem>
              </SelectContent>
            </Select>
          );
        },
      }),
    ],
    [invoices]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tagihan</h1>
          <p className="text-muted-foreground">Kelola tagihan dan pembayaran pasien</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tagihan Baru
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {['all', 'draft', 'sent', 'paid', 'overdue'].map((s) => (
          <Button
            key={s}
            variant={
              (s === 'all' && !statusFilter) || s === statusFilter ? 'default' : 'outline'
            }
            size="sm"
            onClick={() => setStatusFilter(s === 'all' ? undefined : (s as InvoiceStatus))}
          >
            {s === 'all' ? 'Semua' : INVOICE_STATUS_LABELS[s] ?? s}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={invoices ?? []}
          searchKey="invoice_number"
          searchPlaceholder="Cari nomor invoice..."
        />
      )}
    </div>
  );
}
