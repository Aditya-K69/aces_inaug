import { setRedirectTrue } from "@/lib/flag";

export async function GET() {
  setRedirectTrue();
  return new Response("Redirect triggered", { status: 200 });
}
