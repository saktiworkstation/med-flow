'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useUIStore } from '@/stores/useUIStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/auth';
import type { User } from '@/types/database';

interface TopbarProps {
  user: User;
}

const BREADCRUMB_MAP: Record<string, string> = {
  '/': 'Dashboard',
  '/patients': 'Pasien',
  '/appointments': 'Jadwal',
  '/medical-records': 'Rekam Medis',
  '/prescriptions': 'Resep',
  '/pharmacy': 'Farmasi',
  '/medications': 'Obat',
  '/invoices': 'Tagihan',
  '/analytics': 'Analitik',
  '/settings': 'Pengaturan',
  '/notifications': 'Notifikasi',
};

export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setSidebarOpen, setCommandPaletteOpen } = useUIStore();
  const { unreadCount, setIsOpen: setNotifOpen } = useNotificationStore();

  const breadcrumbs = pathname.split('/').filter(Boolean);
  const currentPage = BREADCRUMB_MAP[pathname] ?? BREADCRUMB_MAP[`/${breadcrumbs[0]}`] ?? 'Dashboard';

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      {/* Mobile menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden text-muted-foreground sm:inline">MedFlow</span>
        <ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:inline" />
        <span className="font-medium">{currentPage}</span>
        {breadcrumbs.length > 1 && breadcrumbs[1] !== 'new' && (
          <>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Detail</span>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="hidden items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
      >
        <Search className="h-4 w-4" />
        <span>Cari...</span>
        <kbd className="pointer-events-none ml-4 hidden select-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium lg:inline">
          Ctrl+K
        </kbd>
      </button>

      {/* Mobile search button */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Notifications */}
      <button
        onClick={() => {
          setNotifOpen(true);
          router.push('/notifications');
        }}
        className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse-soft"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">{getInitials(user.full_name)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium lg:inline">{user.full_name}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
