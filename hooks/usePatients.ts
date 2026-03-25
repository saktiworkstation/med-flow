'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase';
import type { Patient } from '@/types/database';
import type { PatientFormData } from '@/lib/validations';

const supabase = getSupabaseClient();

export function usePatients(clinicId: string | undefined, search?: string) {
  return useQuery({
    queryKey: ['patients', clinicId, search],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('*')
        .eq('clinic_id', clinicId!)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,medical_record_number.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Patient[];
    },
    enabled: !!clinicId,
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Patient;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clinicId,
      data,
    }: {
      clinicId: string;
      data: PatientFormData;
    }) => {
      const { data: patient, error } = await supabase
        .from('patients')
        .insert({ ...data, clinic_id: clinicId })
        .select()
        .single();
      if (error) throw error;
      return patient as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PatientFormData>;
    }) => {
      const { data: patient, error } = await supabase
        .from('patients')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return patient as Patient;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
  });
}
