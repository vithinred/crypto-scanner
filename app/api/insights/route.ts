// app/api/insights/route.ts
import { NextResponse } from 'next/server';
import { getMarkets } from '@/services/coingecko';
import { generateInsights } from '@/services/aiEngine';

export async function GET() {
  try {
    const coins = await getMarkets(1, 10, true);
    const insights = generateInsights(coins);
    return NextResponse.json(insights);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
