'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Wrench,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { providerApi } from '../../../../lib/api';

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnhNumber, setCnhNumber] = useState('');
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
          await providerApi.syncUserWithBackend('PROVIDER', phone);
        } catch {
          // ignore
        }
        router.push('/pro');
        return;
      }

      // 1. SignUp no Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'PROVIDER',
            phone,
            cnh: cnhNumber,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        try {
          await providerApi.syncUserWithBackend('PROVIDER', phone);
        } catch (syncErr) {
          console.warn('Sync provider:', syncErr);
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('borracharia_provider_logged', 'true');
          localStorage.setItem('borracharia_provider_email', email.trim());
        }
        router.push('/pro');
      } else {
        router.push('/pro/login');
      }
    } catch (err: any) {
      console.error('Erro no cadastro do prestador:', err);
      setErrorMessage(err.message || 'Falha ao realizar cadastro.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 min-h-screen relative overflow-hidden font-sans bg-zinc-950 text-white">
      {/* Background Hero Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[2px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1000&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950" />

      {/* Decorative radial blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6600]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Card Glassmorphism */}
        <div className="backdrop-blur-xl bg-zinc-900/85 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/30 mx-auto">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-black text-2xl text-white tracking-tight">
              Cadastre sua Borracharia
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Vagas para socorristas em Itajaí, Balneário Camboriú e eixo BR-101
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
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Telefone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(47) 99999-0000"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Número da CNH
                </label>
                <div className="relative">
                  <Wrench className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={cnhNumber}
                    onChange={(e) => setCnhNumber(e.target.value)}
                    placeholder="12345678900"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6600] transition"
                  />
                </div>
              </div>
            </div>

            {/* Destaques de Vantagem */}
            <div className="p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80 space-y-1 text-xs text-zinc-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Preço dinâmico: você decide o valor do socorro</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pagamento retido no cartão antes do deslocamento</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black py-3.5 px-4 rounded-2xl text-sm transition shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Criando Conta e Perfil...</span>
              ) : (
                <>
                  <span>Concluir Cadastro de Parceiro</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links de Apoio */}
          <div className="text-center space-y-2 pt-2 border-t border-zinc-800/80">
            <p className="text-xs text-zinc-400">
              Já possui cadastro aprovado?{' '}
              <Link href="/pro/login" className="font-bold text-[#FF6600] hover:underline">
                Acesse sua conta
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
