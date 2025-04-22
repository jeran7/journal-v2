import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { routeHandlerUserProfileService } from "@/lib/supabase/route-handler-service"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session) {
      // Check if user profile exists, if not create one
      const { data: profile } = await routeHandlerUserProfileService.getUserProfileById(session.user.id)

      if (!profile) {
        // Create a new user profile
        const userData = session.user.user_metadata || {}
        await routeHandlerUserProfileService.createUserProfile(session.user.id, {
          full_name: userData.full_name || userData.name,
          avatar_url: userData.avatar_url,
        })

        // Log the security event
        await routeHandlerUserProfileService.logSecurityEvent(
          session.user.id,
          "account_created",
          request.headers.get("x-forwarded-for") || "unknown",
          request.headers.get("user-agent") || "unknown",
        )

        // Redirect to onboarding
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin))
      }

      // Log the login event
      await routeHandlerUserProfileService.logSecurityEvent(
        session.user.id,
        "login",
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
      )

      // Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    }
  }

  // Something went wrong, redirect to login with error
  return NextResponse.redirect(new URL("/auth/login?error=Could not authenticate user", requestUrl.origin))
}
