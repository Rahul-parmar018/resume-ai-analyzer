import { Link } from "react-router-dom";

const PublicFooter = () => {
  return (
    <footer className="py-16 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">

          {/* Brand & Socials */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10">
                <img src="/images/logo.png" alt="Candidex AI Logo" className="w-full h-full object-contain" />
              </div>
              <p className="font-heading font-black text-slate-950 text-xl tracking-tighter">Candidex <span className="text-blue-500 italic">AI</span></p>
            </div>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Premium AI-powered resume intelligence for modern talent acquisition teams. Build world-class teams faster.
            </p>
            <div className="flex items-center gap-4 text-secondary">
              <a href="#" className="hover:text-primary transition-colors"><span className="material-symbols-outlined">language</span></a>
              <a href="#" className="hover:text-primary transition-colors"><span className="material-symbols-outlined">share</span></a>
              <a href="#" className="hover:text-primary transition-colors"><span className="material-symbols-outlined">mail</span></a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 text-sm">

            <div className="space-y-4">
              <p className="font-bold text-primary uppercase tracking-widest text-xs mb-2">Product</p>
              <Link to="/app"          className="block text-secondary hover:text-accent font-medium transition-colors">Dashboard</Link>
              <Link to="/app/analyze"  className="block text-secondary hover:text-accent font-medium transition-colors">Resume Analyzer</Link>
              <Link to="/app/finder"   className="block text-secondary hover:text-accent font-medium transition-colors">Candidate Finder</Link>
              <Link to="/pricing"      className="block text-secondary hover:text-accent font-medium transition-colors">Pricing</Link>
              <a href="#features"      className="block text-secondary hover:text-accent font-medium transition-colors">Features</a>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-primary uppercase tracking-widest text-xs mb-2">Resources</p>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Documentation</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">API Reference</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Help Center</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Blog</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Case Studies</a>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-primary uppercase tracking-widest text-xs mb-2">Company</p>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">About Us</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Careers</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Security</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Contact Sales</a>
            </div>

            <div className="space-y-4">
              <p className="font-bold text-primary uppercase tracking-widest text-xs mb-2">Legal</p>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Privacy Policy</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Terms of Service</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">Cookie Policy</a>
              <a href="#" className="block text-secondary hover:text-accent font-medium transition-colors">GDPR</a>
            </div>

          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
          <p>© 2026 Candidex AI Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-2 text-secondary font-medium">
            <span className="material-symbols-outlined text-accent">neurology</span>
            <span>Powered by Advanced AI</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;
