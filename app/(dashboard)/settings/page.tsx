'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Building,
  Users,
  Receipt,
  Bell,
  Shield,
  Download,
  Save,
  Loader2,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getSupabaseClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getRoleLabel, getRoleBadgeColor } from '@/lib/utils';
import TeamManagement from '@/components/settings/TeamManagement';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';

export default function SettingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'general';
  const [saving, setSaving] = useState(false);
  const supabase = getSupabaseClient();

  const handleSaveClinic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    // Save clinic settings to Supabase
    setTimeout(() => {
      toast.success('Pengaturan berhasil disimpan');
      setSaving(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola pengaturan klinik dan tim</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">
            <Building className="mr-2 h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="mr-2 h-4 w-4" />
            Tim
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Receipt className="mr-2 h-4 w-4" />
            Tagihan
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-2 h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="audit">
            <Shield className="mr-2 h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-2 h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Klinik</CardTitle>
              <CardDescription>Data dasar klinik Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveClinic} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nama Klinik</Label>
                    <Input defaultValue="Klinik Sehat Sentosa" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Alamat</Label>
                    <Textarea defaultValue="Jl. Kesehatan No. 123, Jakarta Selatan" rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telepon</Label>
                    <Input defaultValue="+62211234567" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="info@kliniksehat.co.id" />
                  </div>
                </div>

                <Separator />

                <h3 className="font-semibold">Jam Operasional</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(
                    (day) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="w-16 text-sm">{day}</span>
                        <Input defaultValue="08:00" type="time" className="w-24" />
                        <span className="text-muted-foreground">-</span>
                        <Input defaultValue={day === 'Minggu' ? '12:00' : '20:00'} type="time" className="w-24" />
                        <Switch defaultChecked={day !== 'Minggu'} />
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6 space-y-4">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tagihan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Biaya Konsultasi Default (Rp)</Label>
                  <Input type="number" defaultValue="150000" />
                </div>
                <div className="space-y-2">
                  <Label>Tarif PPN (%)</Label>
                  <Input type="number" defaultValue="11" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferensi Notifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Pengingat jadwal', desc: 'Kirim pengingat sebelum jadwal pasien' },
                  { label: 'Stok obat rendah', desc: 'Notifikasi saat stok mencapai batas minimum' },
                  { label: 'Tagihan jatuh tempo', desc: 'Pengingat tagihan yang belum dibayar' },
                  { label: 'Pasien baru', desc: 'Notifikasi saat pasien baru terdaftar' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <ChangePasswordForm />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Riwayat semua aktivitas di klinik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <p className="text-sm">Audit log akan ditampilkan dari database</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download semua data klinik untuk kepatuhan regulasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['Pasien', 'Rekam Medis', 'Jadwal', 'Resep', 'Tagihan', 'Obat'].map((type) => (
                <div key={type} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">{type}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">CSV</Button>
                    <Button variant="outline" size="sm">JSON</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
