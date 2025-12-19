import * as React from "react"
import { cn } from "@/lib/cn"

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
    secondary:
      "border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--muted))]",
    destructive:
      "border-transparent bg-red-500 text-white hover:bg-red-600",
    outline: "text-[hsl(var(--foreground))] border border-[hsl(var(--border))]",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
