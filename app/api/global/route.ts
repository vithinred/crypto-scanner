// app/api/global/route.ts
import { NextResponse } from 'next/server';
import { getGlobalMarket } from '@/services/coingecko';

export async function GET() {
  try {
    const data = await getGlobalMarket();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
