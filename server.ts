import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
app.use(express.json());

// API Route: Hata Kodu Analizi
app.post("/api/diagnose", async (req, res) => {
  const { brand, errorCode } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API anahtarı sunucuda yapılandırılmamış." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Cihaz Markası: ${brand}, Hata Kodu: ${errorCode}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Sen 'hatakodum.com' sitesinin arkasındaki uzman teknik teknisyensin. Sana verilen cihaz markası ve hata kodunu analiz et. Çıktıyı JSON formatında ver. JSON yapısı şu şekilde olsun: { 'brand': '', 'errorCode': '', 'problemSummary': '', 'diySolutions': ['', '', ''], 'requiredTools': ['', ''], 'safetyWarning': '', 'estimatedRepairCost': '' }",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING },
            errorCode: { type: Type.STRING },
            problemSummary: { type: Type.STRING },
            diySolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredTools: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyWarning: { type: Type.STRING },
            estimatedRepairCost: { type: Type.STRING },
          },
          required: ["brand", "errorCode", "problemSummary", "diySolutions", "requiredTools", "safetyWarning", "estimatedRepairCost"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Analiz sırasında bir hata oluştu." });
  }
});

// API Route: Görsel Oluşturma
app.post("/api/generate-image", async (req, res) => {
  const { prompt, size } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API anahtarı eksik." });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: { parts: [{ text: `Teknik bir çizim veya arıza görseli: ${prompt}. Profesyonel, net ve açıklayıcı olmalı.` }] },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: size || "1K" } },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return res.json({ imageUrl: `data:image/png;base64,${part.inlineData.data}` });
      }
    }
    res.status(500).json({ error: "Görsel oluşturulamadı." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Görsel servisi hatası." });
  }
});

// API Route: Teknik Sohbet
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API anahtarı eksik." });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: "gemini-3.1-pro-preview",
      config: {
        systemInstruction: "Sen 'hatakodum.com' sitesinin uzman teknik asistanısın. Kullanıcılara beyaz eşya, kombi, otomobil ve elektronik cihaz arızaları konusunda yardımcı oluyorsun. Yanıtların profesyonel, güvenliğe önem veren ve çözüm odaklı olmalı. Eğer bir işlem tehlikeliyse mutlaka uyar.",
      },
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sohbet servisi hatası." });
  }
});

// Vite Middleware (Sadece Geliştirme Ortamında)
if (process.env.NODE_ENV !== "production") {
  const startVite = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startVite();
} else {
  // Üretim Ortamı (Vercel)
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Vercel için app nesnesini dışa aktar
export default app;
