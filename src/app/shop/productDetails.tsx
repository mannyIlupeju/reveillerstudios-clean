'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Slider from 'react-slick';
import dynamic from 'next/dynamic';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PinchZoomImage = dynamic(() => import('../../components/PinchZoomImage/PinchZoomImage'), { ssr: false });

import ProdDetailsConfiguration from './prodDetailsConfig';
import Prodrecommendations from '@/components/ProdRecommendations/ProdRecommendations';
import { useGlobalContext } from '@/Context/GlobalContext';
import { useCurrency } from '../../Context/context/CurrencyContext';

type ImageEdge = { node: { originalSrc: string; altText?: string } };
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

function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;
    const hasTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints ?? 0) > 0;
    setIsTouch(Boolean(coarse || hasTouch));
  }, []);
  return isTouch;
}

const ProductDetails = ({ products, recommendations }: Props) => {
  const { images, descriptionHtml, title, priceRange, variants, collections } = products;
  const { currency } = useCurrency();
  const isTouch = useIsTouch();

  const {
    allLoaded, setAllLoaded,
    loadedImages, setLoadedImages,
    recommendedItems, setRecommendedItems,
  } = useGlobalContext();

  const imageUrl = useMemo(() => images.edges.map((e) => e.node), [images.edges]);

  // Preload to control skeletons
  useEffect(() => {
    if (!imageUrl?.length) return;
    let cancelled = false;
    imageUrl.forEach((item, idx) => {
      const img = new Image();
      img.src = item.originalSrc;
      img.onload = img.onerror = () => {
        if (!cancelled) setLoadedImages((prev: number[]) => (prev.includes(idx) ? prev : [...prev, idx]));
      };
    });
    return () => { cancelled = true; };
  }, [imageUrl, setLoadedImages]);

  useEffect(() => {
    if (imageUrl.length && loadedImages.length >= imageUrl.length) setAllLoaded(true);
  }, [imageUrl.length, loadedImages.length, setAllLoaded]);

  useEffect(() => setRecommendedItems(recommendations), [recommendations, setRecommendedItems]);

  // While zoomed-in on touch, disable slider swipe
  const [canSwipe, setCanSwipe] = useState(true);
  const handleScaleChange = (scale: number) => setCanSwipe(!isTouch || scale === 1);

  const NextArrow = (props: any) => (
    <button aria-label="Next" onClick={props.onClick}
      className="absolute z-10 right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black">
      ▶
    </button>
  );
  const PrevArrow = (props: any) => (
    <button aria-label="Previous" onClick={props.onClick}
      className="absolute z-10 left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black">
      ◀
    </button>
  );

  const settings = useMemo(() => ({
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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipe: canSwipe,
    swipeToSlide: canSwipe,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 2, centerPadding: '4rem', arrows: false, speed: 500, autoplay: true, autoplaySpeed: 5000, cssEase: 'linear' },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1, initialSlide: Math.min(1, imageUrl.length - 1), centerPadding: '0.5rem', arrows: false, speed: 500, autoplay: true, autoplaySpeed: 5000, cssEase: 'linear' },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: '0.5rem', arrows: false, speed: 500, autoplay: true, autoplaySpeed: 5000, cssEase: 'linear' },
      },
    ],
  }), [imageUrl.length, canSwipe]);

  return (
    <main className="overflow-x-hidden mb-24">
      <div className={`relative transition-opacity duration-700 ${allLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <section className="mt-10 slider-container min-h-[200px]">
          <Slider {...settings}>
            {imageUrl.map((item, index) => {
              const isLoaded = loadedImages.includes(index);
              return (
                <div key={index} className="w-fit flex justify-center">
                  {!isLoaded && (
                    <div className="w-full max-w-[500px] aspect-square bg-gray-300 animate-pulse rounded-md" />
                  )}

                  <div className={isLoaded ? 'block' : 'hidden'}>
                    <div className="w-full h-screen aspect-square">
                      <PinchZoomImage
                        src={item.originalSrc}
                        alt={item.altText}
                        isTouch={isTouch}
                        onScaleChange={handleScaleChange}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </section>

        <ProdDetailsConfiguration
          title={title}
          priceRange={priceRange}
          variants={variants}
          descriptionHtml={descriptionHtml}
          collections={collections}
          images={images}
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold my-8">Recommended Products</h2>
        <Prodrecommendations recommendations={recommendedItems} />
      </div>
    </main>
  );
};

export default ProductDetails;
