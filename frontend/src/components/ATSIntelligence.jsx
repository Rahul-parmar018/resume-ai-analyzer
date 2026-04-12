import React from 'react';

const ATSIntelligence = () => {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden border-y border-slate-100">
      {/* Precision Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:60px_60px] opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center relative z-10">
        
        {/* LEFT CONTENT (TECHNICAL) */}
        <div className="lg:basis-1/2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-px bg-emerald-500"></div>
              <h2 className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.6em]">System Architecture</h2>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
              Machine Intelligence <br/>
              <span className="text-slate-400">Human Calibration</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl border-l-2 border-slate-100 pl-6">
              Our neural extraction engine processes unstructured PDF data into structured JSON objects with a validated 99.8% precision rate across 40+ languages.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: "Extraction", val: "Neural v4.1" },
              { label: "Accuracy", val: "99.82%" },
              { label: "Latency", val: "< 140ms" },
              { label: "Security", val: "SOC2 Compliant" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1 group">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                <div className="flex items-end gap-2">
                   <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                   <div className="h-1.5 w-12 bg-slate-100 rounded-full mb-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4 group-hover:w-full transition-all duration-1000"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (TECHNICAL HUD) */}
        <div className="lg:basis-1/2 relative min-h-[550px] w-full flex items-center justify-center">
            {/* Main Terminal Block */}
            <div className="w-full max-w-lg bg-slate-900 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-800 overflow-hidden relative z-20 animate-fade-in">
               {/* Terminal Header */}
               <div className="bg-slate-800/50 px-6 py-3 flex justify-between items-center border-b border-slate-800">
                  <div className="flex gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">parser_v4.1.bin</span>
               </div>
               
               {/* Terminal Body (JSON Content) */}
               <div className="p-8 font-mono text-[11px] leading-relaxed">
                  <div className="space-y-1">
                     <p className=""><span className="text-pink-400">"candidate"</span>: &#123;</p>
                     <div className="pl-6 space-y-1 border-l border-slate-800 ml-2">
                        <p><span className="text-indigo-400">"relevance_score"</span>: <span className="text-emerald-400">0.98</span>,</p>
                        <p><span className="text-indigo-400">"skills"</span>: [</p>
                        <div className="pl-6 border-l border-slate-800 ml-2">
                           <p className="text-emerald-400">"Strategic Leadership",</p>
                           <p className="text-emerald-400">"Neural Architecture",</p>
                           <p className="text-emerald-400">"Predictive Analytics"</p>
                        </div>
                        <p>],</p>
                        <p><span className="text-indigo-400">"matches"</span>: <span className="text-indigo-400">true</span></p>
                     </div>
                     <p>&#125;</p>
                  </div>

                  {/* Typing Indicator Overlay */}
                  <div className="mt-6 flex items-center gap-3 bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                     <span className="material-symbols-outlined text-emerald-500 text-sm animate-pulse">check_circle</span>
                     <p className="text-emerald-300 tracking-tight font-black animate-pulse">EXTRACTION COMPLETE: SEMANTIC MATCH SECURED</p>
                  </div>
               </div>
            </div>

            {/* Floating Technical HUD Elements */}
            <div className="absolute top-[-5%] right-0 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-30 animate-float">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Real-time Parsing</span>
               </div>
            </div>

            <div className="absolute bottom-5 left-[-20px] bg-white p-6 rounded-xl shadow-xl border border-slate-100 z-30 animate-float-up">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recruiter Visibility</p>
               <div className="flex -space-x-3 mb-4">
                  {[1,2,3,4].map(v => (
                    <div key={v} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400 group-hover:translate-x-1 transition-transform">
                       U{v}
                    </div>
                  ))}
               </div>
               <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-2/3"></div>
               </div>
            </div>

            {/* 3D Background Tech (Low Opacity) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#10b9810d_0%,transparent_50%)]"></div>
        </div>
      </div>
    </section>
  );
};

export default ATSIntelligence;
