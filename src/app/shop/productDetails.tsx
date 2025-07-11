'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import ProdDetailsConfiguration from './prodDetailsConfig'
import Image from 'next/image'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { useCurrency } from '../../Context/context/CurrencyContext'
import { formatMoney } from '../../utils/formatMoney'


const ProductDetails = ({ products, recommendations }: any) => {
  
  const { images, descriptionHtml, title, priceRange, variants, collections, totalInventory } = products
  const {currency } = useCurrency();


  const imageUrl = images.edges.map((item: any) => item.node)
  const [loadedImages, setLoadedImages] = useState<number[]>([])
  const [allLoaded, setAllLoaded] = useState(false)

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => {
      const updated = [...prev, index]
      if (updated.length === imageUrl.length) {
        setAllLoaded(true)
      }
      return updated
    })
  }

  const NextArrow = (props: any) => {
    const { onClick } = props
    return (
      <div
        onClick={onClick}
        className="absolute z-10 right-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
      >
        ▶
      </div>
    )
  }
  
  const PrevArrow = (props: any) => {
    const { onClick } = props
    return (
      <div
        onClick={onClick}
        className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-black/50 text-white p-2 rounded-full hover:bg-black transition"
      >
        ◀
      </div>
    )
  }

  const settings = {
    className: "center",
    centerMode: true,
    centerPadding: "1rem",
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000, // 5s pause between slides
    cssEase: "linear",
    nextArrow: <NextArrow />, // Will be hidden on mobile
    prevArrow: <PrevArrow />, // Will be hidden on mobile
    swipe: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          centerPadding: "25rem",
          speed: 500,
          autoplay: true,
          autoplaySpeed: 5000,
          cssEase: "linear",
          arrows: false, // Hide arrows on tablet/mobile
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 2,
          initialSlide: Math.min(2, imageUrl.length - 1),
          speed: 500,
          autoplay: true,
          centerPadding: "1px",
          autoplaySpeed: 5000,
          cssEase: "linear",
          arrows: false, // Hide arrows on mobile
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "1px",
          speed: 500,
          autoplay: true,
          autoplaySpeed: 5000,
          cssEase: "linear",
          arrows: false, // Hide arrows on mobile
        },
      },
    ],
  }

  return (
    <main className="overflow-x-hidden mb-24">
      <div className={`relative transition-opacity duration-700 ${allLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Image Slider */}
        <main className="mt-10 slider-container min-h-[200px]">
          <Slider {...settings}>
            {imageUrl.map((item: any, index: number) => (
             <div key={index} className="w-fit flex justify-center">
             {!loadedImages.includes(index) && (
               <div className="w-[600px] h-fit bg-gray-300 animate-pulse rounded-md flex " />
             )}
             <Image
               src={item.originalSrc}
               alt={item.altText || 'Product image'}
               width={500}
               height={500}
               className={`${!loadedImages.includes(index) ? 'hidden' : ''}`}
               onLoadingComplete={() => handleImageLoad(index)}
             />
           </div>
            ))}
          </Slider>
        </main>

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
      <section className={`p-3 ml-2 xl:mt-4 mt-24 transition-opacity duration-700 ${allLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {recommendations?.length > 0 && (
          <section className="px-4">
            <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-fit">
              {recommendations.map((item: any, index: number) => (
                <div className="flex flex-col" key={item.id || index}>
                  <div className="w-fit p-4 items-end">
                    {item.featuredImage?.url ? (
                      <Link href={`/shop/allProducts/${item.handle}`}>
                        <Image
                          src={item.featuredImage.url}
                          alt={item.featuredImage.altText || 'Product'}
                          width={200}
                          height={200}
                        />
                      </Link>
                    ) : (
                      <div className="w-[200px] h-[200px] bg-gray-300 animate-pulse rounded-md" />
                    )}
                  </div>

                  {/* Text Skeletons */}
                  <div className="flex flex-col mx-auto align-bottom space-y-2">
                    {item.title ? (
                      <h3 className="text-lg">{item.title}</h3>
                    ) : (
                      <div className="h-6 bg-gray-300 rounded w-[150px] animate-pulse" />
                    )}

                    {item.priceRange ? (
                      <p>
                      {currency.code} {formatMoney(Number(item.priceRange.minVariantPrice.amount), currency.code)}
                      </p>
                    ) : (
                      <div className="h-5 bg-gray-300 rounded w-[100px] animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default ProductDetails
