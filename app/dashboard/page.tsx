"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clientTradesService, type Trade } from "@/lib/supabase/trades-service"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [tradesData, statsData] = await Promise.all([
          clientTradesService.getTrades(),
          clientTradesService.getTradeStatistics(),
        ])
        setTrades(tradesData)
        setStats(statsData)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const recentTrades = trades.slice(0, 5)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total P&L</CardDescription>
              <CardTitle className={stats.totalPnL > 0 ? "text-green-600" : stats.totalPnL < 0 ? "text-red-600" : ""}>
                {formatCurrency(stats.totalPnL)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Win Rate</CardDescription>
              <CardTitle>{formatPercentage(stats.winRate)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Trades</CardDescription>
              <CardTitle>{stats.totalTrades}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Profit Factor</CardDescription>
              <CardTitle>{stats.profitFactor.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Trades</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/trades">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No trades yet. Create your first trade!</p>
            ) : (
              <div className="space-y-4">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-gray-500">
                        {trade.direction} • {trade.status}
                      </div>
                    </div>
                    {trade.pnl_absolute !== null && (
                      <div
                        className={
                          trade.pnl_absolute > 0
                            ? "text-green-600 font-medium"
                            : trade.pnl_absolute < 0
                              ? "text-red-600 font-medium"
                              : ""
                        }
                      >
                        {formatCurrency(trade.pnl_absolute)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Winning Trades</p>
                    <p className="font-medium">{stats.winningTrades}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Losing Trades</p>
                    <p className="font-medium">{stats.losingTrades}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Average Win</p>
                    <p className="font-medium text-green-600">{formatCurrency(stats.averageWin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Loss</p>
                    <p className="font-medium text-red-600">{formatCurrency(stats.averageLoss)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Largest Win</p>
                    <p className="font-medium text-green-600">{formatCurrency(stats.largestWin)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Largest Loss</p>
                    <p className="font-medium text-red-600">{formatCurrency(stats.largestLoss)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
