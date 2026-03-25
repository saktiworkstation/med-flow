'use client';

import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/useUIStore';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { QuickViewPanel } from './QuickViewPanel';
import type { User } from '@/types/database';

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const { sidebarCollapsed } = useUIStore();

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/auth');
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} onLogout={handleLogout} />

      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex min-h-screen flex-col max-lg:!ml-0"
      >
        <Topbar user={user} />

        <main className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>

      <CommandPalette />
      <QuickViewPanel />
    </div>
  );
}
