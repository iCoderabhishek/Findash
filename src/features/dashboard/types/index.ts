export type Period = 'daily' | 'monthly' | 'yearly'

export type Trend = 'up' | 'down' | 'neutral'

export type Insight = {
  label: string
  value: string
  detail: string
  type: 'warning' | 'info' | 'success'
}

export type SummaryCard = {
  key: string
  title: string
  amount: string
  change: string
  isPositive: boolean
  iconName: string
}

export type FinancialStat = {
  title: string
  amount: string
  change: string
  isPositive: boolean
}
