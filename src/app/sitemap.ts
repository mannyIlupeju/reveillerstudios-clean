import { fetchCategories } from "@/utils/fetchCategories/fetchCategories";

const BASE_URL = 'https://www.reveillerstudios.com';

// Every real, indexable static route on the site. Previously the sitemap
// only ever listed the homepage plus whatever Shopify collections it
// could fetch live -- and since the store is currently paused, that
// fetch returns nothing, leaving effectively just one URL for search
// engines to discover. None of the marketing pages below were listed.
const STATIC_ROUTES = [
    '',
    '/about',
    '/gallery',
    '/shop',
    '/shop/collections',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
    '/shipping',
];

export default async function sitemap() {
    const collections = await fetchCategories();

    const staticEntries = STATIC_ROUTES.map((route) => ({
        url: `${BASE_URL}${route}`,
    }));

    const productCollections = collections.map((item) => {
        return {
            url: `${BASE_URL}/shop/collections/${item.handle}`,
        }
    })

    return [...staticEntries, ...productCollections];
}
