// components/dashboard/CoinRow.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Coin } from '@/types';
import { useLivePrice } from '@/hooks/useLivePrice';
import { formatPrice, formatCompact, formatPct } from '@/utils/format';
import { COIN_COLORS } from '@/utils/format';
import { ChangeText } from '@/components/ui/Card';
import { SparklineChart } from '@/components/charts/SparklineChart';
import clsx from 'clsx';

interface CoinRowProps {
  coin: Coin;
  rank: number;
  delay?: number;
}

export function CoinRow({ coin, rank, delay = 0 }: CoinRowProps) {
  const { price, changePercent, isLive } = useLivePrice(coin);
  const prevPrice = useRef(price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const color = COIN_COLORS[coin.id] || '#00ffa3';

  // Flash on price change
  useEffect(() => {
    if (price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? 'up' : 'down');
      const t = setTimeout(() => setFlash(null), 700);
      prevPrice.current = price;
      return () => clearTimeout(t);
    }
  }, [price]);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors"
    >
      {/* Rank */}
      <td className="py-4 pl-4 pr-3 w-10">
        <span className="font-mono text-xs text-muted">{rank}</span>
      </td>

      {/* Coin */}
      <td className="py-4 pr-4">
        <Link href={`/coins/${coin.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {coin.image ? (
            <Image src={coin.image} alt={coin.name} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: `${color}20`, color }}>
              {coin.symbol.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm text-text group-hover:text-neon transition-colors">{coin.name}</p>
            <p className="font-mono text-[10px] text-muted uppercase">{coin.symbol}</p>
          </div>
          {isLive && (
            <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" title="Live WebSocket" />
          )}
        </Link>
      </td>

      {/* Price */}
      <td className="py-4 pr-6 text-right">
        <span className={clsx(
          'font-mono font-bold text-sm transition-colors',
          flash === 'up'   && 'text-neon',
          flash === 'down' && 'text-pink',
          !flash           && 'text-text'
        )}>
          {formatPrice(price)}
        </span>
      </td>

      {/* 1H */}
      <td className="py-4 pr-6 text-right hidden lg:table-cell">
        <ChangeText value={coin.price_change_percentage_1h_in_currency ?? 0} />
      </td>

      {/* 24H */}
      <td className="py-4 pr-6 text-right">
        <ChangeText value={changePercent} />
      </td>

      {/* 7D */}
      <td className="py-4 pr-6 text-right hidden md:table-cell">
        <ChangeText value={coin.price_change_percentage_7d_in_currency ?? 0} />
      </td>

      {/* Market Cap */}
      <td className="py-4 pr-6 text-right hidden xl:table-cell">
        <span className="font-mono text-sm text-text">{formatCompact(coin.market_cap)}</span>
      </td>

      {/* Volume */}
      <td className="py-4 pr-6 text-right hidden xl:table-cell">
        <span className="font-mono text-sm text-muted">{formatCompact(coin.total_volume)}</span>
      </td>

      {/* Sparkline */}
      <td className="py-4 pr-4 hidden lg:table-cell">
        <SparklineChart
          data={coin.sparkline_in_7d?.price ?? []}
          positive={(coin.price_change_percentage_7d_in_currency ?? 0) >= 0}
          width={100}
          height={36}
        />
      </td>
    </motion.tr>
  );
}
