import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: Request) {
  const token = await getToken({ req: request as any })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname === "/admin/login"

  // If user is on login page and is already authenticated
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return null
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuth && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return null
}

export const config = {
  matcher: ["/admin/:path*"]
}