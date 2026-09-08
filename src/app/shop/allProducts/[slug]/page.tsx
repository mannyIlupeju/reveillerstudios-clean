import React from 'react';
import type { Metadata } from 'next';
import humanizeString from 'humanize-string';
import ProductDetails from '../../productDetails';
import client from '../../../../lib/shopify/shopify-client/shopify-client';
import { paramQuery, productQuery } from '@/lib/shopify/queries/queries';
import { getProductRecommendations } from '../../prodRecommendations';
import { cookies, headers } from 'next/headers';
import { isShopOpen } from '@/utils/shopStatus/shopStatus';

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Strips HTML tags from Shopify's descriptionHtml and trims it to a
// search-result-friendly length for the meta description.
function toPlainDescription(html: string | undefined, fallback: string): string {
  const text = (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return fallback;
  return text.length > 155 ? `${text.slice(0, 152)}...` : text;
}

// Every product previously shared the site's generic root title/description
// in search results since this route had no metadata of its own. While the
// shop is closed there's no live product data to pull from, so this falls
// back to a readable title derived from the slug instead of skipping
// metadata entirely.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = humanizeString(slug);
  const canonical = `https://www.reveillerstudios.com/shop/allProducts/${slug}`;
  const fallbackDescription = `Shop ${fallbackTitle} from Reveiller Studios.`;

  if (!isShopOpen) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical },
    };
  }

  try {
    const response = await client.request(productQuery, { variables: { handle: slug, country: 'US' } });
    const product = response?.data?.productByHandle;
    const title = product?.title || fallbackTitle;

    return {
      title,
      description: toPlainDescription(product?.descriptionHtml, `Shop ${title} from Reveiller Studios.`),
      alternates: { canonical },
    };
  } catch (error) {
    console.error('Error fetching product metadata:', error);
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      alternates: { canonical },
    };
  }
}



// Define the Page Component
export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;

  try {
    // Fetch product data using the slug
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    const cookie = cookieStore.get('user-country')?.value;
    const headerCountry = headerStore.get('x-vercel-ip-country');

    const country = (cookie === 'CA' || headerCountry === 'CA') ? 'CA' : 'US';
   

    const response = await client.request(productQuery, { variables: { handle: slug, country } });
    const product = response?.data?.productByHandle;

    if (!product) {
      return <h1>Product not found</h1>;
    }

    const recommendations = await getProductRecommendations(product.id, country);

    return (
      <ProductDetails products={product} recommendations={recommendations} />
    );
  } catch (error) {
    // console.error("Error fetching product data:", error);
    return <h1>Error loading product</h1>;
  }
}

// Generate Static Params for Dynamic Routes
export async function generateStaticParams() {
  try {
    const res = await client.request(paramQuery);
    const collections = res?.data?.collections?.edges || [];
    const products = res?.data?.products?.edges || [];

    return products.map((p: any) => ({ slug: p.node.handle }));
  } catch (error) {
    // console.error("Error generating static params:", error);
    return []; // Return empty array to prevent build failure
  }

}

export const dynamic = 'force-dynamic';



