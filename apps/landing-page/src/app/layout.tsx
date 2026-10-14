import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BorracharIA Super App | Socorro de Pneus Inteligente em SC',
  description:
    'A plataforma de socorro de pneus que conecta motoristas a borracheiros e socorristas em minutos em Itajaí, Balneário Camboriú e eixo BR-101.',
  keywords: [
    'borracharia itajaí',
    'socorro de pneu balneário camboriú',
    'borracharia 24 horas sc',
    'troca de pneu br 101',
    'socorrista automotivo sc',
    'aplicativo para borracheiros',
  ],
  openGraph: {
    title: 'BorracharIA Super App - Socorro de Pneus Inteligente',
    description:
      'Chame socorro de pneus em minutos ou aumente o faturamento da sua oficina com preço dinâmico e pagamento garantido.',
    type: 'website',
    locale: 'pt_BR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF6600',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white min-h-screen antialiased selection:bg-[#FF6600] selection:text-white">
        {children}
      </body>
    </html>
  );
}
