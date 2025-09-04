import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    try {
        const cookieSore = await cookies()
        const cookie = cookieSore.delete("meetingToken")
        if(!cookie) return NextResponse.json({message:"Cannot Delete The Cookie", success:false}, {status:200})
        else return NextResponse.json({message:"Successfully Deleted The Token", success:true}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}