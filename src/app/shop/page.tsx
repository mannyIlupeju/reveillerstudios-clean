// app/shop/page.tsx

import React from 'react';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { fetchProducts } from '../../utils/fetchProducts/fetchProducts';
import { fetchCategories } from '../../utils/fetchCategories/fetchCategories';
import Footer from '@/components/Footer/Footer';
import ProductGrid from './ProductGrid';
import ProductCategories from './productCategories';
import Navigation from '@/components/Navigation/Navigation';

export const metadata: Metadata = {
  title: 'Shop page',
};

// 1️⃣ Force per-request SSR
export const dynamic = 'force-dynamic';

const Page = async () => {
  // 2️⃣ Detect country from cookie or header
  const cookieStore = cookies();
  const headerStore = headers();
  const cookieCountry = cookieStore.get('user-country')?.value;
  const headerCountry = headerStore.get('x-vercel-ip-country');
  const country = cookieCountry === 'CA' || headerCountry === 'CA' ? 'CA' : 'US';

  // 3️⃣ Pass country into your fetch helpers
  const products = await fetchProducts(country);
  const collections = await fetchCategories();

  return (
    <>
      <main className="flex xl:flex-row flex-col gap-8 px-4">
        <aside className="xl:sticky block xl:top-52 top-10 z-10 xl:w-48 xl:self-start">
          <ProductCategories collections={collections} />
        </aside>

        <section className="flex-1 p-8">
          <ProductGrid items={products} isProductGrid={false} />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Page;