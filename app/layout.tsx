// app/layout.tsx
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'NEXUS — AI Crypto Intelligence',
  description: 'Real-time crypto tracker with AI-powered insights, WebSocket price streams, and portfolio analytics.',
  keywords: ['crypto', 'bitcoin', 'real-time', 'AI', 'portfolio', 'trading'],
  openGraph: {
    title: 'NEXUS — AI Crypto Intelligence',
    description: 'Real-time crypto dashboard with live WebSocket data and AI insights.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
