import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const Features = () => {
  return (
    <div className="bg-neutral-50 text-primary font-sans min-h-screen pt-24">
      <PublicHeader />

      {/* Hero */}
      <section className="py-20 px-6 bg-neutral-50 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3">Enterprise Capabilities</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-primary tracking-tight">Intelligence at Scale</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Stop relying on legacy keyword filters. Candidex AI provides deep semantic understanding to drastically reduce time-to-hire while uncovering hidden talent.
          </p>
        </div>
      </section>

      {/* Feature 1: Semantic Analysis */}
      <section className="py-24 px-6 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <span className="material-symbols-outlined text-2xl">neurology</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary">Semantic Understanding</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">cancel</span>
                <div>
                  <h4 className="font-bold text-red-700 mb-1">The Old Way (Problem)</h4>
                  <p className="text-sm text-red-600/80 leading-relaxed">Traditional ATS systems reject highly qualified candidates simply because they used the term 'Next.js' instead of 'React'. Rigid keywords cause massive false negatives.</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-green-700 mb-1">The Candidex AI Way (Solution)</h4>
                  <p className="text-sm text-green-700/80 leading-relaxed">Our AI Engine understands context. It knows that building large-scale Next.js arrays implies React mastery, scoring the candidate perfectly without matching the exact string.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent rounded-3xl blur-2xl transition-all"></div>
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 relative z-10 hover:-translate-y-1 transition-transform duration-500">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                 <span className="font-bold text-primary text-sm">Target Requirement: <span className="text-accent bg-accent/10 px-2 py-0.5 rounded ml-2">React</span></span>
               </div>
               <div className="space-y-4">
                 <div className="bg-slate-50 p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                   <p className="text-sm font-medium">"...architected frontend using Next.js..."</p>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">done_all</span> 100% Match</span>
                 </div>
                 <div className="flex gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl mt-4">
                   <span className="material-symbols-outlined text-accent text-[18px]">psychology</span>
                   <p className="text-xs text-primary leading-relaxed">AI Note: Candidate did not explicitly write "React", however "Next.js" is a React framework indicating high proficiency.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Candidate Finder */}
      <section className="py-24 px-6 bg-slate-50 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative group">
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-700 relative z-10 text-white hover:scale-[1.02] transition-transform duration-500">
               <div className="flex items-center gap-3 bg-slate-900 border border-slate-600 rounded-xl p-3 mb-6">
                 <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500 font-bold">astrophotography_auto</span>
                 <p className="text-sm font-medium font-mono text-slate-300 w-full whitespace-nowrap overflow-hidden border-r-[2px] border-accent animate-[typing_3s_steps(40)_infinite]">Find an engineer who built payment systems...</p>
               </div>
               
               <div className="space-y-3">
                 <div className="bg-slate-700 p-4 rounded-xl border border-slate-600 flex justify-between items-center opacity-80">
                   <div>
                     <p className="font-bold text-sm">Marcus Thorne</p>
                     <p className="text-xs text-slate-400">FinTech Lead</p>
                   </div>
                   <span className="text-accent font-bold">92%</span>
                 </div>
                 <div className="bg-slate-700 p-4 rounded-xl border border-slate-600 flex justify-between items-center opacity-40">
                   <div>
                     <p className="font-bold text-sm">Elena Rostova</p>
                     <p className="text-xs text-slate-400">Backend Eng</p>
                   </div>
                   <span className="text-slate-300 font-bold">78%</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">person_search</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary">AI Query Sourcing</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">cancel</span>
                <div>
                  <h4 className="font-bold text-red-700 mb-1">The Old Way (Problem)</h4>
                  <p className="text-sm text-red-600/80 leading-relaxed">Searching your historical talent database means combining clunky boolean queries (`(Fintech OR Payments) AND Python`) resulting in messy, inaccurate longlists.</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-green-700 mb-1">The Candidex AI Way (Solution)</h4>
                  <p className="text-sm text-green-700/80 leading-relaxed">Chat with your database. Simply ask the engine what you are looking for in natural English, and it instantly ranks historic candidates by relevance.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Feature 3: Bulk Processing */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-2xl">library_add</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-primary">Bulk Processing Ecosystem</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-red-500 mt-0.5">cancel</span>
                <div>
                  <h4 className="font-bold text-red-700 mb-1">The Old Way (Problem)</h4>
                  <p className="text-sm text-red-600/80 leading-relaxed">Opening 500 PDF attachments manually from a job board export consumes entire working days and causes severe recruiter fatigue.</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-5 rounded-2xl border border-green-100 flex gap-4 items-start">
                <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                <div>
                  <h4 className="font-bold text-green-700 mb-1">The Candidex AI Way (Solution)</h4>
                  <p className="text-sm text-green-700/80 leading-relaxed">Upload a raw `.zip` of 1,000 resumes. Our cloud architecture processes the batch asynchronously in under 3 minutes, emitting a perfectly ranked spreadsheet.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded-3xl p-8 relative shadow-inner">
            <h4 className="font-heading font-bold text-primary mb-6">Processing Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-secondary">
                 <span>Batch_Oct_Applicants.zip</span>
                 <span className="text-accent">Done</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                 <div className="w-full h-full bg-accent"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                 <span>1,240 Resumes</span>
                 <span>142 Seconds</span>
              </div>
            </div>
            <button className="w-full mt-8 bg-white border border-gray-200 text-primary font-bold py-3 rounded-xl shadow-sm hover:border-primary transition-colors flex items-center justify-center gap-2">
               Download Sorted CSV <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 bg-primary">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-6 text-white">Experience it yourself.</h2>
          <p className="text-slate-300 mb-10 text-lg">Stop losing great talent to legacy workflows. Get started today.</p>
          <Link to="/register">
            <button className="bg-accent text-primary px-10 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-xl active:scale-95">
              Start Free Trial
            </button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Features;
