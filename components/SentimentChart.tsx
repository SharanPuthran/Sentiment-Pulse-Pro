import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { SentimentDataPoint } from '../types';

interface Props {
  data: SentimentDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    const colorClass = score > 0 ? 'text-[#0073CF]' : score < 0 ? 'text-[#003366]' : 'text-gray-400';
    return (
      <div className="bg-white p-4 border border-[#d1d9e6] rounded-2xl shadow-xl">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black ${colorClass}`}>
          {(score * 100).toFixed(0)}%
        </p>
        <p className="text-[9px] text-gray-400 uppercase font-bold mt-2">{payload[0].payload.label}</p>
      </div>
    );
  }
  return null;
};

const SentimentChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d9e6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#003366', fontSize: 10, fontWeight: 800 }}
            dy={10}
          />
          <YAxis 
            domain={[-1, 1]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0073CF', strokeWidth: 2 }} />
          <ReferenceLine y={0} stroke="#d1d9e6" strokeWidth={2} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#003366" 
            strokeWidth={5} 
            dot={{ r: 6, fill: '#0073CF', strokeWidth: 4, stroke: '#fff' }}
            activeDot={{ r: 9, strokeWidth: 0, fill: '#003366' }}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;