import * as React from "react"
import * as PrimitiveProgress from "@radix-ui/react-progress"
import { cn } from "@/lib/cn"

const Progress = React.forwardRef<
  React.ElementRef<typeof PrimitiveProgress.Root>,
  React.ComponentPropsWithoutRef<typeof PrimitiveProgress.Root>
>(({ className, value, ...props }, ref) => (
  <PrimitiveProgress.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <PrimitiveProgress.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </PrimitiveProgress.Root>
))
Progress.displayName = PrimitiveProgress.Root.displayName

export { Progress }
