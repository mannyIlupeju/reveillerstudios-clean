import client from '../../lib/shopify/shopify-client/shopify-client';


export const fetchCategories = async () => {
  const categoryQuery = `
    query {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            updatedAt
          }
        }
      }
    }`;

  try {
    const res = await client.request(categoryQuery);
    // Extract `collections.edges` from response or response.data
    const payload = (res as any).data ?? res;
    const edges = payload?.collections?.edges;
    console.log('💡 fetched collections.edges:', edges);

    if (!edges || !Array.isArray(edges) || edges.length === 0) {
      console.warn('No collections returned from Shopify:', payload);
      return [];
    }

    return edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('❌ Error fetching categories from Shopify:', error);
    return [];
  }
};



