import * as React from "react"
import * as PrimitiveSeparator from "@radix-ui/react-separator"
import { cn } from "@/lib/cn"

const Separator = React.forwardRef<
  React.ElementRef<typeof PrimitiveSeparator.Root>,
  React.ComponentPropsWithoutRef<typeof PrimitiveSeparator.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <PrimitiveSeparator.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = PrimitiveSeparator.Root.displayName

export { Separator }
