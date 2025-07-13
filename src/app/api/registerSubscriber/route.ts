import { NextResponse } from 'next/server'
import { z } from 'zod'


// Zod schema for request validation
const requestBodySchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(1, "Full name is required"),
    termsAgreed: z.boolean().refine(val => val === true, {
      message: "You must agree to the terms and conditions"   
    }),
    requestUpdate: z.boolean().optional().default(false)
})  

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);


    // Validate request
    const validated = requestBodySchema.parse(body);
    console.log("Validated data:", validated);  

    // Forward to Express backend
    const response = await fetch('http://localhost:5001/api/rvr/registerSubscriber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validated),
    }); 

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Failed to register subscriber" }, { status: response.status });
    }   
    const data = await response.json();
    console.log("Response from backend:", data);      
    return NextResponse.json({ success: true, data });  
    
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
