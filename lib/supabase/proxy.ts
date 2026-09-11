import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

import { supabaseEnv } from './env';

export interface RefreshedSession {
  response: NextResponse;
  user: User | null;
}

/**
 * 在 proxy 裡刷新 session。`getUser()` 一定要呼叫：它才會把過期的 token 換新並透過
 * `setAll` 寫回 response；回傳的 `response` 必須原樣（或複製 cookie 後）送出。
 */
export async function refreshSession(request: NextRequest): Promise<RefreshedSession> {
  const { url, anonKey } = supabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
