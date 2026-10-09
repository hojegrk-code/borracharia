import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BorracharIA - Socorro Emergencial de Pneus',
  description: 'Marketplace emergencial para troca e conserto de pneus sob demanda',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ea580c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-slate-900 text-slate-800 flex justify-center min-h-screen">
        {/* Contêiner mobile centralizado simulando smartphone em telas grandes */}
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
