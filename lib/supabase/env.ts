export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/** 兩個變數本來就為 `/product` 預覽而存在；缺一個就是部署設定錯誤，直接丟出。 */
export function supabaseEnv(): SupabaseEnv {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  }
  return { url, anonKey };
}
