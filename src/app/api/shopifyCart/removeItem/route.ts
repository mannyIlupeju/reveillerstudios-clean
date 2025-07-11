import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("=== REMOVE ITEM API ROUTE ===");

  try {
    const body = await req.json();
    const { cartId, lineId } = body;

    console.log("Received cartId:", cartId);
    console.log("Received lineId:", lineId);

    if (!cartId || !lineId) {
      return NextResponse.json(
        { error: "Missing cartId or lineId" },
        { status: 400 }
      );
    }

    const country = req.headers.get('x-vercel-ip-country') || 'US';

    const query = `
      mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode!) @inContext(country: $country) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            lines(first: 10) {
              edges {
                node {
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
            cost {
              totalAmount { amount currencyCode }
              subtotalAmount { amount currencyCode }
              totalTaxAmount { amount currencyCode }
              totalDutyAmount { amount currencyCode }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC!,
        },
        body: JSON.stringify({
          query,
          variables: {
            cartId,
            lineIds: [lineId],
            country,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Shopify API. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Shopify API response:", data);

    const userErrors = data?.data?.cartLinesRemove?.userErrors;
    if (userErrors?.length > 0) {
      console.warn("Shopify user errors:", userErrors);
      return NextResponse.json(
        { error: "Shopify user error", details: userErrors },
        { status: 400 }
      );
    }

    const cart = data?.data?.cartLinesRemove?.cart;
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found after item removal" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("Unexpected error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
