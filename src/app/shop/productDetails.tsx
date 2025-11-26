'use client';

import React, {useEffect,useMemo,useRef,useState,KeyboardEvent} from 'react';
import Slider from 'react-slick';
import dynamic from 'next/dynamic';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ProdDetailsConfiguration from './prodDetailsConfig';
import Prodrecommendations from '@/components/ProdRecommendations/ProdRecommendations';
import { useGlobalContext } from '@/Context/GlobalContext';

const PinchZoomImage = dynamic(
  () => import('@/components/PinchZoomImage/PinchZoomImage'),
  { ssr: false }
);

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

type Props = {
  products: Product;
  recommendations: any[];
};

/** Touch detection hook */
function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches;
    const hasTouch =
      typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints ?? 0) > 0;

    setIsTouch(Boolean(coarse || hasTouch));
  }, []);

  return isTouch;
}

const ProductDetails: React.FC<Props> = ({ products, recommendations }) => {
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

  // Safe array of image nodes
  const imageNodes: ImageNode[] = useMemo(() => {
    const edges: ImageEdge[] = products?.images?.edges ?? [];
    return edges.map((e) => e?.node).filter(Boolean) as ImageNode[];
  }, [products?.images?.edges]);

  const imgCount = imageNodes.length;

  // Reset loading state when product/images change
  useEffect(() => {
    setLoadedImages([]);
    setAllLoaded(false);
  }, [imgCount, setLoadedImages, setAllLoaded]);

  // Preload images → control skeletons
  useEffect(() => {
    if (!imgCount) {
      setAllLoaded(true);
      return;
    }

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
  }, [imgCount, imageNodes, setLoadedImages, setAllLoaded]);

  // Fade in when all preloaded
  useEffect(() => {
    if (imgCount && loadedImages.length >= imgCount) {
      setAllLoaded(true);
    }
  }, [imgCount, loadedImages.length, setAllLoaded]);

  // Recommendations
  useEffect(() => {
    setRecommendedItems(recommendations);
  }, [recommendations, setRecommendedItems]);

  const [zoomScale, setZoomScale] = useState<number>(1);
const canSwipe = !isTouch || zoomScale === 1;

// Slider ref + overlay buttons
const sliderRef = useRef<Slider | null>(null);
const goPrev = () => sliderRef.current?.slickPrev();
const goNext = () => sliderRef.current?.slickNext();

const onKeyNav = (e: KeyboardEvent<HTMLElement>) => {
  if (e.key === 'ArrowLeft') goPrev();
  if (e.key === 'ArrowRight') goNext();
};

  const settings = {
  className: "center",
  centerMode: true,
  infinite: true,
  centerPadding: "0",        // Use percentage for better scaling
  dots: true,
  speed: 500,
  slidesToShow: 3,             // Show 1 slide for best centering
  slidesToScroll: 1,
  arrows: false,
  adaptiveHeight: true,        // Changed to true for better responsive behavior
  swipe: canSwipe,
  swipeToSlide: canSwipe,
  touchMove: canSwipe,
  touchThreshold: 5,
  draggable: canSwipe,
 
  responsive: [
    {
      breakpoint: 1920,          // Extra large desktop
      settings: {
        centerPadding: "0px",
        slidesToShow: 3,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 1536,          // 2xl - large desktop
      settings: {
        centerPadding: "20%",
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 1280,          // xl - desktop
      settings: {
        centerPadding: "1rem",
        slidesToShow: 2,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 1024,          // lg - laptop
      settings: {
        centerPadding: "1rem",
        slidesToShow: 2,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 768,           // md - tablet
      settings: {
        centerMode: true,
        centerPadding: "1px",
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 640,           // sm - mobile landscape
      settings: {
        centerMode: true,
        centerPadding: "5%",
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 440,           // xs - mobile portrait
      settings: {
        centerMode: true,
        centerPadding: "20rem",
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    },
    {
      breakpoint: 400,           // xs - mobile portrait
      settings: {
        centerMode: true,
        centerPadding: "0px",
        slidesToShow: 1,
        slidesToScroll: 1,
        swipe: canSwipe,
        touchMove: canSwipe,
      }
    }
  ]
};

  return (
    <main className="overflow-x-hidden">
      <div className="relative transition-opacity duration-700">
        {/* Carousel + Buttons */}
        <section
          className="relative"
          aria-label="Product image carousel"
          onKeyDown={onKeyNav}
          tabIndex={0}
        >
          {/* Overlay navigation buttons */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          >
            <FaAngleLeft size={24} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
          >
            <FaAngleRight size={24} />
          </button>

          {/* Slider Container */}
          <div className=" max-w-[8xl] md:w-full mx-auto px-4">
            <Slider ref={sliderRef} {...settings}>
              {imageNodes.map((item, index) => {
                const alt = item.altText || `Product image ${index + 1}`;

                return (
                  <div key={index} className="px-4">
                    <div className="relative h-[700px] md:h-[500px] lg:h-[700px] flex aspect-[2/3]">
                     <div className="w-full h-full mx-auto px-12">
                      <PinchZoomImage
                        src={item.originalSrc}
                        alt={alt}
                        isTouch={isTouch}
                        onScaleChange={(s: number) => setZoomScale(s)}
                        touchAction={isTouch && zoomScale > 1 ? 'none' : 'auto'}
                        
                        />
                    </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
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
        <h2 className="text-xl font-semibold">You may also like</h2>
        <Prodrecommendations recommendations={recommendedItems} />
      </div>
    </main>
  );
};

export default ProductDetails;