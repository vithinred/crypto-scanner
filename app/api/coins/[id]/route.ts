// app/api/coins/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCoinDetail } from '@/services/coingecko';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await getCoinDetail(params.id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Coin not found' }, { status: 404 });
  }
}
