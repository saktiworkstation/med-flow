import { getSupabaseClient } from './supabase';
import type { User } from '@/types/database';

export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  return user;
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}
