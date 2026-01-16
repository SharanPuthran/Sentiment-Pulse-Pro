import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  MessageSquare, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowLeftRight,
  Plus,
  Share2,
  Filter,
  Twitter,
  Globe,
  Star,
  Activity,
  Zap,
  Facebook,
  Linkedin,
  Plane,
  LayoutGrid
} from 'lucide-react';
import { analyzeReviews } from './services/geminiService';
import { DashboardReport, CategoryData, ReviewEntry } from './types';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ChatBot from './components/ChatBot';
import IntegrationPanel from './components/IntegrationPanel';

const INDIGO_MOCK_FEED = [
  { text: "Indigo 6E-2104 delayed by 2 hours. Extremely poor communication at the gate.", source: 'twitter' },
  { text: "Web check-in process is so smooth! Love the efficiency of the Indigo app.", source: 'google' },
  { text: "Reddit: Why does Indigo charge for every small thing? Water should be free.", source: 'reddit' },
  { text: "Ground staff at Kolkata airport helped me with my extra baggage seamlessly.", source: 'facebook' },
  { text: "Proud to see Indigo expanding its international network. Great for Indian aviation.", source: 'linkedin' },
  { text: "Yelp: Standard LCC experience. On time but seats are quite cramped.", source: 'yelp' },
  { text: "Indigo's 6E Prime service is worth the extra money for the meal and seat.", source: 'google' },
  { text: "Lost my luggage on the flight from Delhi. Still waiting for an update.", source: 'facebook' },
  { text: "Best on-time performance in India. Indigo always delivers on punctuality.", source: 'linkedin' },
  { text: "Cabin crew was polite but the cabin itself looked a bit worn out.", source: 'twitter' },
];

const App: React.FC = () => {
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackgroundUpdating, setIsBackgroundUpdating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  
  // Real-time Simulation Engine
  useEffect(() => {
    let interval: any;
    if (isLiveSyncing) {
      interval = setInterval(() => {
        const randomReview = INDIGO_MOCK_FEED[Math.floor(Math.random() * INDIGO_MOCK_FEED.length)];
        const newEntry: ReviewEntry = {
          id: Math.random().toString(36).substr(2, 9),
          text: randomReview.text,
          source: randomReview.source as any,
          timestamp: new Date()
        };
        setReviews(prev => [newEntry, ...prev.slice(0, 49)]);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isLiveSyncing]);

  // Background Auto-Analysis
  useEffect(() => {
    if (reviews.length > 0 && reviews.length % 3 === 0) {
      handleBackgroundAnalyze();
    }
  }, [reviews.length]);

  const handleBackgroundAnalyze = async () => {
    if (reviews.length === 0) return;
    setIsBackgroundUpdating(true);
    try {
      const fullText = reviews.map(r => `[${r.source.toUpperCase()}] ${r.text}`).join('\n');
      const data = await analyzeReviews(fullText, activeCategory || undefined);
      setReport(data);
    } catch (err) {
      console.error("Analysis sync failed", err);
    } finally {
      setIsBackgroundUpdating(false);
    }
  };

  const startInitialAnalysis = async () => {
    const initial = INDIGO_MOCK_FEED.slice(0, 6).map(r => ({
      id: Math.random().toString(36).substr(2, 9),
      text: r.text,
      source: r.source as any,
      timestamp: new Date()
    }));
    setReviews(initial);
    setIsLoading(true);
    const fullText = initial.map(r => `[${r.source.toUpperCase()}] ${r.text}`).join('\n');
    const data = await analyzeReviews(fullText);
    setReport(data);
    setIsLoading(false);
    setIsLiveSyncing(true);
  };

  const SourceIcon = ({ source }: { source: string }) => {
    switch(source) {
      case 'twitter': return <Twitter size={14} className="text-sky-400" />;
      case 'google': return <Globe size={14} className="text-red-400" />;
      case 'yelp': return <Star size={14} className="text-rose-400" />;
      case 'facebook': return <Facebook size={14} className="text-blue-500" />;
      case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
      case 'reddit': return <div className="w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">R</div>;
      default: return <Globe size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#f0f4f8]">
      <header className="bg-white/95 backdrop-blur-md border-b border-[#d1d9e6] sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* IndiGo Official Logo Representation */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-[#003366] tracking-tight">Indi</span>
                <span className="text-4xl font-normal text-[#003366] tracking-tight">Go</span>
              </div>
              <div className="ml-1 relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#003366]">
                  {/* Simplified dotted plane icon as per IndiGo branding */}
                  <circle cx="20" cy="50" r="4" fill="currentColor" />
                  <circle cx="35" cy="50" r="4" fill="currentColor" />
                  <circle cx="50" cy="50" r="4" fill="currentColor" />
                  <circle cx="65" cy="40" r="4" fill="currentColor" />
                  <circle cx="80" cy="30" r="4" fill="currentColor" />
                  <circle cx="65" cy="60" r="4" fill="currentColor" />
                  <circle cx="80" cy="70" r="4" fill="currentColor" />
                  <circle cx="95" cy="50" r="4" fill="currentColor" />
                  <circle cx="80" cy="50" r="4" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-gray-200 hidden md:block"></div>
            
            <div className="hidden md:block">
              <h2 className="text-[10px] font-black uppercase text-indigo-400 tracking-[3px] mb-0.5">Sentiment Intelligence</h2>
              {isLiveSyncing && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  Real-time Network Sync
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLiveSyncing(!isLiveSyncing)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest shadow-md ${
                isLiveSyncing ? 'bg-rose-500 text-white hover:bg-rose-600' : 'indigo-gradient text-white hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <Zap size={14} fill={isLiveSyncing ? 'currentColor' : 'none'} />
              {isLiveSyncing ? 'Stop Monitoring' : 'Start Live Monitor'}
            </button>
            <button 
              onClick={() => setIsIntegrationsOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold bg-white border border-[#d1d9e6] text-[#003366] hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
              Channels
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!report && !isLoading ? (
          <div className="max-w-4xl mx-auto text-center py-20 space-y-12">
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-[#003366] tracking-tight leading-tight">
                Global Network <br/>
                <span className="indigo-accent">Sentiment Control.</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                Unified intelligence across Google, Reddit, Yelp, Facebook, LinkedIn, and Twitter. Transform social noise into operational fuel for IndiGo.
              </p>
            </div>
            <button 
              onClick={startInitialAnalysis}
              className="px-14 py-5 gradient-bg text-white font-black rounded-full shadow-2xl shadow-indigo-900/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-[3px]"
            >
              Initialize Intelligence
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-1000">
            {/* Live Feed Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-card rounded-[2rem] flex flex-col h-[750px] overflow-hidden">
                <div className="p-6 border-b border-[#d1d9e6] flex items-center justify-between bg-white/50">
                  <h3 className="font-bold text-[#003366] flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Activity size={16} className="indigo-accent" />
                    Operational Stream
                  </h3>
                  {isBackgroundUpdating && <Loader2 size={14} className="animate-spin indigo-accent" />}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white/80 rounded-2xl border border-[#d1d9e6] hover:border-indigo-400 transition-all shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <SourceIcon source={rev.source} />
                          <span className="text-[10px] font-black uppercase text-[#003366] tracking-tighter opacity-60">{rev.source}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold">
                          {rev.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-800 leading-relaxed font-medium">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="lg:col-span-9 space-y-10">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 border-8 border-indigo-100 border-t-[#003366] rounded-full animate-spin"></div>
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#003366]" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-[#003366] uppercase tracking-[4px] mb-2 text-xl">Operational Uplink</p>
                    <p className="text-sm text-gray-400 italic font-medium">Processing global feedback threads...</p>
                  </div>
                </div>
              ) : report && (
                <>
                  {/* Category Selection */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className={`px-6 py-3 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${!activeCategory ? 'gradient-bg text-white shadow-lg' : 'bg-white text-[#003366] border border-[#d1d9e6] hover:bg-gray-50'}`}
                    >
                      Entire Fleet
                    </button>
                    {report.categories.map((cat, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-6 py-3 rounded-full text-[10px] font-black whitespace-nowrap transition-all flex items-center gap-3 uppercase tracking-widest ${activeCategory === cat.name ? 'gradient-bg text-white shadow-lg' : 'bg-white text-[#003366] border border-[#d1d9e6] hover:bg-gray-50'}`}
                      >
                        {cat.name}
                        <span className={`px-2 py-0.5 rounded text-[9px] ${cat.sentimentScore > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                          {(cat.sentimentScore * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Trend Chart */}
                    <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-[#003366] uppercase text-xs tracking-widest flex items-center gap-2">
                          <TrendingUp size={16} />
                          Sentiment Trajectory
                        </h3>
                        <div className="text-[9px] font-bold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase">
                          Dynamic Feed
                        </div>
                      </div>
                      <SentimentChart data={report.sentimentTrend} />
                    </div>

                    {/* Word Cloud */}
                    <div className="glass-card p-8 rounded-[2.5rem]">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-[#003366] uppercase text-xs tracking-widest flex items-center gap-2">
                          <LayoutGrid size={16} />
                          Keyword Pulse
                        </h3>
                        <span className="text-[9px] text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded uppercase animate-pulse">Growing</span>
                      </div>
                      <WordCloud items={report.wordCloud} />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="glass-card p-10 rounded-[2.5rem] bg-gradient-to-br from-white to-indigo-50/30 relative border-l-[12px] border-l-[#003366]">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 indigo-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-300">
                        <MessageSquare className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-[#003366] uppercase tracking-tight">Executive Ops Summary</h3>
                        <p className="text-[10px] text-indigo-400 uppercase tracking-[3px] font-bold">AI Intelligence Unit</p>
                      </div>
                    </div>
                    <p className="text-[#003366]/80 leading-relaxed text-xl font-medium">
                      "{report.executiveSummary}"
                    </p>
                  </div>

                  {/* Action Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {report.actionableAreas.map((area, idx) => (
                      <div key={idx} className="glass-card p-8 rounded-[2rem] group hover:scale-[1.02] transition-all border-b-4 border-b-[#0073CF]">
                        <div className={`text-[9px] font-black uppercase tracking-[2px] mb-6 px-4 py-2 rounded-full w-fit ${
                          area.impact === 'High' ? 'gradient-bg text-white shadow-md' : 'bg-gray-100 text-[#003366]'
                        }`}>
                          {area.impact} Priority
                        </div>
                        <h4 className="font-black text-[#003366] mb-4 text-sm uppercase tracking-tight leading-tight">{area.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{area.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <IntegrationPanel 
        isOpen={isIntegrationsOpen} 
        onClose={() => setIsIntegrationsOpen(false)} 
        onImport={() => {}}
      />
      <ChatBot />
    </div>
  );
};

export default App;