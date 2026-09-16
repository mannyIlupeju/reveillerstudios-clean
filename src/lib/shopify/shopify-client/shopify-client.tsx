import { createStorefrontApiClient} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_DOMAIN || '1725d5-a3.myshopify.com',
  // '2025-04' previously used here is deprecated (Storefront API client logs a
  // runtime warning on every request); bumped the fallback to a currently
  // supported version. Still overridable via SHOPIFY_API_VERSION.
  apiVersion: process.env.SHOPIFY_API_VERSION || '2026-07',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC || undefined,
});

export default client