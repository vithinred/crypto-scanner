// components/dashboard/TrendingCoins.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui/Card';

interface TrendingItem {
  item: {
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number;
    data?: { price_change_percentage_24h?: { usd?: number } };
  };
}

export function TrendingCoins() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(d => setTrending(Array.isArray(d) ? d.slice(0, 7) : []))
      .catch(() => setTrending([]));
  }, []);

  return (
    <Card className="p-5">
      <SectionHeader
        title="Trending"
        sub="Top searched coins"
        action={<Flame size={16} className="text-gold" />}
      />

      <div className="space-y-2">
        {trending.length === 0
          ? [...Array(7)].map((_, i) => (
              <div key={i} className="skeleton h-11 rounded-xl" />
            ))
          : trending.map(({ item }, i) => {
              const pct = item.data?.price_change_percentage_24h?.usd ?? 0;
              const up  = pct >= 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/coins/${item.id}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="font-mono text-[10px] text-muted w-4">{i + 1}</span>
                    {item.thumb ? (
                      <Image src={item.thumb} alt={item.name} width={24} height={24} className="rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                        {item.symbol?.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-neon transition-colors">{item.name}</p>
                      <p className="font-mono text-[10px] text-muted uppercase">{item.symbol}</p>
                    </div>
                    {pct !== 0 && (
                      <span className={`font-mono text-xs font-bold ${up ? 'text-neon' : 'text-pink'}`}>
                        {up ? '+' : ''}{pct.toFixed(1)}%
                      </span>
                    )}
                  </Link>
                </motion.div>
              );
            })}
      </div>
    </Card>
  );
}
