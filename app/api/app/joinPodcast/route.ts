import dbConnect from "@/lib/database/dbConnect"
import podcast from "@/lib/database/models/podcast";
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
export async function POST(req:Request){
    const {username,password} = await req.json()
    if(!username||!password) return NextResponse.json({message:"Please Provide All The Required Fields", success:false}, {status:200})
    
    try {
        await dbConnect();
        const Podcast = await podcast.findOne({username:username,password:password})
        if(Podcast) {
            

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

const response = NextResponse.json({ message: "Successfully Logged In!", success: true }, { status: 200 });
response.cookies.set('meetingToken', token, {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
});
return response;
        }
        else return NextResponse.json({message:"Invalid Username/Password",success:false}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}