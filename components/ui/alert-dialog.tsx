import * as React from "react"
import * as PrimitiveAlert from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/cn"

const AlertDialog = PrimitiveAlert.Root
const AlertDialogTrigger = PrimitiveAlert.Trigger

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof PrimitiveAlert.Content>,
  React.ComponentPropsWithoutRef<typeof PrimitiveAlert.Content>
>(({ className, ...props }, ref) => (
  <PrimitiveAlert.Portal>
    <PrimitiveAlert.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <PrimitiveAlert.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </PrimitiveAlert.Portal>
))
AlertDialogContent.displayName = PrimitiveAlert.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof PrimitiveAlert.Title>,
  React.ComponentPropsWithoutRef<typeof PrimitiveAlert.Title>
>(({ className, ...props }, ref) => (
  <PrimitiveAlert.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = PrimitiveAlert.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof PrimitiveAlert.Description>,
  React.ComponentPropsWithoutRef<typeof PrimitiveAlert.Description>
>(({ className, ...props }, ref) => (
  <PrimitiveAlert.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = PrimitiveAlert.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof PrimitiveAlert.Action>,
  React.ComponentPropsWithoutRef<typeof PrimitiveAlert.Action>
>(({ className, ...props }, ref) => (
  <PrimitiveAlert.Action ref={ref} className={cn("", className)} {...props} />
))
AlertDialogAction.displayName = PrimitiveAlert.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof PrimitiveAlert.Cancel>,
  React.ComponentPropsWithoutRef<typeof PrimitiveAlert.Cancel>
>(({ className, ...props }, ref) => (
  <PrimitiveAlert.Cancel ref={ref} className={cn("", className)} {...props} />
))
AlertDialogCancel.displayName = PrimitiveAlert.Cancel.displayName

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
