import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
try {
        const req = await request.json()
        console.log(req)
        
} catch (error) {
        console.log(error)    
}
return(NextResponse.json({message:"Works Probably"}))
}