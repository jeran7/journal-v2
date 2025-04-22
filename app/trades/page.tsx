"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TradesList } from "@/components/trades/trades-list"
import { GlassCard } from "@/components/ui/glass-card"
import { getSupabaseClient } from "@/lib/supabase/supabase-client"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export default function TradesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Trades</h1>
        <Button asChild>
          <Link href="/trades/new">Add Trade</Link>
        </Button>
      </div>

      <TradeStats />

      <GlassCard className="mt-6 p-6">
        <TradesList />
      </GlassCard>
    </div>
  )
}

function TradeStats() {
  const [stats, setStats] = useState({
    winRate: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalPnL: 0,
    totalTrades: 0,
    averagePnL: 0,
    profitFactor: 1,
    averageWin: 0,
    averageLoss: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = getSupabaseClient()

        // Get all trades
        const { data: trades, error } = await supabase.from("trades").select("*").eq("status", "closed")

        if (error) throw error

        if (!trades || trades.length === 0) {
          setIsLoading(false)
          return
        }

        // Calculate statistics
        const winningTrades = trades.filter((trade) => (trade.pnl_absolute || 0) > 0)
        const losingTrades = trades.filter((trade) => (trade.pnl_absolute || 0) < 0)

        const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0)
        const totalWinnings = winningTrades.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0)
        const totalLosses = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0))

        const averageWin = winningTrades.length > 0 ? totalWinnings / winningTrades.length : 0
        const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0

        setStats({
          winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
          winningTrades: winningTrades.length,
          losingTrades: losingTrades.length,
          totalPnL,
          totalTrades: trades.length,
          averagePnL: trades.length > 0 ? totalPnL / trades.length : 0,
          profitFactor: totalLosses > 0 ? totalWinnings / totalLosses : totalWinnings > 0 ? 999 : 1,
          averageWin,
          averageLoss,
        })
      } catch (error) {
        console.error("Error fetching trade statistics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <TradeStatsSkeleton />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Win Rate</h3>
        <p className="text-2xl font-bold">{formatPercentage(stats.winRate)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.winningTrades} wins / {stats.losingTrades} losses
        </p>
      </GlassCard>

      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total P&L</h3>
        <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? "text-profit" : "text-loss"}`}>
          {formatCurrency(stats.totalPnL)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{stats.totalTrades} total trades</p>
      </GlassCard>

      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Average Trade</h3>
        <p className={`text-2xl font-bold ${stats.averagePnL >= 0 ? "text-profit" : "text-loss"}`}>
          {formatCurrency(stats.averagePnL)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Per trade average</p>
      </GlassCard>

      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Profit Factor</h3>
        <p className="text-2xl font-bold">{stats.profitFactor.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Avg Win: {formatCurrency(stats.averageWin)} / Avg Loss: {formatCurrency(Math.abs(stats.averageLoss))}
        </p>
      </GlassCard>
    </div>
  )
}

function TradeStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <GlassCard key={i} className="p-4">
          <div className="h-4 w-24 bg-muted rounded animate-pulse mb-2"></div>
          <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-muted rounded animate-pulse mt-2"></div>
        </GlassCard>
      ))}
    </div>
  )
}
