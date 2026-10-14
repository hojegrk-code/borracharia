import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seja um Parceiro BorracharIA | Renda Extra com Socorro de Pneus em SC',
  description:
    'Aumente o faturamento da sua borracharia atendendo chamados emergenciais em Itajaí, Balneário Camboriú e região. Você define o seu preço e recebe direto no app.',
  keywords: [
    'borracheiro itajaí',
    'socorro de pneu balneário camboriú',
    'borracharia 24 horas sc',
    'renda extra mecânico',
    'troca de pneu br 101',
    'aplicativo para borracheiros',
  ],
  openGraph: {
    title: 'Ganhe Mais com a BorracharIA - Seja um Socorrista Parceiro',
    description:
      'Sem mensalidade. Sem patrão. Defina o seu preço dinâmico e receba clientes direto no seu celular.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ea580c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white min-h-screen antialiased selection:bg-orange-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
