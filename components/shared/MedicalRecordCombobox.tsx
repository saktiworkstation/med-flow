'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronsUpDown, Check, Loader2, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface MedicalRecordRow {
  id: string;
  record_date: string;
  assessment: string | null;
  patient: { full_name: string } | null;
  doctor: { full_name: string } | null;
}

interface MedicalRecordComboboxProps {
  clinicId: string | undefined;
  value: string | undefined;
  onSelect: (recordId: string) => void;
  /** Filter hanya rekam medis untuk pasien tertentu */
  patientId?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox untuk memilih rekam medis.
 * Menampilkan: Tanggal + Nama Pasien + Assessment (diagnosis singkat).
 */
export default function MedicalRecordCombobox({
  clinicId,
  value,
  onSelect,
  patientId,
  placeholder = 'Cari rekam medis...',
  disabled = false,
}: MedicalRecordComboboxProps) {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<MedicalRecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchRecords = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    let query = supabase
      .from('medical_records')
      .select('id, record_date, assessment, patient:patients(full_name), doctor:users(full_name)')
      .eq('clinic_id', clinicId)
      .order('record_date', { ascending: false })
      .limit(100);

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data } = await query;
    setRecords((data as unknown as MedicalRecordRow[]) || []);
    setLoading(false);
  }, [clinicId, patientId, supabase]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const selected = records.find((r) => r.id === value);

  const formatLabel = (rec: MedicalRecordRow) => {
    const dateStr = format(parseISO(rec.record_date), 'dd MMM yyyy', { locale: idLocale });
    const patientName = rec.patient?.full_name ?? 'Pasien';
    const assessment = rec.assessment ? ` — ${rec.assessment.substring(0, 40)}` : '';
    return `${dateStr} • ${patientName}${assessment}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className="w-full justify-between font-normal"
        >
          {loading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Memuat rekam medis...
            </span>
          ) : selected ? (
            <span className="flex items-center gap-2 truncate">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{formatLabel(selected)}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Ketik nama pasien atau tanggal..." />
          <CommandList>
            <CommandEmpty>Rekam medis tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {records.map((rec) => {
                const dateStr = format(parseISO(rec.record_date), 'dd MMM yyyy', { locale: idLocale });
                const patientName = rec.patient?.full_name ?? 'Pasien';
                const doctorName = rec.doctor?.full_name ?? 'Dokter';
                return (
                  <CommandItem
                    key={rec.id}
                    value={`${patientName} ${doctorName} ${dateStr} ${rec.assessment || ''}`}
                    onSelect={() => {
                      onSelect(rec.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        value === rec.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{patientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {dateStr} &bull; Dr. {doctorName}
                        {rec.assessment ? ` — ${rec.assessment.substring(0, 50)}` : ''}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
