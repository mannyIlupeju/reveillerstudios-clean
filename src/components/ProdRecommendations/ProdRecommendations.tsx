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
            <div
              className="grid gap-6 w-full max-w-[900px]"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              {recommendations.map((item: any, index: number) => (
                <div className="flex flex-col" key={item.id || index}>
                  <div className="w-full p-4 flex justify-center">
                    {item.featuredImage?.url ? (
                      <Link href={`/shop/allProducts/${item.handle}`}>
                        <Image
                          src={item.featuredImage.url}
                          alt={item.featuredImage.altText || 'Product'}
                          width={160}
                          height={240}
                          className="object-contain rounded-md w-40 aspect-[2/3]"
                        />
                      </Link>
                    ) : (
                      <div className="w-[400px] h-[200px] bg-gray-300 animate-pulse rounded-md" />
                    )}
                  </div>

                  {/* Text Skeletons */}
                  <div className="flex flex-col mx-auto align-bottom space-y-2">
                    {item.title ? (
                      <h3 className="text-lg xs:text-sm">{item.title}</h3>
                    ) : (
                      <div className="h-6 bg-gray-300 rounded w-[150px] animate-pulse" />
                    )}

                    {item.priceRange ? (
                      <p className="text-sm">
                      {formatMoney(Number(item.priceRange.minVariantPrice.amount), currency.code)}
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