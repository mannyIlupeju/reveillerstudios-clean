'use client';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/Context/context/LoadingContext';
import React from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';


type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function LinkWithLoader({ href, children, className }: Props) {
  const router = useRouter();
  const { setIsLoading, loading } = useLoading();

  const gsapRef = React.useRef<HTMLAnchorElement | null>(null);
  useGSAP(() => {

    gsap.to(gsapRef.current, {
      opacity: loading ? 0.5 : 1,
      pointerEvents: loading ? 'none' : 'auto',
    });
  }, [loading])

  const handleClick = (e: React.MouseEvent) => {
    setIsLoading(true);
    console.log("loading started...")
    e.preventDefault();

   


    // Delay to allow animation
    setTimeout(() => {
      router.push(href);
      console.log("loading finished...")
      console.log("navigated to ", href)
    }, 4000); // You can tweak this


     

  };



  return (
    <a ref={gsapRef}href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
