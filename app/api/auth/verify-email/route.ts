import dbConnect from "@/lib/database/dbConnect";
import user from "@/lib/database/models/user";
import { JwtType } from "@/types/JwtTypes";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth`);
    }


    const existingUser = await user.findOneAndUpdate(
      { email },
      { $set: { emailVerified: true } },
      { new: true }
    );

    if (!existingUser) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth`);
    }

    const tokenPayload: JwtType = {
      email: existingUser.email,
      username: existingUser.username,
      emailVerified: existingUser.emailVerified,
      profilePhotoColor: existingUser.profilePhotoColor,
      provider: existingUser.provider,
      dateCreated: existingUser.dateCreated,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "7d" });

    const response = NextResponse.redirect(new URL('/dashboard', req.url));

    response.cookies.set('authToken', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth`);
  }
}
