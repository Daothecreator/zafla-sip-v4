import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'stable';
}

function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-[#c9a84c]',
  };

  return (
    <div className="zafla-card p-4 flex items-center gap-4">
      <div className="p-3 bg-[#1a2332] rounded-lg">
        <Icon className="text-[#c9a84c]" size={24} />
      </div>
      <div>
        <p className="text-[#1a1a1a]/60 text-sm">{title}</p>
        <p className="text-[#1a1a1a] text-2xl font-bold">{value}</p>
      </div>
      <div className={`ml-auto ${trendColor[trend]}`}>
        {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
      </div>
    </div>
  );
}

export default StatsCard;
