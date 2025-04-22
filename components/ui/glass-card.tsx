import { cn } from "@/lib/utils"
import { type HTMLAttributes, forwardRef } from "react"

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({ className, hoverEffect = true, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("glass-card rounded-xl p-4 transition-all duration-300", hoverEffect && "hover-scale", className)}
      {...props}
    />
  )
})
GlassCard.displayName = "GlassCard"

export { GlassCard }
