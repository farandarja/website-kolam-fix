import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminSessionValue } from "@/lib/admin-auth";

// Middleware ini pakai modul "crypto" bawaan Node.js (lewat admin-auth.ts),
// jadi WAJIB dijalankan di runtime Node.js, bukan Edge (default Next.js).
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Halaman login & API login/logout tidak perlu dilindungi (kalau dilindungi
  // ya pengguna tidak akan pernah bisa login sama sekali).
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const isLoggedIn = isValidAdminSessionValue(sessionCookie);

  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
