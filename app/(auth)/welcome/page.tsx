'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, LayoutDashboard, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Welcome page — ditampilkan setelah clinic owner berhasil signup.
 * Memberikan pilihan untuk langsung ke dashboard atau invite tim dulu.
 */
export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">MedFlow</span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          >
            <span className="text-3xl">🎉</span>
          </motion.div>
          <h1 className="text-2xl font-bold">Selamat Datang di MedFlow!</h1>
          <p className="mt-2 text-muted-foreground">
            Klinik Anda berhasil didaftarkan. Apa yang ingin Anda lakukan selanjutnya?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Card
            className="cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => router.push('/settings?tab=team')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Undang Tim Anda</h3>
                <p className="text-sm text-muted-foreground">
                  Tambahkan dokter, perawat, resepsionis, dan apoteker ke klinik Anda.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-colors hover:border-primary/50"
            onClick={() => router.push('/')}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Langsung ke Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Mulai gunakan MedFlow sekarang. Anda bisa mengundang tim nanti.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Anda bisa mengundang anggota tim kapan saja dari menu Pengaturan.
        </p>
      </motion.div>
    </div>
  );
}
