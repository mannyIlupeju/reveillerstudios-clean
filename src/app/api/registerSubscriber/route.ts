import { NextResponse } from 'next/server';
import validator from 'validator';

export async function POST(req: Request) {
  console.log("=== NEXT.JS API ROUTE CALLED ===");

  const body = await req.json();
  const { email } = body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  // Check for allowed providers
  const allowedProviders = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com"
  ];
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain || !allowedProviders.includes(domain)) {
    return NextResponse.json({ error: "Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)" }, { status: 400 });
  }

  try {
    const backendResponse = await fetch('http://localhost:5001/api/rvr/registerSubscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log("Backend response status:", backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    const responseData = contentType?.includes('application/json')
      ? await backendResponse.json()
      : await backendResponse.text();

    if (!backendResponse.ok) {
      console.error("Backend error:", responseData);
      return NextResponse.json(
        { error: `Backend error: ${backendResponse.status}`, details: responseData },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(responseData, { status: 200 });
  } catch (fetchError) {
    console.error("Fetch to backend failed:", fetchError);
    return NextResponse.json(
      { error: 'Failed to reach backend', details: fetchError instanceof Error ? fetchError.message : fetchError },
      { status: 500 }
    );
  }
}