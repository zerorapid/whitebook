import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize dynamically to prevent build-time crashes on Vercel
const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build' });

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const systemPrompt = `You are an expert Optical Character Recognition (OCR) and contact extraction AI.
Carefully examine the business card image and read all visible text, including tiny text, labels next to icons (phone icon, email @ icon, globe/web icon, location pin icon), titles, company names, and addresses.

Extract and return a raw JSON object with these exact keys:
- name: Full name of the person (string, empty if not found)
- role: Job title / designation (e.g. Founder, CEO, Head of Fintech, Manager)
- company: Company or organization name
- email: Email address
- phone: Phone number with country code if present
- location: Address, city, or location mentioned
- website: Website URL if present
- notes: Any additional info or tagline on the card

Output ONLY valid JSON. Do not include markdown formatting or commentary outside the JSON.`;

    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Transcribe and extract all contact information from this business card.' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      model: 'qwen/qwen3.8-27b',
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    
    // Robust JSON extraction using regex
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not extract JSON from image response', raw: content }, { status: 500 });
    }

    const extracted = JSON.parse(jsonMatch[0]);
    return NextResponse.json(extracted);
  } catch (error: any) {
    console.error('Groq Vision OCR Error:', error);
    return NextResponse.json({ error: error.message || 'Vision OCR failed' }, { status: 500 });
  }
}
