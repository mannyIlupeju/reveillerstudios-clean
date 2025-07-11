"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobalContext } from '@/Context/GlobalContext'
import NewsletterFooter from '../NewsletterFooter/NewsletterFooter'



export default function Footer() {

  const {timeState} = useGlobalContext();
 

  return (
     
        <div className="flex flex-col-reverse lg:flex-row justify-around lg:gap-[10vw] pb-24 text-zinc-100 text-lg p-8 w-screen footer-section ">
            <div className="flex flex-col md:flex-row gap-10 mt-4">
                <div className="flex flex-col lg:gap-2 w-[250px] h-[250px]">
                    <Image 
                    src='/images/footerlogo.png'
                    alt="footer logo"
                    width={250}
                    height={250}
                    />

                    <span className="text-sm items-center">© {timeState.currentYear} Reveillerstudios</span>
                    <span className="text-xs">Designed and Developed in-house by machnmb</span>
                </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 gap-5 w-max text-sm mt-4">
                    <div className="flex flex-col xl:gap-5 gap-2">
                        <Link href='/contact'className="footer-link">About</Link>
                        <Link href=''className="footer-link">Privacy policy</Link>
                    </div>
                    <div className="flex flex-col gap-5">
                        <Link href=''className="footer-link">Shipping</Link>
                        <Link href=''className="footer-link xl:w-32">Delivery & Returns</Link>
                    </div>
                        

                    <div className="flex flex-col lg:gap-5">
                        <Link href=''className="footer-link ">Contact</Link>

                        <div>
                            <p className="xl:w-32">Connect with us!</p>
                            <ul className="flex gap-2 mt-4">
                            <li>
                                <Image src="/images/tiktokpng.webp" alt="tiktok logo" width={60} height={60}/>
                            </li>
                            <li>
                                <Image src="/images/instagramlogo.webp" alt="instagram logo" width={60} height={60}/>
                            </li>
                            <li>
                                <Image src="/images/pinterestlogo.png" alt="pinterest logo" width={60} height={60}/>
                            </li>
                            </ul>
                        </div>
                    </div>

                </div>

         

          <NewsletterFooter/>
        </div>
   
     

  )
}
