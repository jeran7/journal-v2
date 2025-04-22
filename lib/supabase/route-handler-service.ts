import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

// Route handler service (for use in route handlers)
class RouteHandlerUserProfileService {
  async getUserProfileById(userId: string) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    return await supabase.from("user_profiles").select("*").eq("user_id", userId).single()
  }

  async updateUserProfile(userId: string, profileData: any) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    return await supabase.from("user_profiles").update(profileData).eq("user_id", userId)
  }

  async createUserProfile(userId: string, profileData: any) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    return await supabase.from("user_profiles").insert([{ user_id: userId, ...profileData }])
  }

  async logSecurityEvent(userId: string, eventType: string, ipAddress: string, userAgent: string) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    return await supabase.from("security_events").insert([
      {
        user_id: userId,
        event_type: eventType,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    ])
  }
}

// Create instance
export const routeHandlerUserProfileService = new RouteHandlerUserProfileService()
