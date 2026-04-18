// app/api/coins/[id]/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCoinHistory } from '@/services/coingecko';
import { TimeRange } from '@/types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const range = (req.nextUrl.searchParams.get('range') || '24H') as TimeRange;
  try {
    const data = await getCoinHistory(params.id, range);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
