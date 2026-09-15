import { NextResponse } from 'next/server';
import { detectCountry } from '@/utils/detectCountry/detectCountry';

export async function GET() {
  const country = await detectCountry();
  return NextResponse.json({ country });
}
