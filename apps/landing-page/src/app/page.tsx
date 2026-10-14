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
  Car,
  TrendingUp,
  Star,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function PartnerLandingPage() {
  const providerRegisterUrl =
    process.env.NEXT_PUBLIC_PROVIDER_URL || 'http://localhost:3002/register';

  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-orange-500 selection:text-white flex flex-col font-sans relative overflow-x-hidden">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/80 backdrop-blur sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">BorracharIA</span>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                Parceiros
              </span>
            </div>
          </div>

          <Link
            href={providerRegisterUrl}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md shadow-orange-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Cadastrar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Radial Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-600/15 via-orange-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge de Localização */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold animate-pulse-subtle shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Vagas para Borracheiros: Itajaí, Balneário Camboriú & Eixo BR-101</span>
          </div>

          {/* Headline Impactante */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Aumente a Faturação da Sua Borracharia a Atender{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              Emergências em Itajaí e BC
            </span>
          </h1>

          {/* Subheadline Persuasiva */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Seja acionado quando condutores precisarem de socorro de pneus perto de si.{' '}
            <strong className="text-white font-semibold">
              Preço dinâmico, pagamento 100% garantido
            </strong>{' '}
            e autonomia total para acelerar os ganhos da sua oficina.
          </p>

          {/* Destaque de Vantagens Rápidas */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Preço Dinâmico (Você Decide)
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pagamento 100% Garantido
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Autonomia Total
            </span>
          </div>

          {/* CTA Principal de Conversão */}
          <div className="pt-4 pb-2">
            <Link
              href={providerRegisterUrl}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-base sm:text-lg uppercase tracking-wider transition transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-orange-600/40 cursor-pointer border border-orange-400/30"
            >
              <span>Quero Ser um Parceiro BorracharIA</span>
              <ArrowRight className="w-5 h-5 text-white animate-pulse" />
            </Link>
            <p className="text-[11px] text-zinc-400 mt-2.5">
              Validação ágil de documentos • Comece a faturar assim que aprovado
            </p>
          </div>
        </div>

        {/* Card de Faturamento Estimado */}
        <div className="max-w-xl mx-auto mt-8 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>Potencial de Lucro Extra</span>
            </div>
            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full font-medium">
              Média SC
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 text-center">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">Por Chamado Atendido</span>
              <span className="text-xl sm:text-2xl font-black text-white">R$ 90 a R$ 250</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
                Você define o preço
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-xs text-zinc-400 block mb-1">Com apenas 2 socorros/dia</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                +R$ 5.400<span className="text-xs text-zinc-400">/mês</span>
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">Sem chefe nem metas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios Principais */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/50 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Por Que Ser Parceiro?
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Feito por quem entende a rotina do borracheiro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Benefício 1 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-orange-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Preço Dinâmico: Você no Comando</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Nada de tabela fixa injusta imposta por aplicativo. Ao ver a emergência e a
                distância, você faz seu próprio lance com o valor que achar justo para o socorro.
              </p>
            </div>

            {/* Benefício 2 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-orange-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Dinheiro Seguro (Sem Calote)</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                O cliente tem o pagamento retido no cartão antes de você sair da oficina. Concluiu o
                atendimento, o valor é liberado na sua carteira digital para transferência rápida.
              </p>
            </div>

            {/* Benefício 3 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-orange-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Sem Chefe e Sem Horário Fixo</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Abra o aplicativo apenas quando tiver tempo livre ou quando a oficina estiver calma.
                Você atende apenas onde e quando quiser, sem cobranças de horário.
              </p>
            </div>

            {/* Benefício 4 */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 hover:border-orange-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Atenda com o Seu Meio de Transporte</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Pode ser de moto com compressor portátil, carro de passeio, picape de apoio ou van
                equipada. Qualquer socorrista preparado tem espaço na BorracharIA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Passo a Passo
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como funciona na prática?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Passo 1 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Notificação de Socorro</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Um motorista com pneu furado na sua região abre o chamado. Seu celular apita com o
                local exato no mapa.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Envie Seu Lance</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você envia sua proposta em 3 toques: estipula seu preço e o tempo que levará para
                chegar.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Aceite & Pagamento</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O cliente aceita o lance e o dinheiro é retido no app. Você se desloca com 100% de
                garantia de recebimento.
              </p>
            </div>

            {/* Passo 4 */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 relative">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                04
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Serviço Feito & Saldo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Troque o pneu ou faça o reparo, conclua pelo app e o dinheiro cai na sua conta sem
                dor de cabeça.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social / Depoimentos em SC */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/40 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              O que dizem os parceiros na região
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                &ldquo;Trabalho perto da BR-101 em Itajaí. Antes eu dependia de gente passando na
                porta. Hoje eu deixo o app ligado e pego 2 ou 3 socorros por semana na marginal. É o
                dinheiro do aluguel garantido.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <span className="font-semibold text-white">Claudio M. (Borracheiro)</span>
                <span>Itajaí - SC</span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                &ldquo;A melhor coisa é não tomar calote. O cliente já autoriza o cartão pelo
                aplicativo antes de eu sair. Só pego a moto, vou lá, troco o estepe e volto com o
                dinheiro no bolso.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <span className="font-semibold text-white">Ricardo S. (Socorrista Móvel)</span>
                <span>Balneário Camboriú - SC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção FAQ (Perguntas Frequentes) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Dúvidas Frequentes
            </h2>
            <p className="text-2xl font-extrabold text-white">Tudo o que você precisa saber</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Como funciona a taxa da plataforma?',
                a: 'A BorracharIA opera com modelo transparente por intermediação: uma taxa padrão da plataforma é descontada diretamente no momento em que o pagamento do cliente é processado pelo gateway (Asaas). Não há custos ocultos nem cobranças antecipadas.',
              },
              {
                q: 'Quais documentos são exigidos para aprovação?',
                a: 'Para garantir a segurança de todos, exigimos CNH válida, fotos das ferramentas básicas que você utiliza para socorro de pneus e um breve vídeo de validação.',
              },
              {
                q: 'Como e quando recebo o dinheiro dos atendimentos?',
                a: 'Os pagamentos são processados via gateway financeiro seguro (Asaas) e você recebe diretamente na sua conta bancária cadastrada (via Pix ou transferência) após a conclusão do chamado.',
              },
              {
                q: 'Posso continuar trabalhando na minha oficina fixa?',
                a: 'Com certeza! Você não precisa sair da sua borracharia. Ligue o aplicativo para pegar chamados de motoristas que estejam a poucos quilômetros de você e aumente seu fluxo diário.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-orange-400 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{item.q}</span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      faqOpen === idx ? 'rotate-90 text-orange-500' : ''
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
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-orange-950/20 to-zinc-950 border-t border-zinc-800/80 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-600/20 border border-orange-500/30 text-orange-500 shadow-xl shadow-orange-600/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Não Perca Chamados na Sua Região. Cadastre-se Hoje Mesmo!
          </h2>

          <p className="text-sm text-zinc-300 max-w-lg mx-auto">
            O fluxo de veículos em Itajaí, Balneário Camboriú e na BR-101 é gigantesco todos os
            dias. Esteja pronto para atender e faturar.
          </p>

          <div>
            <Link
              href={providerRegisterUrl}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-base sm:text-lg uppercase tracking-wider transition transform hover:scale-[1.02] shadow-2xl shadow-orange-600/30 cursor-pointer"
            >
              <span>Cadastrar Como Parceiro Agora</span>
              <ArrowRight className="w-5 h-5 text-white" />
            </Link>
            <p className="text-xs text-zinc-400 mt-3">
              Leva menos de 3 minutos para enviar seus dados.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-400 space-y-2 mb-16 sm:mb-0">
        <p className="font-semibold text-zinc-400">
          BorracharIA Marketplace de Serviços Automotivos © 2026. Todos os direitos reservados.
        </p>
        <p>Operando em Itajaí, Balneário Camboriú e região litoral norte de Santa Catarina.</p>
      </footer>

      {/* Sticky Bottom Bar (Mobile Conversion CTA) */}
      <div className="fixed bottom-0 inset-x-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 p-3 z-50 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
            Vagas Abertas
          </span>
          <span className="text-xs font-semibold text-white">Cadastre-se Grátis</span>
        </div>
        <Link
          href={providerRegisterUrl}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Quero Participar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
