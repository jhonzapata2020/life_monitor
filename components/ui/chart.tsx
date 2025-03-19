import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("relative", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<SVGSVGElement, React.SVGAttributes<SVGSVGElement>>(({ className, ...props }, ref) => {
  return <svg className={cn("h-full w-full", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "pointer-events-none absolute z-50 flex h-auto w-auto min-w-[160px] flex-col items-start rounded-md border border-border bg-popover p-2 text-sm font-normal text-popover-foreground shadow-md outline-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, labelClassName, valueClassName, ...props }, ref) => {
    return (
      <div className={cn("grid gap-1.5", className)} ref={ref} {...props}>
        <div className={cn("font-medium leading-none", labelClassName)} />
        <div className={cn("font-bold", valueClassName)} />
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, itemClassName, iconClassName, ...props }, ref) => {
    return <div className={cn("flex flex-wrap", className)} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, iconClassName, name, color, ...props }, ref) => {
    return (
      <div className={cn("flex items-center", className)} ref={ref} {...props}>
        {color ? (
          <svg className={cn("mr-2 h-4 w-4", iconClassName)}>
            <rect width="100%" height="100%" fill={color} />
          </svg>
        ) : null}
        {name}
      </div>
    )
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

export { ChartContainer, Chart, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

