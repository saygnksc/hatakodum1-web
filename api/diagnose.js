// api/diagnose.js
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { brand, code } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; // Vercel'deki değişkeni buradan okur

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key not configured on Vercel' });
    }

    try {
        const genAI = new GoogleGenAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = "Sen 'hatakodum.com' sitesinin uzman teknisyenisin. Marka ve hata kodunu analiz et. Yanıtı mutlaka şu JSON formatında ver: { \"brand\": \"\", \"errorCode\": \"\", \"problemSummary\": \"\", \"diySolutions\": [\"\", \"\"], \"requiredTools\": [\"\", \"\"], \"safetyWarning\": \"\", \"estimatedRepairCost\": \"\" }";
        const prompt = `${systemInstruction}\n\nAnaliz edilecek cihaz: ${brand}, Hata Kodu: ${code}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonStr = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(jsonStr);

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'AI Analysis failed' });
    }
}
