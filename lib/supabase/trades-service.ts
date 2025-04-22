import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

export type Trade = {
  id: string
  user_id: string
  symbol: string
  direction: "long" | "short"
  status: "planned" | "open" | "closed" | "canceled"
  entry_date: string | null
  exit_date: string | null
  entry_price: number | null
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  position_size: number
  position_size_unit: "shares" | "contracts" | "units" | "currency"
  fees: number
  commissions: number
  slippage: number
  pnl_absolute: number | null
  pnl_percentage: number | null
  risk_reward_ratio: number | null
  duration_minutes: number | null
  setup_type: string | null
  timeframe: string | null
  market_condition: string | null
  strategy_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TradeInsert = Omit<Trade, "id" | "created_at" | "updated_at">
export type TradeUpdate = Partial<Omit<Trade, "id" | "user_id" | "created_at" | "updated_at">>

// Client-side trades service
export const tradesService = {
  async getTrades() {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("trades").select("*").order("entry_date", { ascending: false })

    if (error) {
      console.error("Error fetching trades:", error)
      throw error
    }

    return data as Trade[]
  },

  async getTradeById(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("trades").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching trade with id ${id}:`, error)
      throw error
    }

    return data as Trade
  },

  async createTrade(trade: TradeInsert) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("trades").insert(trade).select().single()

    if (error) {
      console.error("Error creating trade:", error)
      throw error
    }

    return data as Trade
  },

  async updateTrade(id: string, updates: TradeUpdate) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("trades").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating trade with id ${id}:`, error)
      throw error
    }

    return data as Trade
  },

  async deleteTrade(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from("trades").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting trade with id ${id}:`, error)
      throw error
    }

    return true
  },

  async getTradesByStatus(status: Trade["status"]) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("status", status)
      .order("entry_date", { ascending: false })

    if (error) {
      console.error(`Error fetching trades with status ${status}:`, error)
      throw error
    }

    return data as Trade[]
  },

  async getTradesBySymbol(symbol: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("symbol", symbol)
      .order("entry_date", { ascending: false })

    if (error) {
      console.error(`Error fetching trades for symbol ${symbol}:`, error)
      throw error
    }

    return data as Trade[]
  },

  async getTradesByStrategy(strategyId: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("strategy_id", strategyId)
      .order("entry_date", { ascending: false })

    if (error) {
      console.error(`Error fetching trades for strategy ${strategyId}:`, error)
      throw error
    }

    return data as Trade[]
  },

  async getTradeStatistics() {
    const supabase = createClientComponentClient<Database>()
    const { data: trades, error } = await supabase.from("trades").select("*").eq("status", "closed")

    if (error) {
      console.error("Error fetching trades for statistics:", error)
      throw error
    }

    const tradesData = trades as Trade[]

    // Calculate statistics
    const totalTrades = tradesData.length
    const winningTrades = tradesData.filter((trade) => (trade.pnl_absolute || 0) > 0).length
    const losingTrades = tradesData.filter((trade) => (trade.pnl_absolute || 0) < 0).length
    const breakEvenTrades = totalTrades - winningTrades - losingTrades

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    const totalPnL = tradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0)
    const averagePnL = totalTrades > 0 ? totalPnL / totalTrades : 0

    const winningTradesData = tradesData.filter((trade) => (trade.pnl_absolute || 0) > 0)
    const losingTradesData = tradesData.filter((trade) => (trade.pnl_absolute || 0) < 0)

    const averageWin =
      winningTradesData.length > 0
        ? winningTradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0) / winningTradesData.length
        : 0

    const averageLoss =
      losingTradesData.length > 0
        ? losingTradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0) / losingTradesData.length
        : 0

    const largestWin =
      winningTradesData.length > 0 ? Math.max(...winningTradesData.map((trade) => trade.pnl_absolute || 0)) : 0

    const largestLoss =
      losingTradesData.length > 0 ? Math.min(...losingTradesData.map((trade) => trade.pnl_absolute || 0)) : 0

    const profitFactor = Math.abs(averageLoss) > 0 ? Math.abs(averageWin / averageLoss) : 0

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      breakEvenTrades,
      winRate,
      totalPnL,
      averagePnL,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      profitFactor,
    }
  },
}

// Server-side trades service
export const serverTradesService = {
  async getTrades() {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("trades").select("*").order("entry_date", { ascending: false })

    if (error) {
      console.error("Error fetching trades:", error)
      throw error
    }

    return data as Trade[]
  },

  async getTradeById(id: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("trades").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching trade with id ${id}:`, error)
      throw error
    }

    return data as Trade
  },

  async getTradeStatistics() {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: trades, error } = await supabase.from("trades").select("*").eq("status", "closed")

    if (error) {
      console.error("Error fetching trades for statistics:", error)
      throw error
    }

    const tradesData = trades as Trade[]

    // Calculate statistics (same as client-side)
    const totalTrades = tradesData.length
    const winningTrades = tradesData.filter((trade) => (trade.pnl_absolute || 0) > 0).length
    const losingTrades = tradesData.filter((trade) => (trade.pnl_absolute || 0) < 0).length
    const breakEvenTrades = totalTrades - winningTrades - losingTrades

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    const totalPnL = tradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0)
    const averagePnL = totalTrades > 0 ? totalPnL / totalTrades : 0

    const winningTradesData = tradesData.filter((trade) => (trade.pnl_absolute || 0) > 0)
    const losingTradesData = tradesData.filter((trade) => (trade.pnl_absolute || 0) < 0)

    const averageWin =
      winningTradesData.length > 0
        ? winningTradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0) / winningTradesData.length
        : 0

    const averageLoss =
      losingTradesData.length > 0
        ? losingTradesData.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0) / losingTradesData.length
        : 0

    const largestWin =
      winningTradesData.length > 0 ? Math.max(...winningTradesData.map((trade) => trade.pnl_absolute || 0)) : 0

    const largestLoss =
      losingTradesData.length > 0 ? Math.min(...losingTradesData.map((trade) => trade.pnl_absolute || 0)) : 0

    const profitFactor = Math.abs(averageLoss) > 0 ? Math.abs(averageWin / averageLoss) : 0

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      breakEvenTrades,
      winRate,
      totalPnL,
      averagePnL,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      profitFactor,
    }
  },
}
