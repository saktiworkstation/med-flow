'use client';

import { motion } from 'framer-motion';
import { Clock, Users, Stethoscope, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatTime, getAppointmentStatusColor } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS } from '@/lib/constants';
import { useTodayAppointments } from '@/hooks/useAppointments';
import type { User } from '@/types/database';

interface DoctorDashboardProps {
  user: User;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const { data: todayAppointments, isLoading } = useTodayAppointments(user.clinic_id, user.id);

  const activeAppointment = todayAppointments?.find((a) => a.status === 'in_progress');
  const upcomingAppointments = todayAppointments?.filter(
    (a) => a.status === 'scheduled' || a.status === 'confirmed'
  );
  const completedCount = todayAppointments?.filter((a) => a.status === 'completed').length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Dashboard Dokter</h1>
        <p className="text-muted-foreground">Selamat datang, {user.full_name}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item} initial="hidden" animate="show">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jadwal Hari Ini</p>
                <p className="font-mono text-2xl font-bold">{todayAppointments?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-green-50 p-2.5 dark:bg-green-950/30">
                <Stethoscope className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selesai</p>
                <p className="font-mono text-2xl font-bold">{completedCount}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item} initial="hidden" animate="show" transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/30">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="font-mono text-2xl font-bold">{upcomingAppointments?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Active Patient */}
      {activeAppointment && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-primary">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Sedang Ditangani
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{activeAppointment.patient?.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(activeAppointment.start_time)} - {formatTime(activeAppointment.end_time)}
                  </p>
                  <p className="mt-1 text-sm">{activeAppointment.complaint}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Today's Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Antrian Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : todayAppointments && todayAppointments.length > 0 ? (
              <div className="space-y-2">
                {todayAppointments.map((apt, idx) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-mono text-sm font-medium">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium">{apt.patient?.full_name ?? 'Pasien'}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(apt.start_time)} &bull; {apt.complaint ?? 'Konsultasi'}
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

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
