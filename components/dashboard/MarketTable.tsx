// components/dashboard/MarketTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpDown } from 'lucide-react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { CoinRow } from './CoinRow';
import { Skeleton } from '@/components/ui/Card';
import { Coin } from '@/types';

type SortKey = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'total_volume' | 'market_cap';

export function MarketTable() {
  const { coins, loading } = useCryptoStore();
  const [query,   setQuery]   = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let list = [...coins];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = (a as any)[sortKey] ?? 0;
      const bv = (b as any)[sortKey] ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [coins, query, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const Th = ({ label, sortable, k }: { label: string; sortable?: SortKey; k?: string }) => (
    <th
      className="pb-3 text-right first:text-left cursor-pointer select-none"
      onClick={() => sortable && handleSort(sortable)}
    >
      <span className="flex items-center gap-1 justify-end first:justify-start font-mono text-[10px] text-muted uppercase tracking-widest hover:text-neon transition-colors">
        {label}
        {sortable && <ArrowUpDown size={9} />}
      </span>
    </th>
  );

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search coins…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-neon/40 font-mono transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="pb-3 pl-4 w-10" />
                <Th label="Asset" />
                <Th label="Price"      sortable="current_price" />
                <Th label="1H %"       k="h1" />
                <Th label="24H %"      sortable="price_change_percentage_24h" />
                <Th label="7D %"       k="7d" />
                <Th label="Market Cap" sortable="market_cap" />
                <Th label="Volume"     sortable="total_volume" />
                <Th label="7D Chart"   k="chart" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin, i) => (
                <CoinRow key={coin.id} coin={coin} rank={coin.market_cap_rank} delay={i * 0.03} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted font-mono text-sm">
                    No coins match &ldquo;{query}&rdquo;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
