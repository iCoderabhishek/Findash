import {
  Wallet02Icon, MoneyReceive01Icon, ProfitIcon, MoneySend01Icon,
  AlertCircleIcon, ChartBarIncreasingIcon, CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons'
import { chartColors } from '@/utils/colors'
import type { Period } from '@/features/dashboard/types'

export const OPENING_BALANCE = 62450

export const PERIOD_LABELS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'DAY' },
  { key: 'monthly', label: 'MONTH' },
  { key: 'yearly', label: 'YEAR' },
]

export const TREND_COLORS = {
  up: chartColors.green,
  down: chartColors.red,
  neutral: chartColors.blue,
} as const

export const SUMMARY_ICON_MAP: Record<string, typeof Wallet02Icon> = {
  'money': Wallet02Icon,
  'trending-up': MoneyReceive01Icon,
  'gift': ProfitIcon,
  'credit-card': MoneySend01Icon,
}

export const SUMMARY_CARD_BG: Record<string, string> = {
  'total-spent': 'bg-indigo-500/[0.03] dark:bg-indigo-500/[0.06]',
  'income': 'bg-emerald-500/[0.03] dark:bg-emerald-500/[0.06]',
  'benefits': 'bg-violet-500/[0.03] dark:bg-violet-500/[0.06]',
  'costs': 'bg-rose-500/[0.03] dark:bg-rose-500/[0.06]',
}

export const INSIGHT_TYPE_CONFIG = {
  warning: { icon: AlertCircleIcon, color: 'text-amber-500', bg: 'bg-amber-500/10', accent: 'border-l-amber-500' },
  info: { icon: ChartBarIncreasingIcon, color: 'text-indigo-500', bg: 'bg-indigo-500/10', accent: 'border-l-indigo-500' },
  success: { icon: CheckmarkBadge01Icon, color: 'text-emerald-500', bg: 'bg-emerald-500/10', accent: 'border-l-emerald-500' },
} as const
