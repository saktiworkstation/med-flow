'use client';

import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Check, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { formatDateTime, getPrescriptionStatusColor } from '@/lib/utils';
import { PRESCRIPTION_STATUS_LABELS } from '@/lib/constants';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import type { Prescription, PrescriptionStatus } from '@/types/database';

export default function PharmacyPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const { data: pendingRx, isLoading } = useQuery({
    queryKey: ['pharmacy-queue', user?.clinic_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*, patient:patients(full_name), doctor:users(full_name), items:prescription_items(*, medication:medications(name, unit, stock_quantity))')
        .eq('clinic_id', user!.clinic_id)
        .in('status', ['pending', 'partially_dispensed'])
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Prescription[];
    },
    enabled: !!user?.clinic_id,
  });

  const dispense = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PrescriptionStatus }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('prescriptions') as any)
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy-queue'] });
      toast.success('Resep berhasil di-dispense');
    },
    onError: () => {
      toast.error('Gagal memperbarui resep');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Farmasi</h1>
        <p className="text-muted-foreground">
          Antrian resep untuk di-dispense ({pendingRx?.length ?? 0} menunggu)
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : pendingRx && pendingRx.length > 0 ? (
          <div className="space-y-4">
            {pendingRx.map((rx, idx) => (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {(rx.patient as unknown as { full_name: string })?.full_name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Dr. {(rx.doctor as unknown as { full_name: string })?.full_name} &bull;{' '}
                          {formatDateTime(rx.prescription_date)}
                        </p>
                      </div>
                      <StatusBadge
                        status={rx.status}
                        colorClass={getPrescriptionStatusColor(rx.status)}
                        label={PRESCRIPTION_STATUS_LABELS[rx.status] ?? rx.status}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {rx.items && rx.items.length > 0 ? (
                      <div className="space-y-2">
                        {rx.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-sm"
                          >
                            <div>
                              <p className="font-medium">
                                {(item.medication as unknown as { name: string })?.name ?? 'Obat'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.dosage} &bull; {item.frequency} &bull; {item.duration_days} hari
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-bold">{item.quantity}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {(item.medication as unknown as { unit: string })?.unit ?? 'unit'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Tidak ada item resep</p>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => dispense.mutate({ id: rx.id, status: 'dispensed' })}
                        disabled={dispense.isPending}
                      >
                        {dispense.isPending ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Dispense Semua
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-3 text-muted-foreground">Tidak ada resep menunggu</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
