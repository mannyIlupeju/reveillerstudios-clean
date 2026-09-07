import React from 'react'
import client from '@/lib/shopify/shopify-client/shopify-client'
import { fetchCategories } from '@/utils/fetchCategories/fetchCategories'
import ProductGrid from '@/app/shop/ProductGrid'
import ProductCategories from '@/app/shop/productCategories'
import { collectionQuery, collectionParamQuery } from '@/lib/shopify/queries/queries';
import Waitlist from '@/components/Waitlist/Waitlist';



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
    // show the shared "shop closed, join the waitlist" state instead of a
    // raw error.
    return <Waitlist />
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