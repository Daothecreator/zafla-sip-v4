import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, FileText, Database } from 'lucide-react';
import StatsCard from './StatsCard';

const intelData = [
  { source: 'IMF', count: 120 },
  { source: 'SEC', count: 85 },
  { source: 'Binance', count: 200 },
  { source: 'Yahoo', count: 150 },
  { source: 'World Bank', count: 95 },
];

const timelineData = [
  { date: '2026-01', acts: 2 },
  { date: '2026-02', acts: 5 },
  { date: '2026-03', acts: 8 },
  { date: '2026-04', acts: 12 },
  { date: '2026-05', acts: 15 },
  { date: '2026-06', acts: 20 },
];

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Intel Records" value="1,247" icon={Database} trend="up" />
        <StatsCard title="Legal Acts" value="62" icon={FileText} trend="up" />
        <StatsCard title="Attestation Chain" value="1,309" icon={Shield} trend="up" />
        <StatsCard title="Active Sources" value="5" icon={TrendingUp} trend="stable" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="zafla-card p-6">
          <h3 className="text-lg font-bold text-[#1a2332] mb-4">Intelligence by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={intelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#c9a84c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="zafla-card p-6">
          <h3 className="text-lg font-bold text-[#1a2332] mb-4">Legal Acts Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="acts" stroke="#c9a84c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
