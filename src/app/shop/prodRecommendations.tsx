import client from '../../lib/shopify/shopify-client/shopify-client'
import { recommendationQuery } from "@/lib/shopify/queries/queries";
import ProductDetails from './productDetails';

type Product = {
    id: string;
    title: string;
    handle: string;
    featuredImage?: {
      url: string;
      altText: string | null;
    } | null;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  };

type ProductRecommendation = {
    id: string
    title: string
    handle: string
    featuredImage: {
      url: string
      altText: string | null
    }
    priceRange: {
      minVariantPrice: {
        amount: string
        currencyCode: string
      }
    }
  }
  
  type ProductRecommendationsResponse = {
    data: {
      productRecommendations: ProductRecommendation[];
    };
  };

type ProductRecommendationIntent = 'RELATED' | 'COMPLEMENTARY' | 'ALTERNATIVE';

type Recommendation2sVariables = {
    productId: string;
    intent?: 'RELATED' | 'COMPLEMENTARY' | 'ALTERNATIVE';
};



export async function getProductRecommendations(productId: string, country: string) {
    try {
      const response  = await client.request(recommendationQuery, {
        variables: {
          productId: `${productId}`,
          intent: 'RELATED',
          country: country, // Pass the country parameter to the query
        },
      });

      console.log(response)
  
      return response.data.productRecommendations.slice(0,4);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }







