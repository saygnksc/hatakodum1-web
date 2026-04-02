import React, { useState } from 'react';
import { Search, MessageSquare, Image as ImageIcon, Settings, Info } from 'lucide-react';
import { DiagnosisView } from './components/DiagnosisView';
import { ChatView } from './components/ChatView';
import { ImageView } from './components/ImageView';

type Tab = 'diagnose' | 'chat' | 'image';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('diagnose');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
              hatakodum<span className="text-blue-600">.com</span>
            </span>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('diagnose')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'diagnose' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Hata Sorgula</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">Teknik Destek</span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden md:inline">Görselleştir</span>
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'diagnose' && <DiagnosisView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'image' && <ImageView />}
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                H
              </div>
              <span className="text-lg font-bold text-slate-900">hatakodum.com</span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed">
              Yapay zeka teknolojisi ile cihazlarınızdaki hata kodlarını saniyeler içinde analiz ediyor, 
              size en doğru çözüm yollarını ve maliyet tahminlerini sunuyoruz.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => setActiveTab('diagnose')} className="hover:text-blue-600 transition-colors">Hata Sorgula</button></li>
              <li><button onClick={() => setActiveTab('chat')} className="hover:text-blue-600 transition-colors">Teknik Destek</button></li>
              <li><button onClick={() => setActiveTab('image')} className="hover:text-blue-600 transition-colors">Görsel Analiz</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Yasal</h4>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Kullanım Koşulları</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Sorumluluk Reddi</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          © 2026 hatakodum.com - Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
