'use client';

import { useEffect, useState, type ReactNode } from 'react';

type PreloaderGateProps = {
  children: ReactNode;
  splash: ReactNode;
  duration?: number;        // ms
  onlyFirstVisit?: boolean; // per-tab skip after first show
  withFade?: boolean;       // optional nice fade-out
  bgClass?: string;         // background and text class, e.g. "bg-black text-white"
};

const FADE_DURATION = 300; // match CSS transition for fade

export default function PreloaderGate({
  children,
  splash,
  duration = 2000,
  onlyFirstVisit = true,
  withFade = true,
  bgClass = 'bg-black text-white',
}: PreloaderGateProps) {
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

   useEffect(() => {
    // Wait until hydration to avoid SSR mismatches
    setHydrated(true);

    // Only show splash if not seen and onlyFirstVisit is true
    const hasSeen = onlyFirstVisit && sessionStorage.getItem('rvr:seenPreloader');
    if (hasSeen) {
      setVisible(false);
      return;
    }

    setVisible(true); // Now it's okay to show the splash

    const timeout = setTimeout(() => {
      if (withFade) {
        setHiding(true);
        const fadeTimeout = setTimeout(() => {
          setVisible(false);
          if (onlyFirstVisit) sessionStorage.setItem('rvr:seenPreloader', '1');
        }, FADE_DURATION);
        return () => clearTimeout(fadeTimeout);
      } else {
        setVisible(false);
        if (onlyFirstVisit) sessionStorage.setItem('rvr:seenPreloader', '1');
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration, onlyFirstVisit, withFade]);

  if (!hydrated) return null;

  return (
    <>
      {children}
      {visible && (
        <div
          className={`fixed inset-0 z-[9999] grid place-items-center transition-opacity 
            ${bgClass} ${hiding ? 'opacity-0' : 'opacity-100'}`}
          style={{ transitionDuration: `${FADE_DURATION}ms` }}
          aria-busy="true"
          aria-live="polite"
          
        >
          {splash}
        </div>
      )}
    </>
  );
}
