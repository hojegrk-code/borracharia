import { createClient, User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-borracharia.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_borracharia_anon_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Obtém o token JWT da sessão atual do prestador
 */
export async function getProviderAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch (err) {
    console.warn('[Supabase Auth Pro] Falha ao recuperar sessão:', err);
    return null;
  }
}

/**
 * Retorna o prestador autenticado atualmente
 */
export async function getCurrentProvider(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user || null;
  } catch {
    return null;
  }
}

/**
 * Realiza logout do prestador
 */
export async function signOutProvider(): Promise<void> {
  await supabase.auth.signOut();
}
