import React from 'react';
import { X, Globe, Star, Twitter, RefreshCw, CheckCircle, Facebook, Linkedin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (source: string) => void;
}

const IntegrationPanel: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
  const sources = [
    { id: 'google', name: 'Google Reviews', icon: <Globe className="text-red-500" />, connected: true },
    { id: 'reddit', name: 'Reddit Threads', icon: <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">R</div>, connected: true },
    { id: 'twitter', name: 'Twitter / X', icon: <Twitter className="text-black" />, connected: true },
    { id: 'facebook', name: 'Facebook Groups', icon: <Facebook className="text-blue-600" />, connected: false },
    { id: 'linkedin', name: 'LinkedIn Posts', icon: <Linkedin className="text-blue-700" />, connected: false },
    { id: 'yelp', name: 'Yelp Reviews', icon: <Star className="text-rose-500" />, connected: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end bg-indigo-900/20 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-[#d1d9e6] flex items-center justify-between gradient-bg text-white">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight">Channel Ingestion</h3>
            <p className="text-[10px] uppercase font-bold tracking-[3px] opacity-70">Source Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-8 space-y-4 overflow-y-auto no-scrollbar">
          <p className="text-sm text-gray-500 mb-6 font-medium">
            Sync operational data across all major social corridors for real-time fleet intelligence.
          </p>

          {sources.map((source) => (
            <div key={source.id} className="p-5 rounded-[1.5rem] border border-[#d1d9e6] bg-gray-50 flex items-center justify-between hover:border-indigo-400 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  {source.icon}
                </div>
                <div>
                  <h4 className="font-black text-[#003366] text-sm uppercase tracking-tight">{source.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{source.connected ? 'Active Pipeline' : 'Disconnected'}</p>
                </div>
              </div>
              <button 
                onClick={() => onImport(source.id)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  source.connected 
                    ? 'bg-indigo-50 text-[#003366] hover:bg-indigo-100 border border-indigo-200' 
                    : 'gradient-bg text-white hover:shadow-lg'
                }`}
              >
                {source.connected ? (
                  <span className="flex items-center gap-1.5"><RefreshCw size={12} className="animate-spin-slow" /> Sync</span>
                ) : 'Inject'}
              </button>
            </div>
          ))}
        </div>

        <div className="p-8 bg-indigo-50 border-t border-[#d1d9e6]">
          <div className="flex items-center gap-3 text-[#0073CF] text-xs font-black uppercase tracking-widest mb-4">
            <CheckCircle size={18} />
            <span>Encrypted Data Feed</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
            Data is analyzed by Gemini 3 Pro every 5 minutes when sync is active to provide dynamic sentiment trajectory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;