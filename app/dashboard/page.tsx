// app/dashboard/page.tsx
import { Metadata } from 'next';
import { GlobalStats }    from '@/components/dashboard/GlobalStats';
import { FeaturedChart }  from '@/components/dashboard/FeaturedChart';
import { MarketTable }    from '@/components/dashboard/MarketTable';
import { TrendingCoins }  from '@/components/dashboard/TrendingCoins';

export const metadata: Metadata = { title: 'Dashboard — NEXUS' };

export default function DashboardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">

      {/* Page heading */}
      <div>
        <h1 className="font-display text-4xl tracking-widest mb-1">Dashboard</h1>
        <p className="text-muted text-sm">Live market overview · updates every 15s via REST + WebSocket</p>
      </div>

      {/* Global stats row */}
      <GlobalStats />

      {/* Featured chart + trending sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <FeaturedChart />
        <TrendingCoins />
      </div>

      {/* Full market table */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-2xl tracking-wider">Markets</h2>
            <p className="text-muted text-sm mt-0.5">Top 20 by market cap</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <MarketTable />
        </div>
      </div>

    </div>
  );
}
