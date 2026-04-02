import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { sendChatMessage } from '../lib/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const responseText = await sendChatMessage(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-200px)] flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Teknik Destek</h2>
        <p className="text-slate-600">Arızanız hakkında detaylı bilgi alın.</p>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto glass-panel rounded-2xl p-6 mb-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <Bot className="w-12 h-12" />
            <p>Merhaba! Cihazınızdaki sorunla ilgili bana her şeyi sorabilirsiniz.</p>
          </div>
        )}
        
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-lg flex-shrink-0 h-fit ${msg.role === 'user' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600" /> : <Bot className="w-5 h-5 text-slate-600" />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-slate-100 h-fit">
                <Bot className="w-5 h-5 text-slate-600" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          placeholder="Mesajınızı yazın..."
          className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-16 shadow-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
