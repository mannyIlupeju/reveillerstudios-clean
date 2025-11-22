import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const correctPassword = process.env.SITE_PASSWORD || 'your-password-here';

  if (!password || password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Cookie marks the user as “unlocked”
  res.cookies.set("site_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  return res;
}
