'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronsUpDown, Check, Loader2, Pill, AlertTriangle } from 'lucide-react';
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
import type { Medication, MedicationCategory } from '@/types/database';

const CATEGORY_LABELS: Record<MedicationCategory, string> = {
  tablet: 'Tablet',
  capsule: 'Kapsul',
  syrup: 'Sirup',
  injection: 'Injeksi',
  cream: 'Krim',
  drops: 'Tetes',
  inhaler: 'Inhaler',
  other: 'Lainnya',
};

interface MedicationComboboxProps {
  clinicId: string | undefined;
  value: string | undefined;
  onSelect: (medicationId: string, medication: Medication) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Searchable combobox untuk memilih obat.
 * Menampilkan: Nama Obat + Kategori + Stok.
 * Warna merah jika stok rendah (stock_quantity <= min_stock_alert).
 */
export default function MedicationCombobox({
  clinicId,
  value,
  onSelect,
  placeholder = 'Cari obat...',
  disabled = false,
}: MedicationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const fetchMedications = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .limit(300);
    setMedications((data as Medication[]) || []);
    setLoading(false);
  }, [clinicId, supabase]);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const selected = medications.find((m) => m.id === value);

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
              Memuat obat...
            </span>
          ) : selected ? (
            <span className="flex items-center gap-2 truncate">
              <Pill className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selected.name}</span>
              <span className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[selected.category]} &bull; Stok: {selected.stock_quantity}
              </span>
              {selected.stock_quantity <= selected.min_stock_alert && (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-500" />
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
          <CommandInput placeholder="Ketik nama obat..." />
          <CommandList>
            <CommandEmpty>Obat tidak ditemukan</CommandEmpty>
            <CommandGroup>
              {medications.map((med) => {
                const isLow = med.stock_quantity <= med.min_stock_alert;
                return (
                  <CommandItem
                    key={med.id}
                    value={`${med.name} ${med.generic_name || ''} ${CATEGORY_LABELS[med.category]}`}
                    onSelect={() => {
                      onSelect(med.id, med);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        value === med.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-1 flex-col">
                      <span className="font-medium">{med.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {CATEGORY_LABELS[med.category]}
                        {med.generic_name ? ` — ${med.generic_name}` : ''}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'ml-2 text-xs font-mono',
                        isLow ? 'text-red-500 font-bold' : 'text-muted-foreground'
                      )}
                    >
                      {isLow && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                      {med.stock_quantity} {med.unit}
                    </span>
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
