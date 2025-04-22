import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

export type JournalEntry = {
  id: string
  user_id: string
  template_id: string | null
  title: string
  content: string | null
  content_json: any | null
  mood_rating: number | null
  focus_rating: number | null
  energy_rating: number | null
  confidence_rating: number | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export type JournalEntryInsert = Omit<JournalEntry, "id" | "created_at" | "updated_at">
export type JournalEntryUpdate = Partial<Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">>

// Client-side journal service
export const journalService = {
  async getJournalEntries() {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching journal entries:", error)
      throw error
    }

    return data as JournalEntry[]
  },

  async getJournalEntryById(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("journal_entries").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching journal entry with id ${id}:`, error)
      throw error
    }

    return data as JournalEntry
  },

  async createJournalEntry(entry: JournalEntryInsert) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("journal_entries").insert(entry).select().single()

    if (error) {
      console.error("Error creating journal entry:", error)
      throw error
    }

    return data as JournalEntry
  },

  async updateJournalEntry(id: string, updates: JournalEntryUpdate) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("journal_entries").update(updates).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating journal entry with id ${id}:`, error)
      throw error
    }

    return data as JournalEntry
  },

  async deleteJournalEntry(id: string) {
    const supabase = createClientComponentClient<Database>()
    const { error } = await supabase.from("journal_entries").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting journal entry with id ${id}:`, error)
      throw error
    }

    return true
  },

  async linkTradeToJournalEntry(entryId: string, tradeId: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
      .from("journal_entry_trades")
      .insert({
        entry_id: entryId,
        trade_id: tradeId,
      })
      .select()
      .single()

    if (error) {
      console.error(`Error linking trade ${tradeId} to journal entry ${entryId}:`, error)
      throw error
    }

    return data
  },

  async getTradesForJournalEntry(entryId: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase.from("journal_entry_trades").select("trade_id").eq("entry_id", entryId)

    if (error) {
      console.error(`Error fetching trades for journal entry ${entryId}:`, error)
      throw error
    }

    if (data.length === 0) {
      return []
    }

    const tradeIds = data.map((item) => item.trade_id)

    const { data: trades, error: tradesError } = await supabase.from("trades").select("*").in("id", tradeIds)

    if (tradesError) {
      console.error(`Error fetching trade details for journal entry ${entryId}:`, tradesError)
      throw tradesError
    }

    return trades
  },
}

// Server-side journal service
export const serverJournalService = {
  async getJournalEntries() {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("journal_entries").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching journal entries:", error)
      throw error
    }

    return data as JournalEntry[]
  },

  async getJournalEntryById(id: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("journal_entries").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching journal entry with id ${id}:`, error)
      throw error
    }

    return data as JournalEntry
  },

  async getTradesForJournalEntry(entryId: string) {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data, error } = await supabase.from("journal_entry_trades").select("trade_id").eq("entry_id", entryId)

    if (error) {
      console.error(`Error fetching trades for journal entry ${entryId}:`, error)
      throw error
    }

    if (data.length === 0) {
      return []
    }

    const tradeIds = data.map((item) => item.trade_id)

    const { data: trades, error: tradesError } = await supabase.from("trades").select("*").in("id", tradeIds)

    if (tradesError) {
      console.error(`Error fetching trade details for journal entry ${entryId}:`, tradesError)
      throw tradesError
    }

    return trades
  },
}
