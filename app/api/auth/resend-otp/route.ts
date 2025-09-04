import dbConnect from "@/lib/database/dbConnect";
import { setOtpInCache } from "@/lib/utils/otpCache";
import { sendOtpToEmail } from "@/lib/utils/sendOtp";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
export async function POST(req:Request){
    const { email } = req.json()
    try {
        await dbConnect();
        if(!email) return NextResponse.json({message:"Please Provide All The Fields", success:false}, {status:200})

                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const payload = {
                    email:email,
                    verificationCode:otp
                }
                
                const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'})
                await setOtpInCache(email,otp)
                await sendOtpToEmail(email,otp)
                   const response = NextResponse.redirect(new URL(`/verify?email=${email}`, req.url));
                    response.cookies.delete('otpToken')
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
       return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500}) 
    }
}