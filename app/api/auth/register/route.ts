import dbConnect from "@/lib/database/dbConnect";
import user from "@/lib/database/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/lib/utils/sendVerificationEmail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        {
          message: "Please Provide All The Required Credentials",
          success: false,
        },
        { status: 200 }
      );
    }

    const existingUserEmail = await user.findOne({ email });
    if (existingUserEmail) {
      return NextResponse.json(
        { message: "Email Already Exists", success: false },
        { status: 200 }
      );
    }

    const existingUserUsername = await user.findOne({ username });
    if (existingUserUsername) {
      return NextResponse.json(
        { message: "Username Already Exists", success: false },
        { status: 200 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // ✅ FIXED HERE

    const User = await user.create({
      email: email,
      username: username,
      provider: "credentials",
      password: hashedPassword,
    });

    if (User) {
      await sendVerificationEmail(email, username);
      return NextResponse.json(
        { message: "Successfully Created Account", success: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Error Occurred In Creating The User Object",
          success: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "An Unexpected Error Occurred", success: false },
      { status: 500 }
    );
  }
}
