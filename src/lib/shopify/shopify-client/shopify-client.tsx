import { createStorefrontApiClient} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_DOMAIN || '1725d5-a3.myshopify.com',
  apiVersion: process.env.SHOPIFY_API_VERSION || '2025-04',
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC || undefined,
});

export default client