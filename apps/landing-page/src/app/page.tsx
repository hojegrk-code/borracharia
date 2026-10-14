'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Zap,
  DollarSign,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Star,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Radar,
  Lock,
  Sparkles,
  Car,
  Compass,
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SuperAppLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#FF6600] selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Header com Glassmorphism e Navegação Integrada */}
      <header className="border-b border-zinc-800/90 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3.5 shadow-2xl shadow-black/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6600] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 group-hover:scale-105 transition">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-xl tracking-tight text-white">BorracharIA</span>
              <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500/20 text-[#FF6600] px-2 py-0.5 rounded-full border border-orange-500/30">
                SC
              </span>
            </div>
          </Link>

          {/* Links Centrais de Acesso Rápido */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-zinc-300">
            <Link
              href="/app"
              className="hover:text-[#FF6600] transition flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-zinc-900"
            >
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>Pedir Socorro (Motorista)</span>
            </Link>
            <Link
              href="/pro"
              className="hover:text-[#FF6600] transition flex items-center gap-1.5 py-1 px-2.5 rounded-xl hover:bg-zinc-900"
            >
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              <span>Área do Borracheiro</span>
            </Link>
            <Link
              href="/admin"
              className="text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1.5 py-1 px-2 rounded-xl"
            >
              <span>Painel Gestão</span>
            </Link>
          </nav>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2.5">
            <Link href="/app">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                <Car className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Chamar Socorro</span>
              </Button>
            </Link>

            <Link href="/pro/register">
              <Button size="sm" variant="default" className="gap-1 text-xs">
                <span>Cadastrar Oficina</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Cinematográfica com Imagem de Fundo Escurecida */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Background Hero Image com Overlay Escuro */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 filter scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950" />

        {/* Ambient Radial Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#FF6600]/25 via-amber-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-7">
          {/* Badge de Localização Regional com Pulso */}
          <div className="inline-flex">
            <div className="backdrop-blur-md bg-zinc-900/80 border border-orange-500/40 rounded-full py-1.5 px-4 text-xs font-bold text-orange-300 flex items-center gap-2 shadow-xl shadow-orange-600/20 animate-pulse-subtle">
              <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
              <span>Itajaí, Balneário Camboriú & Eixo Rodoviário BR-101</span>
            </div>
          </div>

          {/* Headline Monumental com Alto Contraste Laranja (#FF6600) e Branco */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Socorro de pneus inteligente para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] via-amber-400 to-[#FF6600]">
              motoristas e oficinas
            </span>{' '}
            em Santa Catarina.
          </h1>

          {/* Subheadline Persuasiva */}
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Acione o socorrista mais próximo em minutos ou aumente a receita da sua oficina
            atendendo chamados com{' '}
            <strong className="text-white font-semibold">
              preço dinâmico e pagamento 100% garantido
            </strong>
            .
          </p>

          {/* Duplo CTA Gigante: Motoristas e Borracheiros */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            {/* CTA Motorista */}
            <Link href="/app" className="w-full sm:w-1/2">
              <button className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-black py-4 px-6 rounded-2xl text-base transition shadow-2xl flex items-center justify-center gap-2.5 cursor-pointer group">
                <Compass className="w-5 h-5 text-[#FF6600] group-hover:rotate-45 transition-transform" />
                <span>Pedir Socorro Agora</span>
              </button>
            </Link>

            {/* CTA Borracheiro */}
            <Link href="/pro/register" className="w-full sm:w-1/2">
              <button className="w-full bg-gradient-to-r from-[#FF6600] to-[#E65100] hover:from-[#E65100] hover:to-[#CC4400] text-white font-black py-4 px-6 rounded-2xl text-base transition shadow-2xl shadow-orange-600/40 border border-orange-400/30 flex items-center justify-center gap-2.5 cursor-pointer">
                <span>Quero ser Parceiro</span>
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sem taxas fixas mensais
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Retenção segura no cartão
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Geolocalização em tempo real
            </span>
          </div>
        </div>

        {/* Card Grande Laranja com Projeção de Ganhos para Parceiros */}
        <div className="max-w-3xl mx-auto mt-14 w-full">
          <div className="rounded-3xl bg-gradient-to-br from-[#FF6600] via-[#FF771A] to-[#E65100] text-white p-6 sm:p-8 shadow-2xl shadow-orange-600/30 border border-orange-400/40 relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/15 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-orange-100">
                    Projeção de Faturamento para Oficinas
                  </span>
                </div>
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white border border-white/20">
                  Média Litoral SC
                </span>
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs sm:text-sm text-orange-100 font-medium block">
                  Com apenas 2 a 4 atendimentos rápidos por dia:
                </span>
                <div className="text-3xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
                  +R$ 5.400 a R$ 10.800
                  <span className="text-base sm:text-2xl font-bold text-orange-200">/mês</span>
                </div>
                <p className="text-xs sm:text-sm text-orange-100/90 pt-1">
                  Média de <strong>R$ 90 a R$ 250</strong> por socorro emergencial (você decide o
                  valor do lance!).
                </p>
              </div>

              {/* 3 Blocos de Simulação Internos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
                  <span className="text-[11px] font-bold text-orange-100 block">
                    Socorro Urbano
                  </span>
                  <span className="text-lg font-black text-white block mt-0.5">R$ 90 - R$ 140</span>
                  <span className="text-[10px] text-orange-200">Troca de pneu rápida</span>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
                  <span className="text-[11px] font-bold text-orange-100 block">
                    Plantão / BR-101
                  </span>
                  <span className="text-lg font-black text-white block mt-0.5">
                    R$ 150 - R$ 260
                  </span>
                  <span className="text-[10px] text-orange-200">Noturno ou rodovia</span>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
                  <span className="text-[11px] font-bold text-orange-100 block">
                    Sem Mensalidade
                  </span>
                  <span className="text-lg font-black text-white block mt-0.5">R$ 0,00 fixo</span>
                  <span className="text-[10px] text-orange-200">Taxa só na conclusão</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link href="/pro/register" className="inline-block w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-[#FF6600] hover:bg-orange-50 font-black px-7 py-3.5 rounded-2xl text-sm transition shadow-xl shadow-black/20 flex items-center justify-center gap-2 mx-auto cursor-pointer">
                    <Sparkles className="w-4 h-4 text-[#FF6600]" />
                    <span>Cadastrar Minha Oficina e Receber Chamados</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria de Fotos Reais de Alta Resolução (Padrão Startup Premium) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Excelência Operacional em Campo
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Socorro profissional, seguro e imediato
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Imagem 1: Profissional Uniformizado / Ferramentas */}
            <div className="group relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/60 shadow-2xl h-80 flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1000&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="relative z-10 p-6 backdrop-blur-sm bg-zinc-950/40 border-t border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                  Segurança Garantida
                </span>
                <h3 className="font-extrabold text-lg text-white">Profissionais Verificados</h3>
                <p className="text-xs text-zinc-300">
                  Validação de CNH, equipamentos adequados e histórico de atendimento.
                </p>
              </div>
            </div>

            {/* Imagem 2: Pneu Moderno / Roda Esportiva */}
            <div className="group relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/60 shadow-2xl h-80 flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=1000&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="relative z-10 p-6 backdrop-blur-sm bg-zinc-950/40 border-t border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                  Qualquer Veículo
                </span>
                <h3 className="font-extrabold text-lg text-white">Carros, SUVs & Utilitários</h3>
                <p className="text-xs text-zinc-300">
                  Troca por estepe, calibragem ou vulcanização de furos na hora.
                </p>
              </div>
            </div>

            {/* Imagem 3: Atendimento na Rodovia BR-101 */}
            <div className="group relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/60 shadow-2xl h-80 flex flex-col justify-end">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=1000&auto=format&fit=crop')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="relative z-10 p-6 backdrop-blur-sm bg-zinc-950/40 border-t border-white/10 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block">
                  Agilidade e Precisão
                </span>
                <h3 className="font-extrabold text-lg text-white">Plantões na Rodovia</h3>
                <p className="text-xs text-zinc-300">
                  Chegada ágil em trechos urbanos e rodoviários com rastreamento GPS.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Vantagens Diretas com Glassmorphism */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/40 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Por que a BorracharIA é Diferente?
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Transparência total para ambas as partes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Vantagem 1 */}
            <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3 hover:border-orange-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/15 border border-orange-500/30 text-[#FF6600] flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Preço Dinâmico</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sem tabelas engessadas. Os borracheiros enviam suas próprias propostas baseadas na
                distância real e o motorista escolhe a mais conveniente.
              </p>
            </div>

            {/* Vantagem 2 */}
            <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3 hover:border-emerald-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Pagamento Garantido</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Retenção no cartão estilo Uber antes do deslocamento. O profissional tem 100% de
                certeza de recebimento e o cliente paga só pelo conserto feito.
              </p>
            </div>

            {/* Vantagem 3 */}
            <div className="backdrop-blur-xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-3 hover:border-amber-500/40 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Autonomia Total</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ligue o aplicativo apenas nos horários em que desejar atender. Faça das emergências
                uma fonte de renda potente para sua oficina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Escura para IA / Tecnologia */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-white border-y border-zinc-800 relative overflow-hidden">
        {/* Tech Radial Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex">
              <span className="bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-orange-400" />
                Tecnologia e Inteligência BorracharIA
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              A inteligência artificial que trabalha{' '}
              <span className="text-[#FF6600]">pela sua oficina</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
              Desenvolvemos um ecossistema com geolocalização de precisão e retenção financeira
              automatizada para eliminar o tempo ocioso e proteger sua receita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tech Card 1 */}
            <div className="backdrop-blur-xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center">
                <Radar className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Despacho Inteligente por Geofencing PostGIS
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Algoritmos geoespaciais calculam a distância e tempo real de percurso em Itajaí,
                Balneário Camboriú e eixo BR-101. Você só recebe chamados que realmente compensam o
                seu deslocamento.
              </p>
            </div>

            {/* Tech Card 2 */}
            <div className="backdrop-blur-xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Radar de Chamados em Tempo Real</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Comunicação bidirecional via WebSockets com latência mínima. No mesmo segundo em que
                o motorista solicita socorro, o seu celular apita com a rota, foto e dados da avaria
                do pneu.
              </p>
            </div>

            {/* Tech Card 3 */}
            <div className="backdrop-blur-xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Pré-Autorização & Garantia Anticalote
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                O modelo Uber de pagamento retém o valor integral no cartão de crédito do cliente no
                momento do aceite. Você nunca mais correrá o risco de atender e não receber.
              </p>
            </div>

            {/* Tech Card 4 */}
            <div className="backdrop-blur-xl bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Sugestão Inteligente de Precificação</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Nossos modelos analisam condições de chuva, horário de pico e histórico de socorros
                para sugerir faixas ideais de lance que maximizam a chance de você ser escolhido com
                alta margem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona o Aplicativo */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Fluxo Operacional Simples
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como funciona o atendimento de chamados?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Passo 1 */}
            <div className="p-6 relative rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-lg space-y-2">
              <span className="text-3xl font-black text-orange-500/25 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Chamado Próximo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Um motorista com emergência de pneu na sua região solicita socorro. Seu aplicativo
                notifica com localização precisa no mapa.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="p-6 relative rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-lg space-y-2">
              <span className="text-3xl font-black text-orange-500/25 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Envio do Seu Lance</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você define seu valor e o tempo estimado de chegada. Em segundos seu lance chega na
                tela do cliente.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="p-6 relative rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-lg space-y-2">
              <span className="text-3xl font-black text-orange-500/25 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Retenção Financeira</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O cliente escolhe o seu lance e o valor é pré-autorizado no cartão pelo app. Você se
                desloca com segurança de recebimento.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="p-6 relative rounded-3xl border border-zinc-800 bg-zinc-900/70 shadow-lg space-y-2">
              <span className="text-3xl font-black text-orange-500/25 absolute top-4 right-4">
                04
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Conclusão e Saldo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Finalize a troca ou conserto e confirme no aplicativo. O pagamento cai direto na sua
                conta cadastrada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social em Santa Catarina */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/40 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Depoimentos de quem já atende em SC
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;Trabalho próximo à BR-101 em Itajaí. Com o BorracharIA, recebo chamados de
                emergência direto no celular. O dinheiro cai certinho e eu decido o preço que vale o
                meu deslocamento.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800">
                <span className="font-bold text-white">Claudio M. (Borracheiro)</span>
                <span>Itajaí - SC</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;A segurança do pagamento é o grande diferencial. O cliente já autoriza o
                cartão pelo aplicativo antes de eu sair da borracharia. Zero risco de calote.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800">
                <span className="font-bold text-white">Ricardo S. (Socorrista Móvel)</span>
                <span>Balneário Camboriú - SC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Operacional e Transparente */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-zinc-800/80">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Dúvidas Frequentes
            </h2>
            <p className="text-2xl font-extrabold text-white">Esclarecimentos Rápidos</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Como funciona a taxa da plataforma?',
                a: 'A BorracharIA opera com modelo transparente por intermediação: uma taxa padrão da plataforma é descontada diretamente no momento em que o pagamento do cliente é processado pelo gateway (Asaas). Não há custos ocultos nem cobranças antecipadas.',
              },
              {
                q: 'Quais documentos são exigidos no cadastro?',
                a: 'Para garantir a segurança dos clientes e profissionais, solicitamos CNH válida, fotos das suas ferramentas de atendimento e um breve vídeo de validação do socorrista.',
              },
              {
                q: 'Como recebo o dinheiro dos atendimentos?',
                a: 'Os pagamentos são processados via gateway financeiro seguro (Asaas) e você recebe diretamente na sua conta bancária cadastrada (via Pix ou transferência) após a conclusão do chamado.',
              },
              {
                q: 'Posso continuar atendendo na minha borracharia fixa?',
                a: 'Com certeza. O aplicativo é um canal adicional para receber novos clientes em trânsito e multiplicar o seu faturamento diário sem interferir na rotina da sua oficina.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-[#FF6600] transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#FF6600] shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      faqOpen === idx ? 'rotate-90 text-[#FF6600]' : ''
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-4 pb-4 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Final de Conversão */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 border-t border-zinc-800/80 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-600/20 text-[#FF6600] shadow-xl shadow-orange-600/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Não perca chamados na sua região. Cadastre-se agora mesmo!
          </h2>

          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            O fluxo de veículos em Itajaí, Balneário Camboriú e na BR-101 é constante todos os dias.
            Esteja pronto para faturar com chamados de emergência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="outline"
                className="w-full sm:w-auto gap-2 text-sm sm:text-base"
              >
                <Car className="w-4 h-4 text-orange-400" />
                <span>Pedir Socorro Agora</span>
              </Button>
            </Link>

            <Link href="/pro/register" className="w-full sm:w-auto">
              <Button
                size="xl"
                variant="cta"
                className="w-full sm:w-auto gap-3 text-sm sm:text-base"
              >
                <span>Quero ser um Parceiro</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500 space-y-2 mb-16 sm:mb-0">
        <p className="font-semibold text-zinc-400">
          BorracharIA Super App © 2026. Todos os direitos reservados.
        </p>
        <p>Operando em Itajaí, Balneário Camboriú e região litoral norte de Santa Catarina.</p>
        <div className="flex justify-center gap-4 text-[11px] text-zinc-500 pt-2">
          <Link href="/app" className="hover:underline">
            App Motorista
          </Link>
          <span>•</span>
          <Link href="/pro" className="hover:underline">
            App Borracheiro
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:underline">
            Painel Gestão
          </Link>
        </div>
      </footer>

      {/* Sticky Bottom Bar (Mobile Quick Action) */}
      <div className="fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-3 z-50 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <Link href="/app" className="flex-1">
          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-zinc-700">
            <Car className="w-3.5 h-3.5 text-orange-400" />
            <span>Motorista</span>
          </button>
        </Link>
        <Link href="/pro/register" className="flex-1">
          <button className="w-full bg-gradient-to-r from-[#FF6600] to-[#E65100] text-white font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-orange-600/30">
            <span>Borracheiro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
