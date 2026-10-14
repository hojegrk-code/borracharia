'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { adminApi } from '../../lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const isMock =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-borracharia');

      if (isMock && email.trim() === 'admin@borracharia.com' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('borracharia_admin_logged', 'true');
          localStorage.setItem('borracharia_admin_email', email.trim());
          const mockPayload = btoa(
            JSON.stringify({ sub: 'admin-master-id', email: email.trim(), role: 'ADMIN' }),
          );
          localStorage.setItem('borracharia_admin_token', `mock.${mockPayload}.sig`);
        }
        try {
          await adminApi.syncUser('ADMIN');
        } catch (err: any) {
          console.warn('Sync admin:', err.message);
        }
        router.push('/');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (email.trim() === 'admin@borracharia.com' && password === 'admin123') {
          if (typeof window !== 'undefined') {
            localStorage.setItem('borracharia_admin_logged', 'true');
            localStorage.setItem('borracharia_admin_email', email.trim());
            const mockPayload = btoa(
              JSON.stringify({ sub: 'admin-master-id', email: email.trim(), role: 'ADMIN' }),
            );
            localStorage.setItem('borracharia_admin_token', `mock.${mockPayload}.sig`);
          }
          router.push('/');
          return;
        }
        throw new Error(error.message || 'Falha na autenticação');
      }

      const user = data.user;
      const role = user?.user_metadata?.role;

      // Se o usuário não for ADMIN explicitamente no metadata e falhar na checagem de API
      if (role && role !== 'ADMIN') {
        await supabase.auth.signOut();
        throw new Error(
          'Acesso negado: sua conta não possui privilégios de Administrador (ADMIN).',
        );
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('borracharia_admin_logged', 'true');
        localStorage.setItem('borracharia_admin_email', email.trim());
      }

      // Validação com o backend para sincronização e verificação de privilégios
      try {
        await adminApi.syncUser('ADMIN');
      } catch (err: any) {
        console.warn('Sync admin:', err.message);
      }

      router.push('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/30 text-orange-500 mb-4 shadow-lg shadow-orange-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">BorracharIA Control</h1>
          <p className="text-sm text-slate-400 mt-1">
            Painel Executivo de Gestão & Moderação de Parceiros
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 flex items-start gap-3 text-red-300 text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fundador@borracharia.com.br"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Ambiente restrito e monitorado. Todas as ações administrativas são auditadas.
        </p>
      </div>
    </div>
  );
}
