'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCurrency } from '../../Context/context/CurrencyContext';
import { formatMoney } from '../../utils/formatMoney';

type Item = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml?: string;
  images: {
    edges: Array<{
      node: {
        originalSrc: string;
        altText: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        availableForSale: boolean;
        quantityAvailable: number;
      };
    }>;
  };
  createdAt: string;
};

type ProductNode = {
  node: Item;
};

type Props = {
  items: ProductNode[];
  isProductGrid?: boolean;
};

export default function ProductGrid({ items, isProductGrid = true }: Props) {
  const { currency } = useCurrency();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const sortedProducts = useMemo(() => {
    return items
      .map(({ node }) => ({
        ...node,
        totalQuantity: node.variants.edges.reduce(
          (sum, variant) => sum + (variant.node.quantityAvailable || 0),
          0
        ),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA === dateB
          ? b.totalQuantity - a.totalQuantity
          : dateB - dateA;
      });
  }, [items]);

  const handleMouseEnter = (id: string) => setHoveredId(id);
  const handleMouseLeave = () => setHoveredId(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-x-12 gap-y-12 ps-8">
      {sortedProducts.map((item) => {
        const id = item.id?.match(/\d+/g)?.join('') || item.id;
        const isAvailable = item.variants.edges[0]?.node.availableForSale;
        const isHovered = hoveredId === id;
        const primaryImage = item.images.edges[0]?.node.originalSrc;
        const hoverImage = item.images.edges[1]?.node.originalSrc;

        return (
          <Link href={`/shop/allProducts/${item.handle}`} key={id}>
            <div
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseEnter(id)}
              onTouchEnd={handleMouseLeave}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  // Prevent navigation on first tap, show hover instead
                  if (!isHovered) {
                    e.preventDefault();
                    setHoveredId(id);
                  } else {
                    setHoveredId(null);
                  }
                }
              }}
              className="relative w-full aspect-[2/3]"
            >
              {primaryImage && (
                <Image
                  src={isHovered && hoverImage ? hoverImage : primaryImage}
                  alt={item.title}
                  fill
                  className={`transform transition hover:scale-105 optimized ${
                    !isAvailable ? 'opacity-50' : ''
                  }`}
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              {!isAvailable && (
                <div className="absolute bg-black bg-opacity-50 text-white flex items-center justify-center text-xl font-semibold inset-0">
                  Sold Out
                </div>
              )}
            </div>

            <div className="text-center xl:text-lg text-xs font-satoshi flex flex-col justify-center gap-2 font-light -mt-4 productTitleBox w-full p-2">
              <h1>{item.title}</h1>
              <span>
                {currency.code} {formatMoney(
                  Number(item.priceRange.minVariantPrice.amount),
                  currency.code
                )}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
