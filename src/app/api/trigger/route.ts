import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({message:"Redirecting to website",flag:true},{status:301});
}


