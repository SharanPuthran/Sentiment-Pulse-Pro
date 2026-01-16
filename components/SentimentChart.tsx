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
    const colorClass = score > 0 ? 'text-[#c4a468]' : score < 0 ? 'text-[#2d2926]' : 'text-gray-400';
    return (
      <div className="bg-white p-4 border border-[#eeebe3] rounded shadow-xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-bold ${colorClass}`}>
          {(score * 100).toFixed(0)}%
        </p>
        <p className="text-[10px] text-gray-400 uppercase mt-2">{payload[0].payload.label}</p>
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeebe3" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#c4a468', fontSize: 9, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            domain={[-1, 1]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c4a468', strokeWidth: 1 }} />
          <ReferenceLine y={0} stroke="#eeebe3" strokeWidth={1} />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#c4a468" 
            strokeWidth={4} 
            dot={{ r: 5, fill: '#c4a468', strokeWidth: 3, stroke: '#fff' }}
            activeDot={{ r: 7, strokeWidth: 0, fill: '#2d2926' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;