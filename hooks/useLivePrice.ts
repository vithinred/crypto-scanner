// hooks/useLivePrice.ts
'use client';

import { useMemo } from 'react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { Coin } from '@/types';

// Maps coingecko id → binance ws symbol
const ID_TO_WS: Record<string, string> = {
  bitcoin:        'BTCUSDT',
  ethereum:       'ETHUSDT',
  solana:         'SOLUSDT',
  binancecoin:    'BNBUSDT',
  ripple:         'XRPUSDT',
  dogecoin:       'DOGEUSDT',
  cardano:        'ADAUSDT',
  'avalanche-2':  'AVAXUSDT',
  polkadot:       'DOTUSDT',
  chainlink:      'LINKUSDT',
  'matic-network':'MATICUSDT',
  litecoin:       'LTCUSDT',
  uniswap:        'UNIUSDT',
  cosmos:         'ATOMUSDT',
  near:           'NEARUSDT',
};

export function useLivePrice(coin: Coin | undefined) {
  const livePrices = useCryptoStore((s) => s.livePrices);
  const wsConnected = useCryptoStore((s) => s.wsConnected);

  return useMemo(() => {
    if (!coin) return { price: 0, change: 0, changePercent: 0, isLive: false };

    const wsSymbol = ID_TO_WS[coin.id];
    const live     = wsSymbol ? livePrices[wsSymbol] : null;

    if (live && wsConnected) {
      return {
        price:         live.price,
        change:        live.change,
        changePercent: live.changePercent,
        isLive:        true,
      };
    }

    // Fallback to REST data
    return {
      price:         coin.current_price,
      change:        coin.price_change_24h,
      changePercent: coin.price_change_percentage_24h,
      isLive:        false,
    };
  }, [coin, livePrices, wsConnected]);
}
