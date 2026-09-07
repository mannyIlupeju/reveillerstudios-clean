import React from 'react'
import client from '@/lib/shopify/shopify-client/shopify-client'
import { fetchCategories } from '@/utils/fetchCategories/fetchCategories'
import ProductGrid from '@/app/shop/ProductGrid'
import ProductCategories from '@/app/shop/productCategories'
import { collectionQuery, collectionParamQuery } from '@/lib/shopify/queries/queries';
import NewsletterFooter from '@/components/NewsletterFooter/Newsletterfooter';



export default async function Page({params}: {params: Promise<{ slug: string }> }){
   const {slug} = await params

   
   try {
     const response = await client.request(collectionQuery, {variables: { handle:slug }})
       
     const collection = response.data.collectionByHandle
     

     const collections = collection.products.edges.map((item:any)=> {
      return item
     })

     console.log(collections)
     
     const allCategories = await fetchCategories();

     return (
        <main className="flex xl:flex-row flex-col gap-8 px-4">
          <aside className="xl:sticky block xl:top-52 top-10 z-10 xl:w-48 xl:self-start">
            <ProductCategories collections={allCategories} />
          </aside>
          <section className="flex-1 p-8">
            <ProductGrid items={collections} isProductGrid={true} />
          </section>
        </main>
     )
      

   } catch(error){
    console.error("Error fetching collection:", error)

    // The Shopify store is currently paused, so this fetch always fails --
    // show the same "closed" messaging as /shop instead of a raw error,
    // with a way to sign up for the waitlist.
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
        <div>
          <h1 className="text-xs tracking-widest uppercase mb-4">Shop Closed</h1>
          <p className="text-sm max-w-sm">
            Shop closed, join our waitlist to hear about the next drop.
          </p>
        </div>
        <NewsletterFooter />
      </main>
    )
   }
  
}


export async function generateStaticParams() {
  try {
    const res = await client.request(collectionParamQuery);

    const collections = res?.data?.collections?.edges || [];

    return collections.map((collection: any) => ({
      slug: collection.node.handle,
    }));
  } catch (error) {
    console.error("Error fetching collections data:", error);
    return [];
  }
}