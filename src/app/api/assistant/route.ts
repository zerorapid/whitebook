import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize dynamically to prevent build-time crashes on Vercel
const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build' });

export async function POST(req: Request) {
  try {
    const { prompt, contacts } = await req.json();

    const systemPrompt = `You are a highly intelligent CRM assistant named 'Dude'. 
    You have access to the user's private network directory. 
    Here are their contacts in JSON format: ${JSON.stringify(contacts)}
    
    Answer the user's questions about their contacts. If they ask to find duplicates, analyze the names and emails and list them clearly. Be concise, professional, and directly helpful. Do not output markdown code blocks for normal text.`;

    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'qwen/qwen3.8-27b',
      temperature: 0.2,
      max_tokens: 500,
    });

    return NextResponse.json({ reply: chatCompletion.choices[0]?.message?.content || 'No response' });
  } catch (error: any) {
    console.error('Groq Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
