'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronsUpDown, Check, Loader2, Stethoscope } from 'lucide-react';
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
import type { User } from '@/types/database';

interface DoctorComboboxProps {
  clinicId: string | undefined;
  value: string | undefined;
  onSelect: (doctorId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox untuk memilih dokter.
 * Menampilkan nama lengkap + spesialisasi (jika ada).
 */
export default function DoctorCombobox({
  clinicId,
  value,
  onSelect,
  placeholder = 'Cari nama dokter...',
  disabled = false,
}: DoctorComboboxProps) {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchDoctors = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    const { data } = await supabase
      .from('users')
      .select('id, full_name, specialization')
      .eq('clinic_id', clinicId)
      .eq('role', 'doctor')
      .eq('is_active', true)
      .order('full_name', { ascending: true });
    setDoctors((data as User[]) || []);
    setLoading(false);
  }, [clinicId, supabase]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const selectedDoctor = doctors.find((d) => d.id === value);

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
              Memuat dokter...
            </span>
          ) : selectedDoctor ? (
            <span className="flex items-center gap-2 truncate">
              <Stethoscope className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selectedDoctor.full_name}</span>
              {selectedDoctor.specialization && (
                <span className="text-xs text-muted-foreground">
                  {selectedDoctor.specialization}
                </span>
              )}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Ketik nama dokter..." />
          <CommandList>
            <CommandEmpty>Dokter tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {doctors.map((doctor) => (
                <CommandItem
                  key={doctor.id}
                  value={`${doctor.full_name} ${doctor.specialization || ''}`}
                  onSelect={() => {
                    onSelect(doctor.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      value === doctor.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{doctor.full_name}</span>
                    {doctor.specialization && (
                      <span className="text-xs text-muted-foreground">
                        {doctor.specialization}
                      </span>
                    )}
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
