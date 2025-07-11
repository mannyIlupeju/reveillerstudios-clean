// utils/shopifyFetch.ts

const shopifyFetch = async (query: string, variables: Record<string, any> = {}) => {
    const endpoint = `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
  
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': `${process.env.SHOPIFY_PUBLIC}`,
      },
      body: JSON.stringify({ query, variables }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify HTTP error:', errorText);
      throw new Error(`Failed to fetch from Shopify: ${response.status}`);
    }
  
    const json = await response.json();
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }
  
    return json.data;
  };
  
  export default shopifyFetch;