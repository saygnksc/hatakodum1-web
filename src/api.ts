const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function diagnoseError(brand: string, code: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${brand} marka cihazda ${code} hata kodu nedir? Çözüm adımlarını ve tahmini maliyeti Türkçe açıkla.` }] }]
    })
  });
  return await response.json();
}
