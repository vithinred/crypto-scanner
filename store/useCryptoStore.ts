// store/useCryptoStore.ts
'use client';

import { create } from 'zustand';
import { Coin, LivePrice, PortfolioHolding, AIInsight, TimeRange } from '@/types';

interface CryptoStore {
  // Market data
  coins: Coin[];
  trending: Coin[];
  livePrices: Record<string, LivePrice>;
  wsConnected: boolean;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Selected state
  selectedCoin: string;
  timeRange: TimeRange;

  // Portfolio
  portfolio: PortfolioHolding[];

  // AI
  insights: AIInsight[];

  // Actions
  setCoins: (coins: Coin[]) => void;
  setTrending: (coins: Coin[]) => void;
  updateLivePrice: (symbol: string, price: LivePrice) => void;
  setWsConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCoin: (id: string) => void;
  setTimeRange: (range: TimeRange) => void;
  setInsights: (insights: AIInsight[]) => void;

  // Portfolio actions
  addHolding: (holding: PortfolioHolding) => void;
  removeHolding: (id: string) => void;
  updateHolding: (id: string, updates: Partial<PortfolioHolding>) => void;
  updatePortfolioPrices: (prices: Record<string, number>) => void;
}

export const useCryptoStore = create<CryptoStore>((set, get) => ({
  coins: [],
  trending: [],
  livePrices: {},
  wsConnected: false,
  loading: true,
  error: null,
  lastUpdated: null,
  selectedCoin: 'bitcoin',
  timeRange: '24H',
  portfolio: [
    // Sample portfolio to showcase the feature
    { id: 'bitcoin',  symbol: 'BTC', name: 'Bitcoin',  image: '', amount: 0.5,  buyPrice: 58000, currentPrice: 0 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', image: '', amount: 4,    buyPrice: 3100,  currentPrice: 0 },
    { id: 'solana',   symbol: 'SOL', name: 'Solana',   image: '', amount: 20,   buyPrice: 140,   currentPrice: 0 },
  ],
  insights: [],

  setCoins: (coins) => set({ coins, lastUpdated: new Date() }),
  setTrending: (trending) => set({ trending }),
  updateLivePrice: (symbol, price) =>
    set((state) => ({ livePrices: { ...state.livePrices, [symbol]: price } })),
  setWsConnected: (wsConnected) => set({ wsConnected }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCoin: (selectedCoin) => set({ selectedCoin }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setInsights: (insights) => set({ insights }),

  addHolding: (holding) =>
    set((state) => ({ portfolio: [...state.portfolio, holding] })),
  removeHolding: (id) =>
    set((state) => ({ portfolio: state.portfolio.filter((h) => h.id !== id) })),
  updateHolding: (id, updates) =>
    set((state) => ({
      portfolio: state.portfolio.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    })),
  updatePortfolioPrices: (prices) =>
    set((state) => ({
      portfolio: state.portfolio.map((h) => ({
        ...h,
        currentPrice: prices[h.id] ?? h.currentPrice,
      })),
    })),
}));
