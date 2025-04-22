import { GlassCard } from "@/components/ui/glass-card"
import { TradeForm } from "@/components/trades/trade-form"

export default function NewTradePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">New Trade</h1>

      <GlassCard className="p-6">
        <TradeForm mode="create" />
      </GlassCard>
    </div>
  )
}
