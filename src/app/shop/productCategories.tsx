'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export type Collection = {
  id: string;
  title: string;
  handle: string;
  updatedAt: string;
};

interface ProductCategoriesProps {
  collections: Collection[];
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ collections }) => {
  const [reversedTitle, setReversedTitle] = useState<string | null>(null);
  const [hoveredID, setHoveredID] = useState<string | null>(null);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

  function handleMouseEnter(e: React.MouseEvent<HTMLAnchorElement>, id: string, title: string) {
    e.preventDefault();
    const element = e.currentTarget;
    const originalText = title;
    element.setAttribute("data-original-text", originalText);

    const idInterval = setInterval(() => {
      setReversedTitle((prev) =>
        prev === originalText ? originalText.split("").reverse().join("") : originalText
      );
    }, 500);

    setHoveredID(id);
    setIntervalID(idInterval);
  }

  const handleMouseLeave = () => {
    if (intervalID) {
      clearInterval(intervalID);
      setIntervalID(null);
    }
    setHoveredID(null);
    setReversedTitle(null);
  };

  if (!collections || collections.length === 0) {
    return <div className="text-sm text-red-500">No categories to display.</div>;
  }

  // ✅ Main render
  return (
    <div className="flex xl:flex-col justify-center lg:gap-2 ">
      {collections.map((item) => {
        const { id, title, handle } = item;

        return (
          <Link
            key={id}
            href={`/shop/collections/${handle}`}
            className="orange-hover w-fit p-2 rounded-lg xl:text-lg text-xs hover:text-zinc-900 text-zinc-800"
            data-original-text={title}
            onMouseEnter={(e) => handleMouseEnter(e, id, title)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleMouseEnter(e as any, id, title)}
            onTouchEnd={handleMouseLeave}
          >
            <span className="font-bold Satoshi-Medium uppercase">
              {hoveredID === id && reversedTitle ? reversedTitle : title}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductCategories;
