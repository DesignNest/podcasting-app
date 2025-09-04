import dbConnect from "@/lib/database/dbConnect";
import podcast from "@/lib/database/models/podcast";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    if (!link) {
      return NextResponse.json({ message: "Missing link parameter" }, { status: 400 });
    }

    const findPodcast = await podcast.findOne({ invitationLink: link });

    if (!findPodcast) {
      return NextResponse.json({ message: "Cannot Find Podcast!" }, { status: 404 });
    }

    const payload = {
      email: findPodcast.email,
      username: findPodcast.username,
      invitationLink: findPodcast.invitationLink,
      title: findPodcast.title,
      description: findPodcast.description,
      date: findPodcast.date,
      password:findPodcast.password
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

   const response = NextResponse.redirect(new URL("/setupMeeting", req.url));
    response.cookies.set("meetingToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GET /podcast error:", error);
    return NextResponse.json({ message: "An Unexpected Error Occurred!" }, { status: 500 });
  }
}