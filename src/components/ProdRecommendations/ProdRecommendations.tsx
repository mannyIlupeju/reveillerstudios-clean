import React, {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGlobalContext } from '../../Context/GlobalContext'
import { useCurrency } from '../../Context/context/CurrencyContext'
import { formatMoney } from '../../utils/formatMoney'

function ProdRecommendations({recommendations}:any) {
   const {currency } = useCurrency();

   const {allLoaded, setAllLoaded, loadedImages, setLoadedImages} = useGlobalContext();

   console.log(recommendations)


  return (
     <section className={`p-3 ml-2 xl:mt-4 mt-2 transition-opacity duration-700 ${allLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {recommendations?.length > 0 && (
          <section className="">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-fit">
              {recommendations.map((item: any, index: number) => (
                <div className="flex flex-col" key={item.id || index}>
                  <div className="w-fit p-4 items-end">
                    {item.featuredImage?.url ? (
                      <Link href={`/shop/allProducts/${item.handle}`}>
                        <Image
                          src={item.featuredImage.url}
                          alt={item.featuredImage.altText || 'Product'}
                          width={100}
                          height={100}
                          className="object-contain rounded-md w-fit h-fit aspect-[2/3] flex justify-end"
                        />
                      </Link>
                    ) : (
                      <div className="w-[400px] h-[200px] bg-gray-300 animate-pulse rounded-md" />
                    )}
                  </div>

                  {/* Text Skeletons */}
                  <div className="flex flex-col mx-auto align-bottom space-y-2">
                    {item.title ? (
                      <h3 className="text-xs">{item.title}</h3>
                    ) : (
                      <div className="h-6 bg-gray-300 rounded w-[150px] animate-pulse" />
                    )}

                    {item.priceRange ? (
                      <p className="text-sm">
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
  )
}

export default ProdRecommendations