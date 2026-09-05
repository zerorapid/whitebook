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
