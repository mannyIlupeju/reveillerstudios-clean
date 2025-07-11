'use client'

import React, {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import { useLoading } from '@/Context/context/LoadingContext'
import { gsap } from "gsap"
import { useGSAP } from '@gsap/react'



const Loading:React.FC = () => {
    const {setIsLoading} = useLoading()
    
  return (
    <>
        <div className="mt-20">
            <Image src='/images/footerlogo.png' alt="Loading artwork of Reveillerstudios logo" width={200} height={200} className="translate-y-1/2"/>
        </div>
   </>
 
    )
}

export default Loading;
