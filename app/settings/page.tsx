import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { GlassCard } from "@/components/ui/glass-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { serverUserProfileService } from "@/lib/supabase/user-profile-service"

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await serverUserProfileService.getUserProfileById(session.user.id)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>

            {/* Account settings content would go here */}
            <p className="mt-4">
              This page is under construction. Please visit your profile page to update your account information.
            </p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="appearance">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
            <p className="text-muted-foreground">Customize the appearance of your trading journal.</p>

            {/* Appearance settings content would go here */}
            <p className="mt-4">This page is under construction. Theme settings are available in the header.</p>
          </GlassCard>
        </TabsContent>

        <TabsContent value="notifications">
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <p className="text-muted-foreground">Manage your notification preferences.</p>

            {/* Notification settings content would go here */}
            <p className="mt-4">
              This page is under construction. Please visit your profile page to update your notification preferences.
            </p>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
