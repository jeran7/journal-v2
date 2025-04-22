import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { serverTradesService } from "@/lib/supabase/trades-service"
import { serverStrategiesService } from "@/lib/supabase/strategies-service"
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle, Edit } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function TradeDetailPage({ params }: { params: { id: string } }) {
  try {
    const trade = await serverTradesService.getTradeById(params.id)

    let strategy = null
    if (trade.strategy_id) {
      strategy = await serverStrategiesService.getStrategyById(trade.strategy_id)
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "planned":
          return <Clock className="h-5 w-5 text-yellow-500" />
        case "open":
          return <Clock className="h-5 w-5 text-blue-500" />
        case "closed":
          return <CheckCircle className="h-5 w-5 text-green-500" />
        case "canceled":
          return <XCircle className="h-5 w-5 text-gray-500" />
        default:
          return null
      }
    }

    const getDirectionIcon = (direction: string) => {
      return direction === "long" ? (
        <ArrowUpCircle className="h-5 w-5 text-profit" />
      ) : (
        <ArrowDownCircle className="h-5 w-5 text-loss" />
      )
    }

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{trade.symbol} Trade Details</h1>
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link href={`/trades/${params.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Trade
              </Link>
            </Button>
            <Button asChild>
              <Link href="/trades">Back to Trades</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="mr-2">{getDirectionIcon(trade.direction)}</div>
                  <h2 className="text-2xl font-semibold">{trade.symbol}</h2>
                </div>
                <div className="flex items-center">
                  <div className="mr-2">{getStatusIcon(trade.status)}</div>
                  <span className="capitalize">{trade.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Trade Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Direction</dt>
                      <dd className="font-medium capitalize">{trade.direction}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Entry Date</dt>
                      <dd className="font-medium">{trade.entry_date ? formatDate(trade.entry_date) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Exit Date</dt>
                      <dd className="font-medium">{trade.exit_date ? formatDate(trade.exit_date) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration</dt>
                      <dd className="font-medium">
                        {trade.duration_minutes
                          ? `${Math.floor(trade.duration_minutes / 60)}h ${trade.duration_minutes % 60}m`
                          : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Timeframe</dt>
                      <dd className="font-medium">{trade.timeframe || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Setup Type</dt>
                      <dd className="font-medium">{trade.setup_type || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Market Condition</dt>
                      <dd className="font-medium">{trade.market_condition || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Strategy</dt>
                      <dd className="font-medium">{strategy ? strategy.name : "N/A"}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Price Information</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Entry Price</dt>
                      <dd className="font-medium">{trade.entry_price ? formatCurrency(trade.entry_price) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Exit Price</dt>
                      <dd className="font-medium">{trade.exit_price ? formatCurrency(trade.exit_price) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Stop Loss</dt>
                      <dd className="font-medium">{trade.stop_loss ? formatCurrency(trade.stop_loss) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Take Profit</dt>
                      <dd className="font-medium">{trade.take_profit ? formatCurrency(trade.take_profit) : "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Position Size</dt>
                      <dd className="font-medium">
                        {trade.position_size} {trade.position_size_unit}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Risk/Reward Ratio</dt>
                      <dd className="font-medium">
                        {trade.risk_reward_ratio ? `${trade.risk_reward_ratio.toFixed(2)}:1` : "N/A"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Fees & Commissions</dt>
                      <dd className="font-medium">{formatCurrency(trade.fees + trade.commissions + trade.slippage)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {trade.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{trade.notes}</div>
                </div>
              )}
            </GlassCard>
          </div>

          <div>
            <GlassCard className="p-6">
              <h3 className="text-lg font-medium mb-4">Results</h3>
              {trade.status === "closed" ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center p-4 bg-muted/50 rounded-md">
                    <span className="text-sm text-muted-foreground">P&L</span>
                    <span
                      className={`text-3xl font-bold ${(trade.pnl_absolute || 0) >= 0 ? "text-profit" : "text-loss"}`}
                    >
                      {trade.pnl_absolute ? formatCurrency(trade.pnl_absolute) : "N/A"}
                    </span>
                    <span className={`text-sm ${(trade.pnl_percentage || 0) >= 0 ? "text-profit" : "text-loss"}`}>
                      {trade.pnl_percentage ? formatPercentage(trade.pnl_percentage) : "N/A"}
                    </span>
                  </div>

                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Result</dt>
                      <dd
                        className={`font-medium ${(trade.pnl_absolute || 0) > 0 ? "text-profit" : (trade.pnl_absolute || 0) < 0 ? "text-loss" : ""}`}
                      >
                        {(trade.pnl_absolute || 0) > 0 ? "Win" : (trade.pnl_absolute || 0) < 0 ? "Loss" : "Break Even"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Return on Risk</dt>
                      <dd className="font-medium">
                        {trade.risk_reward_ratio && trade.pnl_absolute && trade.pnl_absolute > 0
                          ? `${(trade.pnl_percentage || 0 / (trade.risk_reward_ratio * 100)).toFixed(2)}R`
                          : "N/A"}
                      </dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="text-center p-4 bg-muted/50 rounded-md">
                  <p>Trade not closed yet</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/journal/new?tradeId=${params.id}`}>Create Journal Entry</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/trades/${params.id}/screenshots/new`}>Add Screenshot</Link>
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching trade:", error)
    notFound()
  }
}
