import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export interface DiagnosisResult {
  brand: string;
  errorCode: string;
  problemSummary: string;
  diySolutions: string[];
  requiredTools: string[];
  safetyWarning: string;
  estimatedRepairCost: string;
}

export const diagnoseErrorCode = async (brand: string, errorCode: string): Promise<DiagnosisResult> => {
  const ai = getAI();
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

  return JSON.parse(response.text || "{}");
};

export const generateTechnicalImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: {
      parts: [{ text: `Teknik bir çizim veya arıza görseli: ${prompt}. Profesyonel, net ve açıklayıcı olmalı.` }],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Görsel oluşturulamadı.");
};

export const createChatSession = () => {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3.1-pro-preview",
    config: {
      systemInstruction: "Sen 'hatakodum.com' sitesinin uzman teknik asistanısın. Kullanıcılara beyaz eşya, kombi, otomobil ve elektronik cihaz arızaları konusunda yardımcı oluyorsun. Yanıtların profesyonel, güvenliğe önem veren ve çözüm odaklı olmalı. Eğer bir işlem tehlikeliyse mutlaka uyar.",
    },
  });
};
