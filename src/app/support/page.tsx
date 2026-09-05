"use client";
import { useState } from 'react';
import { Mail, Book, Keyboard, ChevronDown, MessageSquare, ExternalLink } from 'lucide-react';

const faqs = [
  {
    question: "How does the 'Dude' AI assistant work?",
    answer: "Dude is powered by a locally connected MCP bridge. By connecting your local context, Dude can intelligently analyze your contacts, draft follow-ups, and read context from your files securely, without your private data being sent to third-party databases."
  },
  {
    question: "How do I download the business card to my phone?",
    answer: "When someone scans your QR code, they are taken to your public profile page. They can tap the 'Save Contact' button, which instantly downloads a universally compatible .vcf file right into their native contacts app (iOS or Android)."
  },
  {
    question: "Does Whitebook work offline?",
    answer: "Yes! Whitebook is built as an Offline-First Progressive Web App (PWA). If you lose connection at a conference, you can still search your directory and add new contacts. They will sync automatically to the cloud once your connection is restored."
  },
  {
    question: "What happens if I encounter a duplicate contact?",
    answer: "Whitebook automatically detects duplicates when you import CSV files or scan cards. You can resolve them directly from the Dashboard's notification center, where Dude will suggest merging their details."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Help & Support
        </h1>
        <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-2xl">
          Everything you need to master Whitebook. Explore our frequently asked questions or get in touch directly.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="max-w-xl mb-10">
        {/* Email Contact Card */}
        <a 
          href="mailto:support@whitebook.app"
          className="bg-primary text-primary-foreground border-transparent rounded-3xl p-8 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div>
            <Mail className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-extrabold text-2xl mb-2">Email Support</h3>
            <p className="text-primary-foreground/80 font-medium mb-8">
              Our team typically responds within 2 hours. Send us your bugs, feature requests, or questions directly.
            </p>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm bg-black/20 hover:bg-black/30 transition-colors w-fit px-5 py-2.5 rounded-xl backdrop-blur-md">
            support@whitebook.app <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
          </div>
        </a>
      </div>

      {/* FAQ Section */}
      <div className="pt-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Frequently Asked Questions</h2>
        <div className="bg-card border border-border/60 rounded-3xl overflow-hidden divide-y divide-border/40 shadow-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="flex flex-col">
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex items-center justify-between p-6 w-full text-left hover:bg-muted/30 transition-colors focus:outline-none"
              >
                <span className="font-semibold text-[15px] pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
