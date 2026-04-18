// app/portfolio/page.tsx
'use client';

import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { PortfolioSummary } from '@/components/portfolio/PortfolioSummary';
import { HoldingsTable }    from '@/components/portfolio/HoldingsTable';
import { ProfitCalculator } from '@/components/portfolio/ProfitCalculator';

export default function PortfolioPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-4xl tracking-widest mb-1">Portfolio</h1>
        <p className="text-muted text-sm">Track your holdings · live P&amp;L updates</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6">
        {/* Left: summary + pie */}
        <PortfolioSummary />

        {/* Right: holdings table */}
        <div className="space-y-6">
          <HoldingsTable />
          <ProfitCalculator />
        </div>
      </div>
    </div>
  );
}
