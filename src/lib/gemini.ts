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
  const response = await fetch("/api/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, errorCode }),
  });
  if (!response.ok) throw new Error("Analiz servisi hatası.");
  return response.json();
};

export const generateTechnicalImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, size }),
  });
  if (!response.ok) throw new Error("Görsel servisi hatası.");
  const data = await response.json();
  return data.imageUrl;
};

export const sendChatMessage = async (message: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error("Sohbet servisi hatası.");
  const data = await response.json();
  return data.text;
};
