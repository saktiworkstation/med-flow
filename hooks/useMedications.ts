'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase';
import type { Medication } from '@/types/database';
import type { MedicationFormData } from '@/lib/validations';

const supabase = getSupabaseClient();

export function useMedications(clinicId: string | undefined, search?: string) {
  return useQuery({
    queryKey: ['medications', clinicId, search],
    queryFn: async () => {
      let query = supabase
        .from('medications')
        .select('*')
        .eq('clinic_id', clinicId!)
        .eq('is_active', true)
        .order('name');

      if (search) {
        query = query.or(`name.ilike.%${search}%,generic_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!clinicId,
  });
}

export function useLowStockMedications(clinicId: string | undefined) {
  return useQuery({
    queryKey: ['medications', 'low-stock', clinicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_low_stock_medications', { p_clinic_id: clinicId! });

      if (error) {
        // Fallback if RPC doesn't exist
        const { data: meds, error: fallbackError } = await supabase
          .from('medications')
          .select('*')
          .eq('clinic_id', clinicId!)
          .eq('is_active', true)
          .order('stock_quantity');

        if (fallbackError) throw fallbackError;
        return (meds as Medication[]).filter(
          (m) => m.stock_quantity <= m.min_stock_alert
        );
      }

      return data as Medication[];
    },
    enabled: !!clinicId,
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clinicId,
      data,
    }: {
      clinicId: string;
      data: MedicationFormData;
    }) => {
      const { data: med, error } = await supabase
        .from('medications')
        .insert({ ...data, clinic_id: clinicId })
        .select()
        .single();
      if (error) throw error;
      return med as Medication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MedicationFormData>;
    }) => {
      const { data: med, error } = await supabase
        .from('medications')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return med as Medication;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });
}
