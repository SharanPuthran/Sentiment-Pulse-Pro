
import React from 'react';
import { X, Globe, Star, Twitter, RefreshCw, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (source: string) => void;
}

const IntegrationPanel: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
  const sources = [
    { id: 'google', name: 'Google Reviews', icon: <Globe className="text-blue-500" />, connected: true },
    { id: 'yelp', name: 'Yelp Business', icon: <Star className="text-red-500" />, connected: false },
    { id: 'twitter', name: 'Twitter (X) Mentions', icon: <Twitter className="text-black" />, connected: false },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/20 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Data Integrations</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <p className="text-sm text-gray-500 mb-6">
            Connect your platforms to enable real-time sentiment tracking and dynamic shift alerts.
          </p>

          {sources.map((source) => (
            <div key={source.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-indigo-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {source.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-xs text-gray-400">{source.connected ? 'Last synced 2m ago' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                onClick={() => onImport(source.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  source.connected 
                    ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {source.connected ? (
                  <span className="flex items-center gap-1"><RefreshCw size={12} /> Sync</span>
                ) : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-4">
            <CheckCircle size={16} />
            <span>Ready for Real-Time Analysis</span>
          </div>
          <p className="text-xs text-gray-400 italic">
            Connecting a source allows Gemini 3 Pro to automatically ingest and categorize new reviews every 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationPanel;
