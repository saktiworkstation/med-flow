'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronsUpDown, Check, Loader2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getSupabaseClient } from '@/lib/supabase';
import { APPOINTMENT_TYPE_LABELS } from '@/lib/constants';
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
import type { AppointmentType } from '@/types/database';

interface AppointmentWithPatient {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_type: AppointmentType;
  status: string;
  patient?: { full_name: string } | null;
}

interface AppointmentComboboxProps {
  clinicId: string | undefined;
  value: string | undefined;
  onSelect: (appointmentId: string) => void;
  /** Filter hanya jadwal untuk pasien tertentu */
  patientId?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox untuk memilih jadwal/appointment.
 * Menampilkan: Nama Pasien + Tanggal + Waktu + Tipe.
 * Default filter: status confirmed/in_progress/scheduled.
 */
export default function AppointmentCombobox({
  clinicId,
  value,
  onSelect,
  patientId,
  placeholder = 'Cari jadwal...',
  disabled = false,
}: AppointmentComboboxProps) {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchAppointments = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    let query = supabase
      .from('appointments')
      .select('*, patient:patients(full_name)')
      .eq('clinic_id', clinicId)
      .in('status', ['scheduled', 'confirmed', 'in_progress'])
      .order('appointment_date', { ascending: false })
      .limit(100);

    if (patientId) {
      query = query.eq('patient_id', patientId);
    }

    const { data } = await query;
    setAppointments((data as AppointmentWithPatient[]) || []);
    setLoading(false);
  }, [clinicId, patientId, supabase]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const selected = appointments.find((a) => a.id === value);

  const formatLabel = (apt: AppointmentWithPatient) => {
    const patientName = (apt.patient as { full_name: string } | null)?.full_name ?? 'Pasien';
    const dateStr = format(parseISO(apt.appointment_date), 'dd MMM yyyy', { locale: idLocale });
    const typeLabel = APPOINTMENT_TYPE_LABELS[apt.appointment_type as AppointmentType] ?? apt.appointment_type;
    return `${patientName} — ${dateStr} ${apt.start_time} (${typeLabel})`;
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
              Memuat jadwal...
            </span>
          ) : selected ? (
            <span className="flex items-center gap-2 truncate">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
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
            <CommandEmpty>Jadwal tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {appointments.map((apt) => {
                const patientName = (apt.patient as { full_name: string } | null)?.full_name ?? 'Pasien';
                const dateStr = format(parseISO(apt.appointment_date), 'dd MMM yyyy', { locale: idLocale });
                const typeLabel = APPOINTMENT_TYPE_LABELS[apt.appointment_type as AppointmentType] ?? apt.appointment_type;
                return (
                  <CommandItem
                    key={apt.id}
                    value={`${patientName} ${dateStr} ${apt.start_time} ${typeLabel}`}
                    onSelect={() => {
                      onSelect(apt.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        value === apt.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{patientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {dateStr} &bull; {apt.start_time}–{apt.end_time} &bull; {typeLabel}
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
