import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({ 
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mascota Crítica',
  description: 'Un componente de interfaz que observa y decide cuándo interactuar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
