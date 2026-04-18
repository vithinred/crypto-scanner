// utils/format.ts

export function formatPrice(n: number, decimals?: number): string {
  if (n == null || isNaN(n)) return '—';
  if (decimals !== undefined) return '$' + n.toFixed(decimals);
  const d = n >= 1 ? 2 : n >= 0.01 ? 4 : 6;
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function formatCompact(n: number): string {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3)  return '$' + (n / 1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

export function formatPct(n: number, decimals = 2): string {
  if (n == null || isNaN(n)) return '—';
  return (n > 0 ? '+' : '') + n.toFixed(decimals) + '%';
}

export function formatNumber(n: number): string {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export function isPositive(n: number): boolean {
  return n > 0;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// utils/coinMeta.ts
export const COIN_EMOJIS: Record<string, string> = {
  bitcoin:      '₿',
  ethereum:     'Ξ',
  solana:       '◎',
  dogecoin:     'Ð',
  cardano:      '₳',
  ripple:       '✕',
  litecoin:     'Ł',
  'avalanche-2':'🔺',
  chainlink:    '🔗',
  polkadot:     '●',
  'shiba-inu':  '🐕',
  uniswap:      '🦄',
  binancecoin:  'Ⓑ',
  cosmos:       '⚛',
  near:         '◆',
  'matic-network': '⬡',
};

export const COIN_COLORS: Record<string, string> = {
  bitcoin:      '#f7931a',
  ethereum:     '#627eea',
  solana:       '#9945ff',
  dogecoin:     '#c2a633',
  cardano:      '#0033ad',
  ripple:       '#346aa9',
  'avalanche-2':'#e84142',
  chainlink:    '#375bd2',
  polkadot:     '#e6007a',
  'shiba-inu':  '#ff6b35',
  litecoin:     '#bfbbbb',
  binancecoin:  '#f0b90b',
  uniswap:      '#ff007a',
  cosmos:       '#2e3148',
  near:         '#00c08b',
  'matic-network': '#8247e5',
};
