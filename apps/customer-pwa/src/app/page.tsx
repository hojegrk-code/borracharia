'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  LogOut,
  MapPin,
  Radio,
  RefreshCw,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { api, ServiceRequestResponse, ServiceType } from '../lib/api';
import {
  getCustomerSocket,
  joinCustomerRequestRoom,
  onNewProposal,
  onProposalAccepted,
} from '../lib/socket';
import { signOutUser, supabase } from '../lib/supabase';

// Coordenadas mockadas: Centro de Balneário Camboriú, SC
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

  // Proteção de Rota: se não autenticado no Supabase, redireciona para /login
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
        console.error('Erro ao verificar sessão:', err);
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

  // Monitora conexão com o servidor WebSocket
  useEffect(() => {
    const socket = getCustomerSocket();
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    if (socket.connected) setSocketConnected(true);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  // Inscreve na sala do chamado quando um chamado é criado e escuta lances
  useEffect(() => {
    if (!activeRequest) return;

    joinCustomerRequestRoom(activeRequest.id);

    const cleanupProposal = onNewProposal((proposal) => {
      console.log('[Customer PWA] Nova proposta recebida em tempo real via Socket.io:', proposal);
      setRealtimeProposals((prev) => [proposal, ...prev]);
    });

    const cleanupAccepted = onProposalAccepted((data) => {
      console.log('[Customer PWA] Proposta aceita confirmada via Socket.io:', data);
    });

    return () => {
      cleanupProposal();
      cleanupAccepted();
    };
  }, [activeRequest]);

  // Carrega os tipos de serviço disponíveis da core-api
  useEffect(() => {
    async function loadServices() {
      try {
        const types = await api.getServiceTypes();
        setServiceTypes(types);
        if (types.length > 0 && types[0]) {
          setSelectedServiceId(types[0].id);
        }
      } catch (err: any) {
        console.error('Erro ao listar serviços:', err);
      }
    }
    loadServices();
  }, []);

  // Dispara a solicitação de socorro para a core-api
  async function handleRequestAssistance() {
    if (!selectedServiceId) {
      setErrorMessage('Por favor, selecione um tipo de serviço');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await api.createServiceRequest({
        service_type_id: selectedServiceId,
        latitude: MOCK_LOCATION.latitude,
        longitude: MOCK_LOCATION.longitude,
      });

      setActiveRequest(response);
    } catch (err: any) {
      console.error('Falha ao abrir chamado:', err);
      setErrorMessage(
        err.message || 'Não foi possível conectar ao servidor. Verifique se a core-api está ativa.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthChecking) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-screen">
        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg animate-pulse mb-3">
          <Wrench className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-800">Verificando sessão segura...</p>
        <p className="text-xs text-slate-400 mt-1">Conectando ao Supabase Auth</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col justify-between p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <header className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
              Borrachar<span className="text-orange-600">IA</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {currentUser?.email ? currentUser.email.split('@')[0] : 'Socorro 24h'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
              socketConnected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            ></span>
            <span>{socketConnected ? '⚡ Tempo Real' : 'Conectando'}</span>
          </div>

          <button
            onClick={async () => {
              await signOutUser();
              router.replace('/login');
            }}
            title="Sair da conta"
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="my-auto py-6 space-y-6">
        {/* Card de Localização GPS */}
        <section className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              Sua Localização GPS
            </span>
            <span className="text-emerald-600 font-bold">Alta Precisão</span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">{MOCK_LOCATION.address}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              {MOCK_LOCATION.city}
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">
              {MOCK_LOCATION.latitude.toFixed(4)}, {MOCK_LOCATION.longitude.toFixed(4)}
            </span>
          </div>
        </section>

        {/* Alerta de Erro */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {/* Estado de Sucesso: Chamado Criado */}
        {activeRequest ? (
          <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Socorro Solicitado com Sucesso!
                </h2>
                <p className="text-xs text-slate-500">Notificando profissionais mais próximos...</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">ID do Chamado:</span>
                <span className="font-mono text-slate-800 font-semibold text-[11px]">
                  {activeRequest.id.substring(0, 18)}...
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Status Operacional:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                  {activeRequest.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Serviço:</span>
                <span className="text-slate-800 font-bold">{activeRequest.service_type.name}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Estimativa Base:</span>
                <span className="text-orange-600 font-bold">
                  R$ {Number(activeRequest.service_type.estimated_base_price_min).toFixed(2)} - R${' '}
                  {Number(activeRequest.service_type.estimated_base_price_max).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>
                Os profissionais da região estão avaliando sua localização. Em instantes você
                receberá propostas com tempo de chegada e valor exato.
              </p>
            </div>

            {/* Seção de Lances em Tempo Real via WebSocket */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                  Lances em Tempo Real ({realtimeProposals.length})
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {socketConnected ? 'Radar Ativo' : 'Conectando'}
                </span>
              </div>

              {realtimeProposals.length === 0 ? (
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500">
                  <p className="animate-pulse">📡 Aguardando socorristas enviarem lances...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {realtimeProposals.map((prop, idx) => (
                    <div
                      key={prop.id || idx}
                      className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-xl flex items-center justify-between text-xs animate-in fade-in"
                    >
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">
                          R$ {Number(prop.proposed_price).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          Chegada estimada: {prop.estimated_arrival_time_mins} min
                        </p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] shadow-sm">
                        Novo Lance!
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setActiveRequest(null);
                setRealtimeProposals([]);
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Solicitar Outro Atendimento
            </button>
          </div>
        ) : (
          /* Seletor de Serviço e Botão de Ação */
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Escolha o Tipo de Emergência
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {serviceTypes.map((service) => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-orange-600 bg-orange-50/70 shadow-sm ring-1 ring-orange-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
                      </div>
                      <div className="text-right pl-2">
                        <span className="text-xs font-extrabold text-orange-600 block">
                          R$ {Number(service.estimated_base_price_min).toFixed(0)} -{' '}
                          {Number(service.estimated_base_price_max).toFixed(0)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">estimado</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTÃO PRINCIPAL GIGANTE: 🚨 Solicitar Socorro */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRequestAssistance}
                disabled={isLoading}
                className={`w-full relative group overflow-hidden rounded-3xl p-5 text-white font-extrabold text-lg shadow-xl shadow-orange-500/25 transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                  isLoading
                    ? 'bg-orange-400 cursor-wait'
                    : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 hover:shadow-orange-500/40'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 py-1">
                    <RefreshCw className="w-6 h-6 animate-spin text-white" />
                    <span>Buscando borracheiros...</span>
                  </div>
                ) : (
                  <>
                    <span className="text-2xl leading-none">🚨</span>
                    <span className="tracking-wide text-xl font-black">Solicitar Socorro</span>
                    <span className="text-xs text-orange-100 font-medium opacity-90 flex items-center gap-1">
                      Atendimento emergencial no local <ArrowRight className="w-3 h-3" />
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="pt-4 border-t border-slate-200/80 text-center space-y-1">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Preços dinâmicos • Pagamento protegido via Asaas
        </p>
        <p className="text-[10px] text-slate-400">
          BorracharIA PWA v1.0 • Balneário Camboriú & Região
        </p>
      </footer>
    </main>
  );
}
