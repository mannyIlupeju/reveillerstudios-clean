'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGlobalContext } from '../../Context/GlobalContext';
import { fetchCategories } from '@/utils/fetchCategories/fetchCategories';

type Category = {
  id: string;
  title: string;
  handle: string;
};

export default function ShopContainer() {
  const { isShopHovered, setIsShopHovered } = useGlobalContext();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categories = await fetchCategories();
        setAllCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCloseMenu = () => setIsShopHovered(false);

  if (loading) {
    return (
      <div className="bottom-[85px] left-1/2 -translate-x-1/2 w-[95%] max-w-md max-h-[20vh] fixed z-30 shadow-lg flex items-center justify-center glassBox">
        <p className="text-sm text-zinc-600">Loading categories...</p>
      </div>
    );
  }

  if (!allCategories.length) {
    return null;
  }

  return (
    <div className="bottom-[85px] left-1/2 -translate-x-1/2 w-[95%] max-w-md max-h-[60vh] fixed z-30 shadow-lg overflow-y-auto overscroll-contain glassBox transition">
      <div className="flex flex-col gap-2 p-4">
        {allCategories.map((item) => {
          const { id, title, handle } = item;

          return (
            <Link
              key={id}
              href={`/shop/collections/${handle}`}
              className="bg-orange w-fit p-2 rounded-lg xl:text-sm text-md uppercase hover:text-zinc-900 text-zinc-800"
              onClick={handleCloseMenu}
            >
              {title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
