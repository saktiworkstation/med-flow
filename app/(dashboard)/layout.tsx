'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { getSupabaseClient } from '@/lib/supabase';
import { DashboardShell } from '@/components/layout/DashboardShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showTimeout, setShowTimeout] = useState(false);
  const supabase = getSupabaseClient();

  // Activate notifications listener
  useNotifications(user?.id);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Listen for auth errors globally — redirect on session expiry
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
          router.push('/login');
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  // Tampilkan pesan timeout jika loading > 5 detik
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setShowTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
          {showTimeout && (
            <p className="text-xs text-muted-foreground">
              Sesi mungkin sudah berakhir.{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-primary underline"
              >
                Kembali ke login
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
