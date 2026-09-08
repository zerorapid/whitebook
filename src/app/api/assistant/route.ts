import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize dynamically to prevent build-time crashes on Vercel
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

    const { prompt, contacts } = await req.json();

    const systemPrompt = `You are a highly intelligent CRM assistant named 'Dude'. 
    You have access to the user's private network directory. 
    Here are their contacts in JSON format: ${JSON.stringify(contacts)}
    
    Answer the user's questions about their contacts accurately based ONLY on the provided JSON. 
    Be concise, professional, and directly helpful. Do not output markdown code blocks for normal text.

    CRITICAL INSTRUCTION FOR SEARCHING/LISTING:
    If the user asks you to find, search for, or list specific contacts, you MUST append a special tag at the very end of your response containing a JSON array of their exact contact IDs.
    Example: <CONTACTS>[3, 14, 27]</CONTACTS>

    RICH UI COMPONENTS:
    You can trigger rich UI components by using these exact tags in your text:
    1. Tool Chips: If you need to simulate an action, prepend <TOOL>Action Name</TOOL> to your message.
    2. Approvals: If you are suggesting an actionable task (like sending an email), use <APPROVAL title="Task Title">Task Description</APPROVAL>.
    3. Code: Wrap code in standard markdown code blocks (\`\`\`language ... \`\`\`).
    
    Example response:
    <TOOL>Searching your CRM Database</TOOL>
    I found Sarah. Should I draft a follow-up?
    <APPROVAL title="Draft Follow-up Email">I will prepare a draft mentioning your recent meeting.</APPROVAL>
    <CONTACTS>[1]</CONTACTS>`;

    const groq = getGroqClient();
    
    try {
      // 1. Try Groq (Primary)
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'qwen/qwen3.8-27b', // Faster and more stable model
        temperature: 0.2,
        max_tokens: 500,
      });

      return NextResponse.json({ reply: chatCompletion.choices[0]?.message?.content || 'No response' });
    } catch (groqError: any) {
      console.warn('Groq failed or rate limited, falling back to Gemini:', groqError.message);
      
      // 2. Graceful Fallback to Gemini (Secondary)
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Groq failed, and GEMINI_API_KEY is not set for fallback.");
      }

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: { text: systemPrompt } },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 }
        })
      });

      if (!geminiResponse.ok) {
        throw new Error("Both Groq and Gemini fallback failed.");
      }

      const geminiData = await geminiResponse.json();
      const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      
      return NextResponse.json({ reply });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
