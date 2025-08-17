'use client'

import React from 'react'
import Head from 'next/head'
import Loading from '../components/Loading/Loading'
import { useLoading} from '../Context/context/LoadingContext'
import ThreeSketch from '../components/Canvas/ThreeSketch'
import Newsletter from '../components/Newsletter/Newsletter'
import Navigation from '@/components/Navigation/Navigation'
import Footer from '@/components/Footer/Footer'





export default function Home() {
  <Head>
  <title>Home Page - Reveillerstudios</title>
  <meta name="description" content="Welcome to Reveiller Studios, your go-to destination for a blend of hand-made and custom made clothing items and accessories." />
  <meta name="keywords" content="clothing, fashion, punk, Reveiller Studios" />
</Head>

  const {loading, setIsLoading} = useLoading();
 
  return (
    <>
     <Navigation/>
      { !loading ? 
          (<Loading/>)
        :
          ( 
            <main className="flex items-center flex-col relative overflow-x-hidden min-h-200">
            <ThreeSketch/>
            <Newsletter/>
            

            </main>   
           
          )
      }
      <Footer/>
    </>   
   )

}
