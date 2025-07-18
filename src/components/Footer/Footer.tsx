"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobalContext } from '../../Context/GlobalContext';
import NewsletterFooter from '../NewsletterFooter/Newsletterfooter';



export default function Footer() {

  const {timeState} = useGlobalContext();
 

  return (
     
        <div className="flex flex-col-reverse lg:flex-row xl:gap-4 gap-10 justify-between pb-24 text-zinc-100 text-lg p-12 w-screen footer-section ">
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

            <div className="grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 gap-8 w-max mt-4">
                    <div className="flex flex-col xl:gap-5 xl:text-lg text-sm gap-2">
                        <Link href='/privacy'className="footer-link">Privacy policy</Link>
                        <Link href='/terms'className="footer-link">Terms and Condition</Link>
                    </div> 

                     <div className="flex flex-col xl:text-lg text-sm xl:gap-5 gap-2">
                        <Link href='/shipping'className="footer-link">Shipping</Link>
                        <Link href='/contact'className="footer-link ">Contact</Link>
                    </div>
                        

                    <div className="flex flex-col items-center text-md lg:gap-5">
                        <div>
                            <p className="xl:w-full">Connect with us!</p>
                            <ul className="flex justify-center items-center flex-col lg:flex-row gap-2 mt-4">
                            <li >
                                <a href="https://tiktok.com/@reveillerstudios" target="_blank" rel="noopener noreferrer">
                                <Image src="/images/tiktokpng.webp" alt="tiktok logo" width={60} height={60}/>
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com/reveillerstudios" target="_blank" rel="noopener noreferrer ">
                                <Image src="/images/instagramlogo.webp" alt="instagram logo" width={60} height={60}/>
                                </a>
                            </li>
                            <li>
                                <a href='https://youtube.com/@reveillerstudios7473?si=IscpXCCkSra0prU4' target="_blank" rel="noopener noreferrer"   >
                                <Image src="/images/youtube3.png" alt="pinterest logo" width={70} height={60}/>
                                </a>
                            </li>
                            </ul>
                        </div>
                    </div>

                </div>

         

          <NewsletterFooter/>
        </div>
   
     

  )
}
