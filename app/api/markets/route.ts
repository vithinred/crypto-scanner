// app/api/markets/route.ts
import { NextResponse } from 'next/server';
import { getMarkets } from '@/services/coingecko';

export const runtime = 'nodejs';
export const revalidate = 15; // ISR 15s

export async function GET() {
  try {
    const data = await getMarkets(1, 20, true);
    return NextResponse.json(data);
  } catch (err) {
    console.error('[API /markets]', err);
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 });
  }
}
