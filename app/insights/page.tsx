// app/insights/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react';
import { AIInsight } from '@/types';
import { InsightCard }  from '@/components/insights/InsightCard';
import { Card, Badge, Button, SectionHeader } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Card';
import { useCryptoStore } from '@/store/useCryptoStore';
import { generateInsights } from '@/services/aiEngine';
import clsx from 'clsx';

// Market sentiment overview bar
function SentimentBar({ insights }: { insights: AIInsight[] }) {
  if (!insights.length) return null;
  const bullish  = insights.filter(i => i.sentiment === 'bullish').length;
  const bearish  = insights.filter(i => i.sentiment === 'bearish').length;
  const neutral  = insights.length - bullish - bearish;
  const total    = insights.length;

  const avgRisk  = Math.round(insights.reduce((s, i) => s + i.riskScore, 0) / total);
  const avgConf  = Math.round(insights.reduce((s, i) => s + i.prediction.confidence, 0) / total);

  const bullPct  = Math.round((bullish / total) * 100);
  const bearPct  = Math.round((bearish / total) * 100);
  const neutPct  = 100 - bullPct - bearPct;

  const overallSentiment = bullish > bearish ? 'bullish' : bearish > bullish ? 'bearish' : 'neutral';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="p-6 mb-8">
        <div className="flex flex-wrap items-center gap-6 mb-5">
          <div>
            <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">Overall Sentiment</p>
            <div className="flex items-center gap-2">
              {overallSentiment === 'bullish'  && <TrendingUp size={20} className="text-neon" />}
              {overallSentiment === 'bearish'  && <TrendingDown size={20} className="text-pink" />}
              {overallSentiment === 'neutral'  && <Minus size={20} className="text-muted" />}
              <span className={clsx(
                'font-display text-2xl tracking-widest',
                overallSentiment === 'bullish' ? 'text-neon' :
                overallSentiment === 'bearish' ? 'text-pink' : 'text-text'
              )}>
                {overallSentiment.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="h-10 w-px bg-white/10 hidden sm:block" />

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Bullish', count: bullish, pct: bullPct, color: 'text-neon'  },
              { label: 'Neutral', count: neutral,  pct: neutPct, color: 'text-muted' },
              { label: 'Bearish', count: bearish,  pct: bearPct, color: 'text-pink'  },
            ].map(({ label, count, pct, color }) => (
              <div key={label}>
                <p className={clsx('font-display text-2xl tracking-wide', color)}>{count}</p>
                <p className="font-mono text-[10px] text-muted uppercase tracking-widest">{label} ({pct}%)</p>
              </div>
            ))}
          </div>

          <div className="h-10 w-px bg-white/10 hidden sm:block" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">Avg Risk</p>
              <div className="flex items-center gap-2">
                <ShieldAlert size={14} className={avgRisk <= 3 ? 'text-neon' : avgRisk <= 6 ? 'text-gold' : 'text-pink'} />
                <span className="font-display text-2xl">{avgRisk}<span className="font-mono text-sm text-muted">/10</span></span>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-1">Avg Confidence</p>
              <span className="font-display text-2xl">{avgConf}<span className="font-mono text-sm text-muted">%</span></span>
            </div>
          </div>
        </div>

        {/* Sentiment bar */}
        <div>
          <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">Signal Distribution</p>
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            <div className="bg-neon transition-all duration-1000 rounded-l-full" style={{ width: bullPct + '%' }} />
            <div className="bg-muted/30 transition-all duration-1000"           style={{ width: neutPct + '%' }} />
            <div className="bg-pink transition-all duration-1000 rounded-r-full"  style={{ width: bearPct + '%' }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-mono text-[10px] text-neon">Bullish {bullPct}%</span>
            <span className="font-mono text-[10px] text-pink">Bearish {bearPct}%</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Signal filter tabs
const FILTERS = ['ALL', 'STRONG_BUY', 'BUY', 'NEUTRAL', 'SELL', 'STRONG_SELL'] as const;
type Filter = typeof FILTERS[number];

export default function InsightsPage() {
  const coins = useCryptoStore(s => s.coins);
  const [insights,   setInsights]   = useState<AIInsight[]>([]);
  const [filter,     setFilter]     = useState<Filter>('ALL');
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  function generate(overrideCoins?: typeof coins) {
    const src = overrideCoins ?? coins;
    if (!src.length) return;
    const result = generateInsights(src);
    setInsights(result);
    setLastUpdate(new Date());
    setLoading(false);
    setRefreshing(false);
  }

  // Generate when coins are available
  useEffect(() => {
    if (coins.length) generate(coins);
  }, [coins.length > 0]); // only when first populated

  async function refresh() {
    setRefreshing(true);
    // Re-fetch fresh coins then regenerate
    try {
      const res  = await fetch('/api/markets');
      const fresh = await res.json();
      generate(fresh);
    } catch {
      generate();
    }
  }

  const displayed = filter === 'ALL' ? insights : insights.filter(i => i.signal === filter);

  const filterLabel: Record<Filter, string> = {
    ALL: 'All', STRONG_BUY: '🚀 Strong Buy', BUY: '📈 Buy',
    NEUTRAL: '➡️ Neutral', SELL: '📉 Sell', STRONG_SELL: '🔻 Strong Sell',
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Sparkles size={24} className="text-neon" />
            <h1 className="font-display text-4xl tracking-widest">AI Insights</h1>
          </div>
          <p className="text-muted text-sm">
            Technical analysis · Moving averages · RSI · Trend detection
            {lastUpdate && <span className="ml-2 text-white/30">· Updated {lastUpdate.toLocaleTimeString()}</span>}
          </p>
        </div>

        <Button
          variant="outline" size="sm"
          onClick={refresh}
          disabled={refreshing}
          className={refreshing ? 'opacity-50' : ''}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Analyzing…' : 'Refresh'}
        </Button>
      </motion.div>

      {/* Sentiment overview */}
      {insights.length > 0 && <SentimentBar insights={insights} />}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-1.5 rounded-xl font-mono text-xs transition-all',
              filter === f
                ? 'bg-neon/15 text-neon border border-neon/30'
                : 'bg-white/5 text-muted border border-white/10 hover:text-text hover:bg-white/10'
            )}
          >
            {filterLabel[f]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-muted font-mono text-sm">
          No insights match the selected filter
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayed.map((insight, i) => (
            <InsightCard key={insight.coinId} insight={insight} delay={i * 0.05} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-10 text-center text-xs text-muted/50 font-mono max-w-2xl mx-auto">
        AI insights are generated from technical indicators (SMA, RSI, volatility) and are for
        informational purposes only. Not financial advice. Always do your own research.
      </p>
    </div>
  );
}
