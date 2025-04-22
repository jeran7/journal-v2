import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { serverUserProfileService } from "@/lib/supabase/user-profile-service"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase-types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    // Create a new Supabase client for this request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

    // Exchange the code for a session
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && session) {
      // Check if user profile exists, if not create one
      const { data: profile } = await serverUserProfileService.getUserProfileById(session.user.id)

      if (!profile) {
        // Create a new user profile
        const userData = session.user.user_metadata || {}
        await serverUserProfileService.createUserProfile(session.user.id, {
          full_name: userData.full_name || userData.name,
          avatar_url: userData.avatar_url,
        })

        // Log the security event
        await serverUserProfileService.logSecurityEvent(
          session.user.id,
          "account_created",
          request.headers.get("x-forwarded-for") || "unknown",
          request.headers.get("user-agent") || "unknown",
        )

        // Set the session cookie
        const { data: sessionData } = await supabase.auth.setSession(session)

        // Redirect to onboarding
        return NextResponse.redirect(new URL("/onboarding", requestUrl.origin))
      }

      // Log the login event
      await serverUserProfileService.logSecurityEvent(
        session.user.id,
        "login",
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
      )

      // Set the session cookie
      const { data: sessionData } = await supabase.auth.setSession(session)

      // Redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
    }
  }

  // Something went wrong, redirect to login with error
  return NextResponse.redirect(new URL("/auth/login?error=Could not authenticate user", requestUrl.origin))
}
