import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const Pricing = () => {
  return (
    <div className="bg-neutral-50 text-primary font-sans min-h-screen pt-24">
      <PublicHeader />

      {/* PRICING HERO */}
      <section className="py-20 px-6 bg-neutral-50 text-center">
        <div className="max-w-7xl mx-auto mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-3">Plans</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-primary">Simple, Transparent Pricing</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Scale your hiring intelligence effortlessly to build world-class engineering teams.</p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-left">
          
          {/* Starter */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">Starter</h3>
            <p className="text-secondary text-sm mb-6">Perfect for small teams hiring 1-5 roles per month.</p>
            <div className="mb-6"><span className="text-4xl font-bold text-primary">$49</span><span className="text-secondary">/mo</span></div>
            <Link to="/register"><button className="w-full py-3 rounded-xl border border-gray-300 text-primary font-bold mb-8 hover:bg-gray-50 transition-colors">Start Free Trial</button></Link>
            <ul className="space-y-4 text-sm text-secondary">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Up to 500 reports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Basic Finder</li>
              <li className="flex items-center gap-2 text-gray-400"><span className="material-symbols-outlined text-[18px]">horizontal_rule</span>ATS Integrations</li>
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-primary rounded-2xl p-8 border border-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-accent/20">Most Popular</div>
            <h3 className="font-heading text-2xl font-bold text-white mb-2">Professional</h3>
            <p className="text-white/70 text-sm mb-6">For growing companies hiring at scale.</p>
            <div className="mb-6"><span className="text-4xl font-bold text-white">$149</span><span className="text-white/70">/mo</span></div>
            <Link to="/register"><button className="w-full py-3 rounded-xl bg-accent text-primary font-bold mb-8 hover:opacity-90 transition-opacity">Get Started</button></Link>
            <ul className="space-y-4 text-sm text-white/90">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Up to 5,000 reports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Semantic Search</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>ATS Syncing</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Exportable PDF</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="font-heading text-2xl font-bold text-primary mb-2">Enterprise</h3>
            <p className="text-secondary text-sm mb-6">Custom solutions for massive volume hiring.</p>
            <div className="mb-6"><span className="text-4xl font-bold text-primary">Custom</span></div>
            <button className="w-full py-3 rounded-xl border border-gray-300 text-primary font-bold mb-8 hover:bg-gray-50 transition-colors">Contact Sales</button>
            <ul className="space-y-4 text-sm text-secondary">
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Unlimited reports</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Custom AI Tuning</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Priority SLA</li>
              <li className="flex items-center gap-2"><span className="material-symbols-outlined text-accent text-[18px]">check</span>Account Manager</li>
            </ul>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-12 text-center text-primary">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will be reflected in your next billing cycle." },
              { q: "How does the AI token usage map to reports?", a: "Each 'report' equals one full analysis of a candidate resume against a single job description. Semantic search queries within the Candidate Finder do not count toward your report limit." },
              { q: "Do you offer discounts for non-profits?", a: "We offer special pricing for academic institutions and non-profit organizations. Please contact our sales team with proof of status." },
              { q: "What happens if I exceed my monthly limit?", a: "You won't be charged automatically. We'll pause new analyses and prompt you to upgrade your plan." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-gray-100 hover:border-gray-200 transition-colors">
                <h4 className="font-bold text-primary text-lg mb-2">{faq.q}</h4>
                <p className="text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6 bg-neutral-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-primary">
            Ready to upgrade your team?
          </h2>
          <p className="text-secondary mb-8 text-lg">
            Start with our risk-free 14-day trial. No credit card required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 active:scale-95">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Pricing;
