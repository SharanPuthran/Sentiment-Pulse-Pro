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
  Compass,
  LayoutGrid
} from 'lucide-react';
import { analyzeReviews } from './services/geminiService';
import { DashboardReport, CategoryData, ReviewEntry } from './types';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ChatBot from './components/ChatBot';
import IntegrationPanel from './components/IntegrationPanel';

const ETIHAD_MOCK_FEED = [
  { text: "The First Class Lounge in Abu Dhabi is absolute perfection. World class dining.", source: 'google' },
  { text: "Etihad Guest miles devaluation is really frustrating. Considering switching to another carrier.", source: 'reddit' },
  { text: "Cabin crew on EY12 were exceptional. True Arabic hospitality.", source: 'facebook' },
  { text: "Our First Studio flight to London was delayed by 4 hours. No communication from ground staff.", source: 'twitter' },
  { text: "Etihad's focus on sustainable aviation fuel is a great strategic move for the brand.", source: 'linkedin' },
  { text: "Business class seats are starting to feel a bit dated on the older 777s.", source: 'yelp' },
  { text: "Smooth booking process via the mobile app. Highly recommended.", source: 'google' },
  { text: "Poor response from customer support regarding my lost baggage.", source: 'facebook' },
  { text: "Reddit thread: Best ways to spend Etihad Guest miles after the recent changes.", source: 'reddit' },
  { text: "Honored to share our partnership with Etihad Airways on new sustainability tech.", source: 'linkedin' },
];

const App: React.FC = () => {
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackgroundUpdating, setIsBackgroundUpdating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  
  // Simulation Logic
  useEffect(() => {
    let interval: any;
    if (isLiveSyncing) {
      interval = setInterval(() => {
        const randomReview = ETIHAD_MOCK_FEED[Math.floor(Math.random() * ETIHAD_MOCK_FEED.length)];
        const newEntry: ReviewEntry = {
          id: Math.random().toString(36).substr(2, 9),
          text: randomReview.text,
          source: randomReview.source as any,
          timestamp: new Date()
        };
        setReviews(prev => [newEntry, ...prev.slice(0, 49)]);
      }, 7000);
    }
    return () => clearInterval(interval);
  }, [isLiveSyncing]);

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
      console.error("Background sync failed", err);
    } finally {
      setIsBackgroundUpdating(false);
    }
  };

  const startInitialAnalysis = async () => {
    const initial = ETIHAD_MOCK_FEED.slice(0, 5).map(r => ({
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
      case 'twitter': return <Twitter size={14} className="text-sky-500" />;
      case 'google': return <Globe size={14} className="text-red-500" />;
      case 'yelp': return <Star size={14} className="text-rose-500" />;
      case 'facebook': return <Facebook size={14} className="text-blue-600" />;
      case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
      case 'reddit': return <div className="w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">R</div>;
      default: return <Globe size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fcfbf8]">
      <header className="bg-white/95 backdrop-blur-md border-b border-[#eeebe3] sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 gradient-bg rounded-lg flex items-center justify-center shadow-lg">
              <Compass className="text-[#c4a468]" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#2d2926] uppercase">
                Etihad <span className="text-[#c4a468] font-normal">Horizon</span>
              </h1>
              {isLiveSyncing && (
                <div className="flex items-center gap-1.5 text-[10px] text-[#c4a468] font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-[#c4a468] rounded-full animate-pulse"></div>
                  Guest Sentiment Live Monitor
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLiveSyncing(!isLiveSyncing)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider ${
                isLiveSyncing ? 'bg-[#2d2926] text-white' : 'bg-[#c4a468] text-[#2d2926] hover:shadow-lg'
              }`}
            >
              <Zap size={14} fill={isLiveSyncing ? 'currentColor' : 'none'} />
              {isLiveSyncing ? 'Terminate Feed' : 'Initiate Live Feed'}
            </button>
            <button 
              onClick={() => setIsIntegrationsOpen(true)}
              className="px-5 py-2.5 rounded-md text-xs font-bold bg-white border border-[#eeebe3] text-[#2d2926] hover:bg-[#f9f8f4] transition-all uppercase tracking-wider"
            >
              Connect Channels
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {!report && !isLoading ? (
          <div className="max-w-4xl mx-auto text-center py-20 space-y-10">
            <div className="space-y-4">
              <h2 className="text-6xl font-extrabold text-[#2d2926] tracking-tight">
                Guest Experience <br/>
                <span className="text-[#c4a468]">Intelligence.</span>
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                Analyze multi-channel sentiment across Google, Reddit, Yelp, Facebook, and LinkedIn. Leverage Etihad-tuned Gemini intelligence for world-class insights.
              </p>
            </div>
            <button 
              onClick={startInitialAnalysis}
              className="px-14 py-5 gold-gradient text-[#2d2926] font-bold rounded-md shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[2px]"
            >
              Enter Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-1000">
            {/* Live Social Feed Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <div className="premium-card rounded-xl flex flex-col h-[750px] overflow-hidden">
                <div className="p-6 border-b border-[#eeebe3] flex items-center justify-between bg-[#fcfbf8]">
                  <h3 className="font-bold text-[#2d2926] flex items-center gap-2 uppercase text-xs tracking-widest">
                    <Activity size={16} className="text-[#c4a468]" />
                    Guest Stream
                  </h3>
                  {isBackgroundUpdating && <Loader2 size={14} className="animate-spin text-[#c4a468]" />}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white no-scrollbar">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-[#fcfbf8] rounded-lg border border-[#eeebe3] hover:border-[#c4a468]/30 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <SourceIcon source={rev.source} />
                          <span className="text-[10px] font-bold uppercase text-[#c4a468] tracking-widest">{rev.source}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium">
                          {rev.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#2d2926] leading-[1.6] font-normal">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Insights Panel */}
            <div className="lg:col-span-9 space-y-10">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#eeebe3] border-t-[#c4a468] rounded-full animate-spin"></div>
                    <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#c4a468]" size={24} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-[#2d2926] uppercase tracking-widest mb-2">Synchronizing Global Channels</p>
                    <p className="text-xs text-gray-400 italic font-light">Analyzing First, Business, and Economy Guest feedback...</p>
                  </div>
                </div>
              ) : report && (
                <>
                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                    <button 
                      onClick={() => setActiveCategory(null)}
                      className={`px-6 py-2.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all uppercase tracking-widest ${!activeCategory ? 'bg-[#2d2926] text-white shadow-lg' : 'bg-white text-[#2d2926] border border-[#eeebe3] hover:bg-[#fcfbf8]'}`}
                    >
                      Entire Network
                    </button>
                    {report.categories.map((cat, i) => (
                      <button 
                        key={i}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-3 uppercase tracking-widest ${activeCategory === cat.name ? 'bg-[#2d2926] text-white shadow-lg' : 'bg-white text-[#2d2926] border border-[#eeebe3] hover:bg-[#fcfbf8]'}`}
                      >
                        {cat.name}
                        <span className={`px-2 py-0.5 rounded text-[9px] ${cat.sentimentScore > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          {(cat.sentimentScore * 100).toFixed(0)}%
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Sentiment Chart */}
                    <div className="premium-card p-8 rounded-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                         <TrendingUp className="w-full h-full" />
                       </div>
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-[#2d2926] uppercase text-xs tracking-widest">Sentiment Trajectory</h3>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-[#c4a468] bg-[#fcfbf8] px-3 py-1 rounded border border-[#eeebe3] uppercase tracking-tighter">
                          Live Data Buffer
                        </div>
                      </div>
                      <SentimentChart data={report.sentimentTrend} />
                    </div>

                    {/* Word Cloud */}
                    <div className="premium-card p-8 rounded-xl">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-[#2d2926] uppercase text-xs tracking-widest">Global Guest Vocabulary</h3>
                        <span className="text-[9px] text-[#c4a468] font-bold bg-[#fcfbf8] px-2 py-1 border border-[#eeebe3] rounded uppercase tracking-tighter">Updating</span>
                      </div>
                      <WordCloud items={report.wordCloud} />
                    </div>
                  </div>

                  {/* Executive Summary */}
                  <div className="premium-card p-10 rounded-xl bg-white relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#c4a468]"></div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-[#fcfbf8] border border-[#eeebe3] rounded-lg flex items-center justify-center text-[#c4a468]">
                        <LayoutGrid size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#2d2926] uppercase tracking-wider">Guest Insights Summary</h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[2px] mt-1">AI-Generated Intelligence</p>
                      </div>
                    </div>
                    <p className="text-[#2d2926]/80 leading-[1.8] text-lg font-light italic">
                      "{report.executiveSummary}"
                    </p>
                  </div>

                  {/* Actionable Tasks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {report.actionableAreas.map((area, idx) => (
                      <div key={idx} className="premium-card p-6 rounded-xl group hover:border-[#c4a468] transition-all">
                        <div className={`text-[9px] font-bold uppercase tracking-[2px] mb-4 px-3 py-1.5 rounded w-fit ${
                          area.impact === 'High' ? 'bg-[#2d2926] text-[#c4a468]' : 'bg-[#fcfbf8] text-[#2d2926] border border-[#eeebe3]'
                        }`}>
                          {area.impact} Priority
                        </div>
                        <h4 className="font-bold text-[#2d2926] mb-3 text-sm uppercase tracking-tight">{area.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-light">{area.description}</p>
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