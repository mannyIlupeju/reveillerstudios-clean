import React from 'react';
import ProductDetails from '../../productDetails';
import client from '../../../../lib/shopify/shopify-client/shopify-client';
import { paramQuery, productQuery } from '@/lib/shopify/queries/queries';
import { getProductRecommendations } from '../../prodRecommendations';
import { cookies, headers } from 'next/headers';

type PageProps = {
  params: Promise<{ slug: string }>;
};

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



