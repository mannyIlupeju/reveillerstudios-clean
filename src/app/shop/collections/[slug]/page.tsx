import React from 'react'
import type { Metadata } from 'next'
import humanizeString from 'humanize-string'
import client from '@/lib/shopify/shopify-client/shopify-client'
import { fetchCategories } from '@/utils/fetchCategories/fetchCategories'
import ProductGrid from '@/app/shop/ProductGrid'
import ProductCategories from '@/app/shop/productCategories'
import { collectionQuery, collectionParamQuery } from '@/lib/shopify/queries/queries';
import Waitlist from '@/components/Waitlist/Waitlist';
import { isShopOpen } from '@/utils/shopStatus/shopStatus';

// The root layout reads headers() for country detection, which makes
// every route dynamic. Without this, Next tries to statically optimize
// this route for on-demand params (every slug, since generateStaticParams
// below always returns [] while Shopify is unreachable) and crashes with
// a DYNAMIC_SERVER_USAGE error instead of just rendering per request.
export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ slug: string }> };

// Every collection previously shared the site's generic root title/description
// in search results since this route had no metadata of its own. While the
// shop is closed there's no live collection data to pull from, so this falls
// back to a readable title derived from the slug instead of skipping metadata
// entirely.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = humanizeString(slug);
  const canonical = `https://www.reveillerstudios.com/shop/collections/${slug}`;

  if (!isShopOpen) {
    return {
      title: fallbackTitle,
      description: `Shop the ${fallbackTitle} collection from Reveiller Studios.`,
      alternates: { canonical },
    };
  }

  try {
    const response = await client.request(collectionQuery, { variables: { handle: slug } });
    const title = response?.data?.collectionByHandle?.title || fallbackTitle;

    return {
      title,
      description: `Shop the ${title} collection from Reveiller Studios.`,
      alternates: { canonical },
    };
  } catch (error) {
    console.error('Error fetching collection metadata:', error);
    return {
      title: fallbackTitle,
      description: `Shop the ${fallbackTitle} collection from Reveiller Studios.`,
      alternates: { canonical },
    };
  }
}

export default async function Page({params}: PageProps){
   const {slug} = await params

   // Skip the Shopify call entirely while the store is paused, same as
   // /shop -- it would just fail into the catch block below anyway.
   if (!isShopOpen) {
     return <Waitlist />
   }

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