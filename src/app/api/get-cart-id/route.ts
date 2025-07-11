import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cartId = (await cookies()).get("cartId")?.value || null;
    return NextResponse.json({cartId});
}