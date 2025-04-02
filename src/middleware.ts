import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isEqual } from "radash";

const apiRoutes = ["/api/ai/"];

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: "/api/:path*",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with any of the API routes
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}
