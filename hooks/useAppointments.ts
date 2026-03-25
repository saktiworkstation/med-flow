'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase';
import type { Appointment, AppointmentStatus } from '@/types/database';
import type { AppointmentFormData } from '@/lib/validations';

const supabase = getSupabaseClient();

export function useAppointments(
  clinicId: string | undefined,
  filters?: { date?: string; doctorId?: string; status?: AppointmentStatus }
) {
  return useQuery({
    queryKey: ['appointments', clinicId, filters],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select('*, patient:patients(*), doctor:users(*)')
        .eq('clinic_id', clinicId!)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (filters?.date) {
        query = query.eq('appointment_date', filters.date);
      }
      if (filters?.doctorId) {
        query = query.eq('doctor_id', filters.doctorId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!clinicId,
  });
}

export function useTodayAppointments(clinicId: string | undefined, doctorId?: string) {
  const today = new Date().toISOString().split('T')[0];
  return useAppointments(clinicId, { date: today, doctorId });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clinicId,
      data,
    }: {
      clinicId: string;
      data: AppointmentFormData;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: appointment, error } = await (supabase.from('appointments') as any)
        .insert({
          ...data,
          clinic_id: clinicId,
          status: 'scheduled' as const,
        })
        .select('*, patient:patients(*), doctor:users(*)')
        .single();
      if (error) throw error;
      return appointment as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: AppointmentStatus;
    }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('appointments') as any)
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
