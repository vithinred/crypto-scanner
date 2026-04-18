// app/api/trending/route.ts
import { NextResponse } from 'next/server';
import { getTrending } from '@/services/coingecko';

export async function GET() {
  try {
    const data = await getTrending();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
