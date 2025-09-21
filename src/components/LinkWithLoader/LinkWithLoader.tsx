'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLoading } from '@/Context/context/LoadingContext';

gsap.registerPlugin(useGSAP);

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function LinkWithLoader({ href, children, className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, setIsLoading } = useLoading();

  const elRef = React.useRef<HTMLAnchorElement>(null);

  // Animate only the visual part (opacity)
  useGSAP(
    () => {
      if (!elRef.current) return;
      gsap.to(elRef.current, {
        opacity: loading ? 0.5 : 1,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      // Directly set pointer-events based on loading
      gsap.set(elRef.current, { pointerEvents: loading ? 'none' : 'auto' });
    },
    { dependencies: [loading], scope: elRef }
  );

  // CRITICAL: reset loading when the route changes
  React.useEffect(() => {
    setIsLoading(prev => (prev ? false: prev));
  }, [pathname, setIsLoading]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (href === pathname) {
    // No navigation → don’t enter loading
     return;
    }

    setIsLoading(true);

    setTimeout(() => {
      router.push(href);
    }, 400); // shorter feels snappier; avoid 4000ms
  };

  return (
    <a ref={elRef} href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}