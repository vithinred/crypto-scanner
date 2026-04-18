// types/index.ts

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_1h_in_currency?: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail extends Coin {
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    twitter_screen_name: string;
    reddit_subreddit_url: string;
  };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    high_24h: { usd: number };
    low_24h: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    circulating_supply: number;
    total_supply: number | null;
    ath: { usd: number };
    atl: { usd: number };
  };
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChartPoint {
  time: string;
  price: number;
  volume?: number;
}

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
}

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
}

export interface AIInsight {
  coinId: string;
  symbol: string;
  signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  riskScore: number; // 1-10
  summary: string;
  indicators: {
    trend: string;
    momentum: string;
    volatility: string;
    volume: string;
  };
  prediction: {
    direction: 'up' | 'down' | 'sideways';
    confidence: number; // 0-100
    targetPrice: number;
  };
}

export interface WebSocketTrade {
  e: string;  // event type
  E: number;  // event time
  s: string;  // symbol
  t: number;  // trade id
  p: string;  // price
  q: string;  // quantity
  T: number;  // trade time
  m: boolean; // is buyer market maker
}

export interface LivePrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export type TimeRange = '1H' | '24H' | '7D' | '1M' | '1Y';
