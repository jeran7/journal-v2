import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase-types"

export async function seedMarkets() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Check if markets already exist
  const { data: existingMarkets } = await supabase.from("markets").select("id").limit(1)

  if (existingMarkets && existingMarkets.length > 0) {
    console.log("Markets already seeded")
    return
  }

  // Seed markets
  const markets = [
    {
      name: "NYSE",
      description: "New York Stock Exchange",
      country: "USA",
      timezone: "America/New_York",
      open_time: "09:30:00",
      close_time: "16:00:00",
      is_active: true,
    },
    {
      name: "NASDAQ",
      description: "NASDAQ Stock Exchange",
      country: "USA",
      timezone: "America/New_York",
      open_time: "09:30:00",
      close_time: "16:00:00",
      is_active: true,
    },
    {
      name: "Forex",
      description: "Foreign Exchange Market",
      country: "Global",
      timezone: "UTC",
      open_time: null,
      close_time: null,
      is_active: true,
    },
    {
      name: "Crypto",
      description: "Cryptocurrency Markets",
      country: "Global",
      timezone: "UTC",
      open_time: null,
      close_time: null,
      is_active: true,
    },
  ]

  const { error } = await supabase.from("markets").insert(markets)

  if (error) {
    console.error("Error seeding markets:", error)
    throw error
  }

  console.log("Markets seeded successfully")
}

export async function seedAssetClasses() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Check if asset classes already exist
  const { data: existingAssetClasses } = await supabase.from("asset_classes").select("id").limit(1)

  if (existingAssetClasses && existingAssetClasses.length > 0) {
    console.log("Asset classes already seeded")
    return
  }

  // Seed asset classes
  const assetClasses = [
    {
      name: "Stocks",
      description: "Equity shares of publicly traded companies",
    },
    {
      name: "ETFs",
      description: "Exchange Traded Funds",
    },
    {
      name: "Forex",
      description: "Foreign Exchange Currency Pairs",
    },
    {
      name: "Crypto",
      description: "Cryptocurrencies and digital assets",
    },
    {
      name: "Futures",
      description: "Futures contracts",
    },
    {
      name: "Options",
      description: "Options contracts",
    },
  ]

  const { error } = await supabase.from("asset_classes").insert(assetClasses)

  if (error) {
    console.error("Error seeding asset classes:", error)
    throw error
  }

  console.log("Asset classes seeded successfully")
}

export async function seedSampleStrategies(userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Check if strategies already exist for this user
  const { data: existingStrategies } = await supabase.from("strategies").select("id").eq("user_id", userId).limit(1)

  if (existingStrategies && existingStrategies.length > 0) {
    console.log("Strategies already seeded for this user")
    return
  }

  // Seed strategies
  const strategies = [
    {
      user_id: userId,
      name: "Breakout Strategy",
      description: "Trading breakouts from key support and resistance levels",
      category: "Momentum",
      market_condition: "Trending",
      timeframes: ["1h", "4h", "1d"],
      asset_classes: ["Stocks", "ETFs"],
      risk_reward_min: 2.0,
      win_rate_expected: 45.0,
      position_size_percentage: 1.0,
      max_risk_percentage: 1.0,
      is_active: true,
      is_public: false,
      is_system: false,
    },
    {
      user_id: userId,
      name: "Moving Average Crossover",
      description: "Trading crossovers of fast and slow moving averages",
      category: "Trend Following",
      market_condition: "Trending",
      timeframes: ["4h", "1d"],
      asset_classes: ["Stocks", "ETFs", "Forex"],
      risk_reward_min: 1.5,
      win_rate_expected: 55.0,
      position_size_percentage: 1.0,
      max_risk_percentage: 1.0,
      is_active: true,
      is_public: false,
      is_system: false,
    },
    {
      user_id: userId,
      name: "Mean Reversion",
      description: "Trading reversals back to the mean after extreme moves",
      category: "Mean Reversion",
      market_condition: "Ranging",
      timeframes: ["1h", "4h"],
      asset_classes: ["Stocks", "ETFs"],
      risk_reward_min: 1.0,
      win_rate_expected: 65.0,
      position_size_percentage: 1.0,
      max_risk_percentage: 1.0,
      is_active: true,
      is_public: false,
      is_system: false,
    },
  ]

  const { error } = await supabase.from("strategies").insert(strategies)

  if (error) {
    console.error("Error seeding strategies:", error)
    throw error
  }

  console.log("Strategies seeded successfully")
}

export async function seedSampleTrades(userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Check if trades already exist for this user
  const { data: existingTrades } = await supabase.from("trades").select("id").eq("user_id", userId).limit(1)

  if (existingTrades && existingTrades.length > 0) {
    console.log("Trades already seeded for this user")
    return
  }

  // Get strategies for this user
  const { data: strategies } = await supabase.from("strategies").select("id, name").eq("user_id", userId)

  if (!strategies || strategies.length === 0) {
    console.log("No strategies found for this user. Seeding strategies first.")
    await seedSampleStrategies(userId)

    const { data: newStrategies } = await supabase.from("strategies").select("id, name").eq("user_id", userId)

    if (!newStrategies || newStrategies.length === 0) {
      throw new Error("Failed to seed strategies")
    }

    const strategies = newStrategies
  }

  // Create sample trades
  const now = new Date()
  const oneDay = 24 * 60 * 60 * 1000

  const trades = [
    {
      user_id: userId,
      symbol: "AAPL",
      direction: "long",
      status: "closed",
      entry_date: new Date(now.getTime() - 10 * oneDay).toISOString(),
      exit_date: new Date(now.getTime() - 9 * oneDay).toISOString(),
      entry_price: 175.5,
      exit_price: 180.25,
      stop_loss: 172.0,
      take_profit: 185.0,
      position_size: 10,
      position_size_unit: "shares",
      fees: 1.5,
      commissions: 0.5,
      slippage: 0.1,
      pnl_absolute: 47.5,
      pnl_percentage: 2.71,
      risk_reward_ratio: 2.71,
      duration_minutes: 1440,
      setup_type: "Breakout",
      timeframe: "1d",
      market_condition: "Bullish",
      strategy_id: strategies[0].id,
      notes: "Strong breakout above resistance with good volume. Followed the strategy rules perfectly.",
    },
    {
      user_id: userId,
      symbol: "MSFT",
      direction: "long",
      status: "closed",
      entry_date: new Date(now.getTime() - 8 * oneDay).toISOString(),
      exit_date: new Date(now.getTime() - 6 * oneDay).toISOString(),
      entry_price: 320.75,
      exit_price: 315.5,
      stop_loss: 315.0,
      take_profit: 330.0,
      position_size: 5,
      position_size_unit: "shares",
      fees: 1.25,
      commissions: 0.5,
      slippage: 0.05,
      pnl_absolute: -26.25,
      pnl_percentage: -1.63,
      risk_reward_ratio: 1.61,
      duration_minutes: 2880,
      setup_type: "Moving Average Crossover",
      timeframe: "4h",
      market_condition: "Bullish",
      strategy_id: strategies[1].id,
      notes: "Stopped out just before the market reversed. Need to be more patient with entries.",
    },
    {
      user_id: userId,
      symbol: "TSLA",
      direction: "short",
      status: "closed",
      entry_date: new Date(now.getTime() - 5 * oneDay).toISOString(),
      exit_date: new Date(now.getTime() - 3 * oneDay).toISOString(),
      entry_price: 245.0,
      exit_price: 235.5,
      stop_loss: 250.0,
      take_profit: 230.0,
      position_size: 3,
      position_size_unit: "shares",
      fees: 1.0,
      commissions: 0.5,
      slippage: 0.15,
      pnl_absolute: 28.5,
      pnl_percentage: 3.88,
      risk_reward_ratio: 1.9,
      duration_minutes: 2880,
      setup_type: "Mean Reversion",
      timeframe: "1h",
      market_condition: "Bearish",
      strategy_id: strategies[2].id,
      notes: "Good entry at overbought conditions. Took profit at support level.",
    },
    {
      user_id: userId,
      symbol: "AMZN",
      direction: "long",
      status: "open",
      entry_date: new Date(now.getTime() - 2 * oneDay).toISOString(),
      exit_date: null,
      entry_price: 145.25,
      exit_price: null,
      stop_loss: 140.0,
      take_profit: 155.0,
      position_size: 7,
      position_size_unit: "shares",
      fees: 1.3,
      commissions: 0.5,
      slippage: 0.05,
      pnl_absolute: null,
      pnl_percentage: null,
      risk_reward_ratio: 1.87,
      duration_minutes: null,
      setup_type: "Breakout",
      timeframe: "4h",
      market_condition: "Bullish",
      strategy_id: strategies[0].id,
      notes: "Breaking out of consolidation pattern with increasing volume.",
    },
    {
      user_id: userId,
      symbol: "META",
      direction: "long",
      status: "planned",
      entry_date: null,
      exit_date: null,
      entry_price: 325.5,
      exit_price: null,
      stop_loss: 320.0,
      take_profit: 340.0,
      position_size: 4,
      position_size_unit: "shares",
      fees: 0,
      commissions: 0,
      slippage: 0,
      pnl_absolute: null,
      pnl_percentage: null,
      risk_reward_ratio: 2.64,
      duration_minutes: null,
      setup_type: "Moving Average Crossover",
      timeframe: "1d",
      market_condition: "Bullish",
      strategy_id: strategies[1].id,
      notes: "Waiting for 10 EMA to cross above 20 EMA with confirmation from MACD.",
    },
  ]

  const { error } = await supabase.from("trades").insert(trades)

  if (error) {
    console.error("Error seeding trades:", error)
    throw error
  }

  console.log("Trades seeded successfully")
}

export async function seedSampleJournalTemplates(userId: string) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Check if templates already exist
  const { data: existingTemplates } = await supabase
    .from("journal_templates")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (existingTemplates && existingTemplates.length > 0) {
    console.log("Journal templates already seeded")
    return
  }

  // Create template categories
  const { data: categories, error: categoriesError } = await supabase
    .from("template_categories")
    .insert([
      {
        name: "Daily Journal",
        description: "Templates for daily trading journal entries",
        is_system: true,
      },
      {
        name: "Trade Analysis",
        description: "Templates for analyzing individual trades",
        is_system: true,
      },
      {
        name: "Performance Review",
        description: "Templates for periodic performance reviews",
        is_system: true,
      },
    ])
    .select()

  if (categoriesError) {
    console.error("Error creating template categories:", categoriesError)
    throw categoriesError
  }

  // Create templates
  const dailyJournalTemplate = {
    user_id: userId,
    category_id: categories[0].id,
    name: "Daily Trading Journal",
    description: "Standard daily trading journal template",
    is_system: true,
    is_public: false,
  }

  const { data: template, error: templateError } = await supabase
    .from("journal_templates")
    .insert(dailyJournalTemplate)
    .select()
    .single()

  if (templateError) {
    console.error("Error creating journal template:", templateError)
    throw templateError
  }

  // Create template sections
  const { data: sections, error: sectionsError } = await supabase
    .from("template_sections")
    .insert([
      {
        template_id: template.id,
        name: "Market Analysis",
        description: "Overall market conditions and analysis",
        order_index: 0,
      },
      {
        template_id: template.id,
        name: "Trading Plan",
        description: "Plan for the trading day and watchlist",
        order_index: 1,
      },
      {
        template_id: template.id,
        name: "Trade Execution",
        description: "Details of trades executed today",
        order_index: 2,
      },
      {
        template_id: template.id,
        name: "Reflection",
        description: "Reflection on trading performance and emotions",
        order_index: 3,
      },
    ])
    .select()

  if (sectionsError) {
    console.error("Error creating template sections:", sectionsError)
    throw sectionsError
  }

  // Create template questions
  const questionsData = [
    // Market Analysis section
    {
      section_id: sections[0].id,
      question: "What is the overall market sentiment today?",
      question_type: "text",
      is_required: true,
      order_index: 0,
    },
    {
      section_id: sections[0].id,
      question: "What are the key market indices doing?",
      question_type: "text",
      is_required: true,
      order_index: 1,
    },
    {
      section_id: sections[0].id,
      question: "Are there any significant news events affecting the market?",
      question_type: "text",
      is_required: false,
      order_index: 2,
    },

    // Trading Plan section
    {
      section_id: sections[1].id,
      question: "What are your focus symbols for today?",
      question_type: "text",
      is_required: true,
      order_index: 0,
    },
    {
      section_id: sections[1].id,
      question: "What setups are you looking for?",
      question_type: "text",
      is_required: true,
      order_index: 1,
    },
    {
      section_id: sections[1].id,
      question: "What is your risk management plan for today?",
      question_type: "text",
      is_required: true,
      order_index: 2,
    },

    // Trade Execution section
    {
      section_id: sections[2].id,
      question: "Describe the trades you took today:",
      question_type: "text",
      is_required: false,
      order_index: 0,
    },
    {
      section_id: sections[2].id,
      question: "Did you follow your trading plan?",
      question_type: "boolean",
      is_required: true,
      order_index: 1,
    },
    {
      section_id: sections[2].id,
      question: "What worked well in your execution?",
      question_type: "text",
      is_required: false,
      order_index: 2,
    },
    {
      section_id: sections[2].id,
      question: "What could be improved in your execution?",
      question_type: "text",
      is_required: false,
      order_index: 3,
    },

    // Reflection section
    {
      section_id: sections[3].id,
      question: "How would you rate your emotional control today?",
      question_type: "scale",
      options: { min: 1, max: 10, step: 1 },
      is_required: true,
      order_index: 0,
    },
    {
      section_id: sections[3].id,
      question: "What emotions did you experience while trading?",
      question_type: "text",
      is_required: true,
      order_index: 1,
    },
    {
      section_id: sections[3].id,
      question: "What lessons did you learn today?",
      question_type: "text",
      is_required: true,
      order_index: 2,
    },
    {
      section_id: sections[3].id,
      question: "What will you do differently tomorrow?",
      question_type: "text",
      is_required: true,
      order_index: 3,
    },
  ]

  const { error: questionsError } = await supabase.from("template_questions").insert(questionsData)

  if (questionsError) {
    console.error("Error creating template questions:", questionsError)
    throw questionsError
  }

  console.log("Journal templates seeded successfully")
}

export async function seedDatabase(userId: string) {
  try {
    await seedMarkets()
    await seedAssetClasses()
    await seedSampleStrategies(userId)
    await seedSampleTrades(userId)
    await seedSampleJournalTemplates(userId)

    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Error seeding database", error }
  }
}
