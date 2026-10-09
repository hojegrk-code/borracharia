import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BorracharIA Pro - Painel do Profissional',
  description: 'Aplicativo de atendimento e envio de lances para borracheiros e socorristas',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-950 text-slate-100 flex justify-center min-h-screen">
        {/* Contêiner mobile centralizado */}
        <div className="w-full max-w-md bg-slate-900 min-h-screen shadow-2xl flex flex-col relative overflow-hidden text-slate-100 border-x border-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
