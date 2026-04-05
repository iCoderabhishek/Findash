import SummaryCards from './summary-cards'
import CashMonitoring from './cash-monitoring'
import TotalSales from './total-sales'
import FinancialStats from './financial-stats'
import InsightsSection from './insights-section'
import LastActivity from '@/features/transactions/components/last-activity'

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-3xl font-light text-foreground tracking-tight">
          Your finances, <span className="font-extrabold">secured.</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1 tracking-wide">
          Everything at a glance
        </p>
      </div>

      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashMonitoring />
        </div>
        <div className="lg:col-span-1">
          <TotalSales />
        </div>
      </div>

      <FinancialStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <LastActivity />
        </div>
        <div className="xl:col-span-1">
          <InsightsSection />
        </div>
      </div>
    </div>
  )
}
