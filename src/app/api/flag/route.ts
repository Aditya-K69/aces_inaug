import { getRedirectFlag } from "@/lib/flag";

export async function GET() {
  const flag = getRedirectFlag();
  return Response.json({ shouldRedirect: flag });
}
