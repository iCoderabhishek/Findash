import { PiWallet, PiArrowUpRight, PiArrowDownRight } from 'react-icons/pi';
import data from '../../../data/data.json';

const iconMap: Record<string, any> = {
  PiWallet,
  PiArrowUpRight,
  PiArrowDownRight
};

export default function OverviewCards() {
  const cards = data.cards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = iconMap[card.iconName];
        return (
          <div 
            key={index} 
            className="bg-bg-surface p-6 rounded-2xl border border-border-subtle hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text-secondary text-sm font-medium">{card.title}</h3>
              <div aria-hidden="true" className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bgColor}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold text-text-primary tracking-tight">{card.amount}</h2>
              <span 
                className={`text-sm font-medium ${
                  card.isPositive ? 'text-success' : 'text-danger'
                }`}
              >
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
