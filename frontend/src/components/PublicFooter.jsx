import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="py-16 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">

          {/* Brand & Socials */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10">
                <img src="/images/logo.png" alt="Candidex AI Logo" className="w-full h-full object-contain" />
              </div>
              <p className="font-heading font-black text-slate-900 text-2xl italic tracking-tighter">Candidex AI</p>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed font-medium">
              An advanced AI resume analyzer designed to help candidates decode recruiter intent, identify critical gaps, and get shortlisted faster.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">language</span></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">share</span></a>
              <a href="#" className="hover:text-slate-900 transition-colors"><span className="material-symbols-outlined">mail</span></a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 text-sm">

            <div className="space-y-4">
              <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Product</p>
              <Link to="/resume-scanner" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Resume Scanner</Link>
              <Link to="/resume-gap-analysis" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Gap Analyzer</Link>
              <Link to="/resume-optimizer" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">AI Optimizer</Link>
              <Link to="/pricing" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Pricing</Link>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Resources</p>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">ATS Guidelines</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Cover Letter AI</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Help Center</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Career Blog</a>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Company</p>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">About Us</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Careers</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Security Validation</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Contact Support</a>
            </div>

            <div className="space-y-4">
              <p className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Legal</p>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Privacy Policy</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Terms of Service</a>
              <a href="#" className="block text-slate-500 hover:text-emerald-500 font-medium transition-colors">Cookie Policy</a>
            </div>

          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-black uppercase tracking-widest">
          <p>© 2026 Candidex AI. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Powered by Neural Matching v4.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;
