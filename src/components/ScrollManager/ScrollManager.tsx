'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollManager() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ensure we’re on the client before running DOM logic
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (pathname === '/archive') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [pathname, isClient]);

  return null;
}