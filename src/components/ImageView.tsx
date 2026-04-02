import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateTechnicalImage } from '../lib/gemini';

export const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const url = await generateTechnicalImage(prompt, size);
      setImageUrl(url);
    } catch (err) {
      setError('Görsel oluşturulamadı. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">Arıza Görselleştirme</h2>
        <p className="text-slate-600">Sorunu veya parçayı görsel olarak analiz edin.</p>
      </div>

      <form onSubmit={handleGenerate} className="glass-panel p-6 rounded-2xl space-y-6 mb-12">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Ne Görselleştirmek İstiyorsunuz?</label>
          <textarea
            placeholder="Örn: Beko çamaşır makinesi E18 hatası pompa tıkanıklığı teknik çizimi..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-32 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-600">Çözünürlük:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(["1K", "2K", "4K"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    size === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            Görsel Oluştur
          </button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-4 rounded-2xl overflow-hidden group relative"
          >
            <img 
              src={imageUrl} 
              alt="Generated Technical" 
              className="w-full h-auto rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <a 
                href={imageUrl} 
                download="ariza-gorseli.png"
                className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform"
              >
                <Download className="w-6 h-6" />
              </a>
              <button className="p-3 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform">
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
