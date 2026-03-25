'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, Receipt, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInvoices, useUpdateInvoiceStatus, useCreateInvoice } from '@/hooks/useInvoices';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import { INVOICE_STATUS_LABELS, PAYMENT_METHOD_LABELS } from '@/lib/constants';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PatientCombobox from '@/components/shared/PatientCombobox';
import AppointmentCombobox from '@/components/shared/AppointmentCombobox';
import type { Invoice, InvoiceStatus } from '@/types/database';
import { toast } from 'sonner';

const columnHelper = createColumnHelper<Invoice>();

interface InvoiceItemDraft {
  description: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | undefined>(undefined);
  const { data: invoices, isLoading } = useInvoices(user?.clinic_id, statusFilter);
  const updateStatus = useUpdateInvoiceStatus();
  const createInvoice = useCreateInvoice();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [appointmentId, setAppointmentId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceNotes, setInvoiceNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItemDraft[]>([]);

  // Current item
  const [curDesc, setCurDesc] = useState('');
  const [curCategory, setCurCategory] = useState('consultation');
  const [curQty, setCurQty] = useState(1);
  const [curPrice, setCurPrice] = useState(0);

  const resetForm = () => {
    setPatientId('');
    setAppointmentId('');
    setDueDate('');
    setInvoiceNotes('');
    setPaymentMethod('');
    setDiscountAmount(0);
    setInvoiceItems([]);
    setCurDesc('');
    setCurCategory('consultation');
    setCurQty(1);
    setCurPrice(0);
  };

  const addItem = () => {
    if (!curDesc || curPrice <= 0) {
      toast.error('Isi deskripsi dan harga item');
      return;
    }
    setInvoiceItems([
      ...invoiceItems,
      {
        description: curDesc,
        category: curCategory,
        quantity: curQty,
        unit_price: curPrice,
        total_price: curQty * curPrice,
      },
    ]);
    setCurDesc('');
    setCurCategory('consultation');
    setCurQty(1);
    setCurPrice(0);
  };

  const removeItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total_price, 0);
  const taxAmount = Math.round(subtotal * 0.11); // PPN 11%
  const totalAmount = subtotal + taxAmount - discountAmount;

  const handleCreateInvoice = async () => {
    if (!patientId || invoiceItems.length === 0 || !dueDate) {
      toast.error('Lengkapi pasien, tanggal jatuh tempo, dan minimal 1 item');
      return;
    }
    try {
      await createInvoice.mutateAsync({
        clinicId: user!.clinic_id,
        data: {
          patient_id: patientId,
          appointment_id: appointmentId || null,
          due_date: dueDate,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          payment_method: paymentMethod || null,
          notes: invoiceNotes || null,
          items: invoiceItems,
        },
      });
      toast.success('Tagihan berhasil dibuat');
      resetForm();
      setDialogOpen(false);
    } catch {
      toast.error('Gagal membuat tagihan');
    }
  };

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
        <Button onClick={() => setDialogOpen(true)}>
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

      {/* New Invoice Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Tagihan Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pasien *</Label>
                <PatientCombobox
                  clinicId={user?.clinic_id}
                  value={patientId || undefined}
                  onSelect={(id) => { setPatientId(id); setAppointmentId(''); }}
                />
              </div>
              <div className="space-y-2">
                <Label>Jadwal (opsional)</Label>
                <AppointmentCombobox
                  clinicId={user?.clinic_id}
                  patientId={patientId || undefined}
                  value={appointmentId || undefined}
                  onSelect={setAppointmentId}
                  disabled={!patientId}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tanggal Jatuh Tempo *</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="card">Kartu</SelectItem>
                    <SelectItem value="insurance">Asuransi</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                placeholder="Catatan tagihan (opsional)"
                rows={2}
              />
            </div>

            <Separator />

            {/* Item Tagihan */}
            <div>
              <Label className="mb-2 block">Item Tagihan ({invoiceItems.length})</Label>
              {invoiceItems.length > 0 && (
                <div className="mb-3 space-y-2">
                  {invoiceItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity}x {formatCurrency(item.unit_price)} = {formatCurrency(item.total_price)}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive" onClick={() => removeItem(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                <p className="text-sm font-medium">Tambah Item</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Deskripsi *</Label>
                    <Input value={curDesc} onChange={(e) => setCurDesc(e.target.value)} placeholder="cth: Biaya Konsultasi" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kategori</Label>
                    <Select value={curCategory} onValueChange={setCurCategory}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Konsultasi</SelectItem>
                        <SelectItem value="procedure">Tindakan</SelectItem>
                        <SelectItem value="medication">Obat</SelectItem>
                        <SelectItem value="lab_test">Lab</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah</Label>
                    <Input type="number" min={1} value={curQty} onChange={(e) => setCurQty(Number(e.target.value) || 1)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Harga Satuan (Rp) *</Label>
                    <Input type="number" min={0} value={curPrice} onChange={(e) => setCurPrice(Number(e.target.value) || 0)} />
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addItem} disabled={!curDesc || curPrice <= 0}>
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah Item
                </Button>
              </div>
            </div>

            {/* Summary */}
            {invoiceItems.length > 0 && (
              <div className="rounded-lg border p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PPN (11%)</span>
                  <span className="font-mono">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Diskon</span>
                  <Input
                    type="number"
                    min={0}
                    className="w-32 h-7 text-right font-mono"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                  />
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button
              onClick={handleCreateInvoice}
              disabled={createInvoice.isPending || !patientId || invoiceItems.length === 0 || !dueDate}
            >
              {createInvoice.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Tagihan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
