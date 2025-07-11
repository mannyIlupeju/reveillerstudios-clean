import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const country = (await headers()).get('x-vercel-ip-country') || 'US';
  return NextResponse.json({ country });
}