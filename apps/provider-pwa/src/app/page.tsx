'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BellRing,
  CheckCircle,
  Clock,
  Compass,
  LogOut,
  MapPin,
  Radio,
  RefreshCw,
  Wallet,
  Wrench,
  Zap,
} from 'lucide-react';
import { getProviderSocket, onNewServiceRequest } from '../lib/socket';
import { signOutProvider, supabase } from '../lib/supabase';

export default function ProviderHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [realtimeRequests, setRealtimeRequests] = useState<any[]>([]);

  // Proteção de rota do prestador: se não autenticado no Supabase, redireciona para /login
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace('/login');
          return;
        }
        setCurrentUser(data.session.user);
      } catch (err) {
        console.error('Erro ao verificar sessão do prestador:', err);
        router.replace('/login');
      } finally {
        setIsAuthChecking(false);
      }
    }

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/login');
      } else {
        setCurrentUser(session.user);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Conexão WebSocket e listener para novos chamados
  useEffect(() => {
    const socket = getProviderSocket();
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    if (socket.connected) setSocketConnected(true);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    const cleanup = onNewServiceRequest((request) => {
      console.log('[Provider PWA] 🚨 Novo chamado recebido via WebSocket:', request);
      setRealtimeRequests((prev) => [request, ...prev]);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      cleanup();
    };
  }, []);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }

  if (isAuthChecking) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-slate-100 min-h-screen">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <Wrench className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-white">Verificando credenciais PRO...</p>
        <p className="text-xs text-slate-400 mt-1">Conectando ao Supabase Auth</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-slate-900 text-slate-100 min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
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
            <p className="text-xs text-slate-400">
              {currentUser?.email ? currentUser.email.split('@')[0] : 'Socorrista Parceiro'}
            </p>
          </div>
        </div>

        {/* Status e Logout */}
        <div className="flex items-center gap-2">
          {socketConnected && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-1 rounded-full border border-emerald-800/40">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              Socket.io
            </span>
          )}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
              isOnline
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </button>

          <button
            onClick={async () => {
              await signOutProvider();
              router.replace('/login');
            }}
            title="Sair do painel"
            className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="my-auto py-6 space-y-5">
        {/* Card Carteira Asaas */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-850 p-4 rounded-2xl border border-slate-700/80 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-orange-400" />
              Carteira Asaas Vinculada
            </span>
            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
              <CheckCircle className="w-3 h-3" /> Subconta Ativa
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <p className="text-2xl font-black text-white">R$ 480,00</p>
              <p className="text-[11px] text-slate-400">Saldo retido a liberar hoje</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
              Repasse Instantâneo
            </span>
          </div>
        </section>

        {/* Radar de Chamados Próximos */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-orange-400" />
              Chamados Próximos (Raio 15 km)
            </h2>
            <button
              onClick={handleRefresh}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          {/* Chamados Recebidos via WebSocket em Tempo Real */}
          {realtimeRequests.map((req, idx) => (
            <div
              key={req.id || idx}
              className="bg-slate-800 border-2 border-orange-500/80 rounded-2xl p-4 space-y-3 shadow-lg shadow-orange-500/10 animate-in fade-in slide-in-from-top-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[10px] font-black uppercase flex items-center gap-1 w-max">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    🚨 NOVO (Tempo Real)
                  </span>
                  <h3 className="font-extrabold text-sm text-white mt-1.5">
                    {req.service_type?.name || 'Socorro de Pneu'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-800/50">
                  Chamado Aberto
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                GPS: {req.latitude?.toFixed(4)}, {req.longitude?.toFixed(4)}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Agora mesmo
                </span>
                <button className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Fazer Lance
                </button>
              </div>
            </div>
          ))}

          {/* Chamado em Destaque */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 space-y-3 hover:border-orange-500/50 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-extrabold uppercase border border-orange-500/30">
                  Troca de Pneu
                </span>
                <h3 className="font-bold text-sm text-white mt-1.5">
                  Emergência em Balneário Camboriú
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                Aprox. 2.1 km
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Av. Atlântica, Centro - BC
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Criado há 3 min
              </span>
              <button className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Enviar Lance
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="pt-4 border-t border-slate-800 text-center space-y-1">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          GPS em segundo plano ativado • Localização precisa
        </p>
        <p className="text-[10px] text-slate-600">BorracharIA Pro PWA v1.0 • Operação SC</p>
      </footer>
    </main>
  );
}
