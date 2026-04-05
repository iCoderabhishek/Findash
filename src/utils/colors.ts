export const chartColors = {
  blue: "#6366f1",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  pink: "#ec4899",
} as const

export const pieColors = [
  chartColors.blue,
  chartColors.red,
  chartColors.amber,
  chartColors.green,
] as const

export const cardStyles = {
  "total-spent": { icon: "text-indigo-500", bg: "bg-indigo-500/10", border: "group-hover:border-indigo-500/30" },
  income: { icon: "text-emerald-500", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30" },
  benefits: { icon: "text-violet-500", bg: "bg-violet-500/10", border: "group-hover:border-violet-500/30" },
  costs: { icon: "text-rose-500", bg: "bg-rose-500/10", border: "group-hover:border-rose-500/30" },
} as const

export const statusColors = {
  positive: "text-emerald-500",
  negative: "text-rose-500",
} as const

export const bentoCard =
  "rounded-3xl border border-border/60 bg-card p-6 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-0.5 hover:shadow-black/[0.04] dark:hover:shadow-black/20 cursor-default"

export const bentoCardStatic =
  "rounded-3xl border border-border/60 bg-card p-6"