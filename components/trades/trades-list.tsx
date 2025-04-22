"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle, Edit, Trash2, Eye } from "lucide-react"
import { tradesService, type Trade } from "@/lib/supabase/trades-service"
import { formatCurrency, formatDate, formatPercentage } from "@/lib/utils"

export function TradesList() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true)
        const data = await tradesService.getTrades()
        setTrades(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching trades:", err)
        setError("Failed to load trades. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this trade?")) {
      try {
        await tradesService.deleteTrade(id)
        setTrades(trades.filter((trade) => trade.id !== id))
      } catch (err) {
        console.error("Error deleting trade:", err)
        setError("Failed to delete trade. Please try again.")
      }
    }
  }

  const getStatusBadge = (status: Trade["status"]) => {
    switch (status) {
      case "planned":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Planned
          </Badge>
        )
      case "open":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Open
          </Badge>
        )
      case "closed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Closed
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            Canceled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDirectionIcon = (direction: Trade["direction"]) => {
    return direction === "long" ? (
      <ArrowUpCircle className="h-5 w-5 text-profit" />
    ) : (
      <ArrowDownCircle className="h-5 w-5 text-loss" />
    )
  }

  const getStatusIcon = (status: Trade["status"]) => {
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading trades...</div>
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (trades.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="mb-4">No trades found. Start by adding your first trade.</p>
        <Button onClick={() => router.push("/trades/new")}>Add Trade</Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Entry Date</TableHead>
            <TableHead>Exit Date</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>P&L %</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell className="font-medium">{trade.symbol}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getDirectionIcon(trade.direction)}
                  <span className="ml-1">{trade.direction === "long" ? "Long" : "Short"}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(trade.status)}</TableCell>
              <TableCell>{trade.entry_date ? formatDate(trade.entry_date) : "-"}</TableCell>
              <TableCell>{trade.exit_date ? formatDate(trade.exit_date) : "-"}</TableCell>
              <TableCell>{trade.entry_price ? formatCurrency(trade.entry_price) : "-"}</TableCell>
              <TableCell>{trade.exit_price ? formatCurrency(trade.exit_price) : "-"}</TableCell>
              <TableCell className={trade.pnl_absolute && trade.pnl_absolute > 0 ? "text-profit" : "text-loss"}>
                {trade.pnl_absolute ? formatCurrency(trade.pnl_absolute) : "-"}
              </TableCell>
              <TableCell className={trade.pnl_percentage && trade.pnl_percentage > 0 ? "text-profit" : "text-loss"}>
                {trade.pnl_percentage ? formatPercentage(trade.pnl_percentage) : "-"}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/trades/${trade.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/trades/${trade.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(trade.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
