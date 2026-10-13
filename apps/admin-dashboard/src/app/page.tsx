'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  Mail,
  Calendar,
} from 'lucide-react';
import { supabase, signOutAdmin } from '../lib/supabase';
import { adminApi, ProviderItem, AdminStats } from '../lib/api';

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
        if (!data.session?.user) {
          router.push('/login');
          return;
        }

        const user = data.session.user;
        setAdminEmail(user.email || 'Admin');
      } catch (err) {
        console.error('Erro na checagem de sessão admin:', err);
        router.push('/login');
      } finally {
        setAuthChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  // Carregamento de dados da API
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setActionFeedback(null);
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        adminApi.getStats().catch(() => ({ success: false, data: null })),
        adminApi.getPendingProviders().catch(() => ({ success: false, count: 0, data: [] })),
        adminApi.getAllProviders().catch(() => ({ success: false, total: 0, count: 0, data: [] })),
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (pendingRes.data) {
        setPendingProviders(pendingRes.data);
      }
      if (allRes.data) {
        setAllProviders(allRes.data);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados administrativos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecking) {
      loadDashboardData();
    }
  }, [authChecking, loadDashboardData]);

  // Ação de aprovar/rejeitar prestador
  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    setActionFeedback(null);
    try {
      const res = await adminApi.updateProviderStatus(id, newStatus);
      setActionFeedback({
        type: 'success',
        message:
          res.message ||
          `Profissional ${newStatus === 'APPROVED' ? 'aprovado' : 'rejeitado'} com sucesso!`,
      });

      // Recarrega os dados imediatamente para atualizar as listas e contadores
      await loadDashboardData();
    } catch (err: any) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Falha ao atualizar o status do profissional.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    router.push('/login');
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verificando credenciais de Administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white">BorracharIA</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  Control
                </span>
              </div>
              <p className="text-xs text-slate-400">Painel do Fundador • Moderação de Parceiros</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400">Logado como</span>
              <span className="text-xs font-medium text-slate-200">{adminEmail}</span>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              title="Atualizar dados"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-medium transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Banner de Feedback de Ação */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
              actionFeedback.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                : 'bg-red-950/60 border-red-800 text-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {actionFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span className="text-sm font-medium">{actionFeedback.message}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-xs opacity-70 hover:opacity-100 underline cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Métricas Principais (Stats Cards) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pendentes */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Aguardando Revisão
              </span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {stats?.pending_providers ?? pendingProviders.length}
              </span>
              <span className="text-xs text-slate-400">socorristas</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Profissionais aguardando validação de CNH e ferramentas
            </p>
          </div>

          {/* Card 2: Aprovados */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Profissionais Aprovados
              </span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {stats?.approved_providers ?? 0}
              </span>
              <span className="text-xs text-slate-400">aptos para socorro</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Habilitados para receber lances e chamados
            </p>
          </div>

          {/* Card 3: Rejeitados */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Cadastros Rejeitados
              </span>
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {stats?.rejected_providers ?? 0}
              </span>
              <span className="text-xs text-slate-400">não aprovados</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Documentação incompleta ou inconforme</p>
          </div>

          {/* Card 4: Chamados Totais */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                Total de Chamados
              </span>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {stats?.total_service_requests ?? 0}
              </span>
              <span className="text-xs text-slate-400">na plataforma</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Histórico operacional do marketplace</p>
          </div>
        </section>

        {/* Seletor de Abas */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setCurrentTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              currentTab === 'pending'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Fila de Aprovação ({pendingProviders.length})</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer flex items-center gap-2 ${
              currentTab === 'history'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Todos os Profissionais ({allProviders.length})</span>
          </button>
        </div>

        {/* Conteúdo da Aba: Fila de Pendentes */}
        {currentTab === 'pending' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Candidatos Aguardando Validação</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Status: PENDING_REVIEW
                </span>
              </h2>
            </div>

            {pendingProviders.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Tudo em dia, fundador!</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                  Não há nenhum profissional pendente de aprovação no momento. Novos cadastros
                  aparecerão nesta fila automaticamente.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingProviders.map((pro) => {
                  const isProcessing = processingId === pro.id;

                  return (
                    <div
                      key={pro.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition hover:border-slate-700"
                    >
                      {/* Dados Cadastrais */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-base text-white">{pro.user.email}</span>
                          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                            Aguardando Análise
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            <span>{pro.user.phone || 'Sem telefone informado'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>ID: {pro.id.substring(0, 8)}...</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {pro.created_at
                                ? new Date(pro.created_at).toLocaleDateString('pt-BR')
                                : 'Hoje'}
                            </span>
                          </div>
                        </div>

                        {/* Veículos Atendidos */}
                        {pro.vehicle_types && pro.vehicle_types.length > 0 && (
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-slate-500 font-medium">Veículos:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {pro.vehicle_types.map((type, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documentos & Evidências Submetidas */}
                        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                          {/* CNH */}
                          {pro.cnh_url ? (
                            <a
                              href={pro.cnh_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-medium border border-slate-700 transition"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver CNH</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span>CNH não enviada</span>
                            </span>
                          )}

                          {/* Foto Ferramentas */}
                          {pro.tools_photo_url ? (
                            <a
                              href={pro.tools_photo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-medium border border-slate-700 transition"
                            >
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Fotos Ferramentas</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
                              <Wrench className="w-3.5 h-3.5" />
                              <span>Fotos ausentes</span>
                            </span>
                          )}

                          {/* Vídeo Validação */}
                          {pro.validation_video_url ? (
                            <a
                              href={pro.validation_video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-medium border border-slate-700 transition"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>Vídeo de Validação</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/40 text-slate-500 text-xs">
                              <Video className="w-3.5 h-3.5" />
                              <span>Vídeo não enviado</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botões de Ação Decisória */}
                      <div className="flex sm:flex-col lg:flex-row items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(pro.id, 'APPROVED')}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          {isProcessing ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Aprovar Parceiro</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(pro.id, 'REJECTED')}
                          disabled={isProcessing}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Rejeitar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Conteúdo da Aba: Histórico Geral */}
        {currentTab === 'history' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white">Todos os Profissionais Cadastrados</h2>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Profissional</th>
                      <th className="px-6 py-4">Telefone</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Wallet Asaas</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {allProviders.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{item.user.email}</div>
                          <div className="text-[11px] text-slate-500">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4">{item.user.phone}</td>
                        <td className="px-6 py-4">
                          {item.status === 'APPROVED' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                              Aprovado
                            </span>
                          )}
                          {item.status === 'PENDING_REVIEW' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                              Pendente
                            </span>
                          )}
                          {item.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">
                              Rejeitado
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-400">
                          {item.asaas_wallet_id || '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {item.status !== 'APPROVED' ? (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                              disabled={processingId === item.id}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Aprovar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                              disabled={processingId === item.id}
                              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Bloquear
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
