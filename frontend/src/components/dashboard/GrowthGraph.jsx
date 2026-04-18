import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const GrowthGraph = ({ history }) => {
  // Sort history by date and map for chart
  const data = history
    .map(h => ({
      name: h.date,
      score: h.score,
    }))
    .reverse(); // Newest first to chart order

  if (data.length < 2) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2">trending_up</span>
        <p className="text-sm font-medium">Capture more data points to visualize your growth trajectory.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthGraph;
