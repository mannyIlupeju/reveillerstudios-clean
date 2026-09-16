'use client'

import React, { useState, useEffect, useRef } from 'react'
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

// Tailwind's default `xl` breakpoint. This component only centers itself
// vertically in the viewport at xl and up, matching the sidebar layout the
// shop pages switch to at that width; below it, it renders as a plain
// in-flow row (see the lg:/xl: classes below) with no special positioning.
const XL_BREAKPOINT = 1280;

// Keeps the list from ever sitting flush against the top of its column
// (i.e. right under the nav) -- pushes the whole centered/clamped range
// down by this much, so there's always at least this much breathing room
// below the nav even when scrolled all the way to the top of the shop.
const TOP_GAP_PX = 32; // 2rem

const ProductCategories: React.FC<ProductCategoriesProps> = ({ collections }) => {
  const [reversedTitle, setReversedTitle] = useState<string | null>(null);
  const [hoveredID, setHoveredID] = useState<string | null>(null);
  const [intervalID, setIntervalID] = useState<NodeJS.Timeout | null>(null);

  // Manually computed "sticky, but centered" position. This used to be
  // done with CSS (position: sticky, then position: fixed), but both had
  // real problems: sticky's percentage-based `top` resolves against the
  // containing block in ways that differ between Safari and Chrome inside
  // a flex layout, and `position: fixed` isn't scoped to this section at
  // all -- it kept floating over the footer once the product grid ended.
  // Computing a plain pixel offset ourselves, clamped to this container's
  // own height, sidesteps both: it behaves identically in every browser,
  // and it can never render past the bottom of the container it lives in.
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [topOffset, setTopOffset] = useState<number | null>(null);

  useEffect(() => {
    function updatePosition() {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      if (window.innerWidth < XL_BREAKPOINT) {
        // Below xl the category list renders inline (see the lg:flex
        // class below) -- no absolute positioning at all.
        setTopOffset(null);
        return;
      }

      const rect = container.getBoundingClientRect();
      const contentHeight = content.offsetHeight;
      const desiredViewportTop = window.innerHeight / 2 - contentHeight / 2;
      // Clamp to [TOP_GAP_PX, container height - content height] so the
      // list always keeps a bit of breathing room below the nav, and can
      // never spill past the container's bottom into the footer.
      const maxOffset = Math.max(TOP_GAP_PX, container.offsetHeight - contentHeight);
      const offset = Math.min(Math.max(desiredViewportTop - rect.top, TOP_GAP_PX), maxOffset);

      setTopOffset(offset);
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [collections]);

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
    <div ref={containerRef} className="hidden lg:block relative h-full">
      <div
        ref={contentRef}
        className="lg:flex xl:flex-col justify-center lg:gap-2"
        style={topOffset !== null ? { position: 'absolute', top: topOffset, left: 0 } : undefined}
      >
        {collections.map((item) => {
          const { id, title, handle } = item;

          return (
            <Link
              key={id}
              href={`/shop/collections/${handle}`}
              className="orange-hover w-fit p-2 rounded-lg xl:text-sm text-xs hover:text-zinc-900 text-zinc-800"
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
    </div>
  );
};

export default ProductCategories;
