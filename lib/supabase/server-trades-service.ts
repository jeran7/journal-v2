import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"
import type { Trade } from "./trades-service"

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
}
