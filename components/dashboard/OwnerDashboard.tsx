'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarDays,
  DollarSign,
  FileText,
  TrendingUp,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatCurrency, formatTime, getAppointmentStatusColor, formatRelative } from '@/lib/utils';
import { APPOINTMENT_STATUS_LABELS } from '@/lib/constants';
import { useTodayAppointments } from '@/hooks/useAppointments';
import { useLowStockMedications } from '@/hooks/useMedications';
import type { User } from '@/types/database';

interface OwnerDashboardProps {
  user: User;
}

const DEMO_REVENUE_DATA = [
  { month: 'Jan', revenue: 45000000 },
  { month: 'Feb', revenue: 52000000 },
  { month: 'Mar', revenue: 48000000 },
  { month: 'Apr', revenue: 61000000 },
  { month: 'Mei', revenue: 55000000 },
  { month: 'Jun', revenue: 67000000 },
  { month: 'Jul', revenue: 72000000 },
  { month: 'Agu', revenue: 69000000 },
  { month: 'Sep', revenue: 78000000 },
  { month: 'Okt', revenue: 82000000 },
  { month: 'Nov', revenue: 75000000 },
  { month: 'Des', revenue: 91000000 },
];

const DEMO_APPOINTMENTS_WEEK = [
  { day: 'Sen', count: 18 },
  { day: 'Sel', count: 24 },
  { day: 'Rab', count: 20 },
  { day: 'Kam', count: 22 },
  { day: 'Jum', count: 15 },
  { day: 'Sab', count: 28 },
  { day: 'Min', count: 8 },
];

const DEMO_GENDER_DATA = [
  { name: 'Laki-laki', value: 245, color: '#0d9488' },
  { name: 'Perempuan', value: 312, color: '#8b5cf6' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function OwnerDashboard({ user }: OwnerDashboardProps) {
  const { data: todayAppointments, isLoading: appointmentsLoading } = useTodayAppointments(user.clinic_id);
  const { data: lowStockMeds, isLoading: medsLoading } = useLowStockMedications(user.clinic_id);
  const [animatedValues, setAnimatedValues] = useState({ patients: 0, appointments: 0, revenue: 0, invoices: 0 });

  // Animated counters
  useEffect(() => {
    const targets = { patients: 557, appointments: todayAppointments?.length ?? 12, revenue: 91200000, invoices: 8 };
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues({
        patients: Math.round(targets.patients * eased),
        appointments: Math.round(targets.appointments * eased),
        revenue: Math.round(targets.revenue * eased),
        invoices: Math.round(targets.invoices * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [todayAppointments?.length]);

  const kpiCards = [
    {
      title: 'Total Pasien',
      value: animatedValues.patients.toLocaleString('id-ID'),
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Jadwal Hari Ini',
      value: animatedValues.appointments.toString(),
      change: '+3',
      trend: 'up' as const,
      icon: CalendarDays,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: formatCurrency(animatedValues.revenue),
      change: '+18%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Tagihan Tertunda',
      value: animatedValues.invoices.toString(),
      change: '-2',
      trend: 'down' as const,
      icon: FileText,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {user.full_name}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <motion.div key={kpi.title} variants={item}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.title}</p>
                    <p className="mt-1 font-mono text-2xl font-bold">{kpi.value}</p>
                    <div className={`mt-1 flex items-center gap-1 text-xs ${kpi.trend === 'up' ? 'text-green-600' : 'text-amber-600'}`}>
                      {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.change} dari bulan lalu
                    </div>
                  </div>
                  <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tren Pendapatan
              </CardTitle>
              <CardDescription>Pendapatan 12 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DEMO_REVENUE_DATA}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}jt`}
                      tick={{ fontSize: 12 }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <RechartsTooltip
                      formatter={(value) => [formatCurrency(Number(value)), 'Pendapatan']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#0d9488"
                      strokeWidth={2}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender Pie */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Demografi Pasien</CardTitle>
              <CardDescription>Berdasarkan jenis kelamin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DEMO_GENDER_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {DEMO_GENDER_DATA.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6">
                {DEMO_GENDER_DATA.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Appointments Bar Chart */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Minggu Ini</CardTitle>
              <CardDescription>Jumlah kunjungan per hari</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEMO_APPOINTMENTS_WEEK}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Appointments + Low Stock */}
        <motion.div variants={item} className="space-y-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Jadwal Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-36">
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : todayAppointments && todayAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {todayAppointments.slice(0, 5).map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between rounded-lg border p-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium">{apt.patient?.full_name ?? 'Pasien'}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(apt.start_time)} - {formatTime(apt.end_time)}
                          </p>
                        </div>
                        <StatusBadge
                          status={apt.status}
                          colorClass={getAppointmentStatusColor(apt.status)}
                          label={APPOINTMENT_STATUS_LABELS[apt.status] ?? apt.status}
                          pulse={apt.status === 'in_progress'}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    Tidak ada jadwal hari ini
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Stok Obat Rendah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-28">
                {medsLoading ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : lowStockMeds && lowStockMeds.length > 0 ? (
                  <div className="space-y-2">
                    {lowStockMeds.slice(0, 4).map((med) => (
                      <div
                        key={med.id}
                        className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-2 text-sm dark:border-amber-900/50 dark:bg-amber-950/20"
                      >
                        <span className="font-medium">{med.name}</span>
                        <span className="font-mono text-amber-600">
                          {med.stock_quantity} {med.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Semua stok aman
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
