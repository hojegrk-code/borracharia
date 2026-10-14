'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Lock, Mail, Wrench } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { providerApi } from '../../../../lib/api';

export default function ProviderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const isMock =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock-borracharia');

      if (isMock) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('borracharia_provider_logged', 'true');
          localStorage.setItem('borracharia_provider_email', email.trim());
          const mockPayload = btoa(
            JSON.stringify({ sub: 'pro-mock-id', email: email.trim(), role: 'PROVIDER' }),
          );
          localStorage.setItem('borracharia_provider_token', `mock.${mockPayload}.sig`);
        }
        try {
          await providerApi.syncUserWithBackend('PROVIDER');
        } catch {
          // ignore
        }
        router.push('/pro');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback local se estiver em desenvolvimento
        if (email.includes('@')) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('borracharia_provider_logged', 'true');
            localStorage.setItem('borracharia_provider_email', email.trim());
            const mockPayload = btoa(
              JSON.stringify({ sub: 'pro-mock-id', email: email.trim(), role: 'PROVIDER' }),
            );
            localStorage.setItem('borracharia_provider_token', `mock.${mockPayload}.sig`);
          }
          router.push('/pro');
          return;
        }
        throw new Error(error.message);
      }

      if (data.session) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('borracharia_provider_logged', 'true');
          localStorage.setItem('borracharia_provider_email', email.trim());
        }
        router.push('/pro');
      }
    } catch (err: any) {
      console.error('Erro no login do prestador:', err);
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 min-h-screen relative overflow-hidden font-sans bg-zinc-950 text-white">
      {/* Background Hero Image do Borracheiro / Oficina com Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-[1px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950" />

      {/* Decorative radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Card Glassmorphism */}
        <div className="backdrop-blur-xl bg-zinc-900/85 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/30 mx-auto">
              <Wrench className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-black text-2xl text-white tracking-tight">
              Borrachar<span className="text-[#FF6600]">IA</span> PRO
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Acesso exclusivo para Borracheiros e Socorristas
            </p>
          </div>

          {/* Banner de Erro */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="borracheiro@borracharia.com"
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Senha
                </label>
              </div>
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
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black py-3.5 px-4 rounded-2xl text-sm transition shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Acessando Radar...</span>
              ) : (
                <>
                  <span>Entrar e Ligar Radar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links de Apoio */}
          <div className="text-center space-y-3 pt-2 border-t border-zinc-800/80">
            <p className="text-xs text-zinc-400">
              Ainda não é um parceiro cadastrado?{' '}
              <Link href="/pro/register" className="font-bold text-[#FF6600] hover:underline">
                Cadastre sua oficina
              </Link>
            </p>
            <p>
              <Link href="/" className="text-xs text-zinc-500 hover:text-white transition">
                ← Voltar para a Landing Page
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
