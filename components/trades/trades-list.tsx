"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { clientTradesService, type Trade } from "@/lib/supabase/trades-service"
import { formatCurrency, formatDate } from "@/lib/utils"

export function TradesList() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true)
        const data = await clientTradesService.getTrades()
        setTrades(data)
      } catch (err) {
        console.error("Error fetching trades:", err)
        setError("Failed to load trades. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading trades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-center text-muted-foreground mb-4">No trades found. Create your first trade!</p>
          <Button asChild>
            <Link href="/trades/new">Add Trade</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Symbol</th>
              <th className="text-left py-3 px-4">Direction</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Entry Date</th>
              <th className="text-right py-3 px-4">Entry Price</th>
              <th className="text-right py-3 px-4">Exit Price</th>
              <th className="text-right py-3 px-4">P&L</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">{trade.symbol}</td>
                <td className="py-3 px-4 capitalize">{trade.direction}</td>
                <td className="py-3 px-4 capitalize">{trade.status}</td>
                <td className="py-3 px-4">{trade.entry_date ? formatDate(trade.entry_date) : "N/A"}</td>
                <td className="py-3 px-4 text-right">
                  {trade.entry_price ? formatCurrency(trade.entry_price) : "N/A"}
                </td>
                <td className="py-3 px-4 text-right">{trade.exit_price ? formatCurrency(trade.exit_price) : "N/A"}</td>
                <td
                  className={`py-3 px-4 text-right ${
                    trade.pnl_absolute
                      ? trade.pnl_absolute > 0
                        ? "text-profit"
                        : trade.pnl_absolute < 0
                          ? "text-loss"
                          : ""
                      : ""
                  }`}
                >
                  {trade.pnl_absolute ? formatCurrency(trade.pnl_absolute) : "N/A"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/trades/${trade.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
