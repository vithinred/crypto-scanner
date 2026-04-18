// services/binanceWS.ts

import { WebSocketTrade, LivePrice } from '@/types';

const WS_BASE = 'wss://stream.binance.com:9443/ws';

// Symbols to track (Binance format)
const TRACKED_SYMBOLS = [
  'btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt',
  'dogeusdt', 'adausdt', 'avaxusdt', 'dotusdt', 'linkusdt',
  'maticusdt', 'ltcusdt', 'uniusdt', 'atomusdt', 'nearusdt',
];

// Map Binance symbol → CoinGecko id
export const SYMBOL_TO_ID: Record<string, string> = {
  BTCUSDT:   'bitcoin',
  ETHUSDT:   'ethereum',
  SOLUSDT:   'solana',
  BNBUSDT:   'binancecoin',
  XRPUSDT:   'ripple',
  DOGEUSDT:  'dogecoin',
  ADAUSDT:   'cardano',
  AVAXUSDT:  'avalanche-2',
  DOTUSDT:   'polkadot',
  LINKUSDT:  'chainlink',
  MATICUSDT: 'matic-network',
  LTCUSDT:   'litecoin',
  UNIUSDT:   'uniswap',
  ATOMUSDT:  'cosmos',
  NEARUSDT:  'near',
};

type PriceCallback = (symbol: string, data: LivePrice) => void;

export class BinanceWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private shouldReconnect = true;
  private onPriceUpdate: PriceCallback;
  private onConnect: () => void;
  private onDisconnect: () => void;
  private prevPrices: Record<string, number> = {};
  private prevVolumes: Record<string, number> = {};

  constructor(callbacks: {
    onPriceUpdate: PriceCallback;
    onConnect: () => void;
    onDisconnect: () => void;
  }) {
    this.onPriceUpdate    = callbacks.onPriceUpdate;
    this.onConnect        = callbacks.onConnect;
    this.onDisconnect     = callbacks.onDisconnect;
  }

  connect() {
    if (typeof window === 'undefined') return; // SSR guard

    // Use combined stream for all symbols
    const streams = TRACKED_SYMBOLS.map(s => `${s}@trade`).join('/');
    const url = `${WS_BASE}/${streams}`;

    try {
      this.ws = new WebSocket(url);
      this.setupHandlers();
    } catch (err) {
      console.error('[WS] Connection failed:', err);
      this.scheduleReconnect();
    }
  }

  private setupHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('[WS] Connected to Binance');
      this.reconnectDelay = 1000; // reset backoff
      this.onConnect();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const raw = JSON.parse(event.data);
        // Combined stream wraps in { stream, data }
        const trade: WebSocketTrade = raw.data ?? raw;
        this.handleTrade(trade);
      } catch (e) {
        // ignore parse errors
      }
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error:', err);
    };

    this.ws.onclose = (event) => {
      console.log('[WS] Disconnected', event.code);
      this.onDisconnect();
      if (this.shouldReconnect) this.scheduleReconnect();
    };
  }

  private handleTrade(trade: WebSocketTrade) {
    const symbol = trade.s; // e.g. "BTCUSDT"
    const price  = parseFloat(trade.p);
    const volume = parseFloat(trade.q);

    const prev    = this.prevPrices[symbol] ?? price;
    const change  = price - prev;
    const changePct = prev > 0 ? (change / prev) * 100 : 0;

    const livePrice: LivePrice = {
      symbol,
      price,
      change,
      changePercent: changePct,
      volume,
      timestamp: trade.T,
    };

    this.prevPrices[symbol]  = price;
    this.prevVolumes[symbol] = volume;

    this.onPriceUpdate(symbol, livePrice);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = Math.min(this.reconnectDelay, this.maxReconnectDelay);
    console.log(`[WS] Reconnecting in ${delay}ms…`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(delay * 2, this.maxReconnectDelay);
      this.connect();
    }, delay);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
let wsInstance: BinanceWebSocket | null = null;

export function getWSInstance(callbacks: {
  onPriceUpdate: PriceCallback;
  onConnect: () => void;
  onDisconnect: () => void;
}): BinanceWebSocket {
  if (!wsInstance) {
    wsInstance = new BinanceWebSocket(callbacks);
  }
  return wsInstance;
}
