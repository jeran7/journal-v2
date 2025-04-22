import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { seedSampleUserData } from "@/lib/supabase/seed-user-data"

export default async function SeedUsersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // This is a simple admin check - in a real app, you'd have proper admin roles
  const isAdmin = session.user.email === "admin@example.com"

  if (!isAdmin) {
    redirect("/dashboard")
  }

  async function seedUsers() {
    "use server"

    const result = await seedSampleUserData()
    return result
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin: Seed User Data</h1>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Seed Sample User Data</h2>
        <p className="text-muted-foreground mb-4">
          This will create a sample user account with demo data for testing purposes.
        </p>

        <form action={seedUsers}>
          <Button type="submit">Seed User Data</Button>
        </form>
      </GlassCard>
    </div>
  )
}
