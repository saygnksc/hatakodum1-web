export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { brand, code } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${brand} marka cihazda ${code} hata kodu nedir? Çözümünü ve maliyetini Türkçe anlat. Yanıtı sade bir metin olarak ver.` }] }]
      })
    });

    const data = await response.json();
    
    // Google'dan gelen cevabı temizleyip frontend'e gönderiyoruz
    const aiResponse = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Sistemsel bir hata oluştu: " + error.message });
  }
}
