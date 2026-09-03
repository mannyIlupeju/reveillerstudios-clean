"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobalContext } from '../../Context/GlobalContext';
import NewsletterFooter from '../NewsletterFooter/Newsletterfooter';
import ScrambleLink from '../ScrambleLink/ScrambleLink';



export default function Footer() {

  const {timeState} = useGlobalContext();
 

  return (
     
        <main>
            <section className="p-8 flex flex-col-reverse lg:flex-row xl:gap-4 gap-10 justify-between text-zinc-100 text-lg  w-screen footer-section">
            <div className="flex flex-col md:flex-row gap-10 mt-4 mb-32">
                <div className="flex flex-col lg:gap-2 h-[250px]">
                    <Image 
                    src='/images/footerlogo.png'
                    unoptimized
                    alt="footer logo"
                    width={100}
                    height={100}
                    priority
                    />

                    <div className="text-sm md:text-xs md:w-[500px] p-2">
                        <span>All Contents of this website are the property of Reveillerstudios.<br></br> No Part of this site, including all text and images may be reproduced in any form without the prior written consent of Reveiller studios.</span>
                        <p>Registered Company in Canada and North America 1001293176 </p>
                        <span className="items-center">© {timeState.currentYear} Reveillerstudios</span>
                    </div>
                        <br></br>
                        <span className="text-xs">Designed and Developed in-house by mannybiz</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-2 xl:gap-5 xl:text-md text-sm">
                    <div className="flex flex-col  gap-2">
                        <ScrambleLink href='/privacy' className="footer-link">About</ScrambleLink>
                        <ScrambleLink href='/privacy' className="footer-link">Privacy policy</ScrambleLink>
                        <ScrambleLink href='/terms' className="footer-link">Terms and Conditions</ScrambleLink>
                    </div> 

                     <div className="flex flex-col xl:gap-5 w-fit gap-2">
                        <ScrambleLink href='/shipping' className="footer-link">Shipping</ScrambleLink>
                        <ScrambleLink href='/contact' className="footer-link">Contact</ScrambleLink>
                    </div>
                        

                    <div className="flex flex-col lg:gap-5 gap-2 mr-8">
                        <p className="xl:w-full">Connect with us!</p>
                        <div>
                            <ul className="flex xl:flex-row gap-2">
                            <li>
                                <ScrambleLink href="https://tiktok.com/@reveillerstudios" external className="footer-link">
                                Tiktok
                                </ScrambleLink>
                            </li>
                            <li>
                                <ScrambleLink href="https://instagram.com/reveillerstudios" external className="footer-link">
                                Instagram
                                </ScrambleLink>
                            </li>
                            <li>
                                <ScrambleLink href='https://youtube.com/@reveillerstudios7473?si=IscpXCCkSra0prU4' external className="footer-link">
                                Youtube
                                </ScrambleLink>
                            </li>
                            </ul>
                        </div>
                    </div>

                </div>
          <NewsletterFooter/>
          </section>
       
        </main>
   
     

  )
}
