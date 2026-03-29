import { useState } from "react";
import { useAuth } from "../components/AuthProvider";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Account");
  const [name,  setName]  = useState(user?.displayName || "Alex Rivera");
  const [title, setTitle] = useState("Senior Talent Acquisition");
  const [email, setEmail] = useState(user?.email || "alex.rivera@resume-ai.com");
  const [twoFA, setTwoFA] = useState(true);
  const tabs = ["Account", "Billing", "Team", "Notifications"];

  return (
    <div className="space-y-8 pb-8">

      {/* Tab Nav */}
      <div className="flex items-center gap-8 border-b border-surface-container-high">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Account" && (
        <div className="grid grid-cols-12 gap-8">

          {/* Left: Profile + Security */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Profile Card */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
              <div className="mb-8">
                <h3 className="text-xl font-headline font-bold text-primary">Public Profile</h3>
                <p className="text-sm text-on-surface-variant mt-1">Manage how your information appears to your team.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 rounded-2xl bg-primary flex items-center justify-center text-white font-headline text-4xl font-bold ring-4 ring-surface-container-low">
                    {name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Update Photo</button>
                </div>

                {/* Fields */}
                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">Full Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">Professional Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/80">Email Address</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Security Card */}
            <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-headline font-bold text-primary">Security &amp; Access</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Keep your account secure with two-factor authentication.</p>
                </div>
                <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-tighter rounded-full">Secure</span>
              </div>

              <div className="space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-fixed flex items-center justify-center rounded-lg">
                      <span className="material-symbols-outlined text-primary">lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Password Reset</p>
                      <p className="text-xs text-on-surface-variant">Last changed 4 months ago</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold px-4 py-2 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low transition-colors">
                    Change Password
                  </button>
                </div>

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary-fixed flex items-center justify-center rounded-lg">
                      <span className="material-symbols-outlined text-secondary">phonelink_lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Two-Factor Auth</p>
                      <p className="text-xs text-on-surface-variant">Protect your account with SMS codes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFA ? "bg-primary" : "bg-slate-200"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFA ? "translate-x-5" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Billing */}
          <div className="col-span-12 lg:col-span-4 space-y-8">

            {/* Plan Card */}
            <section className="bg-primary p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-container/40 rounded-full -ml-12 -mb-12 blur-2xl"></div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed-dim">Current Plan</span>
                <h3 className="text-3xl font-headline font-bold mt-2">Premium</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$49</span>
                  <span className="text-primary-fixed-dim text-sm">/ month</span>
                </div>
                <div className="mt-8 space-y-4">
                  {["Unlimited Resume Analyses", "Candidate Sourcing Engine", "Priority AI Processing"].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-sm text-primary-fixed">
                      <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}>check_circle</span>
                      {feat}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white text-primary font-bold rounded-xl text-sm active:scale-95 transition-all">
                  Manage Subscription
                </button>
                <p className="text-center mt-4 text-[10px] text-primary-fixed-dim">
                  Next billing date: <span className="text-white">Oct 12, 2024</span>
                </p>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm">
              <h4 className="text-sm font-bold text-primary mb-4">Payment Method</h4>
              <div className="flex items-center gap-4 p-4 border border-outline-variant/20 rounded-xl">
                <div className="w-12 h-8 bg-surface-container-low rounded flex items-center justify-center font-bold text-slate-400 italic text-sm">VISA</div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary">•••• 4242</p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Expires 12/26</p>
                </div>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 border border-dashed border-outline-variant rounded-xl text-xs font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Payment Method
              </button>
            </section>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== "Account" && (
        <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/10">
          <span className="material-symbols-outlined text-5xl text-outline/30 block mb-4">construction</span>
          <p className="text-secondary">{activeTab} settings coming soon.</p>
        </div>
      )}

      {/* Save / Discard */}
      {activeTab === "Account" && (
        <div className="flex justify-end gap-4 border-t border-surface-container-high pt-8">
          <button className="px-8 py-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">Discard Changes</button>
          <button className="px-10 py-3 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-95 transition-all">Save Changes</button>
        </div>
      )}

    </div>
  );
};

export default Settings;
