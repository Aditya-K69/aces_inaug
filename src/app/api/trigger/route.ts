import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

const filePath = "/tmp/trigger.json";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.module === "ESP") {
    await fs.writeFile(filePath, JSON.stringify({ trigger: true }));
    return NextResponse.json({ trigger: true });
  }

  // For any module other than "ESP"
  await fs.writeFile(filePath, JSON.stringify({ trigger: false }));
  return NextResponse.json({ success: false, trigger: false });
}
