'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLoading } from '@/Context/context/LoadingContext';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const Loading: React.FC = () => {
  const { loading } = useLoading();
  const containerRef = useRef(null);

  useGSAP(() => {
    if (loading) {
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    } else {
      gsap.to(containerRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [loading]);

  if (!loading) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] grid place-items-center bg-white">
      <Image
        src="/images/footerlogo.png"
        unoptimized
        alt="Loading artwork of Reveillerstudios logo"
        width={1000}
        height={1000}
        className="animate-pulse"
      />
    </div>
  );
};

export default Loading;
