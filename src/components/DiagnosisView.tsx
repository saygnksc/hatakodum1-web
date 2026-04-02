import React, { useState } from 'react';
import { Search, AlertTriangle, Wrench, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { diagnoseErrorCode, DiagnosisResult } from '../lib/gemini';

export const DiagnosisView: React.FC = () => {
  const [brand, setBrand] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !code) return;

    setLoading(true);
    setError(null);
    try {
      const data = await diagnoseErrorCode(brand, code);
      setResult(data);
    } catch (err) {
      setError('Hata kodu analiz edilemedi. Lütfen tekrar deneyin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          Hata Kodun Ne Diyor?
        </h1>
        <p className="text-lg text-slate-600">
          Saniyeler içinde arıza sebebini ve çözüm yollarını öğrenin.
        </p>
      </div>

      <form onSubmit={handleSearch} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Marka / Cihaz</label>
          <input
            type="text"
            placeholder="Örn: Beko, Bosch, VW..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Hata Kodu</label>
          <input
            type="text"
            placeholder="Örn: E18, P0300..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="md:self-end px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          Sorgula
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl mb-8 text-center"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Structured Data for SEO */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                "name": `${result.brand} ${result.errorCode} Hata Kodu Çözümü`,
                "description": result.problemSummary,
                "step": result.diySolutions.map((sol, i) => ({
                  "@type": "HowToStep",
                  "position": i + 1,
                  "text": sol
                }))
              })}
            </script>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="glass-panel p-8 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Sorun Özeti</h2>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {result.problemSummary}
                  </p>
                </div>

                <div className="glass-panel p-8 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold">Adım Adım Çözümler</h2>
                  </div>
                  <ul className="space-y-4">
                    {result.diySolutions.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          {i + 1}
                        </span>
                        <p className="text-slate-700 pt-1">{step}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl bg-amber-50/50 border-amber-100">
                  <div className="flex items-center gap-2 mb-3 text-amber-700 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                    Güvenlik Uyarısı
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {result.safetyWarning}
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                    <Wrench className="w-5 h-5 text-slate-500" />
                    Gerekli Aletler
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.requiredTools.map((tool, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                    Tahmini Maliyet
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.estimatedRepairCost}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    *Türkiye piyasası tahmini aralığıdır.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
