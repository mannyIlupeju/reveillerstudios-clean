// Single source of truth for whether the Shopify-backed shop is live.
//
// The store is currently paused, so every shop-facing page shows a
// "join the waitlist" state instead of hitting Shopify. Once Shopify is
// reactivated, set SHOP_OPEN=true in the environment (e.g. Vercel project
// settings) -- no code changes needed in the pages that import this.
export const isShopOpen = process.env.SHOP_OPEN === 'true';
