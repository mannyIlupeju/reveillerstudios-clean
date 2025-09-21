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
                <div className="flex flex-col lg:gap-2 w-[400px] h-[250px]">
                    <Image 
                    src='/images/footerlogo.png'
                    alt="footer logo"
                    width={250}
                    height={250}
                    priority
                    />

                    <span className="text-sm">All Contents of this website are the property of Reveiller studios.<br></br> No Part of this site, including all text and images may be reproduced in any form without the prior written consent of Reveiller studios</span>
                    <span className="text-sm">Registered Company in Canada and North America 1001293176 </span>
                    <span className="text-sm items-center">© {timeState.currentYear} Reveillerstudios</span>
                    <br></br>
                    <span className="text-xs">Designed and Developed in-house by mannybiz</span>
                </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-3 lg:grid-cols-2 gap-8 w-max mt-4">
                    <div className="flex flex-col xl:gap-5 xl:text-lg text-sm gap-2">
                        <Link href='/privacy'className="footer-link">About</Link>
                        <Link href='/privacy'className="footer-link">Privacy policy</Link>
                        <Link href='/terms'className="footer-link">Terms and Conditions</Link>
                    </div> 

                     <div className="flex flex-col xl:text-lg text-sm xl:gap-5 gap-2">
                        <Link href='/shipping'className="footer-link">Shipping</Link>
                        <Link href='/contact'className="footer-link ">Contact</Link>
                    </div>
                        

                    <div className="flex flex-col text-md lg:gap-5">
                        <p className="xl:w-full">Connect with us!</p>
                        <div>
                            <ul className="flex  xl:flex-row gap-2">
                            <li >
                                <a href="https://tiktok.com/@reveillerstudios" target="_blank" rel="noopener noreferrer">
                                Tiktok
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com/reveillerstudios" target="_blank" rel="noopener noreferrer ">
                                Instagram
                                </a>
                            </li>
                            <li>
                                <a href='https://youtube.com/@reveillerstudios7473?si=IscpXCCkSra0prU4' target="_blank" rel="noopener noreferrer"   >
                                Youtube
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
