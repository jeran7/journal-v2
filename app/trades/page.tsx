import Link from "next/link"
import { ArrowDown, ArrowUp, Download, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { Badge } from "@/components/ui/badge"

// Mock data for trades
const trades = [
  {
    id: "1",
    symbol: "AAPL",
    type: "Long",
    entry: 175.23,
    exit: 182.67,
    size: 100,
    pnl: 744.0,
    pnlPercent: 4.25,
    date: "2023-12-15",
    setup: "Breakout",
    tags: ["Gap Up", "High Volume"],
  },
  {
    id: "2",
    symbol: "MSFT",
    type: "Long",
    entry: 340.12,
    exit: 352.45,
    size: 50,
    pnl: 616.5,
    pnlPercent: 3.62,
    date: "2023-12-14",
    setup: "Pullback",
    tags: ["Trend Continuation"],
  },
  {
    id: "3",
    symbol: "TSLA",
    type: "Short",
    entry: 245.67,
    exit: 238.21,
    size: 75,
    pnl: 559.5,
    pnlPercent: 3.04,
    date: "2023-12-13",
    setup: "Reversal",
    tags: ["Overbought", "Resistance"],
  },
  {
    id: "4",
    symbol: "NVDA",
    type: "Long",
    entry: 465.23,
    exit: 452.1,
    size: 25,
    pnl: -328.25,
    pnlPercent: -2.82,
    date: "2023-12-12",
    setup: "Breakout",
    tags: ["Failed Breakout"],
  },
  {
    id: "5",
    symbol: "META",
    type: "Short",
    entry: 320.45,
    exit: 315.2,
    size: 40,
    pnl: 210.0,
    pnlPercent: 1.64,
    date: "2023-12-11",
    setup: "Reversal",
    tags: ["Double Top"],
  },
  {
    id: "6",
    symbol: "AMZN",
    type: "Long",
    entry: 145.78,
    exit: 149.32,
    size: 100,
    pnl: 354.0,
    pnlPercent: 2.43,
    date: "2023-12-10",
    setup: "Support Bounce",
    tags: ["Oversold", "Support"],
  },
  {
    id: "7",
    symbol: "GOOGL",
    type: "Long",
    entry: 132.45,
    exit: 130.21,
    size: 75,
    pnl: -168.0,
    pnlPercent: -1.69,
    date: "2023-12-09",
    setup: "Gap Fill",
    tags: ["Morning Gap"],
  },
]

export default function TradesPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold tracking-tight font-sf-pro">Trades</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Trade
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search trades, symbols..." className="w-full pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="sr-only">Advanced filters</span>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {trades.map((trade) => (
                <Link key={trade.id} href={`/trades/${trade.id}`}>
                  <GlassCard className="transition-all duration-300 hover:bg-accent/10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
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
                          <div className="font-medium">{trade.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {trade.type} • {trade.setup}
                          </div>
                        </div>
                      </div>

                      <div className="hidden flex-1 grid-cols-4 gap-4 sm:grid">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div className="font-medium">${trade.entry}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Exit</div>
                          <div className="font-medium">${trade.exit}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Size</div>
                          <div className="font-medium">{trade.size}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Date</div>
                          <div className="font-medium">{trade.date}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:hidden">
                        {trade.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="ml-auto text-right">
                        <div className={`font-medium ${trade.pnl > 0 ? "text-profit" : "text-loss"}`}>
                          {trade.pnl > 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </div>
                        <div className={`text-xs ${trade.pnl > 0 ? "text-profit" : "text-loss"}`}>
                          {trade.pnl > 0 ? "+" : ""}
                          {trade.pnlPercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
