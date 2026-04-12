import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const Customers = () => {
  return (
    <div className="bg-slate-900 text-white font-sans min-h-screen pt-24 relative overflow-hidden">
      {/* Custom Header for Dark Mode Page */}
      <PublicHeader />

      {/* Hero */}
      <section className="py-20 px-6 text-center relative z-10 pt-32">
        <div className="max-w-4xl mx-auto mb-20">
          <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3">Customer Impact</p>
          <h1 className="font-heading text-6xl md:text-7xl font-bold mb-6 tracking-tight">Radical Efficiency.</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
            See the transformative business metrics of teams who switched from legacy screening to Candidex AI's semantic pipeline.
          </p>
        </div>

        {/* Floating Logos */}
        <div className="flex justify-center gap-12 flex-wrap mb-24 opacity-50 grayscale">
          <h4 className="font-heading font-black text-2xl tracking-widest border border-white/20 px-6 py-2 rounded-xl">TECHCORP</h4>
          <h4 className="font-heading font-black text-2xl tracking-widest border border-white/20 px-6 py-2 rounded-xl">LUMINA</h4>
          <h4 className="font-heading font-black text-2xl tracking-widest border border-white/20 px-6 py-2 rounded-xl">VANGUARD</h4>
        </div>
      </section>

      {/* Case Studies (Before vs After) */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto space-y-12">

          {/* Impact Card 1 */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all"></div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <p className="text-accent font-bold mb-2">Enterprise Software</p>
                <h3 className="font-heading text-4xl font-bold mb-6">Scaling Engineering Hires Pipeline</h3>
                <p className="text-slate-400 leading-relaxed mb-8">"We receive thousands of inbound resumes for every backend role. The manual screening was causing a massive bottleneck, meaning we lost top candidates to competitors who moved faster."</p>
                <div className="flex items-center gap-4 border-t border-slate-700 pt-6">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold">SJ</div>
                  <div>
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-xs text-slate-400">VP Talent, TECHCORP</p>
                  </div>
                </div>
              </div>

              {/* Before vs After Visual */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-inner">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-red-500">cancel</span>
                      <h4 className="font-bold text-slate-300">Before Candidex AI</h4>
                    </div>
                    <div className="flex justify-between items-end bg-slate-800 p-4 rounded-xl border border-slate-700">
                      <span className="text-sm font-bold text-slate-400">Time-to-Screen Batch</span>
                      <span className="text-3xl font-heading font-bold text-red-400">22 hrs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-accent">check_circle</span>
                      <h4 className="font-bold text-white">After Candidex AI</h4>
                    </div>
                    <div className="flex justify-between items-end bg-accent/10 p-4 rounded-xl border border-accent/20">
                      <span className="text-sm font-bold text-slate-300">Time-to-Screen Batch</span>
                      <span className="text-4xl font-heading font-bold text-accent">3 mins</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Card 2 */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="order-2 lg:order-1">
                {/* Before vs After Visual */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-inner">
                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-red-500">cancel</span>
                        <h4 className="font-bold text-slate-300">Before Candidex AI</h4>
                      </div>
                      <div className="flex justify-between items-end bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <span className="text-sm font-bold text-slate-400">Candidate Diversity Ratio</span>
                        <span className="text-3xl font-heading font-bold text-red-400">18%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">Human bias implicitly affected early screening selection.</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-accent">check_circle</span>
                        <h4 className="font-bold text-white">After Candidex AI</h4>
                      </div>
                      <div className="flex justify-between items-end bg-blue-500/10 p-4 rounded-xl border border-blue-500/20">
                        <span className="text-sm font-bold text-slate-300">Candidate Diversity Ratio</span>
                        <span className="text-4xl font-heading font-bold text-blue-400">42%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-2">Objective semantic scoring removed demographic blinding constraints.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-blue-400 font-bold mb-2">Financial Infrastructure</p>
                <h3 className="font-heading text-4xl font-bold mb-6">Eliminating Human Bias in Hiring</h3>
                <p className="text-slate-400 leading-relaxed mb-8">"Candidex AI blind-scores candidates entirely based on technical merit. By removing names, schools, and inferred ages from the initial screening layer, our diversity metrics naturally skyrocketed without lowering the technical bar."</p>
                <div className="flex items-center gap-4 border-t border-slate-700 pt-6">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold">ER</div>
                  <div>
                    <p className="font-bold">Elena Rostova</p>
                    <p className="text-xs text-slate-400">Head of DE&I, VANGUARD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mini CTA */}
      <section className="py-24 text-center border-t border-slate-800">
         <h2 className="font-heading text-4xl font-bold mb-8">Ready for these results?</h2>
         <Link to="/register">
           <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/10 active:scale-95">
             Upgrade Your Pipeline
           </button>
         </Link>
      </section>

    </div>
  );
};

export default Customers;
