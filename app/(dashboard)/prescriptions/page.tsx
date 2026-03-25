'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { FileText, Plus, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { formatDateTime, getPrescriptionStatusColor } from '@/lib/utils';
import { PRESCRIPTION_STATUS_LABELS } from '@/lib/constants';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PatientCombobox from '@/components/shared/PatientCombobox';
import DoctorCombobox from '@/components/shared/DoctorCombobox';
import MedicalRecordCombobox from '@/components/shared/MedicalRecordCombobox';
import MedicationCombobox from '@/components/shared/MedicationCombobox';
import type { Prescription, Medication } from '@/types/database';

const columnHelper = createColumnHelper<Prescription>();

interface PrescriptionItemDraft {
  medication_id: string;
  medication_name: string;
  dosage: string;
  quantity: number;
  frequency: string;
  duration_days: number;
  instructions: string;
}

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [medicalRecordId, setMedicalRecordId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<PrescriptionItemDraft[]>([]);

  // Current item being added
  const [curMedId, setCurMedId] = useState('');
  const [curDosage, setCurDosage] = useState('');
  const [curQuantity, setCurQuantity] = useState(1);
  const [curFrequency, setCurFrequency] = useState('');
  const [curDuration, setCurDuration] = useState(1);
  const [curInstructions, setCurInstructions] = useState('');

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

  const createPrescription = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not found');
      if (!patientId || !medicalRecordId) throw new Error('Pilih pasien dan rekam medis');
      if (items.length === 0) throw new Error('Tambahkan minimal 1 item obat');

      // Insert prescription
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: prescription, error } = await (supabase.from('prescriptions') as any)
        .insert({
          clinic_id: user.clinic_id,
          patient_id: patientId,
          doctor_id: user.id,
          medical_record_id: medicalRecordId,
          prescription_date: new Date().toISOString(),
          status: 'pending',
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Insert prescription items
      const prescriptionItems = items.map((item) => ({
        prescription_id: (prescription as Prescription).id,
        medication_id: item.medication_id,
        dosage: item.dosage,
        quantity: item.quantity,
        frequency: item.frequency,
        duration_days: item.duration_days,
        instructions: item.instructions || null,
      }));

      const { error: itemsError } = await supabase
        .from('prescription_items')
        .insert(prescriptionItems);

      if (itemsError) throw itemsError;

      return prescription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast.success('Resep berhasil dibuat');
      resetForm();
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat resep');
    },
  });

  const resetForm = () => {
    setPatientId('');
    setMedicalRecordId('');
    setNotes('');
    setItems([]);
    resetCurrentItem();
  };

  const resetCurrentItem = () => {
    setCurMedId('');
    setCurDosage('');
    setCurQuantity(1);
    setCurFrequency('');
    setCurDuration(1);
    setCurInstructions('');
  };

  const addItem = () => {
    if (!curMedId || !curDosage || !curFrequency) {
      toast.error('Lengkapi data obat (obat, dosis, frekuensi)');
      return;
    }
    const med = curMedId; // already have the id
    // Find the name from DOM isn't ideal, so we'll store it via the onSelect callback
    setItems([
      ...items,
      {
        medication_id: curMedId,
        medication_name: curMedName,
        dosage: curDosage,
        quantity: curQuantity,
        frequency: curFrequency,
        duration_days: curDuration,
        instructions: curInstructions,
      },
    ]);
    resetCurrentItem();
  };

  // Track medication name for display
  const [curMedName, setCurMedName] = useState('');

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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
        <Button onClick={() => setDialogOpen(true)}>
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

      {/* New Prescription Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Resep Baru</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Pasien */}
            <div className="space-y-2">
              <Label>Pasien *</Label>
              <PatientCombobox
                clinicId={user?.clinic_id}
                value={patientId || undefined}
                onSelect={(id) => {
                  setPatientId(id);
                  setMedicalRecordId(''); // Reset karena pasien berubah
                }}
              />
            </div>

            {/* Rekam Medis */}
            <div className="space-y-2">
              <Label>Rekam Medis *</Label>
              <MedicalRecordCombobox
                clinicId={user?.clinic_id}
                patientId={patientId || undefined}
                value={medicalRecordId || undefined}
                onSelect={setMedicalRecordId}
                disabled={!patientId}
              />
              {!patientId && (
                <p className="text-xs text-muted-foreground">Pilih pasien terlebih dahulu</p>
              )}
            </div>

            {/* Catatan */}
            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan resep (opsional)"
                rows={2}
              />
            </div>

            <Separator />

            {/* Item Obat yang sudah ditambahkan */}
            <div>
              <Label className="mb-2 block">Item Obat ({items.length})</Label>
              {items.length > 0 && (
                <div className="mb-3 space-y-2">
                  {items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.medication_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.dosage} &bull; {item.frequency} &bull; {item.quantity}x &bull; {item.duration_days} hari
                          {item.instructions ? ` — ${item.instructions}` : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => removeItem(i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Form tambah item obat */}
              <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
                <p className="text-sm font-medium">Tambah Obat</p>
                <div className="space-y-2">
                  <MedicationCombobox
                    clinicId={user?.clinic_id}
                    value={curMedId || undefined}
                    onSelect={(id, med) => {
                      setCurMedId(id);
                      setCurMedName(med.name);
                    }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Dosis *</Label>
                    <Input
                      value={curDosage}
                      onChange={(e) => setCurDosage(e.target.value)}
                      placeholder="cth: 500mg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Frekuensi *</Label>
                    <Input
                      value={curFrequency}
                      onChange={(e) => setCurFrequency(e.target.value)}
                      placeholder="cth: 3x sehari"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah</Label>
                    <Input
                      type="number"
                      min={1}
                      value={curQuantity}
                      onChange={(e) => setCurQuantity(Number(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Durasi (hari)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={curDuration}
                      onChange={(e) => setCurDuration(Number(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Instruksi</Label>
                  <Input
                    value={curInstructions}
                    onChange={(e) => setCurInstructions(e.target.value)}
                    placeholder="cth: Setelah makan"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  disabled={!curMedId || !curDosage || !curFrequency}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah ke Resep
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
              Batal
            </Button>
            <Button
              onClick={() => createPrescription.mutate()}
              disabled={createPrescription.isPending || !patientId || !medicalRecordId || items.length === 0}
            >
              {createPrescription.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Resep
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
