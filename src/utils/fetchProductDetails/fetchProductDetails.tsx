
import client from '../../lib/shopify/shopify-client/shopify-client';

export async function generateStaticParams() {

   const paramQuery = `
    query {
        products(first:10) {
            edges{
                node{
                    handle
                }
            }
        }
    }
  `
  const response = await client.request(paramQuery)
  console.log(response)
}


export async function getStaticProps({ params }:any) {

    const productQuery = `
        query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
            id
            title
            handle
            vendor
            descriptionHtml
            images(first: 5) {
            edges {
                node {
                originalSrc
                altText
                }
            }
            }
            priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
            }
            variants(first:10) {
            edges {
                node {
                id
                title
                sku
                priceV2 {
                    amount
                    currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                    name
                    value
                }
                }
            }
            }
        }
        }
    `;

  const { slug } = params;

  const allProductsResponse = await client.request(productQuery);
  const allProducts = allProductsResponse.data.products.edges.map((edge:any) => edge.node);



  try {
    const response = await client.request(productQuery, { variables: { handle: slug } });
    if (response.data.productByHandle) {
      return {
        props: {
          product: response.data.productByHandle,
          allProducts
        },
        revalidate: 60 // or as needed
      };
    } 
    return { notFound: true };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}



    



  

