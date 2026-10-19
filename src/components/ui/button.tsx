import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-none border-2 border-ink bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-ink shadow-[4px_4px_0_0_#0b0b0c] hover:shadow-[6px_6px_0_0_#0b0b0c] hover:-translate-x-0.5 hover:-translate-y-0.5",
        outline:
          "border-ink bg-background text-foreground shadow-[4px_4px_0_0_#0b0b0c] hover:shadow-[6px_6px_0_0_#0b0b0c] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-muted",
        secondary:
          "border-ink bg-secondary text-secondary-foreground shadow-[3px_3px_0_0_#0b0b0c] hover:shadow-[5px_5px_0_0_#0b0b0c] hover:-translate-x-0.5 hover:-translate-y-0.5",
        ghost:
          "border-transparent text-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "border-ink bg-destructive text-destructive-foreground shadow-[4px_4px_0_0_#0b0b0c] hover:shadow-[6px_6px_0_0_#0b0b0c] hover:-translate-x-0.5 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-7 gap-1 rounded-none px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-none px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs": "size-7 rounded-none [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-none",
        "icon-lg": "size-10",
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
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
