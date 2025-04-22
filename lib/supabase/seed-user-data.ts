import { getServerSupabaseClient } from "./supabase-client"
import { serverUserProfileService } from "./user-profile-service"

export async function seedSampleUserData() {
  const supabase = getServerSupabaseClient()

  // Check if we already have user profiles
  const { data: existingProfiles, error: checkError } = await supabase.from("user_profiles").select("id").limit(1)

  if (checkError) {
    console.error("Error checking for existing profiles:", checkError)
    return { error: checkError }
  }

  // If we already have profiles, don't seed
  if (existingProfiles && existingProfiles.length > 0) {
    console.log("User profiles already exist, skipping seed")
    return { success: true }
  }

  // Create a sample user
  const { data: user, error: createUserError } = await supabase.auth.admin.createUser({
    email: "demo@example.com",
    password: "Password123!",
    email_confirm: true,
    user_metadata: {
      full_name: "Demo User",
    },
  })

  if (createUserError) {
    console.error("Error creating sample user:", createUserError)
    return { error: createUserError }
  }

  // Create user profile
  const { error: profileError } = await serverUserProfileService.createUserProfile(user.user.id, {
    full_name: "Demo User",
    trading_experience: "intermediate",
    trading_style: "swing",
    preferred_markets: ["stocks", "crypto"],
    preferred_timeframes: ["daily", "4h"],
    risk_tolerance: 6,
    default_position_size: 2,
    bio: "I'm a swing trader focusing on momentum stocks and crypto assets.",
    email_notifications: true,
    completed_onboarding: true,
  })

  if (profileError) {
    console.error("Error creating user profile:", profileError)
    return { error: profileError }
  }

  console.log("Sample user data seeded successfully")
  return { success: true }
}
