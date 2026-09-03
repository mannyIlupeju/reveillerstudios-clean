'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'motion/react';

// Burst length and tick rate for the scramble effect.
const SCRAMBLE_DURATION = 300; // ms
const SCRAMBLE_SPEED = 12; // ticks per second

interface ScrambleLinkProps {
  href: string;
  children: string;
  className?: string;
  external?: boolean;
  underline?: boolean;
}

export default function ScrambleLink({
  href,
  children: text,
  className = '',
  external = false,
  underline = true,
}: ScrambleLinkProps) {
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Character pool drawn only from the letters already in this link's own
  // text, so the scramble never shows a letter that doesn't belong to it.
  const poolRef = useRef(Array.from(new Set(text.replace(/\s/g, '').split(''))));

  useEffect(() => {
    setDisplayText(text);
    poolRef.current = Array.from(new Set(text.replace(/\s/g, '').split('')));
  }, [text]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (prefersReducedMotion || isScramblingRef.current) return;
    isScramblingRef.current = true;
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      if (Date.now() - start >= SCRAMBLE_DURATION) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        isScramblingRef.current = false;
        return;
      }
      setDisplayText(
        text
          .split('')
          .map((char) =>
            char === ' ' ? ' ' : poolRef.current[Math.floor(Math.random() * poolRef.current.length)]
          )
          .join('')
      );
    }, 1000 / SCRAMBLE_SPEED);
  };

  const content = (
    <span className="group relative inline-block whitespace-pre" onMouseEnter={handleMouseEnter}>
      {displayText}
      {underline && (
        <span
          aria-hidden="true"
          className="absolute left-0 -bottom-0.5 h-[1px] w-full bg-current origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100"
        />
      )}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
