import dbConnect from "@/lib/database/dbConnect";
import { getOtpFromCache } from "@/lib/utils/otpCache";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { JwtType } from "@/types/JwtTypes";
import user from "@/lib/database/models/user";
export async function POST(req:Request){
    const {email,otp} = await req.json();
    try {
        await dbConnect();
        if(!email || !otp) return NextResponse.json({message:"Please Provide All The Credentials", success:false}, {status:200})
        const savedOtp = getOtpFromCache(email)

        if(!savedOtp || !savedOtp == otp) return NextResponse.json({message:"Otp Doesn't Match", success:false}, {status:200})
        
        const User = await user.findOne({email})
        const payload:JwtType = {
            email:email,
            username:User.username,
            emailVerified:true,
            provider:"Credentials",
            profilePhotoColor:User.profilePhotoColor,
            dateCreated:User.dateCreated
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn:"7d"})
            const response = NextResponse.redirect(new URL(`/dashboard`, req.url));
        
            response.cookies.set('auth', token, {
              httpOnly: true,
              maxAge: 60 * 60 * 24 * 7,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            });
        
            return response;
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}