import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase-types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Get the Supabase token from the cookie
  const supabaseToken = req.cookies.get("sb-access-token")?.value
  const supabaseRefreshToken = req.cookies.get("sb-refresh-token")?.value

  let session = null

  // If we have a token, try to get the session
  if (supabaseToken) {
    // Create a new Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    // Set the session
    if (supabaseToken && supabaseRefreshToken) {
      const { data } = await supabase.auth.setSession({
        access_token: supabaseToken,
        refresh_token: supabaseRefreshToken,
      })
      session = data.session
    }
  }

  // Auth routes that don't require authentication
  const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/update-password"]

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/api", "/terms", "/privacy"]

  // Check if the route is public or auth-related
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname === route || pathname.startsWith("/auth/callback"))

  // If user is not signed in and the route requires authentication
  if (!session && !isPublicRoute && !isAuthRoute) {
    const redirectUrl = new URL("/auth/login", req.url)
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access auth routes
  if (session && isAuthRoute && !pathname.startsWith("/auth/callback")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
