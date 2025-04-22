"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { seedDatabase } from "@/lib/supabase/seed-data"
import { useToast } from "@/hooks/use-toast"

export default function SeedPage() {
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    setIsSeeding(true)
    setResult(null)

    try {
      const result = await seedDatabase()
      setResult(result)

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: "An error occurred while seeding the database",
      })

      toast({
        title: "Error",
        description: "An error occurred while seeding the database",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Database Seed Tool</h1>

      <GlassCard className="p-6">
        <h2 className="text-xl font-semibold mb-4">Seed Chart Data</h2>
        <p className="text-muted-foreground mb-6">
          This tool will populate the database with sample price data for common stocks across different timeframes.
          This is useful for testing and development purposes.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleSeed} disabled={isSeeding} className="w-40">
              {isSeeding ? "Seeding..." : "Seed Database"}
            </Button>

            {result && <span className={result.success ? "text-green-500" : "text-red-500"}>{result.message}</span>}
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This will seed the following data:</p>
            <ul className="list-disc list-inside mt-2">
              <li>5 symbols: AAPL, MSFT, GOOGL, AMZN, META</li>
              <li>7 timeframes: 1m, 5m, 15m, 1h, 4h, 1D, 1W</li>
              <li>Appropriate amount of historical data for each timeframe</li>
            </ul>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md p-4 text-yellow-500">
            <p className="font-medium">Warning</p>
            <p className="text-sm">
              This operation will insert a large amount of data into your database. It may take some time to complete
              and could affect database performance.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
