"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  LineChart,
  Percent,
  Share2,
  Tag,
  Timer,
} from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MultiTimeframeChart } from "@/components/ui/multi-timeframe-chart"
import { TradeTimeline } from "@/components/ui/trade-timeline"
import { PsychologicalTracker } from "@/components/ui/psychological-tracker"
import { AIAnalysis } from "@/components/ui/ai-analysis"
import { TradeJournal } from "@/components/ui/trade-journal"

// Mock data for a single trade
const trade = {
  id: "1",
  symbol: "AAPL",
  type: "Long",
  entry: 175.23,
  exit: 182.67,
  size: 100,
  pnl: 744.0,
  pnlPercent: 4.25,
  date: "2023-12-15",
  time: "10:45 AM",
  duration: "2h 15m",
  setup: "Breakout",
  tags: ["Gap Up", "High Volume", "Earnings"],
  notes:
    "Strong momentum after earnings beat. Entered on breakout of previous day's high with increased volume. Exited when price reached resistance level and volume started to decrease.",
  mistakes: ["Entered too early", "Position size too small"],
  images: ["/placeholder.svg?height=400&width=800"],
  psychology: {
    preTrade: {
      emotion: "confident" as const,
      level: 4,
      notes: "Felt confident due to strong pre-market movement and positive earnings surprise.",
    },
    duringTrade: {
      emotion: "anxious" as const,
      level: 3,
      notes: "Some anxiety when price consolidated near entry, but maintained conviction in setup.",
    },
    postTrade: {
      emotion: "calm" as const,
      level: 4,
      notes: "Satisfied with execution despite small position size. Followed plan well.",
    },
  },
  riskReward: {
    risk: 200,
    reward: 744,
    ratio: 3.72,
  },
  planCompliance: 85,
  timeline: [
    {
      id: "1",
      time: "10:30 AM",
      title: "Trade Idea",
      description: "Identified potential breakout setup after earnings beat",
      type: "idea" as const,
    },
    {
      id: "2",
      time: "10:45 AM",
      title: "Entry",
      description: "Entered long position at $175.23",
      type: "entry" as const,
    },
    {
      id: "3",
      time: "11:15 AM",
      title: "Stop Loss",
      description: "Set stop loss at $173.23 (1% risk)",
      type: "stop" as const,
    },
    {
      id: "4",
      time: "12:30 PM",
      title: "Price Consolidation",
      description: "Price consolidated near $178, maintained position",
      type: "adjustment" as const,
    },
    {
      id: "5",
      time: "1:00 PM",
      title: "Exit",
      description: "Exited position at $182.67 as volume decreased",
      type: "exit" as const,
    },
  ],
  aiAnalysis: {
    points: [
      {
        id: "1",
        type: "strength" as const,
        title: "Excellent Entry Timing",
        description: "You entered at a key support level with confirmation from volume increase.",
        impact: "high" as const,
      },
      {
        id: "2",
        type: "weakness" as const,
        title: "Position Sizing",
        description: "Your position size was smaller than optimal based on your risk parameters.",
        impact: "medium" as const,
      },
      {
        id: "3",
        type: "insight" as const,
        title: "Pattern Recognition",
        description: "This trade followed your high-probability earnings breakout pattern.",
        impact: "high" as const,
      },
      {
        id: "4",
        type: "suggestion" as const,
        title: "Consider Scaling Out",
        description: "For similar setups, consider scaling out in multiple parts to maximize gains.",
        impact: "medium" as const,
      },
    ],
    similarTrades: [
      {
        id: "101",
        symbol: "MSFT",
        date: "2023-11-20",
        setup: "Earnings Breakout",
        pnl: 892.5,
        similarity: 87,
      },
      {
        id: "102",
        symbol: "NVDA",
        date: "2023-10-05",
        setup: "Earnings Breakout",
        pnl: 1250.0,
        similarity: 82,
      },
      {
        id: "103",
        symbol: "META",
        date: "2023-09-12",
        setup: "Earnings Breakout",
        pnl: -320.0,
        similarity: 75,
      },
    ],
  },
}

// Mock chart data
const generateChartData = (timeframe: string, entryPrice: number, exitPrice: number) => {
  const points =
    timeframe === "1m" ? 120 : timeframe === "5m" ? 60 : timeframe === "15m" ? 40 : timeframe === "1h" ? 24 : 14
  const data: any[] = []

  let currentPrice = entryPrice * 0.99
  const trend = exitPrice > entryPrice ? 1 : -1
  const volatility = 0.002

  for (let i = 0; i < points; i++) {
    const random = Math.random() * volatility * 2 - volatility
    const trendFactor = ((i / points) * (exitPrice - entryPrice)) / entryPrice

    currentPrice = currentPrice * (1 + random + trendFactor * trend * 0.1)

    const time = new Date()
    time.setHours(10)
    time.setMinutes(
      i *
        (timeframe === "1m"
          ? 1
          : timeframe === "5m"
            ? 5
            : timeframe === "15m"
              ? 15
              : timeframe === "1h"
                ? 60
                : 24 * 60),
    )

    const dataPoint: any = {
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: currentPrice,
      volume: Math.floor(Math.random() * 10000) + 5000,
      ma20: currentPrice * (1 + (Math.random() * 0.01 - 0.005)),
      ma50: currentPrice * (1 + (Math.random() * 0.02 - 0.01)),
    }

    // Add entry and exit points
    if (i === Math.floor(points * 0.2)) {
      dataPoint.entry = entryPrice
    }

    if (i === Math.floor(points * 0.8)) {
      dataPoint.exit = exitPrice
    }

    // Add stop loss and take profit lines
    if (i >= Math.floor(points * 0.2)) {
      dataPoint.stopLoss = trade.type === "Long" ? entryPrice * 0.99 : entryPrice * 1.01
      dataPoint.takeProfit = trade.type === "Long" ? entryPrice * 1.03 : entryPrice * 0.97
    }

    data.push(dataPoint)
  }

  return data
}

const chartData = {
  "1m": generateChartData("1m", trade.entry, trade.exit),
  "5m": generateChartData("5m", trade.entry, trade.exit),
  "15m": generateChartData("15m", trade.entry, trade.exit),
  "1h": generateChartData("1h", trade.entry, trade.exit),
  "1d": generateChartData("1d", trade.entry, trade.exit),
}

export default function TradePage({ params }: { params: { id: string } }) {
  const [isClient, setIsClient] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Simulate page load animation
    const timeout = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6">
            <div className="mb-6 flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link href="/trades">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to trades</span>
                </Link>
              </Button>
              <h1
                className={`text-2xl font-bold font-sf-pro transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
              >
                {trade.symbol} {trade.type} Trade
              </h1>
              <div className="ml-auto flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  style={{ transitionDelay: "100ms" }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  size="sm"
                  className={`transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <GlassCard
                className={`md:col-span-2 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${trade.type === "Long" ? "bg-profit/20" : "bg-loss/20"}`}
                      >
                        {trade.type === "Long" ? (
                          <ArrowUp className="h-5 w-5 text-profit" />
                        ) : (
                          <ArrowDown className="h-5 w-5 text-loss" />
                        )}
                      </div>
                      <div>
                        <div className="text-xl font-bold">{trade.symbol}</div>
                        <div className="text-sm text-muted-foreground">{trade.type} Trade</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        <AnimatedNumber value={trade.pnl} formatValue={(val) => `$${val.toFixed(2)}`} />
                      </div>
                      <div className={`text-sm ${trade.pnl > 0 ? "text-profit" : "text-loss"}`}>
                        {trade.pnl > 0 ? "+" : ""}
                        {trade.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Entry</div>
                      <div className="font-medium">${trade.entry}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Exit</div>
                      <div className="font-medium">${trade.exit}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="font-medium">{trade.size} shares</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Setup</div>
                      <div className="font-medium">{trade.setup}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{trade.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{trade.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{trade.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {trade.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </GlassCard>

              <GlassCard
                className={`flex flex-col gap-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: "100ms" }}
              >
                <h2 className="text-lg font-semibold font-sf-pro">Trade Metrics</h2>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Risk</span>
                  </div>
                  <span className="font-medium">${trade.riskReward.risk.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Reward</span>
                  </div>
                  <span className="font-medium">${trade.riskReward.reward.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">R:R Ratio</span>
                  </div>
                  <span className="font-medium">1:{trade.riskReward.ratio.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Plan Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-profit" style={{ width: `${trade.planCompliance}%` }} />
                    </div>
                    <span className="text-sm font-medium">{trade.planCompliance}%</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="chart">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="psychology">Psychology</TabsTrigger>
                  <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                  <TabsTrigger value="journal">Journal</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="chart"
                  className={`mt-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <GlassCard>
                    <MultiTimeframeChart
                      symbol={trade.symbol}
                      data={chartData}
                      entryPrice={trade.entry}
                      exitPrice={trade.exit}
                      stopLossPrice={trade.entry * 0.99}
                      takeProfitPrice={trade.entry * 1.03}
                      entryTime={trade.time}
                      exitTime="1:00 PM"
                      type={trade.type as "Long" | "Short"}
                      className="h-[500px]"
                    />
                  </GlassCard>
                </TabsContent>

                <TabsContent
                  value="analysis"
                  className={`mt-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <GlassCard>
                      <TradeTimeline events={trade.timeline} />
                    </GlassCard>

                    <GlassCard>
                      <h2 className="mb-4 text-lg font-semibold font-sf-pro">Trade Analysis</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">What Went Well</h3>
                          <p className="text-sm text-muted-foreground">
                            Proper entry on breakout with confirmation from volume. Good exit at resistance level.
                            Managed emotions well throughout the trade.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Mistakes</h3>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {trade.mistakes.map((mistake, index) => (
                              <li key={index}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Lessons Learned</h3>
                          <p className="text-sm text-muted-foreground">
                            Wait for confirmation before entering. Consider increasing position size on high-conviction
                            setups. Continue to follow trading plan and exit strategy.
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </TabsContent>

                <TabsContent
                  value="psychology"
                  className={`mt-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <GlassCard>
                    <PsychologicalTracker
                      preTrade={trade.psychology.preTrade}
                      duringTrade={trade.psychology.duringTrade}
                      postTrade={trade.psychology.postTrade}
                    />
                  </GlassCard>
                </TabsContent>

                <TabsContent
                  value="ai"
                  className={`mt-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <GlassCard>
                    <AIAnalysis points={trade.aiAnalysis.points} similarTrades={trade.aiAnalysis.similarTrades} />
                  </GlassCard>
                </TabsContent>

                <TabsContent
                  value="journal"
                  className={`mt-4 transition-all duration-500 ${isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <GlassCard>
                    <TradeJournal initialNotes={trade.notes} />
                  </GlassCard>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
