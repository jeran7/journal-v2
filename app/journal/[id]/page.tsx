"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Edit, FileText, MessageSquare, Share2, Tag, Trash } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JournalAnalyticsDashboard } from "@/components/journal/analytics-dashboard"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for a journal entry
const journalEntry = {
  id: "1",
  title: "Morning Market Analysis",
  date: "2023-12-15",
  time: "08:30 AM",
  template: "Pre-Market Plan",
  tags: ["SPY", "Market Analysis", "Gap Strategy"],
  content: `
    <h3>Market Overview</h3>
    <p>Markets showing strength in pre-market with positive economic data. S&P futures up 0.5%, Nasdaq futures up 0.7%. Asian markets closed higher, European markets also showing strength.</p>
    
    <h3>Key Levels to Watch</h3>
    <p>SPY: Resistance at 458.50, Support at 455.20<br>
    QQQ: Resistance at 392.30, Support at 388.75<br>
    AAPL: Watching 195.00 level for potential breakout</p>
    
    <h3>Watchlist</h3>
    <p>AAPL - Potential breakout above 195.00<br>
    MSFT - Holding above key support<br>
    NVDA - Consolidating after recent run<br>
    TSLA - Watching for reaction to analyst upgrade</p>
    
    <h3>Trading Plan</h3>
    <p>Looking for continuation of yesterday's bullish momentum. Will focus on tech sector for potential breakouts. Planning to enter AAPL if it breaks above 195.00 with volume confirmation. Will use 193.50 as stop loss.</p>
    
    <h3>Risk Management</h3>
    <p>Max risk per trade: 1% of account<br>
    Max daily loss: 2% of account<br>
    Position sizing: 5% of account per position</p>
  `,
  mood: "Focused",
  moodScore: 4,
  moodNotes: "Feeling clear-headed and prepared for the trading day. Slept well and completed my morning routine.",
  relatedTrades: ["AAPL-123", "MSFT-456"],
  mediaItems: [
    {
      id: "media-1",
      type: "image" as const,
      url: "/placeholder.svg?height=400&width=600",
      name: "SPY Daily Chart",
      timestamp: "2023-12-15 08:15 AM",
    },
    {
      id: "media-2",
      type: "image" as const,
      url: "/placeholder.svg?height=400&width=600",
      name: "AAPL Breakout Setup",
      timestamp: "2023-12-15 08:20 AM",
    },
  ],
  lessons: [
    "Always confirm breakouts with volume",
    "Pre-market analysis helps set the tone for the day",
    "Having clear levels reduces decision fatigue during trading",
  ],
}

export default function JournalEntryPage({ params }: { params: { id: string } }) {
  const [isClient, setIsClient] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  useEffect(() => {
    setIsClient(true)

    // Simulate page load animation
    const timeout = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const handleDelete = async () => {
    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would delete from a database
    console.log(`Deleting journal entry ${params.id}`)

    setIsDeleting(false)

    // Navigate to journal list
    window.location.href = "/journal"
  }

  // Get mood color based on mood score
  const getMoodColor = (score: number) => {
    if (score >= 4) return "bg-profit/20 text-profit"
    if (score <= 2) return "bg-loss/20 text-loss"
    return "bg-neutral/20 text-neutral"
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href="/journal">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to journal</span>
                  </Link>
                </Button>
                <h1
                  className={`text-2xl font-bold tracking-tight font-sf-pro transition-all duration-500 ${
                    isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                  }`}
                >
                  {journalEntry.title}
                </h1>
              </div>
              <div
                className={`flex gap-2 transition-all duration-500 ${
                  isPageLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/journal/${params.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this journal entry.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div
              className={`grid gap-6 md:grid-cols-3 transition-all duration-500 ${
                isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <GlassCard className="md:col-span-2">
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{journalEntry.template}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {journalEntry.date}
                          <Clock className="ml-2 h-3 w-3" />
                          {journalEntry.time}
                        </div>
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs ${getMoodColor(journalEntry.moodScore)}`}>
                      {journalEntry.mood}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {journalEntry.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                    {journalEntry.relatedTrades.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        {journalEntry.relatedTrades.length} related trade
                        {journalEntry.relatedTrades.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex flex-col gap-2 p-4">
                  <h3 className="font-medium">Emotional State</h3>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${getMoodColor(journalEntry.moodScore)}`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {journalEntry.mood} ({journalEntry.moodScore}/5)
                      </div>
                      <p className="text-xs text-muted-foreground">{journalEntry.moodNotes}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className={`transition-all duration-500 ${
                isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <TabsList>
                <TabsTrigger value="content">
                  <FileText className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media">
                  <Calendar className="mr-2 h-4 w-4" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="lessons">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Key Lessons
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <Calendar className="mr-2 h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                <GlassCard className="p-6">
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: journalEntry.content }}
                  />
                </GlassCard>
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                <GlassCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Media ({journalEntry.mediaItems.length})</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {journalEntry.mediaItems.map((item) => (
                      <GlassCard key={item.id} className="overflow-hidden">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.url || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="lessons" className="mt-6">
                <GlassCard className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Key Lessons</h3>
                  <div className="space-y-4">
                    {journalEntry.lessons.map((lesson, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/50">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <p>{lesson}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <GlassCard className="p-6">
                  <JournalAnalyticsDashboard />
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
