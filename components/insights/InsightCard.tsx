// components/insights/InsightCard.tsx
'use client';

import { motion } from 'framer-motion';
import { AIInsight } from '@/types';
import { Card, Badge } from '@/components/ui/Card';
import { formatPrice } from '@/utils/format';
import { TrendingUp, TrendingDown, Minus, ShieldAlert, Target } from 'lucide-react';
import clsx from 'clsx';

const SIGNAL_CONFIG = {
  STRONG_BUY:  { label: 'Strong Buy',  color: 'neon',    icon: TrendingUp,   bg: 'bg-neon/5'  },
  BUY:         { label: 'Buy',         color: 'neon',    icon: TrendingUp,   bg: 'bg-neon/5'  },
  NEUTRAL:     { label: 'Neutral',     color: 'neutral', icon: Minus,        bg: 'bg-white/5' },
  SELL:        { label: 'Sell',        color: 'pink',    icon: TrendingDown, bg: 'bg-pink/5'  },
  STRONG_SELL: { label: 'Strong Sell', color: 'pink',    icon: TrendingDown, bg: 'bg-pink/5'  },
} as const;

const RISK_COLOR = (n: number) => n <= 3 ? 'bg-neon' : n <= 6 ? 'bg-gold' : 'bg-pink';

interface InsightCardProps {
  insight: AIInsight;
  delay?: number;
}

export function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  const cfg = SIGNAL_CONFIG[insight.signal];
  const Icon = cfg.icon;
  const up   = insight.prediction.direction === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={clsx('p-5 h-full', cfg.bg)}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-mono text-xs text-muted uppercase tracking-widest mb-1">
              {insight.symbol} / USD
            </p>
            <Badge variant={cfg.color as any}>{cfg.label}</Badge>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Icon size={18} className={insight.sentiment === 'bullish' ? 'text-neon' : insight.sentiment === 'bearish' ? 'text-pink' : 'text-muted'} />
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-text/80 leading-relaxed mb-4">{insight.summary}</p>

        {/* Indicators */}
        <div className="space-y-2 mb-4">
          {Object.entries(insight.indicators).map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted uppercase tracking-wider capitalize">{k}</span>
              <span className="font-mono text-xs text-text">{v}</span>
            </div>
          ))}
        </div>

        {/* Risk score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert size={10} /> Risk Score
            </span>
            <span className="font-mono text-xs font-bold">{insight.riskScore}/10</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={clsx('h-full rounded-full', RISK_COLOR(insight.riskScore))}
              initial={{ width: 0 }}
              animate={{ width: `${insight.riskScore * 10}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
            />
          </div>
        </div>

        {/* Prediction */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Target size={12} className="text-muted" />
            <span className="font-mono text-[10px] text-muted uppercase tracking-wider">Target</span>
          </div>
          <div className="text-right">
            <p className={clsx('font-mono text-sm font-bold', up ? 'text-neon' : 'text-pink')}>
              {formatPrice(insight.prediction.targetPrice)}
            </p>
            <p className="font-mono text-[10px] text-muted">{insight.prediction.confidence}% confidence</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
