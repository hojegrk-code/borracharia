'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  Wrench,
  Video,
  LogOut,
  Clock,
  Car,
  AlertTriangle,
  RefreshCw,
  Phone,
  Calendar,
  Home,
  ExternalLink,
} from 'lucide-react';
import { supabase, signOutAdmin } from '../../../lib/supabase';
import { adminApi, ProviderItem, AdminStats } from '../../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Estados de autenticação
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Estados dos dados
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingProviders, setPendingProviders] = useState<ProviderItem[]>([]);
  const [allProviders, setAllProviders] = useState<ProviderItem[]>([]);
  const [currentTab, setCurrentTab] = useState<'pending' | 'history'>('pending');
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Verificação de autenticação
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setAdminEmail(data.session.user.email || 'admin@borracharia.com');
          return;
        }

        if (
          typeof window !== 'undefined' &&
          localStorage.getItem('borracharia_admin_logged') === 'true'
        ) {
          setAdminEmail(localStorage.getItem('borracharia_admin_email') || 'admin@borracharia.com');
          return;
        }

        router.push('/admin/login');
      } catch (err) {
        if (
          typeof window !== 'undefined' &&
          localStorage.getItem('borracharia_admin_logged') === 'true'
        ) {
          setAdminEmail(localStorage.getItem('borracharia_admin_email') || 'admin@borracharia.com');
          return;
        }
        console.error('Erro na checagem de sessão admin:', err);
        router.push('/admin/login');
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Carregar dados
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setActionFeedback(null);
    try {
      const [statsRes, pendingRes, allRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getPendingProviders(),
        adminApi.getAllProviders(),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }

      if (pendingRes.status === 'fulfilled') {
        setPendingProviders(pendingRes.value.data || []);
      }

      if (allRes.status === 'fulfilled') {
        setAllProviders(allRes.value.data || []);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados administrativos:', err);
      setActionFeedback({
        type: 'error',
        message: 'Falha ao sincronizar dados com o backend Fastify.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecking && adminEmail) {
      loadDashboardData();
    }
  }, [authChecking, adminEmail, loadDashboardData]);

  // Ações de aprovação e rejeição
  const handleUpdateStatus = async (
    providerId: string,
    newStatus: 'APPROVED' | 'REJECTED',
    reason?: string,
  ) => {
    setProcessingId(providerId);
    setActionFeedback(null);

    try {
      await adminApi.updateProviderStatus(providerId, newStatus, reason);

      setActionFeedback({
        type: 'success',
        message:
          newStatus === 'APPROVED'
            ? 'Prestador aprovado com sucesso! Já está liberado para emitir lances no PWA.'
            : 'Cadastro do prestador rejeitado.',
      });

      // Recarrega lista
      await loadDashboardData();
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Falha ao atualizar o status do prestador.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    router.push('/admin/login');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center text-white space-y-4">
        <RefreshCw className="w-8 h-8 text-[#FF6600] animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-zinc-400">
          Autenticando sessão master...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-[#FF6600] selection:text-white">
      {/* Top Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">BorracharIA</span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#FF6600]/20 text-[#FF6600] px-2 py-0.5 rounded-full border border-orange-500/30">
                  Control Admin
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Validação KYC & Governança de Parceiros</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 hidden sm:flex"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Ver Landing Page</span>
            </Link>

            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-zinc-200 block">{adminEmail}</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                ● Master Admin
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-zinc-700/80 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Banner de Feedback de Ações */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-center justify-between gap-3 shadow-lg ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/40 border-red-500/50 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span className="font-medium">{actionFeedback.message}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-xs underline cursor-pointer opacity-80 hover:opacity-100"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Métricas Principais (Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Pendentes de Avaliação
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-400">
              {stats?.pending_providers ?? pendingProviders.length}
            </div>
            <span className="text-[11px] text-zinc-400 block">Exigem análise do fundador</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">
                Parceiros Aprovados
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {stats?.approved_providers ??
                allProviders.filter((p) => p.status === 'APPROVED').length}
            </div>
            <span className="text-[11px] text-zinc-400 block">Recebendo chamados na região</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Cadastrados</span>
              <Wrench className="w-4 h-4 text-[#FF6600]" />
            </div>
            <div className="text-3xl font-black text-white">
              {stats?.total_providers ?? allProviders.length}
            </div>
            <span className="text-[11px] text-zinc-400 block">Borracheiros e socorristas</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-bold uppercase tracking-wider">Chamados Abertos</span>
              <Car className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-400">
              {stats?.total_service_requests ?? 0}
            </div>
            <span className="text-[11px] text-zinc-400 block">Volume na plataforma</span>
          </div>
        </div>

        {/* Barra de Abas e Atualização */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('pending')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                currentTab === 'pending'
                  ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pendentes de Aprovação ({pendingProviders.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                currentTab === 'history'
                  ? 'bg-[#FF6600] text-white shadow-lg shadow-orange-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Histórico Completo ({allProviders.length})</span>
            </button>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-3.5 py-2 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar Dados</span>
          </button>
        </div>

        {/* Lista de Prestadores Pendentes */}
        {currentTab === 'pending' && (
          <div className="space-y-4">
            {pendingProviders.length === 0 ? (
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400/80 mx-auto" />
                <h3 className="text-lg font-bold text-white">Fila de Análise Zerada!</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Não há novos profissionais aguardando avaliação no momento. Todos os cadastros
                  foram processados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-zinc-700 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-white">
                            {provider.user?.email || 'Prestador Sem Email'}
                          </h3>
                          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-amber-500/30">
                            Aguardando KYC
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-zinc-500" />
                            {provider.user?.phone || 'Não informado'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            Inscrito em {new Date(provider.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação Imediata */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleUpdateStatus(provider.id, 'APPROVED')}
                          disabled={processingId === provider.id}
                          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aprovar Parceiro</span>
                        </button>

                        <button
                          onClick={() => {
                            const reason = prompt('Motivo da rejeição:');
                            if (reason !== null) {
                              handleUpdateStatus(provider.id, 'REJECTED', reason);
                            }
                          }}
                          disabled={processingId === provider.id}
                          className="px-4 py-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold text-xs border border-red-500/30 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Rejeitar</span>
                        </button>
                      </div>
                    </div>

                    {/* Documentos & Ferramentas Submetidos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {/* CNH */}
                      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-zinc-400" />
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">
                              CNH Válida
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Documento de habilitação
                            </span>
                          </div>
                        </div>
                        {provider.cnh_url ? (
                          <a
                            href={provider.cnh_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#FF6600] hover:underline flex items-center gap-1"
                          >
                            <span>Ver</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-zinc-600 italic">Pendente</span>
                        )}
                      </div>

                      {/* Fotos de Ferramentas */}
                      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Wrench className="w-5 h-5 text-zinc-400" />
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">
                              Ferramentas
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              Kit e macaco hidráulico
                            </span>
                          </div>
                        </div>
                        {provider.tools_photo_url ? (
                          <a
                            href={provider.tools_photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#FF6600] hover:underline flex items-center gap-1"
                          >
                            <span>Ver</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-zinc-600 italic">Pendente</span>
                        )}
                      </div>

                      {/* Vídeo de Validação */}
                      <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Video className="w-5 h-5 text-zinc-400" />
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">
                              Vídeo Selfie
                            </span>
                            <span className="text-[10px] text-zinc-500">Validação biométrica</span>
                          </div>
                        </div>
                        {provider.validation_video_url ? (
                          <a
                            href={provider.validation_video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-[#FF6600] hover:underline flex items-center gap-1"
                          >
                            <span>Assistir</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-zinc-600 italic">Pendente</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Histórico Completo */}
        {currentTab === 'history' && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-3.5 px-6">Profissional</th>
                    <th className="py-3.5 px-6">Telefone</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Carteira Asaas</th>
                    <th className="py-3.5 px-6 text-right">Data de Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  {allProviders.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-4 px-6 font-semibold text-white">
                        {item.user?.email || 'N/A'}
                      </td>
                      <td className="py-4 px-6">{item.user?.phone || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'REJECTED'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[11px] text-zinc-400">
                        {item.asaas_wallet_id || 'Não vinculada'}
                      </td>
                      <td className="py-4 px-6 text-right text-zinc-400">
                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
