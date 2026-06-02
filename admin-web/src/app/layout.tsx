import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'ElimuTube Enterprise Admin',
  description: 'Enterprise Control Panel for ElimuTube Video Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.className} flex h-screen overflow-hidden relative`} suppressHydrationWarning>
        {/* Dynamic Glowing Ambient Lights */}
        <div className="glow-orb-purple top-[-100px] left-[-100px]" />
        <div className="glow-orb-blue bottom-[-100px] right-[-100px]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
