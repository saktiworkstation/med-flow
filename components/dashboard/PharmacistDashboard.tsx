'use client';

import { motion } from 'framer-motion';
import { Pill, AlertTriangle, ClipboardList, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useLowStockMedications, useMedications } from '@/hooks/useMedications';
import { getStockColor } from '@/lib/utils';
import type { User } from '@/types/database';

interface PharmacistDashboardProps {
  user: User;
}

export function PharmacistDashboard({ user }: PharmacistDashboardProps) {
  const { data: medications, isLoading: medsLoading } = useMedications(user.clinic_id);
  const { data: lowStock, isLoading: lowLoading } = useLowStockMedications(user.clinic_id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Farmasi</h1>
        <p className="text-muted-foreground">Selamat datang, {user.full_name}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Obat</p>
              <p className="font-mono text-2xl font-bold">{medications?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-amber-50 p-2.5 dark:bg-amber-950/30">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stok Rendah</p>
              <p className="font-mono text-2xl font-bold text-amber-600">{lowStock?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-950/30">
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resep Menunggu</p>
              <p className="font-mono text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Stok Kritis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              {lowLoading ? (
                <div className="space-y-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12" />)}</div>
              ) : lowStock && lowStock.length > 0 ? (
                <div className="space-y-2">
                  {lowStock.map((med) => (
                    <div key={med.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.generic_name}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-mono font-bold ${getStockColor(med.stock_quantity, med.min_stock_alert)}`}>
                          {med.stock_quantity} {med.unit}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Min: {med.min_stock_alert}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">Semua stok aman</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Inventaris Obat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              {medsLoading ? (
                <div className="space-y-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : medications && medications.length > 0 ? (
                <div className="space-y-1">
                  {medications.slice(0, 15).map((med) => (
                    <div key={med.id} className="flex items-center justify-between rounded p-2 text-sm hover:bg-muted/50">
                      <span>{med.name}</span>
                      <span className={`font-mono ${getStockColor(med.stock_quantity, med.min_stock_alert)}`}>
                        {med.stock_quantity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">Belum ada data obat</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
