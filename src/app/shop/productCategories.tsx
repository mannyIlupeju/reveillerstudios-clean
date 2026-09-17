'use client'

import React from 'react'
import ScrambleLink from '@/components/ScrambleLink/ScrambleLink'

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
  if (!collections || collections.length === 0) {
    return <div className="text-sm text-red-500">No categories to display.</div>;
  }

  // Plain CSS position: sticky, centered with `top-[50vh]` + `-translate-y-1/2`.
  // This used to bounce between position: sticky and a hand-rolled JS
  // version (measuring scroll position and setting an absolute `top` via
  // React state) to fix a couple of real bugs -- but the JS version traded
  // those for a new one: driving position from React state on every scroll
  // event lags a frame or two behind the browser's own scroll compositing,
  // which is exactly what reads as "springy". Plain CSS sticky has no such
  // lag since the browser positions it natively with no render round-trip.
  //
  // The two earlier sticky attempts failed for different, specific reasons
  // that don't apply here: `top: 50%` resolved as a percentage of this
  // flex item's containing block, which is ambiguous/inconsistent -- using
  // `50vh` (a viewport length, not a percentage) sidesteps that. And the
  // "bleeds into the footer" bug only happened after switching to
  // `position: fixed`, which isn't scoped to any container; sticky is
  // scoped to its own parent by definition, so it can't reproduce that.
  // The parent `<aside>` (see shop/page.tsx) stretches to the full height
  // of the product grid via the default flex `align-items: stretch`,
  // giving this room to travel and actually center at different scroll
  // depths instead of being stuck near the top immediately.
  return (
    <div className="hidden lg:block h-full">
      <div className="xl:sticky xl:top-[50vh] xl:-translate-y-1/2 mt-8 lg:flex xl:flex-col justify-center lg:gap-2">
        {collections.map((item) => {
          const { id, title, handle } = item;

          return (
            <ScrambleLink
              key={id}
              href={`/shop/collections/${handle}`}
              className="orange-hover w-fit p-2 rounded-lg xl:text-sm text-xs hover:text-zinc-900 text-zinc-800 font-bold Satoshi-Medium uppercase"
              underline={false}
            >
              {title}
            </ScrambleLink>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCategories;
