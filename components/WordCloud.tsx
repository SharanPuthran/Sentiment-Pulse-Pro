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
    return 11 + normalized * 22; 
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-5 p-6 min-h-[250px] bg-[#fcfbf8] rounded-xl border border-[#eeebe3]">
      {items.map((item, idx) => (
        <span
          key={idx}
          style={{ 
            fontSize: `${getSize(item.value)}px`,
            opacity: 0.7 + (item.value / maxVal) * 0.3
          }}
          className={`
            cursor-default transition-all duration-300 hover:scale-110 hover:opacity-100 font-medium tracking-tight uppercase
            ${item.sentiment === 'praise' ? 'text-[#c4a468]' : 'text-[#2d2926] opacity-70'}
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