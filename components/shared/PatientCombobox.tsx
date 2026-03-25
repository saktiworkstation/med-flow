'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronsUpDown, Check, Loader2, User } from 'lucide-react';
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
import type { Patient } from '@/types/database';

interface PatientComboboxProps {
  clinicId: string | undefined;
  value: string | undefined;
  onSelect: (patientId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox untuk memilih pasien.
 * Menampilkan nama lengkap + nomor rekam medis.
 */
export default function PatientCombobox({
  clinicId,
  value,
  onSelect,
  placeholder = 'Cari nama pasien...',
  disabled = false,
}: PatientComboboxProps) {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchPatients = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    const { data } = await supabase
      .from('patients')
      .select('id, full_name, medical_record_number')
      .eq('clinic_id', clinicId)
      .order('full_name', { ascending: true })
      .limit(200);
    setPatients((data as Patient[]) || []);
    setLoading(false);
  }, [clinicId, supabase]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const selectedPatient = patients.find((p) => p.id === value);

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
              Memuat pasien...
            </span>
          ) : selectedPatient ? (
            <span className="flex items-center gap-2 truncate">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selectedPatient.full_name}</span>
              <span className="text-xs text-muted-foreground">
                {selectedPatient.medical_record_number}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Ketik nama pasien..." />
          <CommandList>
            <CommandEmpty>Pasien tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {patients.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={`${patient.full_name} ${patient.medical_record_number}`}
                  onSelect={() => {
                    onSelect(patient.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      value === patient.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{patient.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {patient.medical_record_number}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
