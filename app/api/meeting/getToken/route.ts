import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(req:Request){
    try {
       const cookieStore = await cookies()
       const cookie = cookieStore.get('meetingToken');
       return NextResponse.json({message:cookie,success:true}, {status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
}