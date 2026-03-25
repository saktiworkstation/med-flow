'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  UserPlus,
  CalendarPlus,
  Receipt,
  Users,
  Pill,
  CalendarDays,
  FileText,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useUIStore } from '@/stores/useUIStore';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    },
    [commandPaletteOpen, setCommandPaletteOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const navigate = (path: string) => {
    router.push(path);
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2"
          >
            <Command className="overflow-hidden rounded-xl border bg-popover shadow-2xl">
              <div className="flex items-center gap-2 border-b px-4">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  placeholder="Cari pasien, obat, atau aksi cepat..."
                  className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  Tidak ditemukan.
                </Command.Empty>

                <Command.Group heading="Aksi Cepat" className="pb-2">
                  <Command.Item
                    onSelect={() => navigate('/patients?new=true')}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <UserPlus className="h-4 w-4 text-primary" />
                    Pasien Baru
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate('/appointments?new=true')}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <CalendarPlus className="h-4 w-4 text-primary" />
                    Jadwal Baru
                  </Command.Item>
                  <Command.Item
                    onSelect={() => navigate('/invoices?new=true')}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent"
                  >
                    <Receipt className="h-4 w-4 text-primary" />
                    Tagihan Baru
                  </Command.Item>
                </Command.Group>

                <Command.Separator className="my-1 h-px bg-border" />

                <Command.Group heading="Navigasi" className="pb-2">
                  <Command.Item onSelect={() => navigate('/patients')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <Users className="h-4 w-4" /> Pasien
                  </Command.Item>
                  <Command.Item onSelect={() => navigate('/appointments')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <CalendarDays className="h-4 w-4" /> Jadwal
                  </Command.Item>
                  <Command.Item onSelect={() => navigate('/medications')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <Pill className="h-4 w-4" /> Obat
                  </Command.Item>
                  <Command.Item onSelect={() => navigate('/prescriptions')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <FileText className="h-4 w-4" /> Resep
                  </Command.Item>
                  <Command.Item onSelect={() => navigate('/analytics')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <BarChart3 className="h-4 w-4" /> Analitik
                  </Command.Item>
                  <Command.Item onSelect={() => navigate('/settings')} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent aria-selected:bg-accent">
                    <Settings className="h-4 w-4" /> Pengaturan
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
