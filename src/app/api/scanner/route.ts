import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json(); // base64 string without data:image prefix
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is required for the Business Card Scanner.' }, { status: 400 });
    }

    const prompt = `Extract the contact information from this business card. 
Return ONLY a valid JSON object with these exact keys: name, role, company, email, phone, location, linkedin, website.
If a field is missing, omit it or leave it blank. Do not include markdown code blocks, just raw JSON.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
            ]
          }
        ],
        generationConfig: { temperature: 0.1 }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      throw new Error("Gemini API error: " + errText);
    }

    const geminiData = await geminiResponse.json();
    let reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Clean up if Gemini accidentally returns markdown backticks
    reply = reply.replace(/```json/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ contact: JSON.parse(reply) });
  } catch (error: any) {
    console.error('Scanner Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
