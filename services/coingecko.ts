// services/coingecko.ts

import axios from 'axios';
import { Coin, CoinDetail, ChartPoint, TimeRange } from '@/types';

const BASE = process.env.NEXT_PUBLIC_COINGECKO_BASE || 'https://api.coingecko.com/api/v3';
const KEY  = process.env.COINGECKO_API_KEY || '';

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: KEY ? { 'x-cg-demo-api-key': KEY } : {},
});

// Retry wrapper
async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try { return await fn(); }
    catch (err: unknown) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

// ─── Markets ────────────────────────────────────────
export async function getMarkets(
  page = 1,
  perPage = 20,
  sparkline = true
): Promise<Coin[]> {
  return withRetry(async () => {
    const { data } = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline,
        price_change_percentage: '1h,24h,7d',
      },
    });
    return data;
  });
}

// ─── Trending ───────────────────────────────────────
export async function getTrending(): Promise<{ item: Partial<Coin> }[]> {
  return withRetry(async () => {
    const { data } = await api.get('/search/trending');
    return data.coins;
  });
}

// ─── Coin detail ────────────────────────────────────
export async function getCoinDetail(id: string): Promise<CoinDetail> {
  return withRetry(async () => {
    const { data } = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    });
    return data;
  });
}

// ─── Historical chart ────────────────────────────────
const RANGE_MAP: Record<TimeRange, { days: number | string; interval: string }> = {
  '1H':  { days: 1,     interval: 'minutely' },
  '24H': { days: 1,     interval: 'hourly'   },
  '7D':  { days: 7,     interval: 'daily'    },
  '1M':  { days: 30,    interval: 'daily'    },
  '1Y':  { days: 365,   interval: 'daily'    },
};

export async function getCoinHistory(
  id: string,
  range: TimeRange
): Promise<ChartPoint[]> {
  return withRetry(async () => {
    const { days } = RANGE_MAP[range];
    const { data } = await api.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: 'usd', days },
    });

    const prices: [number, number][] = data.prices;
    return prices.map(([ts, price]) => ({
      time: formatTime(ts, range),
      price,
    }));
  });
}

function formatTime(ts: number, range: TimeRange): string {
  const d = new Date(ts);
  if (range === '1H' || range === '24H') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Simple price ────────────────────────────────────
export async function getSimplePrices(ids: string[]): Promise<Record<string, { usd: number }>> {
  return withRetry(async () => {
    const { data } = await api.get('/simple/price', {
      params: { ids: ids.join(','), vs_currencies: 'usd' },
    });
    return data;
  });
}

// ─── Global market ───────────────────────────────────
export async function getGlobalMarket() {
  return withRetry(async () => {
    const { data } = await api.get('/global');
    return data.data;
  });
}
