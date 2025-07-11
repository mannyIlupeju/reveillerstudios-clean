import fetch from 'node-fetch'
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const body = await req.json();

    const {cartId} = body;


    try {
        const query = `
            query checkoutURL($cartId: ID!) {
                cart(id: $cartId) {
                    checkoutUrl
                }
            }
        `;

        const response = await fetch(`https://${process.env.SHOPIFY_DOMAIN}/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": `${process.env.SHOPIFY_PUBLIC}`,
            },
            body: JSON.stringify({
                query,
                variables: { cartId },
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()

         if (data.errors) {
            return NextResponse.json(
                { error: data.errors[0].message },
                { status: 400 }
            )
        }

        return NextResponse.json(data)
    } catch(error){
        console.error("Error checking out:", error)
        return NextResponse.json(
            { error: "Failed to checkout" },
            { status: 500 }
        )
    }





}