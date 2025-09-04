import dbConnect from "@/lib/database/dbConnect"
import podcast from "@/lib/database/models/podcast"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
export async function POST(req: Request) {
  const { email, title, description, date,isInstant } = await req.json()

  try {
    await dbConnect()

    if (!email || !title || !date) {
      return NextResponse.json(
        { message: "Please Provide All The Details", success: false },
        { status: 200 }
      )
    }

    const Podcast = await podcast.create({
      email,
      title,
      date,
      ...(description && { description })
    })

    if (Podcast) {
      const response = NextResponse.json(
        {
          message: "Successfully Created Podcast",
          success: true,
          username: Podcast.username,
          password: Podcast.password,
          invitationLink: Podcast.invitationLink
        },
        { status: 200 }
      )

      if(isInstant === true){
        const payload = Podcast.toObject();
        const token = jwt.sign(
        {
        email:payload.email,
        username:payload.username,
        password:payload.password,
        invitationLink:payload.invitationLink,
        title:payload.title,
        description:payload.description,
        date:payload.date
        },
          process.env.JWT_SECRET!,
          { expiresIn: '24h' }
        );

        response.cookies.set('meetingToken', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});
return response;
      }

      return response;
    } else {
      return NextResponse.json(
        { message: "Failed To Create Podcast", success: false },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "An Unexpected Error Occurred!" },
      { status: 500 }
    )
  }
}