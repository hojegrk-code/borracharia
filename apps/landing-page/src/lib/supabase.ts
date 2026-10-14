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
 * Obtém o token JWT do usuário comum/cliente
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) return data.session.access_token;
  } catch (err) {
    console.warn('[Supabase Auth] Falha ao recuperar sessão:', err);
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem('borracharia_customer_token') || null;
  }
  return null;
}

/**
 * Obtém o token JWT do prestador
 */
export async function getProviderAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) return data.session.access_token;
  } catch (err) {
    console.warn('[Supabase Auth Provider] Falha ao recuperar sessão:', err);
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem('borracharia_provider_token') || null;
  }
  return null;
}

/**
 * Obtém o token JWT do administrador
 */
export async function getAdminAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) return data.session.access_token;
  } catch (err) {
    console.warn('[Supabase Auth Admin] Falha ao recuperar sessão:', err);
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem('borracharia_admin_token') || null;
  }
  return null;
}

/**
 * Retorna o usuário logado
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) return data.user;
  } catch {
    // fallback
  }
  return null;
}

/**
 * Retorna o prestador logado
 */
export async function getCurrentProvider(): Promise<User | null> {
  try {
    const { data } = await supabase.auth.getUser();
    if (data.user) return data.user;
  } catch {
    // fallback
  }
  if (
    typeof window !== 'undefined' &&
    localStorage.getItem('borracharia_provider_logged') === 'true'
  ) {
    return {
      id: localStorage.getItem('borracharia_provider_id') || 'pro-mock-id',
      email: localStorage.getItem('borracharia_provider_email') || 'borracheiro@borracharia.com',
      user_metadata: { role: 'PROVIDER' },
    } as unknown as User;
  }
  return null;
}

/**
 * Retorna o administrador logado
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
    return {
      id: 'admin-master-id',
      email: localStorage.getItem('borracharia_admin_email') || 'admin@borracharia.com',
      user_metadata: { role: 'ADMIN' },
    } as unknown as User;
  }
  return null;
}

/**
 * Realiza logout
 */
export async function signOutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('borracharia_customer_token');
    localStorage.removeItem('borracharia_customer_logged');
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

export async function signOutProvider(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('borracharia_provider_token');
    localStorage.removeItem('borracharia_provider_logged');
    localStorage.removeItem('borracharia_provider_email');
    localStorage.removeItem('borracharia_provider_id');
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}

export async function signOutAdmin(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('borracharia_admin_token');
    localStorage.removeItem('borracharia_admin_logged');
    localStorage.removeItem('borracharia_admin_email');
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore
  }
}
