"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Import,
  LineChart,
  PenTool,
  Settings,
  Sigma,
  Sparkles,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const pathname = usePathname()

  // Collapse sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(false)
      } else {
        setExpanded(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Trades", href: "/trades", icon: LineChart },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Playbook", href: "/playbook", icon: Target },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Import", href: "/import/csv", icon: Import },
    { name: "Brokers", href: "/brokers", icon: CreditCard },
  ]

  const secondaryNavItems = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: FileText },
  ]

  return (
    <div className="relative min-h-screen">
      <motion.div
        className={cn(
          "fixed top-0 left-0 z-20 h-full bg-black/20 backdrop-blur-xl border-r border-white/10",
          "transition-all duration-300 ease-in-out",
        )}
        animate={{ width: expanded ? 240 : 80 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex items-center"
                >
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
                    TradeJournal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setExpanded(!expanded)}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
            >
              {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          <div className="flex-1 overflow-auto py-2">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "hover:bg-white/10",
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                      ? "bg-white/10 text-white"
                      : "text-white/70",
                  )}
                >
                  <item.icon size={20} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </nav>

            <div className="mt-6 px-4">
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">AI Assistant</h3>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-2 space-y-1">
                <Link
                  href="/ai/analysis"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "hover:bg-white/10",
                    pathname === "/ai/analysis" ? "bg-white/10 text-white" : "text-white/70",
                  )}
                >
                  <Sparkles size={20} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                      >
                        Trade Analysis
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <Link
                  href="/ai/journal"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "hover:bg-white/10",
                    pathname === "/ai/journal" ? "bg-white/10 text-white" : "text-white/70",
                  )}
                >
                  <PenTool size={20} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                      >
                        Journal Assistant
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <Link
                  href="/ai/patterns"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "hover:bg-white/10",
                    pathname === "/ai/patterns" ? "bg-white/10 text-white" : "text-white/70",
                  )}
                >
                  <Sigma size={20} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                      >
                        Pattern Detection
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/10">
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    "hover:bg-white/10",
                    pathname === item.href ? "bg-white/10 text-white" : "text-white/70",
                  )}
                >
                  <item.icon size={20} />
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
