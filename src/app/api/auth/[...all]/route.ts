import { auth, syncFromRemoteRegistry } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  // If attempting to sign in, sync registered users across lambda instances first
  if (request.nextUrl.pathname.includes("sign-in")) {
    try {
      await syncFromRemoteRegistry();
    } catch {
      // ignore
    }
  }
  return handlers.POST(request);
}
