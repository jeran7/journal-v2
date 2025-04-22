"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tradesService, type Trade, type TradeInsert, type TradeUpdate } from "@/lib/supabase/trades-service"
import { strategiesService, type Strategy } from "@/lib/supabase/strategies-service"
import { useToast } from "@/hooks/use-toast"

const tradeFormSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  direction: z.enum(["long", "short"], {
    required_error: "Direction is required",
  }),
  status: z.enum(["planned", "open", "closed", "canceled"], {
    required_error: "Status is required",
  }),
  entry_date: z.string().optional().nullable(),
  exit_date: z.string().optional().nullable(),
  entry_price: z.coerce.number().optional().nullable(),
  exit_price: z.coerce.number().optional().nullable(),
  stop_loss: z.coerce.number().optional().nullable(),
  take_profit: z.coerce.number().optional().nullable(),
  position_size: z.coerce.number().min(0.000001, "Position size must be greater than 0"),
  position_size_unit: z.enum(["shares", "contracts", "units", "currency"], {
    required_error: "Position size unit is required",
  }),
  fees: z.coerce.number().default(0),
  commissions: z.coerce.number().default(0),
  slippage: z.coerce.number().default(0),
  pnl_absolute: z.coerce.number().optional().nullable(),
  pnl_percentage: z.coerce.number().optional().nullable(),
  risk_reward_ratio: z.coerce.number().optional().nullable(),
  duration_minutes: z.coerce.number().optional().nullable(),
  setup_type: z.string().optional().nullable(),
  timeframe: z.string().optional().nullable(),
  market_condition: z.string().optional().nullable(),
  strategy_id: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

type TradeFormProps = {
  initialData?: Trade
  mode: "create" | "edit"
}

export function TradeForm({ initialData, mode }: TradeFormProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: initialData || {
      symbol: "",
      direction: "long",
      status: "planned",
      entry_date: "",
      exit_date: "",
      entry_price: null,
      exit_price: null,
      stop_loss: null,
      take_profit: null,
      position_size: 0,
      position_size_unit: "shares",
      fees: 0,
      commissions: 0,
      slippage: 0,
      pnl_absolute: null,
      pnl_percentage: null,
      risk_reward_ratio: null,
      duration_minutes: null,
      setup_type: "",
      timeframe: "",
      market_condition: "",
      strategy_id: "",
      notes: "",
    },
  })

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const data = await strategiesService.getActiveStrategies()
        setStrategies(data)
      } catch (err) {
        console.error("Error fetching strategies:", err)
        toast({
          title: "Error",
          description: "Failed to load strategies. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchStrategies()
  }, [toast])

  const onSubmit = async (values: z.infer<typeof tradeFormSchema>) => {
    try {
      setLoading(true)

      // Calculate P&L if status is closed and entry/exit prices are provided
      if (values.status === "closed" && values.entry_price && values.exit_price) {
        const entryPrice = values.entry_price
        const exitPrice = values.exit_price
        const positionSize = values.position_size

        if (values.direction === "long") {
          values.pnl_absolute =
            (exitPrice - entryPrice) * positionSize - (values.fees + values.commissions + values.slippage)
          values.pnl_percentage = ((exitPrice - entryPrice) / entryPrice) * 100
        } else {
          values.pnl_absolute =
            (entryPrice - exitPrice) * positionSize - (values.fees + values.commissions + values.slippage)
          values.pnl_percentage = ((entryPrice - exitPrice) / entryPrice) * 100
        }
      }

      // Calculate risk/reward ratio if stop loss and take profit are provided
      if (values.entry_price && values.stop_loss && values.take_profit) {
        const entryPrice = values.entry_price
        const stopLoss = values.stop_loss
        const takeProfit = values.take_profit

        if (values.direction === "long") {
          const risk = entryPrice - stopLoss
          const reward = takeProfit - entryPrice
          values.risk_reward_ratio = risk > 0 ? reward / risk : 0
        } else {
          const risk = stopLoss - entryPrice
          const reward = entryPrice - takeProfit
          values.risk_reward_ratio = risk > 0 ? reward / risk : 0
        }
      }

      // Calculate duration if entry and exit dates are provided
      if (values.entry_date && values.exit_date) {
        const entryDate = new Date(values.entry_date)
        const exitDate = new Date(values.exit_date)
        const durationMs = exitDate.getTime() - entryDate.getTime()
        values.duration_minutes = Math.round(durationMs / (1000 * 60))
      }

      if (mode === "create") {
        const userId = (await tradesService.getUserId()) || ""
        const tradeData: TradeInsert = {
          ...values,
          user_id: userId,
        }
        await tradesService.createTrade(tradeData)
        toast({
          title: "Success",
          description: "Trade created successfully",
        })
      } else {
        if (!initialData) throw new Error("Initial data is required for edit mode")
        const tradeData: TradeUpdate = { ...values }
        await tradesService.updateTrade(initialData.id, tradeData)
        toast({
          title: "Success",
          description: "Trade updated successfully",
        })
      }

      router.push("/trades")
      router.refresh()
    } catch (err) {
      console.error("Error saving trade:", err)
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} trade. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="prices">Prices & Position</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input placeholder="AAPL" {...field} />
                    </FormControl>
                    <FormDescription>Enter the ticker symbol for this trade</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the trade direction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Current status of the trade</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1m">1 Minute</SelectItem>
                        <SelectItem value="5m">5 Minutes</SelectItem>
                        <SelectItem value="15m">15 Minutes</SelectItem>
                        <SelectItem value="30m">30 Minutes</SelectItem>
                        <SelectItem value="1h">1 Hour</SelectItem>
                        <SelectItem value="4h">4 Hours</SelectItem>
                        <SelectItem value="1d">Daily</SelectItem>
                        <SelectItem value="1w">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Timeframe used for this trade</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>When the trade was entered</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exit_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Date</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>When the trade was exited</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="prices" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entry_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entry Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exit Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stop_loss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Loss</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="take_profit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Take Profit</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Size</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position_size_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Size Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="shares">Shares</SelectItem>
                        <SelectItem value="contracts">Contracts</SelectItem>
                        <SelectItem value="units">Units</SelectItem>
                        <SelectItem value="currency">Currency</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fees</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commissions</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slippage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slippage</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="setup_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setup Type</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>The type of trading setup used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="market_condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Condition</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Market conditions during the trade</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="strategy_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Strategy</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Trading strategy used for this trade</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter notes about this trade"
                      className="min-h-[120px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Additional notes, observations, or lessons learned</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pnl_absolute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P&L (Absolute)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Profit/loss in currency terms</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pnl_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>P&L (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Profit/loss as a percentage</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="risk_reward_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk/Reward Ratio</FormLabel>
                    <FormControl>
                      <Input type="number" step="any" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Ratio of potential reward to risk</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>How long the trade was held</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : mode === "create" ? "Create Trade" : "Update Trade"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
