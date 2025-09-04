import { NextResponse } from "next/server";

export async function GET() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
  const SCOPE = "email profile";

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=${SCOPE}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(url);
}
