// components/dashboard/GlobalStats.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCompact, formatPct } from '@/utils/format';
import { TrendingUp, Globe, Coins, BarChart2 } from 'lucide-react';
import { StatCard } from '@/components/ui/Card';

interface GlobalData {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
}

export function GlobalStats() {
  const [data, setData] = useState<GlobalData | null>(null);

  useEffect(() => {
    fetch('/api/global')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton rounded-2xl h-28" />
        ))}
      </div>
    );
  }

  const mcap    = data.total_market_cap?.usd ?? 0;
  const vol     = data.total_volume?.usd ?? 0;
  const mcapChg = data.market_cap_change_percentage_24h_usd ?? 0;
  const btcDom  = data.market_cap_percentage?.btc ?? 0;
  const coins   = data.active_cryptocurrencies ?? 0;

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatCompact(mcap),
      sub:   formatPct(mcapChg) + ' 24h',
      trend: (mcapChg >= 0 ? 'up' : 'down') as 'up' | 'down',
      icon:  <Globe size={14} />,
    },
    {
      label: '24H Volume',
      value: formatCompact(vol),
      sub:   formatPct((vol / mcap) * 100) + ' of mcap',
      trend: 'neutral' as const,
      icon:  <BarChart2 size={14} />,
    },
    {
      label: 'BTC Dominance',
      value: btcDom.toFixed(1) + '%',
      sub:   'ETH ' + (data.market_cap_percentage?.eth ?? 0).toFixed(1) + '%',
      trend: 'neutral' as const,
      icon:  <TrendingUp size={14} />,
    },
    {
      label: 'Active Coins',
      value: coins.toLocaleString(),
      sub:   'tracked globally',
      trend: 'neutral' as const,
      icon:  <Coins size={14} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s, i) => (
        <StatCard key={s.label} {...s} delay={i * 0.08} />
      ))}
    </div>
  );
}
