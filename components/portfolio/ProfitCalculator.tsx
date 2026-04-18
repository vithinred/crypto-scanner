// components/portfolio/ProfitCalculator.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCryptoStore } from '@/store/useCryptoStore';
import { Card, SectionHeader, Button } from '@/components/ui/Card';
import { formatPrice, formatCompact, formatPct } from '@/utils/format';
import { Calculator } from 'lucide-react';
import clsx from 'clsx';

export function ProfitCalculator() {
  const coins = useCryptoStore(s => s.coins);
  const [coinId,    setCoinId]    = useState('bitcoin');
  const [buyPrice,  setBuyPrice]  = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [amount,    setAmount]    = useState('');

  const coin = coins.find(c => c.id === coinId);

  const result = useMemo(() => {
    const bp  = parseFloat(buyPrice)  || 0;
    const sp  = parseFloat(sellPrice) || coin?.current_price || 0;
    const amt = parseFloat(amount)    || 0;
    if (!bp || !sp || !amt) return null;
    const cost  = bp * amt;
    const value = sp * amt;
    const pnl   = value - cost;
    const pct   = (pnl / cost) * 100;
    return { cost, value, pnl, pct, up: pnl >= 0 };
  }, [buyPrice, sellPrice, amount, coin]);

  function useCurrentPrice() {
    if (coin) setSellPrice(coin.current_price.toString());
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-text placeholder-muted focus:outline-none focus:border-neon/40 transition-colors";

  return (
    <Card className="p-5">
      <SectionHeader
        title="P&L Calculator"
        sub="Simulate any trade"
        action={<Calculator size={16} className="text-muted" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Coin select */}
        <div className="sm:col-span-2">
          <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1.5">Coin</label>
          <select
            value={coinId}
            onChange={e => setCoinId(e.target.value)}
            className={inputCls}
          >
            {coins.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#03050a' }}>
                {c.name} ({c.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1.5">Amount</label>
          <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className={inputCls} />
        </div>

        {/* Buy price */}
        <div>
          <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1.5">Buy Price (USD)</label>
          <input type="number" placeholder="0.00" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} className={inputCls} />
        </div>

        {/* Sell price */}
        <div>
          <label className="font-mono text-[10px] text-muted uppercase tracking-widest block mb-1.5">Sell Price (USD)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="0.00" value={sellPrice} onChange={e => setSellPrice(e.target.value)} className={inputCls} />
            <Button variant="ghost" size="sm" onClick={useCurrentPrice} className="shrink-0">Live</Button>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            'mt-5 p-4 rounded-xl border grid grid-cols-2 sm:grid-cols-4 gap-4',
            result.up ? 'border-neon/20 bg-neon/5' : 'border-pink/20 bg-pink/5'
          )}
        >
          {[
            { label: 'Cost Basis',    value: formatCompact(result.cost) },
            { label: 'Exit Value',    value: formatCompact(result.value) },
            { label: 'Profit / Loss', value: (result.up ? '+' : '') + formatCompact(Math.abs(result.pnl)) },
            { label: 'ROI',           value: formatPct(result.pct) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-1">{label}</p>
              <p className={clsx(
                'font-display text-xl tracking-wider',
                (label === 'Profit / Loss' || label === 'ROI')
                  ? result.up ? 'text-neon' : 'text-pink'
                  : 'text-text'
              )}>
                {value}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </Card>
  );
}
