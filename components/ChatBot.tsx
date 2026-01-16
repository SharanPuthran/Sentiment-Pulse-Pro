import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Brain, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.role !== 'thought')
        .map(m => ({
          role: m.role as 'user' | 'model',
          parts: [{ text: m.text }]
        }));

      const response = await getChatResponse(input, history, isThinkingMode);
      
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Operational error occurred. Please retry your query." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col border border-orange-100 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="gradient-bg p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span className="font-black uppercase tracking-widest text-sm">Ops Assistant</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsThinkingMode(!isThinkingMode)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${isThinkingMode ? 'bg-white text-[#9a3412]' : 'bg-white/20 text-white'}`}
              >
                <Brain size={14} />
                {isThinkingMode ? 'Reasoning ON' : 'Normal'}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X size={20} />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-orange-50/20 no-scrollbar">
            {messages.length === 0 && (
              <div className="text-center py-10 text-orange-400">
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">Ready for operational queries</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'orange-gradient text-white rounded-tr-none shadow-md'
                    : 'bg-white text-[#9a3412] shadow-sm border border-orange-100 rounded-tl-none font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 rounded-tl-none flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#f97316]" />
                  <span className="text-[10px] text-orange-400 font-black uppercase tracking-widest">
                    {isThinkingMode ? 'Deep Analysis...' : 'Consulting Gemini...'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about Indigo sentiment..."
                className="flex-1 px-5 py-3 bg-orange-50/50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-orange-500 text-[#9a3412]"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-3 gradient-bg text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="gradient-bg p-5 rounded-full shadow-2xl text-white hover:scale-110 transition-transform border-4 border-white"
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatBot;