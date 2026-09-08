import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const getGroqClient = () => new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build' });

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    // Import and create supabase client dynamically
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { rawText } = await req.json();
    
    if (!rawText || rawText.trim() === '') {
      return NextResponse.json({ error: 'No text extracted from image.' }, { status: 400 });
    }

    const systemPrompt = `You are an AI data extractor. I will give you raw, messy text extracted from a business card via OCR. 
The text might be out of order, have typos, or weird symbols. 
Your job is to extract the contact information and return ONLY a valid JSON object with these exact keys: name, role, company, email, phone, location, linkedin, website.
If a field is missing, omit it or leave it blank. Do not include markdown code blocks, just raw JSON.`;

    const groq = getGroqClient();
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawText }
      ],
      model: 'qwen/qwen3.8-27b',
      temperature: 0.1,
      max_tokens: 500,
    });

    let reply = chatCompletion.choices[0]?.message?.content || '{}';
    // Clean up if Groq accidentally returns markdown backticks
    reply = reply.replace(/```json/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ contact: JSON.parse(reply) });
  } catch (error: any) {
    console.error('Scanner Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
