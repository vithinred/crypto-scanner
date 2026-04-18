// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, TrendingUp, Sparkles, Radio } from 'lucide-react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { formatPrice, formatPct } from '@/utils/format';
import clsx from 'clsx';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/portfolio', label: 'Portfolio',   icon: Wallet },
  { href: '/coins',     label: 'Markets',     icon: TrendingUp },
  { href: '/insights',  label: 'AI Insights', icon: Sparkles },
];

export function Navbar() {
  const pathname     = usePathname();
  const coins        = useCryptoStore(s => s.coins);
  const wsConnected  = useCryptoStore(s => s.wsConnected);
  const livePrices   = useCryptoStore(s => s.livePrices);

  const tickerCoins = coins.slice(0, 12);
  const doubled     = [...tickerCoins, ...tickerCoins]; // seamless loop

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Ticker tape */}
      <div className="bg-black/60 border-b border-white/5 backdrop-blur-xl py-2 ticker-container">
        <div className="ticker-track">
          {doubled.map((coin, i) => {
            const live = livePrices[coin.symbol.toUpperCase() + 'USDT'];
            const price = live?.price ?? coin.current_price;
            const pct   = coin.price_change_percentage_24h ?? 0;
            const up    = pct >= 0;
            return (
              <Link key={`${coin.id}-${i}`} href={`/coins/${coin.id}`}
                className="inline-flex items-center gap-2 text-xs hover:opacity-80 transition-opacity shrink-0">
                <span className="font-mono font-bold text-white/70">{coin.symbol.toUpperCase()}</span>
                <span className="font-mono font-bold">{formatPrice(price)}</span>
                <span className={clsx('font-mono text-[10px]', up ? 'text-neon' : 'text-pink')}>
                  {formatPct(pct)}
                </span>
                {live && (
                  <span className="w-1 h-1 rounded-full bg-neon animate-pulse" title="Live" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main nav */}
      <nav className="glass border-b border-white/[0.06] backdrop-blur-2xl">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-display text-2xl tracking-widest bg-gradient-to-r from-neon to-cyan bg-clip-text text-transparent">
              NEXUS
            </span>
            <span className="text-[8px] text-neon/60 font-mono tracking-widest">AI</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={clsx(
                    'relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm transition-all duration-200',
                    active
                      ? 'text-neon bg-neon/10'
                      : 'text-muted hover:text-text hover:bg-white/5'
                  )}>
                  <Icon size={14} />
                  <span className="font-medium">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl border border-neon/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* WS status */}
          <div className="flex items-center gap-2">
            <div className={clsx(
              'flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono',
              wsConnected
                ? 'border-neon/30 bg-neon/5 text-neon'
                : 'border-white/10 bg-white/5 text-muted'
            )}>
              <Radio size={10} className={wsConnected ? 'animate-pulse' : ''} />
              {wsConnected ? 'LIVE' : 'REST'}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
