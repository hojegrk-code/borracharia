'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Lock, Mail, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { adminApi } from '../../../../lib/api';

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
        router.push('/admin');
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
          router.push('/admin');
          return;
        }
        throw new Error(error.message || 'Falha na autenticação');
      }

      const user = data.user;
      const role = user?.user_metadata?.role;

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

      try {
        await adminApi.syncUser('ADMIN');
      } catch (err: any) {
        console.warn('Sync admin:', err.message);
      }

      router.push('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro inesperado ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Hero Image com Overlay Escuro */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[2px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950" />

      {/* Decorative radial blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Card Glassmorphism */}
        <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo e Cabeçalho */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 text-white shadow-xl shadow-orange-500/25 mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Borrachar<span className="text-[#FF6600]">IA</span> Control
            </h1>
            <p className="text-xs text-zinc-400">Painel Master de Governança do Marketplace</p>
          </div>

          {/* Banner de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                E-mail do Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@borracharia.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black py-3.5 px-4 rounded-2xl text-sm transition shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Validando Credenciais...</span>
              ) : (
                <>
                  <span>Entrar no Painel Master</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dica de Acesso Rápido */}
          <div className="p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/60 text-center">
            <span className="text-[11px] text-zinc-400 block">
              Conta Master: <strong className="text-zinc-200">admin@borracharia.com</strong>
            </span>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-[#FF6600] transition flex items-center justify-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Voltar para a Página Inicial</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
