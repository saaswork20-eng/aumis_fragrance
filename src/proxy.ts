import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Temporary proxy middleware that allows all requests
  // (Full NextAuth Edge compatibility requires splitting auth.config.ts)
  
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // Allow all for now so the UI can be viewed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
