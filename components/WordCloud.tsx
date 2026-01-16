import React from 'react';
import { WordCloudItem } from '../types';

interface Props {
  items: WordCloudItem[];
}

const WordCloud: React.FC<Props> = ({ items }) => {
  const maxVal = Math.max(...items.map(i => i.value));
  const minVal = Math.min(...items.map(i => i.value));

  const getSize = (val: number) => {
    const range = maxVal - minVal || 1;
    const normalized = (val - minVal) / range;
    return 12 + normalized * 24; 
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-6 min-h-[250px] bg-white/40 rounded-3xl border border-[#fed7aa]">
      {items.map((item, idx) => (
        <span
          key={idx}
          style={{ 
            fontSize: `${getSize(item.value)}px`,
            opacity: 0.7 + (item.value / maxVal) * 0.3
          }}
          className={`
            cursor-default transition-all duration-300 hover:scale-115 hover:opacity-100 font-bold tracking-tighter uppercase
            ${item.sentiment === 'praise' ? 'text-[#f97316]' : 'text-[#9a3412] opacity-60'}
          `}
          title={`${item.sentiment}: ${item.value} mentions`}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
};

export default WordCloud;