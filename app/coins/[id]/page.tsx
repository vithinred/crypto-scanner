// app/coins/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Globe, Twitter } from 'lucide-react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { useLivePrice }   from '@/hooks/useLivePrice';
import { PriceChart }     from '@/components/charts/PriceChart';
import { InsightCard }    from '@/components/insights/InsightCard';
import { Card, Badge, Skeleton } from '@/components/ui/Card';
import { generateInsight } from '@/services/aiEngine';
import { formatPrice, formatCompact, formatPct } from '@/utils/format';
import { CoinDetail, AIInsight } from '@/types';
import clsx from 'clsx';

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const coins   = useCryptoStore(s => s.coins);
  const coinBase = coins.find(c => c.id === id);

  const [detail,  setDetail]  = useState<CoinDetail | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);

  const { price, changePercent, isLive } = useLivePrice(coinBase);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/coins/${id}`)
      .then(r => r.json())
      .then((d: CoinDetail) => {
        setDetail(d);
        if (coinBase) setInsight(generateInsight(coinBase));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, coinBase]);

  const md = detail?.market_data;

  const stats = md ? [
    { label: 'Market Cap',        value: formatCompact(md.market_cap.usd) },
    { label: '24H Volume',        value: formatCompact(md.total_volume.usd) },
    { label: '24H High',          value: formatPrice(md.high_24h.usd) },
    { label: '24H Low',           value: formatPrice(md.low_24h.usd) },
    { label: 'Circulating Supply',value: formatCompact(md.circulating_supply) },
    { label: 'All-Time High',     value: formatPrice(md.ath.usd) },
    { label: 'All-Time Low',      value: formatPrice(md.atl.usd) },
    { label: '7D Change',         value: formatPct(md.price_change_percentage_7d),  up: md.price_change_percentage_7d  >= 0 },
    { label: '30D Change',        value: formatPct(md.price_change_percentage_30d), up: md.price_change_percentage_30d >= 0 },
    { label: '1Y Change',         value: formatPct(md.price_change_percentage_1y),  up: md.price_change_percentage_1y  >= 0 },
  ] : [];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
      {/* Back */}
      <Link href="/coins" className="inline-flex items-center gap-2 text-muted hover:text-neon transition-colors text-sm font-mono">
        <ArrowLeft size={14} /> Back to Markets
      </Link>

      {loading && !detail ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <>
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-start gap-5">
            {detail?.image?.large && (
              <Image src={detail.image.large} alt={detail.name} width={64} height={64} className="rounded-full" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-3 mb-1">
                <h1 className="font-display text-4xl tracking-wider">{detail?.name ?? id}</h1>
                {isLive && <Badge variant="neon">LIVE</Badge>}
                {coinBase && (
                  <span className="font-mono text-xs text-muted px-2 py-0.5 bg-white/5 rounded-lg">
                    Rank #{coinBase.market_cap_rank}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl">{formatPrice(price)}</span>
                <span className={clsx('font-mono text-sm font-bold', changePercent >= 0 ? 'text-neon' : 'text-pink')}>
                  {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-2">
              {detail?.links?.homepage?.[0] && (
                <a href={detail.links.homepage[0]} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-neon hover:border-neon/30 transition-all">
                  <Globe size={15} />
                </a>
              )}
              {detail?.links?.twitter_screen_name && (
                <a href={`https://twitter.com/${detail.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-cyan hover:border-cyan/30 transition-all">
                  <Twitter size={15} />
                </a>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
            {/* Left: chart + stats */}
            <div className="space-y-6">
              <Card className="p-6">
                <PriceChart coinId={id} currentPrice={price} change24h={changePercent} />
              </Card>

              {/* Stats grid */}
              <Card className="p-5">
                <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Market Data</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                  {stats.map(({ label, value, up }) => (
                    <div key={label}>
                      <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">{label}</p>
                      <p className={clsx(
                        'font-mono text-sm font-bold',
                        up === undefined ? 'text-text' : up ? 'text-neon' : 'text-pink'
                      )}>
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Description */}
              {detail?.description?.en && (
                <Card className="p-5">
                  <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">About {detail.name}</p>
                  <p className="text-sm text-text/75 leading-relaxed line-clamp-6"
                    dangerouslySetInnerHTML={{ __html: detail.description.en.split('. ').slice(0, 4).join('. ') + '.' }}
                  />
                </Card>
              )}
            </div>

            {/* Right: AI insight */}
            {insight && (
              <div>
                <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">AI Analysis</p>
                <InsightCard insight={insight} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
