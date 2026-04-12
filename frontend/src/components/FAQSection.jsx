import React, { useState } from 'react';

const FAQSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { 
      q: "How does Candidex AI compare to standard ATS keywords?", 
      a: "Unlike standard ATS parsing that looks for exact string matches, our AI uses Large Language Models to read the resume semantically. It understands context, synonyms, and career trajectory." 
    },
    { 
      q: "Do candidates know an AI is screening them?", 
      a: "This operates as a backend tool for your recruiting team. It acts as an augmentation to your ATS, providing data-driven recommendations that human recruiters use to make final decisions." 
    },
    { 
      q: "Can I use it alongside my existing ATS?", 
      a: "Absolutely. Candidex AI provides seamless integration paths for tools like Workday, Greenhouse, and Lever, allowing you to sync candidate scores directly into your workflow." 
    },
    { 
      q: "Is the AI biased against marginalized groups?", 
      a: "Bias mitigation is a core pillar. Candidex AI is strictly PII-blind during analysis, evaluating skills objectively and ignoring demographic markers to ensure a fair shortlist." 
    },
    { 
      q: "How long does parsing thousands of resumes take?", 
      a: "Our infrastructure is horizontally scalable. A batch of 1,000 resumes undergoes full semantic analysis in under 3 minutes, providing real-time intelligence for high-volume hiring." 
    },
    { 
      q: "Are there limits to how many resumes I can process?", 
      a: "Our Enterprise tier offers unlimited processing. Professional and Starter tiers have monthly volumes designed to scale with your team's specific hiring needs." 
    }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 text-slate-900 relative border-y border-slate-200 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none">Support Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-base font-medium max-w-lg mx-auto">
            Quick answers about our neural matching engine and enterprise infrastructure.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`transition-all duration-300 rounded-2xl border ${
                openFaq === i 
                  ? "bg-white border-emerald-500/30 shadow-xl shadow-slate-200/50" 
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 text-left flex justify-between items-center outline-none group"
              >
                <div className="flex items-center gap-5">
                  <span className={`text-sm font-mono transition-colors duration-300 ${openFaq === i ? "text-emerald-500" : "text-slate-300"}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-base md:text-lg font-bold tracking-tight transition-colors duration-300 ${openFaq === i ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"}`}>
                    {faq.q}
                  </span>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ${
                openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="px-16 pb-6 text-slate-500 text-base font-medium leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Support CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xl font-bold tracking-tight">Need a technical deep-dive?</h4>
              <p className="text-slate-500 text-sm font-medium">Our architecture team is available for custom enterprise consultations.</p>
           </div>
           <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg whitespace-nowrap">
              Contact Support
           </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
