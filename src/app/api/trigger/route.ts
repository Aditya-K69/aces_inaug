import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = "/tmp/trigger.json";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.module === "ESP") {
    await fs.writeFile(filePath, JSON.stringify({ trigger: true }));
    return NextResponse.json({ success: true });
  }

  if (body.module === "PC") {
    try {
      const data = await fs.readFile(filePath, "utf-8");
      const { trigger } = JSON.parse(data);

      if (trigger === true) {
        await fs.writeFile(filePath, JSON.stringify({ trigger: false }));
        return NextResponse.json({ trigger: true });
      }

      return NextResponse.json({ trigger: false });
    } catch {
      return NextResponse.json({ trigger: false });
    }
  }

  return NextResponse.json({ success: false });
}
