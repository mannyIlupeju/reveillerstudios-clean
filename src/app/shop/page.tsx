//main Shop Page display

import React from 'react'
import type {Metadata} from 'next'
import {fetchProducts} from '../../utils/fetchProducts/fetchProducts'
import { fetchCategories } from '../../utils/fetchCategories/fetchCategories'
import Footer from '@/components/Footer/Footer'
import ProductGrid from './ProductGrid'
import ProductCategories from './productCategories'
import Navigation from '@/components/Navigation/Navigation'






export const metadata: Metadata = {
  title: 'Shop page'
}

const Page = async () => {  
  const products = await fetchProducts();
  const collections = await fetchCategories();
  

  console.log('Collections:', collections);



 
  

  return (
    <main className="flex xl:flex-row flex-col gap-8 px-4">
      <aside className="xl:sticky block xl:top-52 top-10 z-10 xl:w-48 xl:self-start">
        <ProductCategories collections={collections} />
      </aside>
      <section className="flex-1 p-8">
        <ProductGrid items={products} isProductGrid={false} />
      </section>
     
    </main>
  )
}

export const revalidate = 60;

export default Page;