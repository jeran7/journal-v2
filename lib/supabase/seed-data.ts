"use client"

import { getServerSupabaseClient } from "./supabase-client"
import type { PriceDataPoint, Timeframe } from "./price-data-service"

// Generate random price data for a symbol
export function generatePriceData(
  symbol: string,
  timeframe: Timeframe,
  count: number,
  startTime: number = Math.floor(Date.now() / 1000) - count * getTimeframeInSeconds(timeframe),
  startPrice: number = 100 + Math.random() * 100,
): PriceDataPoint[] {
  const data: PriceDataPoint[] = []
  let time = startTime
  let price = startPrice
  const timeframeSeconds = getTimeframeInSeconds(timeframe)

  for (let i = 0; i < count; i++) {
    const changePercent = (Math.random() - 0.5) * 2 // -1% to 1%
    const change = price * (changePercent / 100)

    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * Math.abs(change)
    const low = Math.min(open, close) - Math.random() * Math.abs(change)
    const volume = Math.floor(Math.random() * 10000) + 1000

    data.push({
      symbol,
      timeframe,
      time,
      open,
      high,
      low,
      close,
      volume,
    })

    price = close
    time += timeframeSeconds
  }

  return data
}

// Get timeframe in seconds
function getTimeframeInSeconds(timeframe: Timeframe): number {
  switch (timeframe) {
    case "1m":
      return 60
    case "5m":
      return 5 * 60
    case "15m":
      return 15 * 60
    case "1h":
      return 60 * 60
    case "4h":
      return 4 * 60 * 60
    case "1D":
      return 24 * 60 * 60
    case "1W":
      return 7 * 24 * 60 * 60
    default:
      return 60
  }
}

// Seed the database with sample data
export async function seedDatabase() {
  const supabase = getServerSupabaseClient()

  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"]
  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"]

  // Generate and insert data for each symbol and timeframe
  for (const symbol of symbols) {
    for (const timeframe of timeframes) {
      // Generate different amounts of data based on timeframe
      let count
      switch (timeframe) {
        case "1m":
          count = 1440 // 1 day of 1-minute data
          break
        case "5m":
          count = 1152 // 4 days of 5-minute data
          break
        case "15m":
          count = 672 // 7 days of 15-minute data
          break
        case "1h":
          count = 720 // 30 days of hourly data
          break
        case "4h":
          count = 360 // 60 days of 4-hour data
          break
        case "1D":
          count = 365 // 1 year of daily data
          break
        case "1W":
          count = 104 // 2 years of weekly data
          break
        default:
          count = 100
      }

      const data = generatePriceData(symbol, timeframe, count)

      // Insert data in batches to avoid hitting limits
      const batchSize = 500
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize)

        const { error } = await supabase.from("price_data").upsert(batch, { onConflict: "symbol,timeframe,time" })

        if (error) {
          console.error(`Error seeding ${symbol} ${timeframe} data:`, error)
        }
      }

      console.log(`Seeded ${data.length} records for ${symbol} ${timeframe}`)
    }
  }

  return { success: true, message: "Database seeded successfully" }
}
