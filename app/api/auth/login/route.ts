import dbConnect from "@/lib/database/dbConnect"
import user from "@/lib/database/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { sendOtpToEmail } from "@/lib/utils/sendOtp";
import { setOtpInCache } from "@/lib/utils/otpCache";
import sendVerificationEmail from "@/lib/utils/sendVerificationEmail";
export async function POST(req:Request){
    const { email,password } = await req.json()
    try {
        await dbConnect();
        if(!email || !password) return NextResponse.json({message:"Please Provide All The Fields", success:false}, {status:200})
        
        const existingUser = await user.findOne({email})
        if(!existingUser) return NextResponse.json({message:"No Email Found!", success:false}, {status:200})
        
        if(!existingUser.emailVerified) {
            await sendVerificationEmail(email,existingUser.username)
            return NextResponse.json({message:"Email Not Verified", success:false}, {status:200})
        }
            
        
        const hashedPassword = await bcrypt.hash(password,10)
        if(existingUser.password !== hashedPassword) return NextResponse.json({message:"Passwords Dont Match", success:false}, {status:200})
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const payload = {
            email:email,
            verificationCode:otp
        }
        
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
        await setOtpInCache(email,otp)
        await sendOtpToEmail(email,otp)
           const response = NextResponse.redirect(new URL(`/verify?email=${email}`, req.url));
        
            response.cookies.set('otpToken', token, {
              httpOnly: true,
              maxAge: 60 * 60,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              path: '/',
            });
        
            return response;
    } catch (error) {
        
        console.error(error)
        return NextResponse.json({message:"An Unexpected Error Occurred"}, {status:500})
    }
}