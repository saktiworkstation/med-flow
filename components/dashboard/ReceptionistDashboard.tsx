'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarDays, UserPlus, Receipt, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatTime, getAppointmentStatusColor } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS } from '@/lib/constants';
import { useTodayAppointments } from '@/hooks/useAppointments';
import type { User } from '@/types/database';

interface ReceptionistDashboardProps {
  user: User;
}

export function ReceptionistDashboard({ user }: ReceptionistDashboardProps) {
  const { data: todayAppointments, isLoading } = useTodayAppointments(user.clinic_id);

  const waitingCount = todayAppointments?.filter(
    (a) => a.status === 'confirmed' || a.status === 'scheduled'
  ).length ?? 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Resepsionis</h1>
          <p className="text-muted-foreground">Selamat datang, {user.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/patients?new=true">
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Pasien Baru
            </Button>
          </Link>
          <Link href="/appointments?new=true">
            <Button size="sm" variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" />
              Jadwal Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Hari Ini</p>
              <p className="font-mono text-2xl font-bold">{todayAppointments?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-950/30">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Menunggu</p>
              <p className="font-mono text-2xl font-bold">{waitingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-green-50 p-2.5 dark:bg-green-950/30">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="font-mono text-2xl font-bold">
                {todayAppointments?.filter((a) => a.status === 'completed').length ?? 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <div className="space-y-2">
                {todayAppointments.map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="font-mono text-sm font-bold">{formatTime(apt.start_time)}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{formatTime(apt.end_time)}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="font-medium">{apt.patient?.full_name ?? 'Pasien'}</p>
                        <p className="text-xs text-muted-foreground">
                          Dr. {apt.doctor?.full_name ?? 'Dokter'} &bull; {apt.complaint ?? 'Konsultasi'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge
                      status={apt.status}
                      colorClass={getAppointmentStatusColor(apt.status)}
                      label={APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                      pulse={apt.status === 'in_progress'}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada jadwal hari ini
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
