import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizePhone } from '@/utils/normalizePhone';

// 1) Define your schema
const requestBodySchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.preprocess(
    (val) => typeof val === "string" ? normalizePhone(val) : val,
    z.string().regex(/^\+[1-9]\d{7,14}$/, "That doesn't look like a valid phone number").optional().or(z.literal(""))
  ),
  smsConsent: z.boolean().optional().default(false),
  termsAgreed: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  requestUpdate: z.boolean().optional().default(false),
}).refine(data => !data.smsConsent || !!data.phone, {
  message: "Phone number is required to opt into SMS",
  path: ["phone"],
});


export async function POST(request: Request) {
  // Parse and validate request body
  const body = await request.json();
  const validation = requestBodySchema.safeParse(body);
  if (!validation.success) {
    const { fieldErrors, formErrors } = validation.error.flatten();
    // Always return a readable string in `error` — the frontend renders it as-is
    const message = formErrors[0] || Object.values(fieldErrors).flat()[0] || "Invalid input";
    return NextResponse.json({ error: message, fieldErrors, formErrors }, { status: 400 });
  }
  const validated = validation.data;

  // Check for required environment variable
  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    console.error("API_BASE_URL missing");
    return NextResponse.json({ error: "API base URL not configured" }, { status: 500 });
  }

  // Forward validated data to Express backend
  try {
    const res = await fetch(`${apiBase}/api/rvr/registerSubscriber`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error ?? "Failed to register subscriber" }, { status: res.status });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Backend request failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
