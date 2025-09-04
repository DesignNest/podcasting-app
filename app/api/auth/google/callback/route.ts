import dbConnect from "@/lib/database/dbConnect";
import user from "@/lib/database/models/user";
import { JwtType } from "@/types/JwtTypes";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code)
    return NextResponse.json({ message: "Code Not Found" }, { status: 400 });

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
  const JWT_SECRET = process.env.JWT_SECRET!;

  await dbConnect();

  try {
    // Step 1: Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Token response:", tokenData);
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    // Step 2: Get Google user profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const profile = await profileRes.json();
    const { email, name, picture } = profile;

    if (!email) {
      return NextResponse.json(
        { error: "No email found in Google profile" },
        { status: 400 }
      );
    }

    let existingUser = await user.findOne({ email });

    if (existingUser) {
      let updated = false;

      if (!existingUser.emailVerified) {
        existingUser.emailVerified = true;
        updated = true;
      }

      if (existingUser.provider !== "google") {
        existingUser.provider = "google";
        updated = true;
      }

      if (updated) await existingUser.save();

      const payload: JwtType = {
        email: email,
        emailVerified: true,
        username: name,
        provider: "google",
        profilePhotoColor: existingUser.profilePhotoColor,
        dateCreated: existingUser.dateCreated,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      const response = NextResponse.redirect(new URL("/dashboard", req.url));
      response.cookies.set("authToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    } else {
      const newUser = await user.create({
        email: email,
        username: name,
        emailVerified: true,
        provider: "google",
      });

      const payload: JwtType = {
        email: email,
        emailVerified: true,
        username: name,
        provider: "google",
        profilePhotoColor: newUser.profilePhotoColor,
        dateCreated: newUser.dateCreated,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

      const response = NextResponse.redirect(new URL("/dashboard", req.url));
      response.cookies.set("authToken", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An Unexpected Error Occurred!" },
      { status: 500 }
    );
  }
}
