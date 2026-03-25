'use client';

import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, CalendarDays, AlertTriangle, Receipt, UserPlus, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { formatRelative } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { NotificationType } from '@/types/database';

const NOTIF_ICONS: Record<NotificationType, React.ElementType> = {
  appointment_reminder: CalendarDays,
  low_stock: AlertTriangle,
  payment_due: Receipt,
  new_patient: UserPlus,
  system: Settings,
};

const NOTIF_COLORS: Record<NotificationType, string> = {
  appointment_reminder: 'bg-blue-100 text-blue-600 dark:bg-blue-950/30',
  low_stock: 'bg-amber-100 text-amber-600 dark:bg-amber-950/30',
  payment_due: 'bg-red-100 text-red-600 dark:bg-red-950/30',
  new_patient: 'bg-green-100 text-green-600 dark:bg-green-950/30',
  system: 'bg-gray-100 text-gray-600 dark:bg-gray-950/30',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { isLoading } = useNotifications(user?.id);
  const { notifications, unreadCount } = useNotificationStore();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => user && markAllRead.mutate(user.id)}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notif, idx) => {
            const Icon = NOTIF_ICONS[notif.type] ?? Bell;
            const colorClass = NOTIF_COLORS[notif.type] ?? NOTIF_COLORS['system'];
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-colors hover:bg-muted/50',
                    !notif.is_read && 'border-primary/30 bg-primary/5'
                  )}
                  onClick={() => !notif.is_read && markRead.mutate(notif.id)}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn('rounded-lg p-2', colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className={cn('font-medium', !notif.is_read && 'text-primary')}>
                          {notif.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatRelative(notif.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{notif.message}</p>
                    </div>
                    {!notif.is_read && (
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <p className="mt-3 text-muted-foreground">Tidak ada notifikasi</p>
          </div>
        </div>
      )}
    </div>
  );
}
