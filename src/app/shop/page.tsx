// app/shop/page.tsx

import React from 'react';
import Head from 'next/head';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { fetchProducts } from '../../utils/fetchProducts/fetchProducts';
import { fetchCategories } from '../../utils/fetchCategories/fetchCategories';
import ProductGrid from './ProductGrid';
import ProductCategories from './productCategories';

// 1️⃣ Force per-request SSR
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop",
  description: "Explore and shop the latest products from Reveiller Studios.",
  alternates: { canonical: "/shop" }, // resolves against metadataBase
  robots: { index: true, follow: true },
  openGraph: {
    title: "Shop",
    description: "Explore our latest drops and best-sellers.",
    url: "/shop",
  },
  twitter: {
    title: "Shop",
    description: "Explore our latest drops and best-sellers.",
  },
};




const Page = async () => {
  // 2️⃣ Detect country from cookie or header

  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieCountry = cookieStore.get('user-country')?.value;
  const headerCountry = headerStore.get('x-vercel-ip-country');
  const country = cookieCountry === 'CA' || headerCountry === 'CA' ? 'CA' : 'US';

  // 3️⃣ Pass country into your fetch helpers
  const products = await fetchProducts(country);
  const collections = await fetchCategories();


    const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p: any, idx: number) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://www.reveillerstudios.com/product/${encodeURIComponent(p.handle)}`,
      name: p.title,
    })),
  };

  // Optional: Breadcrumbs
  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.reveillerstudios.com/" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://www.reveillerstudios.com/shop" },
    ],
  };

  return (
    <>
    <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD string is safe
        dangerouslySetInnerHTML={{ __html: JSON.stringify([itemListJsonLd, breadcrumbsJsonLd]) }}
      />
      <main className="flex xl:flex-row flex-col gap-8 px-4">
        <h1 className="sr-only">Shop</h1>
        <aside className="xl:sticky block xl:top-52 top-10 z-10 xl:w-48 xl:self-start">
          <ProductCategories collections={collections} />
        </aside>

        <section className="flex justify-center flex-1 p-8">
          <ProductGrid items={products} isProductGrid={false} />
        </section>
      </main>
    </>
  );
};

export default Page;