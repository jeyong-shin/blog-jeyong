import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// SSR 시에도 작동할 수 있도록 singleton 패턴 적용
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
};

// 기존 방식 유지 (호환성을 위해)
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 