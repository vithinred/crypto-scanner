// components/portfolio/PortfolioSummary.tsx
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCryptoStore } from '@/store/useCryptoStore';
import { formatPrice, formatCompact, formatPct } from '@/utils/format';
import { PortfolioStats } from '@/types';
import { Card, StatCard } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { COIN_COLORS } from '@/utils/format';

export function PortfolioSummary() {
  const portfolio = useCryptoStore(s => s.portfolio);

  const stats: PortfolioStats = useMemo(() => {
    const totalValue = portfolio.reduce((s, h) => s + h.currentPrice * h.amount, 0);
    const totalCost  = portfolio.reduce((s, h) => s + h.buyPrice    * h.amount, 0);
    const totalPnL   = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    return { totalValue, totalCost, totalPnL, totalPnLPercent };
  }, [portfolio]);

  const pieData = portfolio.map(h => ({
    name: h.symbol,
    value: h.currentPrice * h.amount,
    color: COIN_COLORS[h.id] || '#00ffa3',
  }));

  const up = stats.totalPnL >= 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Value"  value={formatCompact(stats.totalValue)} icon={<DollarSign size={14} />} delay={0} />
        <StatCard label="Total Cost"   value={formatCompact(stats.totalCost)}  icon={<DollarSign size={14} />} delay={0.06} />
        <StatCard
          label="Total P&L"
          value={formatCompact(Math.abs(stats.totalPnL))}
          sub={(up ? '▲ ' : '▼ ') + formatPct(stats.totalPnLPercent)}
          trend={up ? 'up' : 'down'}
          icon={up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          delay={0.12}
        />
        <StatCard
          label="Return"
          value={formatPct(stats.totalPnLPercent)}
          sub={up ? 'In profit' : 'In loss'}
          trend={up ? 'up' : 'down'}
          icon={<Percent size={14} />}
          delay={0.18}
        />
      </div>

      {/* Allocation pie */}
      <Card className="p-5">
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">Allocation</p>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCompact(v)} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex-1 space-y-2">
            {pieData.map((d, i) => {
              const pct = stats.totalValue > 0 ? (d.value / stats.totalValue * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="font-mono text-xs text-muted w-12">{d.name.toUpperCase()}</span>
                  <div className="flex-1 bg-white/5 rounded-full h-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: pct + '%', background: d.color }} />
                  </div>
                  <span className="font-mono text-xs text-text w-10 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
