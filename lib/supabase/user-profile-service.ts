import { getServerSupabaseClient, getSupabaseClient } from "./supabase-client"
import type { Database } from "@/types/supabase-types"

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"]
export type UserProfileUpdate = Database["public"]["Tables"]["user_profiles"]["Update"]

// Client-side profile service
export const userProfileService = {
  async getCurrentUserProfile() {
    const supabase = getSupabaseClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", user.user.id).single()

    return { data, error }
  },

  async updateProfile(updates: UserProfileUpdate) {
    const supabase = getSupabaseClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.user.id)
      .select()
      .single()

    return { data, error }
  },

  async uploadAvatar(file: File) {
    const supabase = getSupabaseClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user.user) {
      return { data: null, error: new Error("User not authenticated") }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from("user-content").upload(filePath, file, { upsert: true })

    if (uploadError) {
      return { data: null, error: uploadError }
    }

    // Get the public URL
    const { data } = supabase.storage.from("user-content").getPublicUrl(filePath)

    // Update the user profile with the new avatar URL
    const { data: profile, error } = await this.updateProfile({
      avatar_url: data.publicUrl,
    })

    return { data: profile, error }
  },
}

// Server-side profile service
export const serverUserProfileService = {
  async getUserProfileById(userId: string) {
    const supabase = getServerSupabaseClient()

    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    return { data, error }
  },

  async createUserProfile(userId: string, initialData: Partial<UserProfile> = {}) {
    const supabase = getServerSupabaseClient()

    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_notifications: true,
        completed_onboarding: false,
        ...initialData,
      })
      .select()
      .single()

    return { data, error }
  },

  async logSecurityEvent(userId: string, eventType: string, ipAddress: string, userAgent: string, metadata?: any) {
    const supabase = getServerSupabaseClient()

    const { error } = await supabase.from("security_logs").insert({
      user_id: userId,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
      metadata,
    })

    return { error }
  },
}
