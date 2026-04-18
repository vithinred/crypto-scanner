// components/charts/PriceChart.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartPoint, TimeRange } from '@/types';
import { formatPrice, formatCompact } from '@/utils/format';
import { COIN_COLORS } from '@/utils/format';
import { Skeleton } from '@/components/ui/Card';
import clsx from 'clsx';

const RANGES: TimeRange[] = ['1H', '24H', '7D', '1M', '1Y'];

interface PriceChartProps {
  coinId: string;
  currentPrice: number;
  change24h: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 border border-white/10 shadow-card">
      <p className="font-mono text-[10px] text-muted mb-1">{label}</p>
      <p className="font-display text-xl text-white">{formatPrice(payload[0]?.value)}</p>
    </div>
  );
}

export function PriceChart({ coinId, currentPrice, change24h }: PriceChartProps) {
  const [range, setRange]   = useState<TimeRange>('24H');
  const [data, setData]     = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const color = COIN_COLORS[coinId] || '#00ffa3';
  const isUp  = change24h >= 0;
  const chartColor = isUp ? '#00ffa3' : '#ff3e7f';

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/coins/${coinId}/history?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [coinId, range]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // Compute min/max for Y domain padding
  const prices = data.map(d => d.price);
  const minP = prices.length ? Math.min(...prices) * 0.998 : 0;
  const maxP = prices.length ? Math.max(...prices) * 1.002 : 0;

  return (
    <div className="w-full">
      {/* Range tabs */}
      <div className="flex items-center gap-1 mb-5">
        {RANGES.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={clsx(
              'px-3 py-1 rounded-xl font-mono text-xs transition-all duration-200',
              range === r
                ? 'bg-neon/15 text-neon border border-neon/30'
                : 'text-muted hover:text-text hover:bg-white/5'
            )}
          >
            {r}
          </button>
        ))}
        <div className="ml-auto text-right">
          <p className="font-display text-2xl">{formatPrice(currentPrice)}</p>
          <p className={clsx('font-mono text-xs', isUp ? 'text-neon' : 'text-pink')}>
            {isUp ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Skeleton className="h-64 w-full" />
          </motion.div>
        ) : (
          <motion.div key={range} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`grad-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={chartColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: '#4a5268', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickLine={false} axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[minP, maxP]}
                  tick={{ fill: '#4a5268', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  tickLine={false} axisLine={false}
                  width={80}
                  tickFormatter={v => formatCompact(v)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: chartColor, strokeWidth: 1, strokeDasharray: '4 2' }} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={chartColor}
                  strokeWidth={2}
                  fill={`url(#grad-${coinId})`}
                  dot={false}
                  activeDot={{ r: 4, fill: chartColor, stroke: '#03050a', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
