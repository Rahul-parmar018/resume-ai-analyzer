import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

const SkillsGapChart = ({ matchedSkills = [], missingSkills = [] }) => {
  // Combine for comparison: matched = 100%, missing = 20%
  const data = [
    ...matchedSkills.slice(0, 5).map(s => ({ name: s, value: 100, status: 'matched' })),
    ...missingSkills.slice(0, 5).map(s => ({ name: s, value: 30, status: 'missing' }))
  ].sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
        <p className="text-sm font-medium">No skill data detected yet. Analyze a resume to see coverage.</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} 
            width={80}
          />
          <Tooltip 
            cursor={{fill: 'transparent'}}
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#fff',
              fontSize: '10px'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.status === 'matched' ? '#10b981' : '#f43f5e'} 
                fillOpacity={entry.status === 'matched' ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsGapChart;
