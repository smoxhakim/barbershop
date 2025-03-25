import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.includes("/admin/login")) {
    const token = await getToken({ req: request });
    
    // If no token or token without admin role, redirect to login
    if (!token || token.role !== "admin") {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Protect API routes that should only be accessible to admins
  if (
    pathname.startsWith("/api/") && 
    (pathname.includes("/api/customers") || 
     pathname.includes("/api/blocked-days") || 
     pathname.includes("/api/blocked-slots") ||
     pathname.includes("/api/bookings"))
  ) {
    // Skip protection for GET requests to bookings API (needed for public booking form)
    if (pathname.startsWith("/api/bookings") && request.method === "GET") {
      return NextResponse.next();
    }
    
    const token = await getToken({ req: request });
    
    // If no token or token without admin role, return unauthorized
    if (!token || token.role !== "admin") {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  
  return NextResponse.next();
}

// Configure the paths that should be checked by the middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/customers/:path*",
    "/api/blocked-days/:path*",
    "/api/blocked-slots/:path*",
    "/api/bookings/:path*",
  ],
};
