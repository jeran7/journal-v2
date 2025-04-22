import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

export type UserProfile = {
  id: string
  created_at: string
  updated_at: string
  full_name: string | null
  avatar_url: string | null
  trading_experience: string | null
  preferred_markets: string[] | null
  preferred_timeframes: string[] | null
  risk_tolerance: number | null
  default_position_size: number | null
  theme_preference: string | null
  layout_settings: any | null
  bio: string | null
  trading_style: string | null
  achievements: any | null
  email_notifications: boolean
  completed_onboarding: boolean
}

// Client-side service (for use in client components)
class UserProfileService {
  async getCurrentUserProfile() {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: new Error("Not authenticated") }
    }

    return await supabase.from("user_profiles").select("*").eq("id", user.id).single()
  }

  async getUserProfileById(userId: string) {
    const supabase = createClientComponentClient<Database>()
    return await supabase.from("user_profiles").select("*").eq("id", userId).single()
  }

  async uploadAvatar(file: File) {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: new Error("Not authenticated") }
    }

    const timestamp = Date.now()
    const filePath = `avatars/${user.id}/${timestamp}-${file.name}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
      return { data: null, error: uploadError }
    }

    const avatar_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`

    const { error: updateError } = await supabase.from("user_profiles").update({ avatar_url }).eq("id", user.id)

    if (updateError) {
      console.error("Error updating profile with avatar URL:", updateError)
      return { data: null, error: updateError }
    }

    return { data: { avatar_url }, error: null }
  }

  async updateProfile(profileData: Partial<UserProfile>) {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: new Error("Not authenticated") }
    }

    return await supabase.from("user_profiles").update(profileData).eq("id", user.id).select().single()
  }

  async createUserProfile(userId: string, profileData: any) {
    const supabase = createClientComponentClient<Database>()
    return await supabase
      .from("user_profiles")
      .insert([{ id: userId, ...profileData }])
      .select()
      .single()
  }

  async logSecurityEvent(userId: string, eventType: string, ipAddress: string, userAgent: string) {
    const supabase = createClientComponentClient<Database>()
    return await supabase.from("security_logs").insert([
      {
        user_id: userId,
        event_type: eventType,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    ])
  }

  async getUserId(): Promise<string | null> {
    const supabase = createClientComponentClient<Database>()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id || null
  }
}

// Server-side service (for use in server components and API routes)
class ServerUserProfileService {
  async getUserProfileById(userId: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    return await supabase.from("user_profiles").select("*").eq("id", userId).single()
  }

  async updateUserProfile(userId: string, profileData: any) {
    const supabase = createServerComponentClient<Database>({ cookies })
    return await supabase.from("user_profiles").update(profileData).eq("id", userId)
  }

  async createUserProfile(userId: string, profileData: any) {
    const supabase = createServerComponentClient<Database>({ cookies })
    return await supabase.from("user_profiles").insert([{ id: userId, ...profileData }])
  }

  async logSecurityEvent(userId: string, eventType: string, ipAddress: string, userAgent: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    return await supabase.from("security_logs").insert([
      {
        user_id: userId,
        event_type: eventType,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    ])
  }
}

// Create instances
export const userProfileService = new UserProfileService()
export const serverUserProfileService = new ServerUserProfileService()
