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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function PartnerLandingPage() {
  const providerRegisterUrl =
    process.env.NEXT_PUBLIC_PROVIDER_URL || 'http://localhost:3002/register';

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-zinc-900 selection:bg-[#FF6600] selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-orange-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF6600] flex items-center justify-center text-white shadow-md shadow-orange-600/20">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-xl tracking-tight text-zinc-950">BorracharIA</span>
              <span className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
                Parceiros
              </span>
            </div>
          </div>

          <Link href={providerRegisterUrl}>
            <Button size="sm" variant="default" className="gap-1.5">
              <span>Cadastrar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section (Fundo com gradiente suave creme/branco) */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFFFFF]">
        {/* Soft Radial Ambient Light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-orange-200/30 via-orange-100/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge de Localização Regional */}
          <div className="inline-flex">
            <Badge variant="orange" className="gap-2 py-1.5 px-3.5 text-xs animate-pulse-subtle">
              <MapPin className="w-3.5 h-3.5 text-[#FF6600] shrink-0" />
              <span>Vagas para Borracheiros: Itajaí, Balneário Camboriú & Eixo BR-101</span>
            </Badge>
          </div>

          {/* Headline com Tipografia Bold e Destaques em Laranja */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.15]">
            Aumente o faturamento da sua borracharia atendendo{' '}
            <span className="text-[#FF6600]">emergências em Itajaí e BC</span>
          </h1>

          {/* Subheadline Persuasiva */}
          <p className="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Seja acionado quando motoristas precisarem de socorro de pneus perto de você.{' '}
            <strong className="text-zinc-950 font-semibold">
              Preço dinâmico, pagamento 100% garantido
            </strong>{' '}
            e autonomia total para impulsionar a receita da sua oficina.
          </p>

          {/* Destaque das 3 Vantagens Centrais em Pílulas */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-semibold text-zinc-700 pt-1">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-zinc-200/80 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Preço Dinâmico (Você
              decide o valor)
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-zinc-200/80 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Pagamento Garantido
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-xl border border-zinc-200/80 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Autonomia Total
            </span>
          </div>

          {/* CTA Gigante Principal */}
          <div className="pt-4 pb-2">
            <Link href={providerRegisterUrl} className="inline-block w-full sm:w-auto">
              <Button
                size="xl"
                variant="cta"
                className="w-full sm:w-auto gap-3 text-base sm:text-lg shadow-xl shadow-orange-600/30"
              >
                <span>Quero ser um Parceiro BorracharIA</span>
                <ArrowRight className="w-5 h-5 text-white animate-pulse" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-500 mt-2.5">
              Validação ágil de documentos • Comece a atender assim que aprovado
            </p>
          </div>
        </div>

        {/* Card Grande Laranja com Projeção de Ganhos para os Parceiros */}
        <div className="max-w-2xl mx-auto mt-10">
          <div className="rounded-3xl bg-gradient-to-br from-[#FF6600] via-[#FF771A] to-[#E65100] text-white p-6 sm:p-8 shadow-2xl shadow-orange-600/30 border border-orange-400/30 relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-orange-100">
                    Projeção Real de Ganhos Extras
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
                <div className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                  +R$ 5.400 a R$ 10.800
                  <span className="text-base sm:text-xl font-bold text-orange-200">/mês</span>
                </div>
                <p className="text-xs sm:text-sm text-orange-100/90 pt-1">
                  Média de <strong>R$ 90 a R$ 250</strong> por socorro emergencial (você define o
                  lance!).
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
                  <span className="text-[10px] text-orange-200">Taxa só ao concluir</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link href={providerRegisterUrl} className="inline-block w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-[#FF6600] hover:bg-orange-50 font-black px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-black/10 flex items-center justify-center gap-2 mx-auto cursor-pointer">
                    <Sparkles className="w-4 h-4 text-[#FF6600]" />
                    <span>Cadastrar e Começar a Receber Chamados</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Vantagens Diretas (Fundo Claro/Creme) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] border-t border-orange-100/70">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Vantagens Diretas do Marketplace
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Construído para valorizar o seu trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Vantagem 1: Preço Dinâmico */}
            <Card className="hover:border-orange-300 transition shadow-sm bg-white">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold">
                  <DollarSign className="w-6 h-6" />
                </div>
                <CardTitle>Preço Dinâmico (Você decide o valor do socorro)</CardTitle>
                <CardDescription>
                  Sem tabela fixa engessada. Ao visualizar o chamado e a localização do veículo,
                  você envia a sua própria proposta com o valor que considerar justo pelo seu
                  serviço e deslocamento.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Vantagem 2: Pagamento Garantido */}
            <Card className="hover:border-emerald-300 transition shadow-sm bg-white">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle>
                  Pagamento Garantido (O cliente paga no app, o dinheiro vai direto pra você)
                </CardTitle>
                <CardDescription>
                  O motorista tem o valor retido no cartão antes de você iniciar o deslocamento.
                  Assim que o conserto ou troca é concluído, o saldo é liberado diretamente na sua
                  conta via gateway seguro.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Vantagem 3: Autonomia Total */}
            <Card className="hover:border-amber-300 transition shadow-sm bg-white">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <CardTitle>Autonomia Total (Ligue o app apenas quando quiser trabalhar)</CardTitle>
                <CardDescription>
                  Você é dono do seu tempo. Abra o aplicativo apenas quando a oficina estiver
                  tranquila, nos finais de semana ou em plantões noturnos. Atenda somente onde e
                  quando quiser.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção Escura para IA / Tecnologia */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-white border-y border-zinc-800 relative overflow-hidden">
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
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-[#FF6600] flex items-center justify-center">
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
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
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
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
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
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
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
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Fluxo Operacional Simples
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Como funciona o atendimento de chamados?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Passo 1 */}
            <Card className="p-5 relative border-zinc-200/90 shadow-sm bg-[#FFFDF9]">
              <span className="text-3xl font-black text-orange-200 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-2">Chamado Próximo</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Um motorista com emergência de pneu na sua região solicita socorro. Seu aplicativo
                notifica com localização precisa no mapa.
              </p>
            </Card>

            {/* Passo 2 */}
            <Card className="p-5 relative border-zinc-200/90 shadow-sm bg-[#FFFDF9]">
              <span className="text-3xl font-black text-orange-200 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-2">Envio do Seu Lance</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Você define seu valor e o tempo estimado de chegada. Em segundos seu lance chega na
                tela do cliente.
              </p>
            </Card>

            {/* Passo 3 */}
            <Card className="p-5 relative border-zinc-200/90 shadow-sm bg-[#FFFDF9]">
              <span className="text-3xl font-black text-orange-200 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-2">Retenção Financeira</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                O cliente escolhe o seu lance e o valor é pré-autorizado no cartão pelo app. Você se
                desloca com segurança de recebimento.
              </p>
            </Card>

            {/* Passo 4 */}
            <Card className="p-5 relative border-zinc-200/90 shadow-sm bg-[#FFFDF9]">
              <span className="text-3xl font-black text-orange-200 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6600] flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-2">Conclusão e Saldo</h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Finalize a troca ou conserto e confirme no aplicativo. O pagamento cai direto na sua
                conta cadastrada.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Prova Social em Santa Catarina */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] border-t border-orange-100/70">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500" />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">
              Depoimentos de quem já atende em SC
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6 space-y-3 bg-white border-zinc-200/80 shadow-sm">
              <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;Trabalho próximo à BR-101 em Itajaí. Com o BorracharIA, recebo chamados de
                emergência direto no celular. O dinheiro cai certinho e eu decido o preço que vale o
                meu deslocamento.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span className="font-bold text-zinc-900">Claudio M. (Borracheiro)</span>
                <span>Itajaí - SC</span>
              </div>
            </Card>

            <Card className="p-6 space-y-3 bg-white border-zinc-200/80 shadow-sm">
              <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                &ldquo;A segurança do pagamento é o grande diferencial. O cliente já autoriza o
                cartão pelo aplicativo antes de eu sair da borracharia. Zero risco de calote.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
                <span className="font-bold text-zinc-900">Ricardo S. (Socorrista Móvel)</span>
                <span>Balneário Camboriú - SC</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Operacional e Transparente */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-t border-zinc-200/60">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold text-[#FF6600] uppercase tracking-widest">
              Dúvidas Frequentes
            </h2>
            <p className="text-2xl font-extrabold text-zinc-950">Esclarecimentos Rápidos</p>
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
                className="bg-[#FFFDF9] border border-zinc-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-zinc-900 hover:text-[#FF6600] transition cursor-pointer"
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
                  <div className="px-4 pb-4 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Final de Conversão */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#FFFDF9] border-t border-orange-100 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-[#FF6600] shadow-md shadow-orange-600/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Não perca chamados na sua região. Cadastre-se agora mesmo!
          </h2>

          <p className="text-sm text-zinc-600 max-w-lg mx-auto">
            O fluxo de veículos em Itajaí, Balneário Camboriú e na BR-101 é constante todos os dias.
            Esteja pronto para faturar com chamados de emergência.
          </p>

          <div>
            <Link href={providerRegisterUrl} className="inline-block w-full sm:w-auto">
              <Button
                size="xl"
                variant="cta"
                className="w-full sm:w-auto gap-3 text-base sm:text-lg"
              >
                <span>Quero ser um Parceiro BorracharIA</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-500 mt-3">
              Leva menos de 3 minutos para enviar seus dados e iniciar a análise.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 px-4 text-center text-xs text-zinc-500 space-y-2 mb-16 sm:mb-0">
        <p className="font-semibold text-zinc-600">
          BorracharIA Marketplace de Serviços Automotivos © 2026. Todos os direitos reservados.
        </p>
        <p>Operando em Itajaí, Balneário Camboriú e região litoral norte de Santa Catarina.</p>
      </footer>

      {/* Sticky Bottom Bar (Mobile Conversion CTA) */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-orange-100 p-3 z-50 sm:hidden flex items-center justify-between gap-3 shadow-xl">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#FF6600] uppercase tracking-wider">
            Vagas Abertas em SC
          </span>
          <span className="text-xs font-semibold text-zinc-900">Parceria BorracharIA</span>
        </div>
        <Link href={providerRegisterUrl}>
          <Button size="sm" variant="default" className="gap-1.5 shrink-0">
            <span>Quero ser Parceiro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
