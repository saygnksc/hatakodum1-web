import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  // Vercel'deki Environment Variables ismine dikkat!
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const { brand, code } = req.body;
    const prompt = `Sen hatakodum.com uzmanısın. ${brand} marka cihazdaki ${code} hata kodunu analiz et. Kısa ve net çözüm adımları ile tahmini maliyeti Türkçe yaz.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ result: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
