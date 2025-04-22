import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

export type Strategy = {
  id: string
  user_id: string
  name: string
  description: string | null
  category: string | null
  market_condition: string | null
  timeframes: string[] | null
  asset_classes: string[] | null
  risk_reward_min: number | null
  win_rate_expected: number | null
  position_size_percentage: number | null
  max_risk_percentage: number | null
  is_active: boolean
  is_public: boolean
  is_system: boolean
  created_at: string
  updated_at: string
}

export type StrategyInsert = Omit<Strategy, "id" | "created_at" | "updated_at">
export type StrategyUpdate = Partial<Omit<Strategy, "id" | "user_id" | "created_at" | "updated_at">>

// Client-side strategies service
export const strategiesService = {
  async getStrategies() {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("strategies").select("*").order("name")

    if (error) {
      console.error("Error fetching strategies:", error)
      throw error
    }

    return data as Strategy[]
  },

  async getStrategyById(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("strategies").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching strategy with id ${id}:`, error)
      throw error
    }

    return data as Strategy
  },

  async createStrategy(strategy: StrategyInsert) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("strategies").insert(strategy).select().single()

    if (error) {
      console.error("Error creating strategy:", error)
      throw error
    }

    return data as Strategy
  },

  async updateStrategy(id: string, updates: StrategyUpdate) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("strategies").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating strategy with id ${id}:`, error)
      throw error
    }

    return data as Strategy
  },

  async deleteStrategy(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from("strategies").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting strategy with id ${id}:`, error)
      throw error
    }

    return true
  },

  async getActiveStrategies() {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("strategies").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Error fetching active strategies:", error)
      throw error
    }

    return data as Strategy[]
  },

  async getStrategyPerformance(strategyId: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("strategy_id", strategyId)
      .eq("status", "closed")

    if (error) {
      console.error(`Error fetching performance for strategy ${strategyId}:`, error)
      throw error
    }

    // Calculate performance metrics
    const trades = data
    const totalTrades = trades.length
    const winningTrades = trades.filter((trade) => (trade.pnl_absolute || 0) > 0).length
    const losingTrades = trades.filter((trade) => (trade.pnl_absolute || 0) < 0).length

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl_absolute || 0), 0)

    return {
      strategyId,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalPnL,
    }
  },
}

// Server-side strategies service
export const serverStrategiesService = {
  async getStrategies() {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("strategies").select("*").order("name")

    if (error) {
      console.error("Error fetching strategies:", error)
      throw error
    }

    return data as Strategy[]
  },

  async getStrategyById(id: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("strategies").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching strategy with id ${id}:`, error)
      throw error
    }

    return data as Strategy
  },

  async getActiveStrategies() {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("strategies").select("*").eq("is_active", true).order("name")

    if (error) {
      console.error("Error fetching active strategies:", error)
      throw error
    }

    return data as Strategy[]
  },
}
