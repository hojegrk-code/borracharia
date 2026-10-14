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
 * Obtém o token JWT da sessão atual do Administrador
 */
export async function getAdminAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      return data.session.access_token;
    }
  } catch (err) {
    console.warn('[Supabase Auth Admin] Falha ao recuperar sessão:', err);
  }

  if (typeof window !== 'undefined') {
    return localStorage.getItem('borracharia_admin_token') || null;
  }
  return null;
}

/**
 * Retorna o usuário administrador autenticado atualmente
 */
export async function getCurrentAdmin(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) return data.user;
  } catch {
    // fallback
  }

  if (
    typeof window !== 'undefined' &&
    localStorage.getItem('borracharia_admin_logged') === 'true'
  ) {
    const email = localStorage.getItem('borracharia_admin_email') || 'admin@borracharia.com';
    return {
      id: 'admin-master-id',
      app_metadata: {},
      user_metadata: { role: 'ADMIN' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email,
    } as unknown as User;
  }

  return null;
}

/**
 * Realiza logout do usuário administrador
 */
export async function signOutAdmin(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('borracharia_admin_logged');
    localStorage.removeItem('borracharia_admin_email');
    localStorage.removeItem('borracharia_admin_token');
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}
