// components/portfolio/HoldingsTable.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import { useCryptoStore } from '@/store/useCryptoStore';
import { PortfolioHolding } from '@/types';
import { formatPrice, formatCompact, formatPct } from '@/utils/format';
import { Card, Button, SectionHeader } from '@/components/ui/Card';
import clsx from 'clsx';

function HoldingRow({ holding, onRemove }: { holding: PortfolioHolding; onRemove: () => void }) {
  const value  = holding.currentPrice * holding.amount;
  const cost   = holding.buyPrice     * holding.amount;
  const pnl    = value - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  const up     = pnl >= 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="border-b border-white/[0.04] group"
    >
      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          {holding.image ? (
            <Image src={holding.image} alt={holding.name} width={28} height={28} className="rounded-full" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
              {holding.symbol.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm">{holding.name}</p>
            <p className="font-mono text-[10px] text-muted">{holding.symbol}</p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-6 text-right font-mono text-sm">{holding.amount} {holding.symbol}</td>
      <td className="py-4 pr-6 text-right font-mono text-sm">{formatPrice(holding.buyPrice)}</td>
      <td className="py-4 pr-6 text-right font-mono text-sm">
        {holding.currentPrice > 0 ? formatPrice(holding.currentPrice) : '—'}
      </td>
      <td className="py-4 pr-6 text-right font-mono text-sm">{formatCompact(value)}</td>
      <td className="py-4 pr-6 text-right">
        <span className={clsx('font-mono text-sm font-bold', up ? 'text-neon' : 'text-pink')}>
          {up ? '+' : ''}{formatCompact(Math.abs(pnl))}
        </span>
        <br />
        <span className={clsx('font-mono text-xs', up ? 'text-neon/70' : 'text-pink/70')}>
          {formatPct(pnlPct)}
        </span>
      </td>
      <td className="py-4 pr-4">
        <button onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-pink hover:bg-pink/10 transition-all">
          <Trash2 size={13} />
        </button>
      </td>
    </motion.tr>
  );
}

export function HoldingsTable() {
  const { portfolio, addHolding, removeHolding } = useCryptoStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: '', symbol: '', name: '', amount: '', buyPrice: '' });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id || !form.amount || !form.buyPrice) return;
    addHolding({
      id: form.id.toLowerCase(),
      symbol: form.symbol.toUpperCase(),
      name: form.name || form.id,
      image: '',
      amount: parseFloat(form.amount),
      buyPrice: parseFloat(form.buyPrice),
      currentPrice: 0,
    });
    setForm({ id: '', symbol: '', name: '', amount: '', buyPrice: '' });
    setShowForm(false);
  }

  return (
    <Card className="p-5">
      <SectionHeader
        title="Holdings"
        sub={`${portfolio.length} positions`}
        action={
          <Button variant="outline" size="sm" onClick={() => setShowForm(v => !v)}>
            <Plus size={12} /> Add Position
          </Button>
        }
      />

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            {[
              { key: 'id',       placeholder: 'Coin ID (bitcoin)' },
              { key: 'symbol',   placeholder: 'Symbol (BTC)' },
              { key: 'name',     placeholder: 'Name (Bitcoin)' },
              { key: 'amount',   placeholder: 'Amount (0.5)', type: 'number' },
              { key: 'buyPrice', placeholder: 'Buy Price ($)', type: 'number' },
            ].map(f => (
              <input
                key={f.key}
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm font-mono text-text placeholder-muted focus:outline-none focus:border-neon/40 col-span-1"
              />
            ))}
            <div className="col-span-2 md:col-span-5 flex gap-2">
              <Button type="submit" variant="neon" size="sm">Add</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Asset','Amount','Buy Price','Current','Value','P&L',''].map(h => (
                <th key={h} className="pb-3 text-right first:text-left pr-6 first:pl-4 last:pr-4">
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {portfolio.map(h => (
                <HoldingRow key={h.id} holding={h} onRemove={() => removeHolding(h.id)} />
              ))}
            </AnimatePresence>
            {portfolio.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-muted font-mono text-sm">
                  No holdings yet — add your first position above
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
