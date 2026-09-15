// detectCountry.ts
//
// Single source of truth for resolving a visitor's storefront country
// (used for Shopify @inContext pricing/currency). Respects a manual
// override -- the `user-country` cookie CountrySwitchModal sets when a
// visitor switches stores by hand -- over the Vercel IP-geolocation
// header, falling back to 'US' when neither is present.
//
// This must only be imported from Server Components or Route Handlers
// (it uses next/headers, which is unavailable on the client).
import { cookies, headers } from 'next/headers';

export type CountryCode = 'CA' | 'US';

export async function detectCountry(): Promise<CountryCode> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const cookieCountry = cookieStore.get('user-country')?.value;
  const headerCountry = headerStore.get('x-vercel-ip-country');
  return cookieCountry === 'CA' || headerCountry === 'CA' ? 'CA' : 'US';
}
