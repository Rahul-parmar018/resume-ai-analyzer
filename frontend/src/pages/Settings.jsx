import { useState } from "react";
import { useAuth } from "../components/AuthProvider";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Account");
  const [name,  setName]  = useState(user?.displayName || "Alex Rivera");
  const [title, setTitle] = useState("Senior Talent Acquisition");
  const [email, setEmail] = useState(user?.email || "alex.rivera@resume-ai.com");
  const [twoFA, setTwoFA] = useState(true);
  const tabs = ["Account", "Billing", "Team", "Notifications"];

  // Mock Usage Data
  const usageStats = {
    used: 1284,
    limit: 5000,
    renewDate: "Oct 12, 2026"
  };
  const usagePercentage = Math.round((usageStats.used / usageStats.limit) * 100);

  return (
    <div className="space-y-6 pb-8">
      
      <PageHeader 
        title="Settings & Preferences"
        subtitle="Manage your personal profile, team members, and subscription tier."
      />

      {/* Tab Nav */}
      <div className="flex items-center gap-8 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-secondary hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "Account" ? (
        <div className="grid grid-cols-12 gap-8 mt-8 animate-fade-in">

          {/* Left: Profile + Security */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Profile Card */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-heading font-bold text-primary">Public Profile</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-28 h-28 rounded-2xl bg-primary flex items-center justify-center text-white font-heading text-4xl font-bold shadow-md shadow-primary/20">
                    {name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline bg-slate-50 px-3 py-1.5 border border-gray-200 rounded-lg">Update Photo</button>
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary">Full Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary font-medium"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-secondary">Professional Title</label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary font-medium"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-gray-100 pt-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-secondary">Email Address</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent/20 transition-all outline-none text-primary font-medium"
                      type="email"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Security Card */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-heading font-bold text-primary">Security & Access</h3>
                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">verified_user</span> Secure
                </span>
              </div>

              <div className="space-y-4">
                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-gray-100 hover:border-accent/40 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Password Reset</p>
                      <p className="text-xs text-secondary mt-0.5">Last changed 4 months ago</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-slate-50 text-primary transition-colors">
                    Change
                  </button>
                </div>

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-gray-100 hover:border-accent/40 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white border border-gray-200 flex items-center justify-center rounded-lg shadow-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">phonelink_lock</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Two-Factor Auth</p>
                      <p className="text-xs text-secondary mt-0.5">Protect account with SMS keys</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFA(!twoFA)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFA ? "bg-accent" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${twoFA ? "translate-x-5" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Usage & Billing */}
          <div className="col-span-12 lg:col-span-4 space-y-8">

            {/* UPGRADE requested by User: Usage Stats widget */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-2 h-full bg-accent"></div>
               <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">API Usage</h4>
               <div className="flex items-end gap-2 mb-2">
                 <p className="font-heading font-bold text-3xl text-primary">{usageStats.used.toLocaleString()}</p>
                 <p className="text-sm text-secondary font-medium pb-1">/ {usageStats.limit.toLocaleString()} limit</p>
               </div>
               
               <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden mb-4">
                 <div className="h-full bg-primary relative" style={{width: `${usagePercentage}%`}}></div>
               </div>
               
               <p className="text-xs text-secondary font-medium">Resets on {usageStats.renewDate}</p>
            </section>

            {/* Plan Card (Dark Theme) */}
            <section className="bg-primary p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Active Subscription</span>
                <h3 className="text-3xl font-heading font-bold mt-2">Professional</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$149</span>
                  <span className="text-slate-300 text-sm">/ mo</span>
                </div>
                <div className="mt-6 space-y-3">
                  {["5,000 Resume Limit", "Semantic Pipeline Access", "Priority Support SLA"].map((feat) => (
                    <div key={feat} className="flex items-center gap-3 text-sm text-slate-100 font-medium">
                      <span className="material-symbols-outlined text-accent text-[18px]">check_circle</span>
                      {feat}
                    </div>
                  ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-md shadow-white/10 active:scale-95">
                  Manage Billing
                </button>
              </div>
            </section>

          </div>
        </div>
      ) : (
        <div className="mt-8 animate-fade-in">
          <EmptyState 
            icon="construction"
            title={`${activeTab} Settings`}
            description={`The ${activeTab.toLowerCase()} configuration module is currently being optimized for global rollout. Please check back later.`}
            actionLabel="Return to Account"
            onAction={() => setActiveTab("Account")}
          />
        </div>
      )}

      {/* Persistent Save Row */}
      {activeTab === "Account" && (
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-5 bg-white/80 backdrop-blur border-t border-gray-200 z-40 flex justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
           <button className="px-6 py-2.5 text-sm font-bold text-secondary hover:text-primary hover:bg-slate-50 rounded-xl transition-colors">Discard</button>
           <button className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-slate-800 active:translate-y-0.5 transition-all">Save Config</button>
        </div>
      )}

    </div>
  );
};

export default Settings;
