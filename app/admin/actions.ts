'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/lib/supabase/server';

/** OAuth 要回到發起登入的那個 origin（本機與正式站不同），所以從請求推導而不讀設定。 */
async function requestOrigin(): Promise<string> {
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  if (origin) {
    return origin;
  }
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host');
  if (!host) {
    throw new Error('cannot determine request origin');
  }
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http';
  return `${protocol}://${host}`;
}

export async function signInWithGoogle(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${await requestOrigin()}/admin/auth/callback` },
  });

  if (error || !data.url) {
    console.error('admin sign-in failed:', error?.message ?? 'no redirect url');
    redirect('/admin/login?error=auth');
  }

  redirect(data.url);
}

export async function signOut(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('admin sign-out failed:', error.message);
  }
  redirect('/admin/login');
}
