import dbConnect from "@/lib/database/dbConnect"
import podcast from "@/lib/database/models/podcast";
import { NextResponse } from "next/server"

export async function POST(req:Request){
    const {email} = await req.json()
    if(!email) return NextResponse.json({message:"Please Provide All The Fields Required", success:false}, {status:200})
    try {
        await dbConnect();
        const AllPodcast = await podcast.find({email})
        
        if(AllPodcast) return NextResponse.json({message:AllPodcast,success:true},{status:200})
        else return NextResponse.json({message:"Cannot Find The Podcast",success:false}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}