import { useState } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import TrustedEcosystem from "../components/TrustedEcosystem";
import { useEffect } from "react";

const Landing = () => {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = "Candidex AI | Smart Hiring Decisions";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "AI-powered resume analyzer and hiring intelligence platform. Analyze resumes, detect skill gaps, and optimize candidates for job success.");
    }
  }, []);

  const faqs = [
    { q: "How does Candidex AI compare to standard ATS keywords?", a: "Unlike standard ATS parsing that looks for exact string matches, our AI uses Large Language Models to read the resume semantically. It understands context, synonyms, and career trajectory." },
    { q: "Do candidates know an AI is screening them?", a: "This operates as a backend tool for your recruiting team. It acts as an augmentation to your ATS, not a replacement for human recruiters in the interview stage." },
    { q: "Can I use it alongside my existing ATS?", a: "Yes. Candidex AI integrates seamlessly with major platforms like Workday, Greenhouse, and Lever. You can sync candidates automatically." },
    { q: "Is the AI biased against marginalized groups?", a: "We take bias mitigation seriously. Candidex AI is fully blind to demographic data (names, genders, ages implied by graduation years) during the core scoring process." },
    { q: "How long does parsing thousands of resumes take?", a: "Extremely fast. A batch of 1,000 PDFs typically finishes full contextual analysis in under 3 minutes." },
    { q: "Are there limits to how many resumes I can process?", a: "Our Enterprise tier offers unlimited processing. Professional and Starter tiers have monthly limits outlined on our pricing page." }
  ];

  return (
    <div className="bg-neutral-50 text-primary font-sans min-h-screen">
      <PublicHeader />

      {/* 1. & 2. HERO + TRUST METRICS */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">AI-Powered Platform Active</span>
          </div>

          <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-primary tracking-tight max-w-5xl mx-auto">
            Hire the top 1% with <span className="text-accent">Premium AI</span>
          </h1>

          <p className="text-secondary text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Analyze thousands of resumes instantly. Go beyond simple keywords and understand the true semantic context of every candidate's experience.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-16">
            <Link to="/register">
              <button className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
                Start Free Trial
              </button>
            </Link>
            <Link to="/login">
              <button className="border border-gray-300 bg-white px-10 py-4 rounded-xl text-primary hover:border-primary transition-all font-bold text-lg hover:-translate-y-1 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined">play_arrow</span>
                Watch Demo
              </button>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-gray-200/60 max-w-4xl mx-auto">
            <div>
              <p className="font-heading text-4xl font-bold text-primary mb-1">2M+</p>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest">Resumes Analyzed</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold text-primary mb-1">98%</p>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest">Accuracy Matching</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold text-primary mb-1">0.4s</p>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest">Speed Per Resume</p>
            </div>
            <div>
              <p className="font-heading text-4xl font-bold text-primary mb-1">80%</p>
              <p className="text-xs text-secondary font-bold uppercase tracking-widest">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION ❗ */}
      <section className="py-24 px-6 bg-red-50/50 border-y border-red-100/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-6">
            <span className="material-symbols-outlined text-3xl">broken_image</span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-primary">Hiring is broken.</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto mb-16">
            Relying on legacy ATS systems is causing you to bleed top talent. The old way of recruiting is failing modern teams.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-500">search_off</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">ATS Filters Good Candidates</h3>
              <p className="text-secondary">Standard keyword matching filters out brilliant engineers just because they used the "wrong" synonym or forgot a buzzword.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-red-500 font-bold bg-red-50 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">cancel</span> Legacy Problem
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-500">hourglass_empty</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Manual Screening Takes Hours</h3>
              <p className="text-secondary">Recruiters spend 80% of their day skimming PDFs instead of actually talking to candidates and closing deals.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-red-500 font-bold bg-red-50 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">cancel</span> Legacy Problem
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-500">history</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-primary">Keyword Matching is Outdated</h3>
              <p className="text-secondary">Ctrl+F is not intelligence. It lacks the ability to understand career trajectory, project scale, and implicit core skills.</p>
              <div className="mt-6 flex items-center gap-2 text-sm text-red-500 font-bold bg-red-50 p-3 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">cancel</span> Legacy Problem
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section className="py-24 px-6 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-accent font-bold tracking-[0.2em] uppercase text-sm mb-4">The Fix</p>
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-12 text-white">Meet Candidex AI.</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <span className="material-symbols-outlined text-accent text-3xl mb-4">psychology</span>
              <h4 className="font-bold text-lg mb-2">AI Understands Context</h4>
              <p className="text-slate-300 text-sm">We process paragraphs semantically. We know "built a SPA" means React expertise.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <span className="material-symbols-outlined text-accent text-3xl mb-4">rule</span>
              <h4 className="font-bold text-lg mb-2">Not Keyword Matching</h4>
              <p className="text-slate-300 text-sm">Eliminate false negatives. Candidates are scored on deep technical merit, not buzzwords.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <span className="material-symbols-outlined text-accent text-3xl mb-4">bolt</span>
              <h4 className="font-bold text-lg mb-2">Faster Hiring</h4>
              <p className="text-slate-300 text-sm">Get a ranked shortlist of top candidates in under 3 minutes per batch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT DEMO (TABS) ❗ */}
      <section className="py-32 px-6 bg-neutral-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-6 text-primary">Experience the Platform</h2>
            <p className="text-secondary text-lg">See how Candidex AI transforms your workflow.</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white border border-gray-200 p-1 rounded-xl inline-flex shadow-sm">
              <button 
                onClick={() => setActiveTab("analyzer")}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "analyzer" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-primary hover:bg-slate-50"}`}
              >
                Resume Analyzer
              </button>
              <button 
                onClick={() => setActiveTab("finder")}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "finder" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-primary hover:bg-slate-50"}`}
              >
                Candidate Finder
              </button>
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "dashboard" ? "bg-primary text-white shadow-md" : "text-secondary hover:text-primary hover:bg-slate-50"}`}
              >
                Analytics Dashboard
              </button>
            </div>
          </div>

          {/* Browser Window Mockup */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] transition-all duration-500">
            <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 bg-white border border-gray-200 text-xs px-3 py-1 rounded flex-1 max-w-sm text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                app.resumeai.com/{activeTab}
              </div>
            </div>
            
            <div className="p-8 bg-slate-50/50 h-full">
              {activeTab === "analyzer" && (
                <div className="animate-fade-in grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-accent">upload_file</span> Upload Resumes</h4>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl max-h-48 h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                      <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                      <p className="text-sm font-bold text-primary">Drag & Drop PDFs</p>
                      <p className="text-xs text-secondary mt-1">Analyzing against: Senior React Developer</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 border border-gray-100 rounded-xl shadow-sm space-y-4">
                    <h4 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-accent">psychology</span> Live Analysis</h4>
                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                      <span className="text-sm font-bold text-primary">Sarah Jenkins.pdf</span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-2 rounded">94% Match</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-sm font-bold text-primary">David Okafor.pdf</span>
                      <span className="text-sm font-bold text-accent bg-accent/10 px-2 rounded">88% Match</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden"><div className="w-[60%] h-full bg-accent animate-pulse"></div></div>
                  </div>
                </div>
              )}
              {activeTab === "finder" && (
                <div className="animate-fade-in">
                  <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-sm flex gap-4 mb-6">
                     <div className="flex-1 bg-slate-50 border border-gray-200 rounded-lg flex items-center px-4">
                       <span className="material-symbols-outlined text-slate-400 mr-2">search</span>
                       <span className="text-slate-400 text-sm">"Find me a fintech engineer with distributed systems experience"</span>
                     </div>
                     <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm">Search</button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                     {[1,2,3].map(i => (
                       <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-accent transition-colors">
                         <div className="flex justify-between items-start mb-4">
                           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">AE</div>
                           <span className="bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded">Top Match</span>
                         </div>
                         <h5 className="font-bold text-primary">Alex Engineer</h5>
                         <p className="text-xs text-secondary mb-3">5 yrs • FinTech, Kafka, AWS</p>
                         <p className="text-xs text-slate-500 line-clamp-2">Built high-throughput payment processing pipelines at Stripe routing 500k req/s.</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}
              {activeTab === "dashboard" && (
                <div className="animate-fade-in grid grid-cols-3 gap-6">
                   <div className="col-span-3 bg-white p-6 border border-gray-100 rounded-xl shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-primary">Enterprise Command Center</h4>
                        <p className="text-sm text-secondary">Overview of all active requisitions.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent">12,408</p>
                        <p className="text-xs uppercase font-bold text-secondary">Candidates Processed</p>
                      </div>
                   </div>
                   <div className="col-span-2 bg-white p-6 border border-gray-100 rounded-xl shadow-sm min-h-[200px] flex items-end">
                      <div className="w-full flex items-end gap-2 h-32">
                        {[40, 60, 45, 80, 50, 90, 75, 100].map((h, i) => (
                           <div key={i} className="flex-1 bg-accent/20 rounded-t-sm hover:bg-accent transition-colors" style={{height: `${h}%`}}></div>
                        ))}
                      </div>
                   </div>
                   <div className="col-span-1 bg-white p-6 border border-gray-100 rounded-xl shadow-sm">
                      <h5 className="font-bold text-sm mb-4">Top Roles Filled</h5>
                      <ul className="space-y-3 text-sm">
                        <li className="flex justify-between"><span className="text-secondary">Sr. Frontend</span><span className="font-bold text-primary">+$12k Saved</span></li>
                        <li className="flex justify-between"><span className="text-secondary">Data Scientist</span><span className="font-bold text-primary">+$8k Saved</span></li>
                        <li className="flex justify-between"><span className="text-secondary">DevOps Eng</span><span className="font-bold text-primary">+$15k Saved</span></li>
                      </ul>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FEATURES (EXPANDED) */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4 text-primary">Everything you need to scale</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-accent mb-4 group-hover:scale-110 transition-transform">document_scanner</span>
              <h4 className="font-bold text-primary text-xl mb-2">Resume Analysis</h4>
              <p className="text-secondary leading-relaxed text-sm">Extracts experience, education, and implicit skills automatically from messy PDFs and Word docs.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-accent mb-4 group-hover:scale-110 transition-transform">person_search</span>
              <h4 className="font-bold text-primary text-xl mb-2">Candidate Finder</h4>
              <p className="text-secondary leading-relaxed text-sm">Natural language search to query your entire historical talent pipeline for specific skill combos.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-accent mb-4 group-hover:scale-110 transition-transform">troubleshoot</span>
              <h4 className="font-bold text-primary text-xl mb-2">Skill Gap Detection</h4>
              <p className="text-secondary leading-relaxed text-sm">Instantly compares a candidate's profile against the job description to highlight exact missing requirements.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-primary mb-4 group-hover:scale-110 transition-transform">dynamic_feed</span>
              <h4 className="font-bold text-primary text-xl mb-2">AI Suggestions</h4>
              <p className="text-secondary leading-relaxed text-sm">Generates custom interview questions based on the exact weaknesses and strengths found in the resume.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-primary mb-4 group-hover:scale-110 transition-transform">sync</span>
              <h4 className="font-bold text-primary text-xl mb-2">ATS Optimization</h4>
              <p className="text-secondary leading-relaxed text-sm">Two-way sync with tools like Greenhouse & Workday to keep statuses updated without tab-switching.</p>
            </div>
            <div className="p-6 rounded-2xl border border-gray-100 bg-neutral-50 hover:bg-white hover:shadow-xl transition-all hover:border-accent/40 group">
              <span className="material-symbols-outlined text-3xl text-primary mb-4 group-hover:scale-110 transition-transform">library_add</span>
              <h4 className="font-bold text-primary text-xl mb-2">Bulk Processing</h4>
              <p className="text-secondary leading-relaxed text-sm">Drop a .zip of 500 resumes. Go grab a coffee. Come back to a perfectly sorted and ranked spreadsheet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WORKFLOW / INTERACTIVE FLOW */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="font-heading text-4xl font-bold mb-20 text-white">How it works</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative gap-12 md:gap-0">
            {/* Connecting animated line */}
            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-1 bg-slate-800">
               <div className="h-full bg-accent w-full animate-[pulse_3s_ease-in-out_infinite] origin-left"></div>
            </div>

            <div className="relative z-10 basis-1/3 flex flex-col items-center group">
              <div className="w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:-translate-y-2 group-hover:border-accent transition-all">
                <span className="material-symbols-outlined text-3xl text-accent">cloud_upload</span>
              </div>
              <h3 className="font-bold text-xl mb-2">1. Upload</h3>
              <p className="text-slate-400 text-sm max-w-[200px]">Drag and drop your candidate pool.</p>
            </div>

            <div className="relative z-10 basis-1/3 flex flex-col items-center group">
              <div className="w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:-translate-y-2 group-hover:border-accent transition-all relative">
                 <div className="absolute inset-0 bg-accent rounded-2xl animate-ping opacity-20"></div>
                <span className="material-symbols-outlined text-3xl text-accent">memory</span>
              </div>
              <h3 className="font-bold text-xl mb-2">2. Analyze</h3>
              <p className="text-slate-400 text-sm max-w-[200px]">Neural engine scores semantic matches.</p>
            </div>

            <div className="relative z-10 basis-1/3 flex flex-col items-center group">
              <div className="w-20 h-20 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:-translate-y-2 group-hover:border-accent transition-all">
                <span className="material-symbols-outlined text-3xl text-accent">emoji_events</span>
              </div>
              <h3 className="font-bold text-xl mb-2">3. Shortlist</h3>
              <p className="text-slate-400 text-sm max-w-[200px]">Instantly contact the top 5% of talent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. REAL OUTPUT PREVIEW ❗ */}
      <section className="py-32 px-6 bg-neutral-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full mb-6">Transparency</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-primary leading-tight">See exactly why a candidate matched.</h2>
            <p className="text-secondary text-lg mb-8 leading-relaxed">
              Candidex AI doesn't operate in a black box. Every score is backed by hard evidence extracted directly from the resume. You'll see exactly what skills were found, what's missing, and actionable hiring manager notes.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 font-medium text-primary"><span className="material-symbols-outlined text-green-500">check_circle</span> Verified strengths</li>
              <li className="flex items-center gap-3 font-medium text-primary"><span className="material-symbols-outlined text-red-500">error</span> Highlighted gaps</li>
              <li className="flex items-center gap-3 font-medium text-primary"><span className="material-symbols-outlined text-accent">help</span> Auto-generated interview questions</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 rotate-1 hover:rotate-0 transition-transform duration-500">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-xl text-primary">Alex Mercer</h4>
                <p className="text-sm text-secondary">Backend Engineer Candidate</p>
              </div>
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-center">
                <p className="font-heading font-bold text-2xl">84%</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Match Score</p>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm font-medium">Python</span>
                    <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm font-medium">Django</span>
                    <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full text-sm font-medium">PostgreSQL</span>
                  </div>
               </div>
               <div>
                  <p className="text-xs font-bold uppercase text-slate-400 mb-2">Missing Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-sm font-medium">React</span>
                    <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-sm font-medium">Docker</span>
                  </div>
               </div>
               <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                 <p className="text-xs font-bold uppercase text-accent mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">psychology</span> AI Suggestion</p>
                 <p className="text-sm text-primary leading-relaxed">Solid backend foundations but lacks containerization experience. Interview focus: "How do you currently deploy your Django applications in production?"</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. USE CASES ❗ */}
      <section className="py-24 px-6 bg-white border-b border-gray-100">
         <div className="max-w-7xl mx-auto">
           <h2 className="font-heading text-4xl font-bold mb-16 text-center text-primary">Who is this for?</h2>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-neutral-50 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">school</span>
                <h3 className="font-bold text-xl mb-3">Students & Candidates</h3>
                <p className="text-secondary text-sm leading-relaxed mb-6">Upload your own resume against your dream job description to find missing keywords and improve your ATS pass rate before applying.</p>
                <button className="text-accent font-bold mt-auto hover:underline">Try it out →</button>
              </div>
              <div className="p-8 bg-primary text-white rounded-2xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <span className="material-symbols-outlined text-4xl text-accent mb-4">work</span>
                <h3 className="font-bold text-xl mb-3">HR Departments</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">Standardize hiring across the company. Remove interviewer bias with objective scoring methodologies.</p>
                <button className="text-accent font-bold mt-auto hover:underline">Explore enterprise →</button>
              </div>
              <div className="p-8 bg-neutral-50 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">business_center</span>
                <h3 className="font-bold text-xl mb-3">Agency Recruiters</h3>
                <p className="text-secondary text-sm leading-relaxed mb-6">Match candidates from your giant talent pool instantly to a new requisition. Present clients with data-backed submissions.</p>
                <button className="text-accent font-bold mt-auto hover:underline">Learn more →</button>
              </div>
           </div>
         </div>
      </section>

      {/* 10. COMPARISON SECTION ❗ */}
      <section className="py-24 px-6 bg-neutral-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-16 text-center text-primary">The New Standard</h2>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200">
                  <th className="p-6 font-bold text-primary w-1/3">Feature Capability</th>
                  <th className="p-6 font-bold text-primary bg-primary/5 w-1/3 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-accent text-sm">neurology</span> Candidex AI
                    </div>
                  </th>
                  <th className="p-6 font-bold text-secondary w-1/3 text-center">Traditional ATS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-secondary font-medium">Semantic Understanding</td>
                  <td className="p-6 text-center bg-primary/5"><span className="material-symbols-outlined text-green-500">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-red-300">cancel</span></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-secondary font-medium">Processing Speed</td>
                  <td className="p-6 text-center bg-primary/5 font-bold text-primary">⚡ Seconds</td>
                  <td className="p-6 text-center text-secondary">Hours (Manual)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-secondary font-medium">Accuracy & Relevance</td>
                  <td className="p-6 text-center bg-primary/5 font-bold text-accent">98% Match Rate</td>
                  <td className="p-6 text-center text-secondary">Low (Keyword bound)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-6 text-secondary font-medium">Demographic Blinding (Bias Removal)</td>
                  <td className="p-6 text-center bg-primary/5"><span className="material-symbols-outlined text-green-500">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-red-300">cancel</span></td>
                </tr>
                <tr>
                  <td className="p-6 text-secondary font-medium">Automated Interview Questions</td>
                  <td className="p-6 text-center bg-primary/5"><span className="material-symbols-outlined text-green-500">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-red-300">cancel</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transition Divider (Hero -> Trusted) */}
      <div className="h-24 bg-gradient-to-b from-neutral-50 to-white"></div>

      {/* 11. PREMIUM SOCIAL PROOF & STATS (PHASE 4) */}
      <TrustedEcosystem />

      {/* 12. FAQ (Collapsible) */}
      <section className="py-24 px-6 bg-neutral-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-12 text-center text-primary">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-primary hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 text-secondary leading-relaxed bg-slate-50 border-t border-gray-100 ${openFaq === i ? "py-5 max-h-48 opacity-100" : "max-h-0 opacity-0 py-0"}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA (STRONGER) */}
      <section className="py-32 text-center px-6 bg-primary relative overflow-hidden">
        <div className="absolute -left-[20%] -bottom-[50%] w-[60%] h-[150%] bg-accent/20 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute -right-[20%] -top-[50%] w-[60%] h-[150%] bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Stop losing talent to slow processes.
          </h2>
          <p className="text-slate-300 mb-12 text-xl max-w-2xl mx-auto">
            Join the modern talent acquisition revolution. Experience the platform instantly.
          </p>
          <div className="flex gap-6 justify-center flex-wrap mb-8">
            <Link to="/register">
              <button className="bg-accent text-primary px-10 py-5 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-accent/20 hover:-translate-y-1">
                Start analyzing resumes in seconds
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-white/10 text-white border border-white/20 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1">
                Try demo without signup
              </button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 font-medium">
            <span className="material-symbols-outlined text-[16px]">check_circle</span> No credit card required. Cancel anytime.
          </div>
        </div>
      </section>

      {/* 14. FOOTER */}
      <PublicFooter />
    </div>
  );
};

export default Landing;
