'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import type { User } from '@/types/database';

/**
 * Auth hook yang mengelola state user dan session.
 * - Auto-redirect ke /login saat session expired
 * - Timeout 5 detik jika loading tanpa session
 * - Handle TOKEN_REFRESHED dan SIGNED_OUT events
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();
  const hasRedirected = useRef(false);

  const redirectToLogin = useCallback(() => {
    if (hasRedirected.current) return;
    hasRedirected.current = true;
    setUser(null);
    setLoading(false);
    router.push('/login');
  }, [router]);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      // Jika ada auth error (JWT expired, dll), redirect ke login
      if (authError) {
        redirectToLogin();
        return;
      }

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Jika query gagal karena auth (JWT/PGRST301), redirect
      if (dbError?.message?.includes('JWT') || dbError?.code === 'PGRST301') {
        await supabase.auth.signOut();
        redirectToLogin();
        return;
      }

      setUser(data);
      hasRedirected.current = false;
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [supabase, redirectToLogin]);

  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          hasRedirected.current = false;
          await fetchUser();
        } else if (event === 'SIGNED_OUT') {
          redirectToLogin();
        } else if (event === 'TOKEN_REFRESHED' && !session) {
          // Token refresh gagal — session expired
          redirectToLogin();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchUser, supabase.auth, redirectToLogin]);

  // Safety timeout: jika masih loading setelah 5 detik tanpa session, redirect
  useEffect(() => {
    if (!loading) return;

    const timeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        redirectToLogin();
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading, supabase.auth, redirectToLogin]);

  return { user, loading, refetch: fetchUser };
}
