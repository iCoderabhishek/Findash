import MainLayout from '@/layouts/main-layout'
import DashboardContent from '@/features/dashboard/components/dashboard-content'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useDashboard } from '@/store/dashboard-store'

function App() {
  const theme = useDashboard(s => s.theme)
  document.documentElement.classList.toggle('dark', theme === 'dark')

  return (
    <TooltipProvider delayDuration={200}>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </TooltipProvider>
  )
}

export default App
