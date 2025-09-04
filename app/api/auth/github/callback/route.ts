import dbConnect from "@/lib/database/dbConnect";
import user from "@/lib/database/models/user";
import { JwtType } from "@/types/JwtTypes";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
export async function GET(req:NextRequest){
    const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code not found' }, { status: 400 });
  }

  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI!;
  
  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    console.log(tokenData)
    if (!accessToken) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
    }

    // Get user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userProfile = await userRes.json();

    // Get verified emails
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emails = await emailRes.json();

    const primaryEmail =
      emails.find((email: any) => email.primary && email.verified)?.email ||
      emails.find((email: any) => email.verified)?.email;

    if (!primaryEmail) {
      console.log('GitHub email list:', emails);
      return NextResponse.json({ error: 'No verified email found' }, { status: 400 });
    }

    const { login, avatar_url } = userProfile;
    await dbConnect()
    const User = await user.findOne({email:primaryEmail})

    if(User){
        let updated = false
        const payload : JwtType = {
            email:primaryEmail,
            emailVerified:true,
            profilePhotoColor:User.profilePhotoColor,
            username:login,
            dateCreated:User.dateCreated,
            provider:"github"
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})

        if(!User.emailVerified){
User.emailVerified = true
updated = true
        }
        if(User.provider !== "github"){
User.provider = "github"
updated=true
        }
if(updated){
    await User.save()
}
        const response = NextResponse.redirect(new URL('/dashboard', req.url))
        response.cookies.set("authToken",token,{
            sameSite:"lax",
            httpOnly:true,
            maxAge:60*60*24*7,
            path:'/',
            secure:process.env.NODE_ENV == "production"
        })
        return response;
    }
    else{
        const newUser = await user.create({
            email:primaryEmail,
            username:login,
            emailVerified:true,
            provider:"github"
        })

        const payload : JwtType = {
             email:primaryEmail,
            emailVerified:true,
            profilePhotoColor:newUser.profilePhotoColor,
            username:login,
            dateCreated:newUser.dateCreated,
            provider:"github"
        }
         const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})

          const response = NextResponse.redirect(new URL('/dashboard', req.url))
        response.cookies.set("authToken",token,{
            sameSite:"lax",
            httpOnly:true,
            maxAge:60*60*24*7,
            path:'/',
            secure:process.env.NODE_ENV == "production"
        })
        return response;
    }
  }catch(error){
    console.error(error)
    return NextResponse.json({message:"An Unexpected Error Occurred!"},{status:500})
  }

}