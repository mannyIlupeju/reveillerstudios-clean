// app/Providers/RouteChangeReset.tsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/Context/context/LoadingContext';

export default function RouteChangeReset() {
  const pathname = usePathname();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // New route mounted → hide overlay
    setIsLoading(false);
  }, [pathname, setIsLoading]);

  return null;
}
