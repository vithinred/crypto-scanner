// hooks/useWebSocket.ts
'use client';

import { useEffect, useRef } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { BinanceWebSocket, SYMBOL_TO_ID } from '@/services/binanceWS';
import { LivePrice } from '@/types';

export function useWebSocket() {
  const wsRef = useRef<BinanceWebSocket | null>(null);
  const { updateLivePrice, setWsConnected, updatePortfolioPrices } = useCryptoStore();

  useEffect(() => {
    const ws = new BinanceWebSocket({
      onPriceUpdate: (symbol: string, livePrice: LivePrice) => {
        // Store raw live price
        updateLivePrice(symbol, livePrice);

        // Also update portfolio prices using coingecko id mapping
        const cgId = SYMBOL_TO_ID[symbol];
        if (cgId) {
          updatePortfolioPrices({ [cgId]: livePrice.price });
        }
      },
      onConnect:    () => setWsConnected(true),
      onDisconnect: () => setWsConnected(false),
    });

    wsRef.current = ws;
    ws.connect();

    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, []);

  return {
    isConnected: useCryptoStore((s) => s.wsConnected),
  };
}
