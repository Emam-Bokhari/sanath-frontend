import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

  let isTokenValid = false;
  let role: string | null = null;

  if (token && secret) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret),
      );
      isTokenValid = true;
      role = (payload.role as string)?.toUpperCase();
    } catch (err) {
      isTokenValid = false;
    }
  }

  // 1. If not logged in and trying to access dashboard, redirect to login
  if (!isTokenValid) {
    if (
      pathname.startsWith("/agent-dashboard") ||
      pathname.startsWith("/user-dashboard")
    ) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      // Clear the token cookie if it was present but invalid/expired
      if (token) {
        response.cookies.delete("token");
      }
      return response;
    }
  }

  // 2. If logged in and trying to access auth pages, redirect to respective dashboard
  if (isTokenValid && pathname.startsWith("/auth")) {
    if (role === "AGENT") {
      return NextResponse.redirect(
        new URL("/agent-dashboard/overview", request.url),
      );
    }
    if (role === "USER") {
      return NextResponse.redirect(
        new URL("/user-dashboard/profile", request.url),
      );
    }
  }

  // 3. Role-based access control for dashboards
  if (isTokenValid) {
    if (pathname.startsWith("/agent-dashboard") && role !== "AGENT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/user-dashboard") && role !== "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/agent-dashboard/:path*",
    "/user-dashboard/:path*",
    "/auth/:path*",
  ],
};
