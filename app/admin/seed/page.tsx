import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { seedDatabase } from "@/lib/supabase/seed-data"

export default async function SeedPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  async function seedDatabaseAction() {
    "use server"

    const result = await seedDatabase(session.user.id)
    return result
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Seed Database</h1>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Seed Trading Journal Data</h2>
        <p className="text-muted-foreground mb-6">
          This will populate your database with sample data for testing the trading journal application. This includes:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Markets and asset classes</li>
          <li>Sample trading strategies</li>
          <li>Sample trades with various statuses</li>
          <li>Journal templates and questions</li>
        </ul>

        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-md mb-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> This action will only seed data if the tables are empty. If you already have data, it
            will not overwrite it.
          </p>
        </div>

        <form action={seedDatabaseAction}>
          <Button type="submit">Seed Database</Button>
        </form>
      </GlassCard>
    </div>
  )
}
