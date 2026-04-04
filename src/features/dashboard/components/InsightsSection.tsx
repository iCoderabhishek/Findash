import { PiTrendUp, PiWarningCircle, PiShoppingBag } from 'react-icons/pi';
import data from '../../../data/data.json';

const iconMap: Record<string, any> = {
  PiShoppingBag,
  PiTrendUp,
  PiWarningCircle
};

export default function InsightsSection() {
  const insights = data.insights;

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200 h-full flex flex-col">
      <h3 className="text-text-primary font-semibold mb-6">Quick Insights</h3>
      <div className="flex flex-col gap-6 flex-1 justify-center">
        {insights.map((insight, idx) => {
          const Icon = iconMap[insight.iconName];
          return (
            <div key={idx} className="flex items-start gap-4">
              <div aria-hidden="true" className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${insight.bgColor}`}>
                <Icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-medium text-text-secondary">{insight.title}</h4>
                <p className="text-text-primary font-semibold mt-0.5">{insight.value}</p>
                <p className="text-xs text-text-muted mt-1">{insight.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
