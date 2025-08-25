import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/admin-dashboard",
    "/donor-dashboard",
    "/student-dashboard",
  ];

  // Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    // Get token from cookies
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Check role-based access
    if (pathname.startsWith("/admin-dashboard") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/donor-dashboard") && payload.role !== "donor") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (
      pathname.startsWith("/student-dashboard") &&
      payload.role !== "student"
    ) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/donor-dashboard/:path*",
    "/student-dashboard/:path*",
  ],
};
