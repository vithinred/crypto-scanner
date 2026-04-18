// app/coins/page.tsx
'use client';

import { motion } from 'framer-motion';
import { MarketTable }   from '@/components/dashboard/MarketTable';
import { GlobalStats }   from '@/components/dashboard/GlobalStats';
import { TrendingCoins } from '@/components/dashboard/TrendingCoins';

export default function CoinsPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl tracking-widest mb-1">Markets</h1>
        <p className="text-muted text-sm">Real-time prices · Binance WebSocket + CoinGecko REST</p>
      </motion.div>

      <GlobalStats />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div className="glass rounded-2xl p-5">
          <MarketTable />
        </div>
        <TrendingCoins />
      </div>
    </div>
  );
}
