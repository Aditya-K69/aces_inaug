import { redirectFlag } from "../trigger/route";

export function GET() {
  return Response.json({ shouldRedirect: redirectFlag });
}
