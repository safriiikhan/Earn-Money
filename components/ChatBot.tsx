
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../services/aiService';
import GlassCard from './GlassCard';
import { User } from '../types';

interface ChatBotProps {
  user: User | null;
}

const ChatBot: React.FC<ChatBotProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am AdVault AI. How can I help you maximize your earnings today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    // Format history for Gemini API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getChatResponse(history, userText);
    setMessages(prev => [...prev, { role: 'model', text: response || 'I am sorry, I could not process that request.' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-[100] md:bottom-8 md:right-8">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-[360px] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <GlassCard className="flex h-[500px] flex-col overflow-hidden border-blue-500/30 p-0 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-blue-600/10 px-4 py-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <i className="fa-solid fa-robot text-sm"></i>
                </div>
                <div className="overflow-hidden">
                  <h4 className="truncate text-sm font-bold text-white">
                    AdVault Assistant 
                    {user && (
                      <span className="ml-1 text-[9px] font-normal text-blue-300">
                        • {user.email}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-gray-400">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2.5">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:0.2s]"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-500 [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="border-t border-white/10 p-3 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages or earnings..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 py-3 pl-4 pr-12 text-xs text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:outline-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:text-gray-600"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-gradient-to-br from-blue-600 to-purple-700 hover:shadow-blue-500/40'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-xl`}></i>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 flex h-5 w-5 animate-bounce items-center justify-center rounded-full bg-green-500 text-[10px] font-bold ring-2 ring-black">
            1
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
