import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    const systemPrompt = `You are an Optical Character Recognition (OCR) AI. 
    Analyze the provided image of a business card.
    Extract the following details and return ONLY a raw JSON object with these exact keys: name, email, phone, company, role.
    If a field is not found, leave it as an empty string. DO NOT wrap the output in markdown blocks, just raw JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Extract the business card details.' },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      model: 'llama-3.2-11b-vision-preview',
      temperature: 0.1,
      max_tokens: 500,
    });

    const content = chatCompletion.choices[0]?.message?.content || '{}';
    const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedContent));
  } catch (error: any) {
    console.error('Groq Vision Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
