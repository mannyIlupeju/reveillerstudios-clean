import { NextResponse } from "next/server"

export async function POST(req: Request) {
    console.log("=== UPDATE QTY CART ROUTE CALLED ===");

    try {
        const body = await req.json()
        console.log("Request body:", body);

        const { cartId, lineId, quantity } = body;

        // Debug: Log the exact values
        console.log("=== ID DEBUGGING ===");
        console.log("cartId:", cartId);
        console.log("lineId:", lineId);
        console.log("quantity:", quantity);
        console.log("cartId type:", typeof cartId);
        console.log("lineId type:", typeof lineId);
        console.log("cartId length:", cartId?.length);
        console.log("lineId length:", lineId?.length);

        // Debug: Check environment variables
        console.log("=== ENVIRONMENT VARIABLES ===");
        console.log("SHOPIFY_DOMAIN:", process.env.SHOPIFY_DOMAIN ? "Set" : "Missing");
        console.log("SHOPIFY_API_VERSION:", process.env.SHOPIFY_API_VERSION ? "Set" : "Missing");
        console.log("SHOPIFY_PUBLIC:", process.env.NEXT_PUBLIC_SHOPIFY_PUBLIC ? "Set" : "Missing");

        if (!cartId || !lineId || !quantity) {
            console.log('Missing required fields:', { cartId, lineId, quantity });
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        console.log("Making Shopify API request...");
        const query = `
          mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
                cart {
                id
                lines(first: 10) {
                    edges {
                    node {
                        id
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
                    totalAmount {
                    amount
                    currencyCode
                    }
                    subtotalAmount {
                    amount
                    currencyCode
                    }
                    totalTaxAmount {
                    amount
                    currencyCode
                    }
                    totalDutyAmount {
                    amount
                    currencyCode
                    }
                }
                }
            }
          }

         
        `

        const variables = {
            cartId,
            lines: [{
                id: lineId,
                quantity: quantity
            }]
        };

        console.log(variables.lines[0].id)
        console.log("=== SHOPIFY API REQUEST ===");
        console.log("URL:", `https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`);
        console.log("Variables:", JSON.stringify(variables, null, 2));

        const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": `${process.env.SHOPIFY_PUBLIC}`,
            },
            body: JSON.stringify({
                query,
                variables
            }),
        });

        console.log("Shopify response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Shopify API error:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()
        console.log("Shopify response data:", data);

        if (data.errors) {
            console.error("GraphQL errors:", data.errors);
            return NextResponse.json(
                { error: data.errors[0].message },
                { status: 400 }
            )
        }

        console.log("Update successful, returning data");
        return NextResponse.json(data)

    } catch (error) {
        console.error('Error in updateQtyCart:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}