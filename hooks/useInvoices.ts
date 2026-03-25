'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient } from '@/lib/supabase';
import type { Invoice, InvoiceStatus } from '@/types/database';

const supabase = getSupabaseClient();

export function useInvoices(clinicId: string | undefined, status?: InvoiceStatus) {
  return useQuery({
    queryKey: ['invoices', clinicId, status],
    queryFn: async () => {
      let query = supabase
        .from('invoices')
        .select('*, patient:patients(*), items:invoice_items(*)')
        .eq('clinic_id', clinicId!)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!clinicId,
  });
}

export function useInvoice(id: string | undefined) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, patient:patients(*), items:invoice_items(*)')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      clinicId,
      data,
    }: {
      clinicId: string;
      data: {
        patient_id: string;
        appointment_id?: string | null;
        due_date: string;
        subtotal: number;
        tax_amount: number;
        discount_amount: number;
        total_amount: number;
        payment_method?: string | null;
        notes?: string | null;
        items: Array<{
          description: string;
          category: string;
          quantity: number;
          unit_price: number;
          total_price: number;
        }>;
      };
    }) => {
      const { items, ...invoiceData } = data;

      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          clinic_id: clinicId,
          invoice_date: new Date().toISOString(),
          paid_amount: 0,
          status: 'draft' as const,
        })
        .select()
        .single();

      if (error) throw error;

      const invoiceItems = items.map((item) => ({
        ...item,
        invoice_id: (invoice as Invoice).id,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(invoiceItems);

      if (itemsError) throw itemsError;

      return invoice as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      paidAmount,
    }: {
      id: string;
      status: InvoiceStatus;
      paidAmount?: number;
    }) => {
      const updateData: Record<string, unknown> = { status };
      if (paidAmount !== undefined) {
        updateData['paid_amount'] = paidAmount;
      }

      const { data, error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Invoice;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
}
