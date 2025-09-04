import dbConnect from "@/lib/database/dbConnect";
import podcast from "@/lib/database/models/podcast";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    const {email,username} = await req.json();
    if(!email||!username) return NextResponse.json({message:"Please Provide All The Required Fields", success:false}, {status:200})
    
    try {
        await dbConnect();
        const Podcast = await podcast.deleteOne({email:email,username:username})

        if(Podcast) return NextResponse.json({message:"Successfully Deleted!", success:true}, {status:200})
        else return NextResponse.json({message:"Unable To Delete", success:true}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}