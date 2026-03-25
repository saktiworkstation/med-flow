'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Stethoscope, Download, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Demo data
const REVENUE_MONTHLY = [
  { month: 'Jan', revenue: 45000000, expenses: 28000000 },
  { month: 'Feb', revenue: 52000000, expenses: 30000000 },
  { month: 'Mar', revenue: 48000000, expenses: 27000000 },
  { month: 'Apr', revenue: 61000000, expenses: 35000000 },
  { month: 'Mei', revenue: 55000000, expenses: 32000000 },
  { month: 'Jun', revenue: 67000000, expenses: 38000000 },
  { month: 'Jul', revenue: 72000000, expenses: 40000000 },
  { month: 'Agu', revenue: 69000000, expenses: 37000000 },
  { month: 'Sep', revenue: 78000000, expenses: 42000000 },
  { month: 'Okt', revenue: 82000000, expenses: 44000000 },
  { month: 'Nov', revenue: 75000000, expenses: 41000000 },
  { month: 'Des', revenue: 91000000, expenses: 48000000 },
];

const DIAGNOSIS_TOP = [
  { name: 'ISPA', count: 145 },
  { name: 'Hipertensi', count: 98 },
  { name: 'Diabetes Mellitus', count: 87 },
  { name: 'Gastritis', count: 72 },
  { name: 'Dermatitis', count: 56 },
  { name: 'Migrain', count: 43 },
  { name: 'UTI', count: 38 },
  { name: 'Asma', count: 31 },
];

const PAYMENT_METHODS = [
  { name: 'Tunai', value: 35, color: '#0d9488' },
  { name: 'BPJS', value: 28, color: '#3b82f6' },
  { name: 'Transfer', value: 18, color: '#8b5cf6' },
  { name: 'QRIS', value: 12, color: '#f59e0b' },
  { name: 'Kartu', value: 7, color: '#ef4444' },
];

const AGE_GROUPS = [
  { group: '0-12', male: 42, female: 38 },
  { group: '13-25', male: 56, female: 68 },
  { group: '26-40', male: 78, female: 92 },
  { group: '41-60', male: 65, female: 73 },
  { group: '60+', male: 34, female: 41 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('year');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analitik</h1>
          <p className="text-muted-foreground">Insight dan statistik klinik</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="patients">Pasien</TabsTrigger>
          <TabsTrigger value="doctors">Dokter</TabsTrigger>
          <TabsTrigger value="medications">Obat</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6 space-y-6">
          {/* Revenue Chart */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Pendapatan vs Pengeluaran
                </CardTitle>
                <CardDescription>Perbandingan bulanan tahun ini</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_MONTHLY}>
                      <defs>
                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <RechartsTooltip
                        formatter={(value, name) => [
                          formatCurrency(Number(value)),
                          String(name) === 'revenue' ? 'Pendapatan' : 'Pengeluaran',
                        ]}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend formatter={(value) => (value === 'revenue' ? 'Pendapatan' : 'Pengeluaran')} />
                      <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} fill="url(#gradRevenue)" />
                      <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#gradExpenses)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment Methods Pie */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Metode Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={PAYMENT_METHODS} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" stroke="none">
                          {PAYMENT_METHODS.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [`${value}%`, String(name)]}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-4">
                    {PAYMENT_METHODS.map((m) => (
                      <div key={m.name} className="flex items-center gap-1.5 text-xs">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.name}: {m.value}%
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Diagnoses */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Diagnosis Terbanyak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={DIAGNOSIS_TOP} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6 space-y-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Demografi Pasien berdasarkan Usia & Gender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={AGE_GROUPS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="group" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="male" name="Laki-laki" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="female" name="Perempuan" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <Card>
            <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
              <p>Statistik dokter akan ditampilkan dari database</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications" className="mt-6">
          <Card>
            <CardContent className="flex h-64 items-center justify-center text-muted-foreground">
              <p>Analitik obat akan ditampilkan dari database</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
