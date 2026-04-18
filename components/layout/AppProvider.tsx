// components/layout/AppProvider.tsx
'use client';

import { useEffect } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { useWebSocket } from '@/hooks/useWebSocket';

// This component runs the data-fetching hooks globally
// so all pages share the same live data stream.
function DataLayer() {
  useMarketData();
  useWebSocket();
  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DataLayer />
      {children}
    </>
  );
}
