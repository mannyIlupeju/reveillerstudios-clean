'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Slider from 'react-slick';
import dynamic from 'next/dynamic';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PinchZoomImage = dynamic(
  () => import('@/components/PinchZoomImage/PinchZoomImage'),
  { ssr: false }
);

import ProdDetailsConfiguration from './prodDetailsConfig';
import Prodrecommendations from '@/components/ProdRecommendations/ProdRecommendations';
import { useGlobalContext } from '@/Context/GlobalContext';

type ImageNode = { originalSrc: string; altText?: string };
type ImageEdge = { node: ImageNode };
type Product = {
  images: { edges: ImageEdge[] };
  descriptionHtml: string;
  title: string;
  priceRange: any;
  variants: any;
  collections: any;
  totalInventory: number;
};
type Props = { products: Product; recommendations: any[] };

/** Touch detection hook */
function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches;
    const hasTouch =
      typeof navigator !== 'undefined' && (navigator.maxTouchPoints ?? 0) > 0;
    setIsTouch(Boolean(coarse || hasTouch));
  }, []);
  return isTouch;
}

const ProductDetails = ({ products, recommendations }: Props) => {
  const { images, descriptionHtml, title, priceRange, variants, collections } =
    products;

  const {
    allLoaded,
    setAllLoaded,
    loadedImages,
    setLoadedImages,
    recommendedItems,
    setRecommendedItems,
  } = useGlobalContext();

  const isTouch = useIsTouch();

  // Always resolve to a safe array
  const imageNodes: ImageNode[] = useMemo(
    () => products?.images?.edges?.map((e) => e?.node).filter(Boolean) ?? [],
    [products?.images?.edges]
  );
  const imgCount = imageNodes.length;

  // Preload images → control skeletons
  useEffect(() => {
    if (!imgCount) return;
    let cancelled = false;
    imageNodes.forEach((item, idx) => {
      const img = new Image();
      img.src = item.originalSrc;
      img.onload = img.onerror = () => {
        if (!cancelled) {
          setLoadedImages((prev: number[]) =>
            prev.includes(idx) ? prev : [...prev, idx]
          );
        }
      };
    });
    return () => {
      cancelled = true;
    };
  }, [imgCount, imageNodes, setLoadedImages]);

  // Fade in when all preloaded
  useEffect(() => {
    if (imgCount && loadedImages.length >= imgCount) setAllLoaded(true);
  }, [imgCount, loadedImages.length, setAllLoaded]);

  // Recommendations
  useEffect(() => setRecommendedItems(recommendations), [
    recommendations,
    setRecommendedItems,
  ]);

  // Zoom/swipe coordination
  const [zoomScale, setZoomScale] = useState(1);
  const canSwipe = !isTouch || zoomScale === 1;

  // Slider ref + overlay buttons
  const sliderRef = useRef<Slider | null>(null);
  const goPrev = () => sliderRef.current?.slickPrev();
  const goNext = () => sliderRef.current?.slickNext();
  const onKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  };

  // Slick settings
  const settings = useMemo(
    () => ({
      className: 'center',
      centerMode: true,
      centerPadding: '1rem',
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 5000,
      cssEase: 'linear',
      arrows: false, // we provide custom overlay buttons
      swipe: canSwipe,
      swipeToSlide: canSwipe,
      draggable: canSwipe,
      touchMove: canSwipe,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            centerPadding: '4rem',
            arrows: false,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'linear',
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: Math.min(1, Math.max(0, imgCount - 1)),
            centerPadding: '0.5rem',
            arrows: false,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'linear',
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerPadding: '0.5rem',
            arrows: false,
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'linear',
          },
        },
      ],
    }),
    [imgCount, canSwipe]
  );

  return (
    <main className="overflow-x-hidden mb-24">
      <div
        className={`relative transition-opacity duration-700 ${
          allLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Carousel + Buttons */}
        <section
          className="relative mt-10 slider-container min-h-[200px]"
          tabIndex={0}
          onKeyDown={onKeyNav}
          aria-label="Product image carousel"
        >
          {/* Overlay navigation buttons */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 text-white rounded-full px-3 py-2 hover:bg-black focus:outline-none focus:ring"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/60 text-white rounded-full px-3 py-2 hover:bg-black focus:outline-none focus:ring"
          >
            ▶
          </button>

          <Slider ref={sliderRef} {...settings}>
            {imageNodes.map((item, index) => {
              const isLoaded = loadedImages.includes(index);
              return (
                <div key={index} className="w-fit flex justify-center">
                  {/* Skeleton */}
                  {!isLoaded && (
                    <div className="w-full max-w-[500px] aspect-square bg-gray-300 animate-pulse rounded-md" />
                  )}

                  {/* Image (pinch/zoom aware) */}
                  <div className={isLoaded ? 'block' : 'hidden'}>
                    <div className="w-full max-w-[500px] aspect-square">
                      <PinchZoomImage
                        src={item.originalSrc}
                        alt={item.altText}
                        isTouch={isTouch}
                        onScaleChange={(s) => setZoomScale(s)}
                        touchAction={isTouch && zoomScale > 1 ? 'none' : 'auto'}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>

        {/* Product Configuration */}
        <ProdDetailsConfiguration
          title={title}
          priceRange={priceRange}
          variants={variants}
          descriptionHtml={descriptionHtml}
          collections={collections}
          images={images}
        />
      </div>

      {/* Recommendations */}
      <div className="p-4">
        <h2 className="text-xl font-semibold my-8">Recommended Products</h2>
        <Prodrecommendations recommendations={recommendedItems} />
      </div>
    </main>
  );
};

export default ProductDetails;
