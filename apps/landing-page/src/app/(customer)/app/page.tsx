'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Radio,
  RefreshCw,
  ShieldAlert,
  Wrench,
  Home,
  Star,
} from 'lucide-react';
import { api, ServiceRequestResponse, ServiceType } from '../../../lib/api';
import {
  getCustomerSocket,
  joinCustomerRequestRoom,
  onNewProposal,
  onProposalAccepted,
} from '../../../lib/socket';
import { signOutUser, supabase } from '../../../lib/supabase';
import { trackInitiateEmergency } from '../../../lib/analytics';

// Coordenadas padrão: Balneário Camboriú, SC
const MOCK_LOCATION = {
  city: 'Balneário Camboriú, SC',
  address: 'Av. Atlântica, 1750 - Centro',
  latitude: -26.9926,
  longitude: -48.6346,
};

export default function CustomerHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<ServiceRequestResponse | null>(null);
  const [realtimeProposals, setRealtimeProposals] = useState<any[]>([]);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [acceptedProposal, setAcceptedProposal] = useState<any | null>(null);

  // Proteção de rota
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
          localStorage.getItem('borracharia_customer_logged') === 'true'
        ) {
          setCurrentUser({
            email:
              localStorage.getItem('borracharia_customer_email') || 'motorista@borracharia.com',
          });
          return;
        }

        router.replace('/app/login');
      } catch (err) {
        console.error('Erro ao verificar sessão do motorista:', err);
        router.replace('/app/login');
      } finally {
        setIsAuthChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Carrega tipos de serviço
  useEffect(() => {
    async function fetchServices() {
      try {
        const services = await api.getServiceTypes();
        setServiceTypes(services);
        if (services.length > 0) {
          setSelectedServiceId(services[0].id);
        }
      } catch (err) {
        console.warn('Falha ao obter serviços:', err);
      }
    }

    if (!isAuthChecking) {
      fetchServices();
    }
  }, [isAuthChecking]);

  // Conexão Socket.io
  useEffect(() => {
    const socket = getCustomerSocket();
    setSocketConnected(socket.connected);

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  // Escuta novas propostas se houver chamado ativo
  useEffect(() => {
    if (!activeRequest) return;

    joinCustomerRequestRoom(activeRequest.id);

    const unsubscribeProposal = onNewProposal((proposal) => {
      setRealtimeProposals((prev) => {
        if (prev.some((p) => p.id === proposal.id)) return prev;
        return [proposal, ...prev];
      });
    });

    const unsubscribeAccepted = onProposalAccepted((data) => {
      setAcceptedProposal(data);
    });

    return () => {
      unsubscribeProposal();
      unsubscribeAccepted();
    };
  }, [activeRequest]);

  // Criar Chamado
  const handleCreateRequest = async () => {
    if (!selectedServiceId) {
      setErrorMessage('Selecione o tipo de socorro necessário.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setRealtimeProposals([]);
    setAcceptedProposal(null);

    try {
      const result = await api.createServiceRequest({
        service_type_id: selectedServiceId,
        latitude: MOCK_LOCATION.latitude,
        longitude: MOCK_LOCATION.longitude,
      });

      const selectedService = serviceTypes.find((s) => s.id === selectedServiceId);
      trackInitiateEmergency(selectedService ? selectedService.name : 'Socorro de Emergência');

      setActiveRequest(result);

      // Simulação de proposta em 2.5s se não vier do backend em tempo real
      setTimeout(() => {
        setRealtimeProposals((prev) => {
          if (prev.length > 0) return prev;
          return [
            {
              id: 'prop-simulated-1',
              provider_id: 'pro-joao-1',
              proposed_price: 110,
              estimated_arrival_time_mins: 15,
              provider_name: 'Borracharia do Alemão (Móvel)',
              rating: 4.9,
              vehicle: 'Fiat Fiorino Oficina',
            },
            {
              id: 'prop-simulated-2',
              provider_id: 'pro-carlos-2',
              proposed_price: 130,
              estimated_arrival_time_mins: 22,
              provider_name: 'Socorro Rápido BR-101',
              rating: 5.0,
              vehicle: 'Saveiro Socorrista',
            },
          ];
        });
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao solicitar socorro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProposal = (proposal: any) => {
    setAcceptedProposal(proposal);
  };

  const handleLogout = async () => {
    await signOutUser();
    router.replace('/app/login');
  };

  if (isAuthChecking) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
        <RefreshCw className="w-8 h-8 text-[#FF6600] animate-spin mb-3" />
        <p className="text-xs text-zinc-400">Verificando sessão do motorista...</p>
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
                  Borrachar<span className="text-[#FF6600]">IA</span> App
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FF6600] px-2 py-0.5 rounded-full border border-orange-500/30">
                  Motorista
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px] sm:max-w-xs">
                {currentUser?.email || 'Motorista Conectado'}
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
        {/* Banner de Erro */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-semibold flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Card de Localização Atual (Glassmorphism) */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6600]/20 text-[#FF6600] flex items-center justify-center border border-orange-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Localização Atual do Veículo
              </span>
              <p className="font-bold text-sm text-white">{MOCK_LOCATION.address}</p>
              <p className="text-xs text-zinc-400">{MOCK_LOCATION.city}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-zinc-950/80 px-3 py-1.5 rounded-2xl border border-zinc-800 text-xs text-emerald-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GPS Ativo {socketConnected ? '(Conectado)' : ''}</span>
          </div>
        </div>

        {/* Seção 1: Selecionar e Abrir Chamado */}
        {!activeRequest ? (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#FF6600]" />
              <span>O que aconteceu com seu veículo?</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {serviceTypes.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#FF6600]/10 border-[#FF6600] shadow-xl shadow-orange-600/20'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-base text-white">{service.name}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {service.description ||
                            'Atendimento rápido no local com socorrista móvel.'}
                        </p>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#FF6600] bg-[#FF6600]' : 'border-zinc-600'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800/80">
                      <span className="text-zinc-400">Faixa estimada:</span>
                      <span className="font-black text-[#FF6600]">
                        R$ {service.estimated_base_price_min} a R${' '}
                        {service.estimated_base_price_max}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCreateRequest}
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black py-4 px-6 rounded-2xl text-base transition shadow-2xl shadow-orange-600/35 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Acionando Borracheiros Próximos...</span>
              ) : (
                <>
                  <span>SOLICITAR SOCORRO AGORA</span>
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Seção 2: Chamado Aberto e Propostas em Tempo Real */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-3xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-[#FF6600] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                  Chamado de Emergência Aberto
                </span>
                <span className="text-xs text-zinc-400">
                  ID #{activeRequest.id.substring(0, 8)}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Procurando borracheiros num raio de 15km...
              </h3>
              <p className="text-xs text-zinc-300">
                Os profissionais da região estão enviando seus lances em tempo real. Escolha a
                melhor opção de preço e tempo de chegada.
              </p>
            </div>

            {/* Confirmação de Proposta Aceita */}
            {acceptedProposal && (
              <div className="bg-emerald-950/50 border border-emerald-500 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 shrink-0" />
                  <div>
                    <h4 className="text-lg font-black text-white">Socorrista a Caminho!</h4>
                    <p className="text-xs text-emerald-300">
                      Pré-autorização confirmada no cartão no valor de R${' '}
                      {acceptedProposal.proposed_price}. O profissional está em deslocamento.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">
                      {acceptedProposal.provider_name || 'Profissional Parceiro'}
                    </span>
                    <span className="text-zinc-400">
                      Chegada estimada em ~{acceptedProposal.estimated_arrival_time_mins || 20}{' '}
                      minutos
                    </span>
                  </div>
                  <span className="text-base font-black text-emerald-400">
                    R$ {acceptedProposal.proposed_price}
                  </span>
                </div>
              </div>
            )}

            {/* Lista de Propostas Recebidas */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6600]" />
                <span>Propostas Recebidas ({realtimeProposals.length})</span>
              </h3>

              {realtimeProposals.length === 0 ? (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#FF6600] animate-spin mx-auto" />
                  <p className="text-xs text-zinc-400">
                    Aguardando propostas dos profissionais conectados na região de Balneário
                    Camboriú e Itajaí...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {realtimeProposals.map((prop) => (
                    <div
                      key={prop.id}
                      className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-500/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">
                            {prop.provider_name || 'Borracheiro Parceiro'}
                          </h4>
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {prop.rating || '4.9'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                          Tempo estimado:{' '}
                          <strong className="text-white">
                            {prop.estimated_arrival_time_mins} mins
                          </strong>{' '}
                          • Veículo: {prop.vehicle || 'Móvel Equipado'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-400 uppercase block">
                            Valor do Lance
                          </span>
                          <span className="text-xl font-black text-white">
                            R$ {prop.proposed_price}
                          </span>
                        </div>

                        {!acceptedProposal && (
                          <button
                            onClick={() => handleAcceptProposal(prop)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                          >
                            Aceitar Proposta
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setActiveRequest(null);
                  setRealtimeProposals([]);
                  setAcceptedProposal(null);
                }}
                className="text-xs text-zinc-500 hover:text-white transition cursor-pointer underline"
              >
                Cancelar ou Abrir Novo Chamado
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
