// app/portfolio/layout.tsx
import { Navbar } from '@/components/layout/Navbar';
import { AppProvider } from '@/components/layout/AppProvider';

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <Navbar />
      <main className="pt-[104px] min-h-screen relative z-10">
        {children}
      </main>
    </AppProvider>
  );
}
