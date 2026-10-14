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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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

          <Link href={providerRegisterUrl}>
            <Button size="sm" variant="default" className="gap-1.5">
              <span>Cadastrar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section (Mobile-First Alto Contraste) */}
      <section className="relative pt-8 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Radial Highlights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-600/15 via-orange-600/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge de Localização Regional */}
          <div className="inline-flex">
            <Badge variant="orange" className="gap-2 py-1.5 px-3.5 text-xs animate-pulse-subtle">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Vagas para Borracheiros: Itajaí, Balneário Camboriú & Eixo BR-101</span>
            </Badge>
          </div>

          {/* Headline Sugerida com Alto Contraste */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Aumente o faturamento da sua borracharia atendendo{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              emergências em Itajaí e BC
            </span>
          </h1>

          {/* Subheadline Persuasiva e Direta */}
          <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Seja acionado quando motoristas precisarem de socorro de pneus perto de você.{' '}
            <strong className="text-white font-semibold">
              Preço dinâmico, pagamento 100% garantido
            </strong>{' '}
            e autonomia total para impulsionar a receita da sua oficina.
          </p>

          {/* Destaque das 3 Vantagens Centrais */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-semibold text-zinc-300 pt-1">
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Preço Dinâmico (Você
              decide o valor)
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Pagamento Garantido
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Autonomia Total
            </span>
          </div>

          {/* CTA Gigante Principal */}
          <div className="pt-4 pb-2">
            <Link href={providerRegisterUrl} className="inline-block w-full sm:w-auto">
              <Button
                size="xl"
                variant="cta"
                className="w-full sm:w-auto gap-3 text-base sm:text-lg"
              >
                <span>Quero ser um Parceiro BorracharIA</span>
                <ArrowRight className="w-5 h-5 text-white animate-pulse" />
              </Button>
            </Link>
            <p className="text-xs text-zinc-400 mt-2.5">
              Validação ágil de documentos • Comece a atender assim que aprovado
            </p>
          </div>
        </div>

        {/* Card de Faturamento e Previsibilidade */}
        <div className="max-w-xl mx-auto mt-8">
          <Card>
            <div className="flex items-center justify-between border-b border-zinc-800 p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span>Previsibilidade de Ganhos Extras</span>
              </div>
              <Badge variant="secondary">Média SC</Badge>
            </div>
            <CardContent className="pt-4 grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-xs text-zinc-400 block mb-1">Por Socorro Realizado</span>
                <span className="text-xl sm:text-2xl font-black text-white">R$ 90 a R$ 250</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
                  Você define o valor do lance
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <span className="text-xs text-zinc-400 block mb-1">Com apenas 2 socorros/dia</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">
                  +R$ 5.400<span className="text-xs text-zinc-400">/mês</span>
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">
                  Sem metas obrigatórias
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Seção de Vantagens Diretas */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/50 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Vantagens Diretas do Marketplace
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Construído para valorizar o seu trabalho
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Vantagem 1: Preço Dinâmico */}
            <Card className="hover:border-orange-500/40 transition">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-500 flex items-center justify-center font-bold">
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
            <Card className="hover:border-emerald-500/40 transition">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
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
            <Card className="hover:border-amber-500/40 transition">
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
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

      {/* Seção: Como Funciona o Aplicativo */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              Fluxo Operacional Simples
            </h2>
            <p className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Como funciona o atendimento de chamados?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Passo 1 */}
            <Card className="p-5 relative bg-zinc-900/70 border-zinc-800">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Chamado Próximo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Um motorista com emergência de pneu na sua região solicita socorro. Seu aplicativo
                notifica com localização precisa no mapa.
              </p>
            </Card>

            {/* Passo 2 */}
            <Card className="p-5 relative bg-zinc-900/70 border-zinc-800">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Envio do Seu Lance</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Você define seu valor e o tempo estimado de chegada. Em segundos seu lance chega na
                tela do cliente.
              </p>
            </Card>

            {/* Passo 3 */}
            <Card className="p-5 relative bg-zinc-900/70 border-zinc-800">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Retenção Financeira</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O cliente escolhe o seu lance e o valor é pré-autorizado no cartão pelo app. Você se
                desloca com segurança de recebimento.
              </p>
            </Card>

            {/* Passo 4 */}
            <Card className="p-5 relative bg-zinc-900/70 border-zinc-800">
              <span className="text-3xl font-black text-orange-500/30 absolute top-4 right-4">
                04
              </span>
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center font-bold mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Conclusão e Saldo</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Finalize a troca ou conserto e confirme no aplicativo. O pagamento cai direto na sua
                conta cadastrada.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Prova Social em Santa Catarina */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-900/40 border-t border-zinc-800">
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
            <Card className="p-5 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                &ldquo;Trabalho próximo à BR-101 em Itajaí. Com o BorracharIA, recebo chamados de
                emergência direto no celular. O dinheiro cai certinho e eu decido o preço que vale o
                meu deslocamento.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <span className="font-semibold text-white">Claudio M. (Borracheiro)</span>
                <span>Itajaí - SC</span>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <p className="text-xs sm:text-sm text-zinc-300 italic">
                &ldquo;A segurança do pagamento é o grande diferencial. O cliente já autoriza o
                cartão pelo aplicativo antes de eu sair da borracharia. Zero risco de calote.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <span className="font-semibold text-white">Ricardo S. (Socorrista Móvel)</span>
                <span>Balneário Camboriú - SC</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Operacional e Transparente */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
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
            Não perca chamados na sua região. Cadastre-se agora mesmo!
          </h2>

          <p className="text-sm text-zinc-300 max-w-lg mx-auto">
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
            <p className="text-xs text-zinc-400 mt-3">
              Leva menos de 3 minutos para enviar seus dados e iniciar a análise.
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
            Vagas Abertas em SC
          </span>
          <span className="text-xs font-semibold text-white">Parceria BorracharIA</span>
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
