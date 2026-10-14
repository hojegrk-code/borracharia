'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BellRing,
  Clock,
  LogOut,
  MapPin,
  Radio,
  RefreshCw,
  Wrench,
  Zap,
  Home,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { getProviderSocket, onNewServiceRequest, joinProviderChannel } from '../../../lib/socket';
import { signOutProvider, supabase } from '../../../lib/supabase';
import { providerApi } from '../../../lib/api';

export default function ProviderHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [realtimeRequests, setRealtimeRequests] = useState<any[]>([]);
  const [proposalInputs, setProposalInputs] = useState<
    Record<string, { price: string; eta: string }>
  >({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Proteção de rota do prestador
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setCurrentUser(data.session.user);
          return;
        }

        if (
          typeof window !== 'undefined' &&
          localStorage.getItem('borracharia_provider_logged') === 'true'
        ) {
          setCurrentUser({
            email:
              localStorage.getItem('borracharia_provider_email') || 'borracheiro@borracharia.com',
          });
          return;
        }

        router.replace('/pro/login');
      } catch (err) {
        console.error('Erro ao verificar sessão do prestador:', err);
        router.replace('/pro/login');
      } finally {
        setIsAuthChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Conexão Socket.io para receber novos chamados
  useEffect(() => {
    if (!isOnline) return;

    const socket = getProviderSocket();
    setSocketConnected(socket.connected);

    const onConnect = () => {
      setSocketConnected(true);
      joinProviderChannel();
    };
    const onDisconnect = () => setSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
      joinProviderChannel();
    }

    const unsubscribe = onNewServiceRequest((newRequest) => {
      setRealtimeRequests((prev) => {
        if (prev.some((r) => r.id === newRequest.id)) return prev;
        return [newRequest, ...prev];
      });
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      unsubscribe();
    };
  }, [isOnline]);

  // Carrega chamados simulados/iniciais da região
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await providerApi.getNearbyRequests(-26.9926, -48.6346, 25);
      if (res && res.length > 0) {
        setRealtimeRequests(res);
      }
    } catch {
      // fallback
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleSendProposal = async (requestId: string) => {
    const input = proposalInputs[requestId] || { price: '120', eta: '25' };
    setSubmittingId(requestId);
    setSuccessMessage(null);

    try {
      await providerApi.submitProposal(requestId, {
        proposed_price: parseFloat(input.price) || 120,
        estimated_arrival_time_mins: parseInt(input.eta) || 25,
      });

      setSuccessMessage(`Proposta de R$ ${input.price} enviada com sucesso! Aguarde o cliente.`);
    } catch (err: any) {
      console.warn('Erro ao enviar proposta:', err);
      setSuccessMessage(`Proposta registrada em modo simulação!`);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleLogout = async () => {
    await signOutProvider();
    router.replace('/pro/login');
  };

  if (isAuthChecking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
        <RefreshCw className="w-8 h-8 text-[#FF6600] animate-spin mb-3" />
        <p className="text-xs text-zinc-400">Verificando credenciais profissionais...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white shadow-md">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base text-white tracking-tight">
                  Borrachar<span className="text-[#FF6600]">IA</span> PRO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FF6600] px-2 py-0.5 rounded-full border border-orange-500/30">
                  Parceiro
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
                {currentUser?.email || 'Profissional Ativo'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition hidden sm:inline-flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Desconectar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner de Feedback */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="underline text-[10px] cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Status Radar & Switch Online */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                isOnline
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              <Radio className={`w-6 h-6 ${isOnline ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  Radar {isOnline ? 'Ativo e Monitorando' : 'Pausado'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    socketConnected && isOnline ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'
                  }`}
                />
              </div>
              <p className="text-xs text-zinc-400">
                {isOnline
                  ? 'Você receberá avisos sonoros instantâneos de emergências próximas.'
                  : 'Ative para começar a receber lances em Itajaí e BC.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                isOnline
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
              }`}
            >
              {isOnline ? 'ESTOU ONLINE' : 'FICAR ONLINE'}
            </button>
          </div>
        </div>

        {/* Resumo da Carteira */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Saldo a Receber
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">R$ 540,00</span>
            <span className="text-[10px] text-zinc-500 block">Liberação via Asaas Pix</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 space-y-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Socorros Realizados
            </span>
            <span className="text-xl sm:text-2xl font-black text-white">14</span>
            <span className="text-[10px] text-zinc-500 block">Este mês em SC</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
              Avaliação Média
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">★ 4.9</span>
            <span className="text-[10px] text-zinc-500 block">Classificação top parceiro</span>
          </div>
        </div>

        {/* Lista de Chamados Disponíveis em Tempo Real */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF6600]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Chamados de Emergência na Região ({realtimeRequests.length})
              </h2>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Recarregar</span>
            </button>
          </div>

          {realtimeRequests.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center space-y-3">
              <BellRing className="w-10 h-10 text-zinc-600 mx-auto animate-pulse" />
              <h3 className="text-base font-bold text-white">Nenhum chamado ativo no radar</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Mantenha seu aplicativo aberto. Assim que um motorista tiver um pneu furado em
                Balneário Camboriú, Itajaí ou na BR-101, o chamado aparecerá aqui em tempo real.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {realtimeRequests.map((req) => {
                const currentInput = proposalInputs[req.id] || { price: '120', eta: '25' };

                return (
                  <div
                    key={req.id}
                    className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-orange-500/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                        <h4 className="font-extrabold text-white text-base">
                          {req.service_name || 'Troca de Pneu / Socorro'}
                        </h4>
                      </div>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        Há poucos minutos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                      <div className="flex items-center gap-2 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                        <MapPin className="w-4 h-4 text-[#FF6600] shrink-0" />
                        <span>Balneário Camboriú / BR-101 (~{req.distance_km || 3.2} km)</span>
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Pagamento garantido: Retenção no cartão</span>
                      </div>
                    </div>

                    {/* Preço Dinâmico: Envio de Proposta */}
                    <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                            Seu Lance (R$)
                          </label>
                          <input
                            type="number"
                            value={currentInput.price}
                            onChange={(e) =>
                              setProposalInputs((prev) => ({
                                ...prev,
                                [req.id]: { ...currentInput, price: e.target.value },
                              }))
                            }
                            className="w-24 bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-sm text-white font-black text-center focus:outline-none focus:border-[#FF6600]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                            Chegada (Minutos)
                          </label>
                          <input
                            type="number"
                            value={currentInput.eta}
                            onChange={(e) =>
                              setProposalInputs((prev) => ({
                                ...prev,
                                [req.id]: { ...currentInput, eta: e.target.value },
                              }))
                            }
                            className="w-24 bg-zinc-950 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-sm text-white font-black text-center focus:outline-none focus:border-[#FF6600]"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendProposal(req.id)}
                        disabled={submittingId === req.id}
                        className="bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black px-5 py-3 rounded-2xl text-xs transition shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {submittingId === req.id
                            ? 'Transmitindo Lance...'
                            : 'Enviar Proposta Agora'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
