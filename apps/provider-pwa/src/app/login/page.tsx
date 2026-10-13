'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Lock, Mail, Wrench } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Erro no login do prestador:', err);
      setErrorMessage(err.message || 'Falha na autenticação do prestador.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight">
              Borrachar<span className="text-orange-500">IA</span>{' '}
              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                PRO
              </span>
            </h1>
            <p className="text-xs text-slate-400">Portal do Socorrista</p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="my-auto py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Acesso do Profissional</h2>
          <p className="text-xs text-slate-400 mt-1">
            Entre com suas credenciais de parceiro para receber chamados e enviar lances.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              E-mail Profissional
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="socorrista@exemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              'Autenticando...'
            ) : (
              <>
                <span>Acessar Painel PRO</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Ainda não é parceiro credenciado?{' '}
            <Link href="/register" className="font-bold text-orange-400 hover:underline">
              Cadastre-se como Socorrista
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
        BorracharIA Pro • Autenticação Segura via Supabase Auth
      </footer>
    </main>
  );
}
