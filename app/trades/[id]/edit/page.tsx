import { notFound } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { TradeForm } from "@/components/trades/trade-form"
import { serverTradesService } from "@/lib/supabase/trades-service"

export const dynamic = "force-dynamic"

export default async function EditTradePage({ params }: { params: { id: string } }) {
  try {
    const trade = await serverTradesService.getTradeById(params.id)

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Trade: {trade.symbol}</h1>

        <GlassCard className="p-6">
          <TradeForm mode="edit" initialData={trade} />
        </GlassCard>
      </div>
    )
  } catch (error) {
    console.error("Error fetching trade:", error)
    notFound()
  }
}
