'use client'

import React from 'react'
import Loading from '../components/Loading/Loading'
import { useLoading} from '../Context/context/LoadingContext'
import ThreeSketch from '../components/Canvas/ThreeSketch'
import Newsletter from '../components/Newsletter/Newsletter'




export default function Home() {
  const {loading, setIsLoading} = useLoading();
 
  return (
    <>

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

   
    </>   
   )

}
