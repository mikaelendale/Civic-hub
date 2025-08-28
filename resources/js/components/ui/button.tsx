import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform  active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Default (green) Button
        default:
          "bg-primary text-primary-foreground border border-primary shadow-lg shadow-primary/30 ring-1 ring-inset ring-white/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40 dark:shadow-primary/50 dark:hover:shadow-primary/60",
        // Secondary (Dark/Light) Button
        secondary:
          "bg-gradient-to-b from-gray-800 to-black text-gray-100 border border-black shadow-lg shadow-black/30 ring-1 ring-inset ring-white/10 hover:from-gray-700 hover:to-gray-900 hover:shadow-xl hover:shadow-black/40 dark:from-gray-200 dark:to-gray-300 dark:text-gray-900 dark:border-gray-400 dark:shadow-lg dark:shadow-gray-200/20 dark:hover:from-gray-300 dark:hover:to-gray-400 dark:hover:shadow-xl dark:hover:shadow-gray-200/30 dark:ring-black/10",
        // Destructive (Red) Button
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white border border-red-700 shadow-lg shadow-red-500/30 ring-1 ring-inset ring-white/20 hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/40 dark:from-red-600 dark:to-red-700 dark:shadow-red-600/50 dark:hover:shadow-red-600/60",
        // Outline Button
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground dark:border-slate-800  dark:hover:bg-accent dark:hover:text-accent-foreground",
        // Ghost Button
        ghost: "hover:bg-background hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-slate-50",
        // Link Button
        link: "text-primary underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-10 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
