import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { serverUserProfileService } from "@/lib/supabase/user-profile-service"

export default async function DashboardPage() {
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
      <h1 className="text-3xl font-bold mb-8">Trading Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {profile?.full_name || session.user.email}</h2>
          <p className="text-muted-foreground mb-4">
            Your trading journal is ready. Start tracking your trades and improving your performance.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/trades">View Trades</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/profile">Edit Profile</Link>
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Playbook</h2>
          <p className="text-muted-foreground mb-4">Create and manage your trading strategies and setups.</p>
          <Button asChild>
            <Link href="/playbook">Go to Playbook</Link>
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Journal</h2>
          <p className="text-muted-foreground mb-4">Record your trading thoughts, insights, and lessons.</p>
          <Button asChild>
            <Link href="/journal">Go to Journal</Link>
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-muted-foreground mb-4">
            Analyze your trading performance and identify areas for improvement.
          </p>
          <Button asChild>
            <Link href="/analytics">View Analytics</Link>
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Charts</h2>
          <p className="text-muted-foreground mb-4">Access advanced charting tools for technical analysis.</p>
          <Button asChild>
            <Link href="/charts">Open Charts</Link>
          </Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Import Data</h2>
          <p className="text-muted-foreground mb-4">Import your trading data from CSV files or connect to brokers.</p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/import/csv">Import CSV</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/brokers">Connect Brokers</Link>
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
