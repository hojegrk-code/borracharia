'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Lock, Mail, Phone, Wrench } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { providerApi } from '../../lib/api';

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cadastra no Supabase Auth com role PROVIDER
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'PROVIDER',
            phone,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // 2. Se houver sessão imediata, sincroniza com o PostgreSQL
      if (data.session) {
        try {
          await providerApi.syncUserWithBackend('PROVIDER', phone);
        } catch (syncErr) {
          console.warn('Sincronização com o backend ocorrerá no primeiro lance:', syncErr);
        }

        router.push('/');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      console.error('Erro no cadastro de socorrista:', err);
      setErrorMessage(err.message || 'Falha ao cadastrar socorrista. Tente novamente.');
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
            <p className="text-xs text-slate-400">Credenciamento de Parceiro</p>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <div className="my-auto py-6 space-y-5">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cadastro de Socorrista</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre-se para prestar serviços emergenciais de pneus e receber pagamentos diretos.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3.5">
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
                placeholder="seu.nome@exemplo.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Telefone / WhatsApp Profissional
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(47) 98888-8888"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Confirmar Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
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
              'Cadastrando socorrista...'
            ) : (
              <>
                <span>Credenciar como Parceiro</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Já possui credencial?{' '}
            <Link href="/login" className="font-bold text-orange-400 hover:underline">
              Fazer login no painel
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
