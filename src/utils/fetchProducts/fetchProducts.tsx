import client from "../../lib/shopify/shopify-client/shopify-client"

export const fetchProducts = async (country: string = 'US') => {
    const productQuery = `
    query getProducts($country: CountryCode) @inContext(country: $country)  {
        products(first: 30) {
        edges {
            node {
            id
            title
            handle
            options {
                name
                values
            }
            descriptionHtml 
            images(first:6) {
                edges {
                node {
                    originalSrc
                    altText
                }
                }
            }
            createdAt
            variants(first: 10) {
            edges {
              node {
                quantityAvailable
                availableForSale
              }
            }
            }
            priceRange {
                minVariantPrice {
                amount
                currencyCode
                }
            }
            }
        }
        }
    }`

    const {data,errors} = await client.request(productQuery, { variables: { country } })
    
    if (errors){
        console.error("Error fetching data from shopify")
    }

    console.log(data)
    return data?.products.edges
}

