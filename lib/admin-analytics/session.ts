import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createSupabaseServerClient } from '../supabase/server.ts';

export interface SignedInSession {
  supabase: SupabaseClient;
  email: string;
}

/**
 * React cache() 讓 layout 與 page 在同一個請求裡共用同一次驗證。`getClaims()` 用
 * 專案的公開金鑰在本機驗 JWT，不再多打一次 Auth server；proxy 已經負責刷新 cookie。
 * 是否為 admin 由 queries.ts 問 is_admin() 決定，這裡只確認「已登入」。
 */
export const requireSession = cache(async (): Promise<SignedInSession> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) {
    redirect('/admin/login');
  }
  return { supabase, email: data.claims.email ?? '' };
});
