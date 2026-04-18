// hooks/useMarketData.ts
'use client';

import { useEffect, useCallback } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';

const POLL_INTERVAL = 15000; // 15 seconds fallback

export function useMarketData() {
  const { setCoins, setLoading, setError, updatePortfolioPrices, portfolio } = useCryptoStore();

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCoins(data);

      // Update portfolio prices from market data
      const prices: Record<string, number> = {};
      data.forEach((c: { id: string; current_price: number }) => {
        prices[c.id] = c.current_price;
      });
      updatePortfolioPrices(prices);

      setError(null);
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('[Market]', err);
    } finally {
      setLoading(false);
    }
  }, [setCoins, setLoading, setError, updatePortfolioPrices]);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  return { refetch: fetchMarkets };
}
