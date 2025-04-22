"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, Calendar, ChevronRight, Filter, Plus, Search, SlidersHorizontal, Tag } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/navigation/header"
import { Sidebar } from "@/components/navigation/sidebar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for journal entries
const journalEntries = [
  {
    id: "1",
    title: "Morning Market Analysis",
    date: "2023-12-15",
    time: "08:30 AM",
    template: "Pre-Market Plan",
    tags: ["SPY", "Market Analysis", "Gap Strategy"],
    excerpt:
      "Markets showing strength in pre-market with positive economic data. Looking for potential breakouts in tech sector...",
    mood: "Focused",
    moodScore: 4,
    relatedTrades: ["AAPL-123", "MSFT-456"],
    hasMedia: true,
  },
  {
    id: "2",
    title: "AAPL Trade Reflection",
    date: "2023-12-14",
    time: "04:15 PM",
    template: "Post-Trade Reflection",
    tags: ["AAPL", "Breakout", "Success"],
    excerpt:
      "Successfully executed the AAPL breakout trade. Entry was timed well after confirmation of the level break. Managed emotions during temporary pullback...",
    mood: "Confident",
    moodScore: 5,
    relatedTrades: ["AAPL-123"],
    hasMedia: true,
  },
  {
    id: "3",
    title: "Weekly Performance Review",
    date: "2023-12-10",
    time: "06:00 PM",
    template: "Weekly Review",
    tags: ["Review", "Statistics", "Improvement"],
    excerpt:
      "This week showed improvement in win rate (68% vs 62% last week). Still struggling with holding winners long enough. Need to work on patience...",
    mood: "Reflective",
    moodScore: 3,
    relatedTrades: [],
    hasMedia: true,
  },
  {
    id: "4",
    title: "TSLA Trade Mistake Analysis",
    date: "2023-12-08",
    time: "03:45 PM",
    template: "Post-Trade Reflection",
    tags: ["TSLA", "Mistake", "Lesson"],
    excerpt:
      "Entered TSLA trade without confirmation of support level. Position sizing was too large given the volatility. Need to stick to my trading rules...",
    mood: "Disappointed",
    moodScore: 2,
    relatedTrades: ["TSLA-789"],
    hasMedia: false,
  },
  {
    id: "5",
    title: "Market Volatility Strategy",
    date: "2023-12-05",
    time: "09:15 AM",
    template: "Strategy Development",
    tags: ["Volatility", "Risk Management", "Strategy"],
    excerpt:
      "Developing a new approach for high volatility days. Will focus on smaller position sizes and tighter stops. Key levels to watch are...",
    mood: "Creative",
    moodScore: 4,
    relatedTrades: [],
    hasMedia: true,
  },
]

export default function JournalPage() {
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEntries, setFilteredEntries] = useState(journalEntries)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Simulate page load animation
    const timeout = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  // Filter entries based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(journalEntries)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = journalEntries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.excerpt.toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredEntries(filtered)
    }
  }, [searchQuery])

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
              <h1
                className={`text-3xl font-bold tracking-tight font-sf-pro transition-all duration-500 ${
                  isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}
              >
                Trading Journal
              </h1>
              <div
                className={`flex gap-2 transition-all duration-500 ${
                  isPageLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                }`}
                style={{ transitionDelay: "100ms" }}
              >
                <Button asChild>
                  <Link href="/journal/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Entry
                  </Link>
                </Button>
              </div>
            </div>

            <div
              className={`flex flex-col gap-4 sm:flex-row transition-all duration-500 ${
                isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search journal entries..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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

            <Tabs
              defaultValue="all"
              className={`transition-all duration-500 ${
                isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <TabsList>
                <TabsTrigger value="all">All Entries</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="trade">Trade Reflections</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid gap-4">
                  {filteredEntries.map((entry, index) => (
                    <Link key={entry.id} href={`/journal/${entry.id}`}>
                      <GlassCard
                        className="transition-all duration-300 hover:bg-accent/10 animate-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50">
                                <BookOpen className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="font-medium">{entry.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {entry.template} • {entry.date} {entry.time}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`rounded-full px-3 py-1 text-xs ${getMoodColor(entry.moodScore)}`}>
                                {entry.mood}
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>

                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                <Tag className="mr-1 h-3 w-3" />
                                {tag}
                              </Badge>
                            ))}
                            {entry.relatedTrades.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <Calendar className="mr-1 h-3 w-3" />
                                {entry.relatedTrades.length} related trade{entry.relatedTrades.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="daily" className="mt-4">
                <div className="grid gap-4">
                  {filteredEntries
                    .filter((entry) => entry.template === "Pre-Market Plan" || entry.template === "Post-Market Review")
                    .map((entry, index) => (
                      <Link key={entry.id} href={`/journal/${entry.id}`}>
                        <GlassCard
                          className="transition-all duration-300 hover:bg-accent/10 animate-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Same content structure as above */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{entry.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {entry.template} • {entry.date} {entry.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`rounded-full px-3 py-1 text-xs ${getMoodColor(entry.moodScore)}`}>
                                  {entry.mood}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>

                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  <Tag className="mr-1 h-3 w-3" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="trade" className="mt-4">
                <div className="grid gap-4">
                  {filteredEntries
                    .filter((entry) => entry.template === "Post-Trade Reflection")
                    .map((entry, index) => (
                      <Link key={entry.id} href={`/journal/${entry.id}`}>
                        <GlassCard
                          className="transition-all duration-300 hover:bg-accent/10 animate-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Same content structure as above */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{entry.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {entry.template} • {entry.date} {entry.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`rounded-full px-3 py-1 text-xs ${getMoodColor(entry.moodScore)}`}>
                                  {entry.mood}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>

                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  <Tag className="mr-1 h-3 w-3" />
                                  {tag}
                                </Badge>
                              ))}
                              {entry.relatedTrades.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {entry.relatedTrades.length} related trade{entry.relatedTrades.length > 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="mt-4">
                <div className="grid gap-4">
                  {filteredEntries
                    .filter((entry) => entry.template === "Weekly Review")
                    .map((entry, index) => (
                      <Link key={entry.id} href={`/journal/${entry.id}`}>
                        <GlassCard
                          className="transition-all duration-300 hover:bg-accent/10 animate-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {/* Same content structure as above */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/50">
                                  <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">{entry.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {entry.template} • {entry.date} {entry.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`rounded-full px-3 py-1 text-xs ${getMoodColor(entry.moodScore)}`}>
                                  {entry.mood}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>

                            <div className="flex flex-wrap gap-2">
                              {entry.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  <Tag className="mr-1 h-3 w-3" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
