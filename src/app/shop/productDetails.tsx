'use client';

import React, { useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import dynamic from 'next/dynamic';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Load zoomer only on the client (prevents hydration/SSR issues in sliders)
const InnerImageZoom = dynamic(() => import('react-inner-image-zoom'), { ssr: false });
// Correct CSS import for the package
import 'react-inner-image-zoom/lib/styles.min.css';

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
  alt: string
  collections: any;
  totalInventory: number;
};

type Props = {
  products: Product;
  recommendations: any[];
};

const ProductDetails = ({ products, recommendations }: Props) => {
  const { images, descriptionHtml, title, priceRange, variants, collections } = products;
  const { currency } = useCurrency();

  const {
    allLoaded,
    setAllLoaded,
    loadedImages,
    setLoadedImages,
    recommendedItems,
    setRecommendedItems,
  } = useGlobalContext();

  const imageUrl = useMemo(() => images.edges.map((e) => e.node), [images.edges]);

  // Preload images so your skeleton toggles correctly (replaces onLoadingComplete from <Image/>)
  useEffect(() => {
    if (!imageUrl?.length) return;

    let isCancelled = false;

    imageUrl.forEach((item, idx) => {
      const img = new window.Image();
      img.src = item.originalSrc;
      img.onload = img.onerror = () => {
        if (isCancelled) return;
        setLoadedImages((prev: number[]) => (prev.includes(idx) ? prev : [...prev, idx]));
      };
    });

    return () => {
      isCancelled = true;
    };
  }, [imageUrl, setLoadedImages]);

  // When all images are loaded, fade content in
  useEffect(() => {
    if (imageUrl.length > 0 && loadedImages.length >= imageUrl.length) {
      setAllLoaded(true);
    }
  }, [imageUrl.length, loadedImages.length, setAllLoaded]);

  // Recommendations
  useEffect(() => {
    setRecommendedItems(recommendations);
  }, [recommendations, setRecommendedItems]);

  const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        aria-label="Next"
        onClick={onClick}
        className="absolute z-10 right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
      >
        ▶
      </button>
    );
  };

  const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        aria-label="Previous"
        onClick={onClick}
        className="absolute z-10 left-4 top-1/2 -translate-y-1/2 cursor-pointer bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
      >
        ◀
      </button>
    );
  };

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
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      swipe: true,
      swipeToSlide: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            centerPadding: '4rem',
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'linear',
            arrows: false,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: Math.min(1, imageUrl.length - 1),
            speed: 500,
            autoplay: true,
            centerPadding: '0.5rem',
            autoplaySpeed: 5000,
            cssEase: 'linear',
            arrows: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerPadding: '0.5rem',
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            cssEase: 'linear',
            arrows: false,
          },
        },
      ],
    }),
    [imageUrl.length]
  );

  return (
    <main className="overflow-x-hidden mb-24">
      <div
        className={`relative transition-opacity duration-700 ${
          allLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Image Slider */}
        <section className="mt-10 slider-container min-h-[200px]">
          <Slider {...settings}>
            {imageUrl.map((item, index) => {
              const isLoaded = loadedImages.includes(index);
              return (
                <div key={index} className="w-fit flex justify-center">
                  {/* Skeleton */}
                  {!isLoaded && (
                    <div className="w-[500px] h-screen bg-gray-300 animate-pulse rounded-md" />
                  )}

                  {/* Zoomable image */}
                  <div className={isLoaded ? 'block' : 'hidden'}>
                    {/* Container sizing helps the zoomer layout predictably */}
                    <div className=" aspect-square">
                      <InnerImageZoom
                        src={item.originalSrc}
                        zoomSrc={item.originalSrc} // supply higher-res if available
                        zoomType="hover" // or "click"
                        zoomPreload
                        fullscreenOnMobile
                        className=" object-contain"
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

      {/* Recommended Products */}
      <div className="p-4">
        <h2 className="text-xl font-semibold my-8">Recommended Products</h2>
        <Prodrecommendations recommendations={recommendedItems} />
      </div>
    </main>
  );
};

export default ProductDetails;
