import { createStorefrontApiClient} from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: '1725d5-a3.myshopify.com',
  apiVersion: '2024-10',
  publicAccessToken: process.env.SHOPIFY_PUBLIC || undefined,
});

export default client