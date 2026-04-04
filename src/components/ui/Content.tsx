import OverviewCards from '../../features/dashboard/components/OverviewCards';
import ChartsSection from '../../features/dashboard/components/ChartsSection';
import TransactionsSection from '../../features/transactions/components/TransactionsSection';
import InsightsSection from '../../features/dashboard/components/InsightsSection';

function Content() {
  return (
    <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-text-secondary mt-1">Here's a summary of your financial activity.</p>
      </div>

      <OverviewCards />
      <ChartsSection />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionsSection />
        </div>
        <div className="xl:col-span-1">
          <InsightsSection />
        </div>
      </div>
    </main>
  );
}

export default Content;