'use client'

import React, {useEffect, useState, ReactNode} from 'react'
import Loading from '../components/Loading/Loading'
import { useLoading} from '../Context/context/LoadingContext'
import ThreeSketch from '../components/Canvas/ThreeSketch'




export default function Home() {
  const {loading, setIsLoading} = useLoading();
  const [isModalOpen, setIsModalOpen] = useState(false)
  



  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000); // show after 5 seconds
  
    return () => clearTimeout(timer);
  }, []);



  return (
    <>

      { !loading ? 
          (<Loading/>)
        :
          ( 
            <main className="flex items-center flex-col relative overflow-x-hidden min-h-200">
            <ThreeSketch/>
            {/* <Newsletter/> */}

            </main>   
           
          )
      }

   
    </>   
   )

}
