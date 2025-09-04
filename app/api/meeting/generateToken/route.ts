import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
export async function POST(req:Request){
    const { podcast,isVideoOn,isAudioOn,email,profilePhotoColor,name} = await req.json()
    try {
        const payload = {
            podcast,
            isVideoOn,isAudioOn,
            email,
            profilePhotoColor,
            name
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:'24h'})
        return NextResponse.json({message:token,success:true}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }

}