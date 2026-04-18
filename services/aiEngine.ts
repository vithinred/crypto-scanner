// services/aiEngine.ts
// Lightweight technical-analysis-based AI insights (no external AI API needed)

import { Coin, AIInsight, ChartPoint } from '@/types';

// ─── Moving Average ───────────────────────────────────
function sma(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] ?? 0;
  const slice = data.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function ema(data: number[], period: number): number {
  if (data.length === 0) return 0;
  const k = 2 / (period + 1);
  let result = data[0];
  for (let i = 1; i < data.length; i++) {
    result = data[i] * k + result * (1 - k);
  }
  return result;
}

// ─── RSI ─────────────────────────────────────────────
function rsi(prices: number[], period = 14): number {
  if (prices.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
}

// ─── Volatility (std dev of returns) ─────────────────
function volatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * 100; // as percentage
}

// ─── Volume trend ─────────────────────────────────────
function volumeTrend(coin: Coin): 'rising' | 'falling' | 'stable' {
  const volRatio = coin.total_volume / (coin.market_cap || 1);
  if (volRatio > 0.08) return 'rising';
  if (volRatio < 0.03) return 'falling';
  return 'stable';
}

// ─── Signal logic ─────────────────────────────────────
function getSignal(rsiVal: number, sma7: number, sma25: number, change24h: number) {
  const macdLike = sma7 - sma25; // positive = bullish crossover

  if (rsiVal < 30 && macdLike > 0) return 'STRONG_BUY' as const;
  if (rsiVal < 45 && macdLike > 0) return 'BUY' as const;
  if (rsiVal > 70 && macdLike < 0) return 'STRONG_SELL' as const;
  if (rsiVal > 60 && macdLike < 0) return 'SELL' as const;
  return 'NEUTRAL' as const;
}

// ─── Risk score ───────────────────────────────────────
function riskScore(vol: number, change24h: number): number {
  const baseScore = Math.min(vol * 50, 6);
  const changeScore = Math.min(Math.abs(change24h) / 5, 4);
  return Math.round(Math.min(baseScore + changeScore, 10));
}

// ─── Summary text ─────────────────────────────────────
function buildSummary(
  coin: Coin,
  signal: AIInsight['signal'],
  rsiVal: number,
  vol: number,
  vt: string
): string {
  const name = coin.name;
  const pct  = coin.price_change_percentage_24h?.toFixed(2);

  const sentimentMap: Record<string, string> = {
    STRONG_BUY:  `${name} shows strong bullish momentum. RSI at ${rsiVal.toFixed(0)} indicates oversold conditions with high recovery potential.`,
    BUY:         `${name} presents a buying opportunity. Moving averages are trending upward with ${vt} volume.`,
    NEUTRAL:     `${name} is consolidating. Price moved ${pct}% in 24h with no clear directional bias.`,
    SELL:        `${name} shows bearish signals. RSI at ${rsiVal.toFixed(0)} suggests overbought conditions — consider taking profits.`,
    STRONG_SELL: `${name} faces significant selling pressure. RSI extreme and moving average crossover confirm bearish trend.`,
  };

  return sentimentMap[signal] || `${name} moved ${pct}% in 24h.`;
}

// ─── Main export ─────────────────────────────────────
export function generateInsight(coin: Coin, history?: ChartPoint[]): AIInsight {
  const prices = history?.map(p => p.price) ??
    (coin.sparkline_in_7d?.price || Array(25).fill(coin.current_price));

  const rsiVal = rsi(prices);
  const sma7   = sma(prices, 7);
  const sma25  = sma(prices, Math.min(25, prices.length));
  const vol    = volatility(prices);
  const vt     = volumeTrend(coin);
  const signal = getSignal(rsiVal, sma7, sma25, coin.price_change_percentage_24h ?? 0);
  const risk   = riskScore(vol, coin.price_change_percentage_24h ?? 0);

  const sentiment: AIInsight['sentiment'] =
    signal === 'BUY' || signal === 'STRONG_BUY' ? 'bullish' :
    signal === 'SELL' || signal === 'STRONG_SELL' ? 'bearish' : 'neutral';

  // Prediction: simple regression on last N prices
  const lastPrices = prices.slice(-7);
  const avgChange = lastPrices.length > 1
    ? (lastPrices[lastPrices.length - 1] - lastPrices[0]) / lastPrices[0]
    : 0;
  const targetPrice = coin.current_price * (1 + avgChange * 0.5);
  const confidence  = Math.min(Math.abs(rsiVal - 50) * 2, 85);

  return {
    coinId:  coin.id,
    symbol:  coin.symbol.toUpperCase(),
    signal,
    sentiment,
    riskScore: risk,
    summary: buildSummary(coin, signal, rsiVal, vol, vt),
    indicators: {
      trend:      sma7 > sma25 ? 'Uptrend (MA crossover)' : sma7 < sma25 ? 'Downtrend (MA crossover)' : 'Sideways',
      momentum:   rsiVal > 60 ? `RSI ${rsiVal.toFixed(0)} — Overbought` : rsiVal < 40 ? `RSI ${rsiVal.toFixed(0)} — Oversold` : `RSI ${rsiVal.toFixed(0)} — Neutral`,
      volatility: vol < 1 ? 'Low' : vol < 3 ? 'Moderate' : 'High',
      volume:     vt === 'rising' ? 'Above average ↑' : vt === 'falling' ? 'Below average ↓' : 'Average →',
    },
    prediction: {
      direction:   avgChange > 0.005 ? 'up' : avgChange < -0.005 ? 'down' : 'sideways',
      confidence:  Math.round(confidence),
      targetPrice: parseFloat(targetPrice.toFixed(2)),
    },
  };
}

export function generateInsights(coins: Coin[]): AIInsight[] {
  return coins.slice(0, 10).map(c => generateInsight(c));
}
