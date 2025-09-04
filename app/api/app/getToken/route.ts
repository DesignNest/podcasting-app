import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req:Request){
    try {
        const cookieStore = await cookies()
    const token = cookieStore.get('authToken')
    if(token) return NextResponse.json({message:token,success:true},{status:200})
    else return NextResponse.json({message:"No Token Exists!",success:false}, {status:200})  
    } catch (error) {
        console.error(error)
        return NextResponse.json({message:"An Unexpected Error Occurred!"}, {status:500})
    }
  

}