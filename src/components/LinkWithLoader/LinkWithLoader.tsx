'use client';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/Context/context/LoadingContext';
import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function LinkWithLoader({ href, children, className }: Props) {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Delay to allow animation
    setTimeout(() => {
      router.push(href);
    }, 4000); // You can tweak this
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
