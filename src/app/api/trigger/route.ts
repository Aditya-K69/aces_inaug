let redirectFlag = false; 

export function GET() {
  redirectFlag = true;
  return new Response("Redirect triggered", { status: 200 });
}

export { redirectFlag };
