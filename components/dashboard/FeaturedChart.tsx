// components/dashboard/FeaturedChart.tsx
'use client';

import { useCryptoStore } from '@/store/useCryptoStore';
import { useLivePrice } from '@/hooks/useLivePrice';
import { PriceChart } from '@/components/charts/PriceChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { COIN_COLORS } from '@/utils/format';
import { formatCompact } from '@/utils/format';
import Image from 'next/image';

export function FeaturedChart() {
  const coins       = useCryptoStore(s => s.coins);
  const selectedId  = useCryptoStore(s => s.selectedCoin);
  const setSelected = useCryptoStore(s => s.setSelectedCoin);

  const coin = coins.find(c => c.id === selectedId) ?? coins[0];
  const { price, changePercent, isLive } = useLivePrice(coin);
  const color = coin ? COIN_COLORS[coin.id] || '#00ffa3' : '#00ffa3';

  if (!coin) return <div className="skeleton rounded-2xl h-96" />;

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {coin.image && (
          <Image src={coin.image} alt={coin.name} width={40} height={40} className="rounded-full" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl tracking-wider">{coin.name}</h3>
            {isLive && <Badge variant="neon">LIVE</Badge>}
          </div>
          <p className="font-mono text-xs text-muted uppercase">{coin.symbol} / USD</p>
        </div>

        {/* Coin selector */}
        <div className="ml-auto flex gap-2 flex-wrap justify-end">
          {coins.slice(0, 5).map(c => (
            <button
              key={c.id}
              onClick={() => setSelected(c.id)}
              style={selectedId === c.id ? { borderColor: COIN_COLORS[c.id] || '#00ffa3', color: COIN_COLORS[c.id] || '#00ffa3' } : {}}
              className={`px-3 py-1 rounded-xl font-mono text-xs border transition-all ${
                selectedId === c.id ? 'bg-white/5' : 'border-white/10 text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              {c.symbol.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Extra stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/[0.06]">
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">24H High</p>
          <p className="font-mono text-sm font-bold text-neon">${coin.high_24h?.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">24H Low</p>
          <p className="font-mono text-sm font-bold text-pink">${coin.low_24h?.toLocaleString()}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">Volume 24H</p>
          <p className="font-mono text-sm font-bold">{formatCompact(coin.total_volume)}</p>
        </div>
      </div>

      <PriceChart coinId={coin.id} currentPrice={price} change24h={changePercent} />
    </Card>
  );
}
