import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { 
  User, 
  CreditCard, 
  History as HistoryIcon, 
  ChevronLeft, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Languages,
  LogOut,
  Mail,
  Lock,
  Loader2,
  Trash2
} from "lucide-react";
import api from "../api-client";
import HistoryView from "./History";

const Settings = () => {
    const { user, profile, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Your Profile");
    
    // Profile State
    const [name, setName] = useState(profile?.display_name || "");
    const [location, setLocation] = useState(profile?.location || "");
    const [bio, setBio] = useState(profile?.bio || "");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Security & State
    const [resetLoading, setResetLoading] = useState(false);
    const [resetCooldown, setResetCooldown] = useState(0);
    const [resetMessage, setResetMessage] = useState("");
    const [saveStatus, setSaveStatus] = useState(""); // success, error

    const sidebarItems = [
        { name: "Your Profile", icon: User },
        { name: "Evolution History", icon: HistoryIcon },
        { name: "Billing", icon: CreditCard },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });
        try {
            await api.patch('/user/profile/update/', {
                display_name: name,
                location,
                bio
            });
            await refreshProfile();
            setSaveStatus("success");
            setMessage({ type: "success", text: "Profile synchronized with neural network." });
        } catch (err) {
            setSaveStatus("error");
            setMessage({ type: "error", text: "Failed to commit profile updates." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleRequestPasswordReset = async () => {
        if (!user?.email || resetCooldown > 0) return;
        setResetLoading(true);
        setResetMessage("");
        try {
            await sendPasswordResetEmail(firebaseAuth, user.email);
            setResetCooldown(60);
            setResetMessage("Reset link sent to Gmail.");
        } catch (err) {
            console.error("Reset error:", err);
            setResetMessage("Security broadcast failed. Try again later.");
        } finally {
            setResetLoading(false);
        }
    };

    // Sync state with profile updates
    useEffect(() => {
        if (profile) {
            setName(profile.display_name || "");
            setLocation(profile.location || "");
            setBio(profile.bio || "");
        }
    }, [profile]);

    // Cooldown timer logic
    useEffect(() => {
        if (resetCooldown > 0) {
            const timer = setTimeout(() => setResetCooldown(resetCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resetCooldown]);

  return (
    <div className="flex min-h-screen bg-white font-body">
      
      {/* Settings Navigation Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-y-2 lg:sticky lg:top-0 h-screen">
         <button 
           onClick={() => navigate("/")}
           className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 transition-all font-bold mb-6"
         >
           <ChevronLeft className="w-4 h-4" />
           Back
         </button>

         {sidebarItems.map((item) => (
           <button
             key={item.name}
             onClick={() => setActiveTab(item.name)}
             className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
               activeTab === item.name 
                 ? "bg-white text-primary shadow-sm border border-slate-100" 
                 : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
             }`}
           >
             <item.icon className={`w-4 h-4 ${activeTab === item.name ? "text-primary" : ""}`} />
             <span className="text-sm">{item.name}</span>
           </button>
         ))}
      </aside>

      {/* Main Settings Content */}
      <main className="flex-1 p-8 max-w-7xl">
        
        {activeTab === "Your Profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-right-4 duration-500">
             
             {/* Left Column: Focused Profile Editing (8 cols) */}
             <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
                <div className="max-w-3xl space-y-4">
                   <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-1">Your Profile</h2>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Adjust your system-wide professional persona</p>
                   </div>

                   <section className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Name Input */}
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</label>
                            <input 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                              placeholder="Rahul Parmar"
                            />
                         </div>

                         {/* Language Selector */}
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Language</label>
                            <div className="relative">
                               <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 text-sm appearance-none outline-none">
                                  <option>English (Global)</option>
                                  <option>Hindi (IN)</option>
                               </select>
                               <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                         </div>
                      </div>

                      {/* Bio / Professional Summary */}
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional Summary</label>
                         <textarea 
                           rows={3}
                           value={bio}
                           onChange={(e) => setBio(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none"
                           placeholder="AI Researcher & SaaS Engineer..."
                         />
                      </div>

                      {/* Location base */}
                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operating Location</label>
                         <input 
                           value={location}
                           onChange={(e) => setLocation(e.target.value)}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                           placeholder="e.g. Ahmedabad, India"
                         />
                      </div>

                      <div className="h-px bg-slate-50 w-full my-2" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         {/* Email Section */}
                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Email Channel</h4>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                   <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-600 truncate">{user?.email}</p>
                             </div>
                             <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100/50">
                                <p className="text-[10px] text-emerald-700 font-bold leading-relaxed italic">
                                   This is your primary identity channel. To change it, please contact platform security.
                                </p>
                             </div>
                          </div>

                         {/* Password Section */}
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Identity Security</h4>
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                  <Lock className="w-4 h-4 text-slate-400" />
                               </div>
                               <p className="text-[10px] font-black tracking-[0.5em] text-slate-400">********</p>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                               <button 
                                 onClick={handleRequestPasswordReset}
                                 disabled={resetLoading || resetCooldown > 0}
                                 className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline disabled:opacity-50 disabled:no-underline text-left w-fit"
                               >
                                 {resetLoading ? "Sending..." : resetCooldown > 0 ? `Resend in ${resetCooldown}s` : "Change Password"}
                               </button>
                               {resetMessage && (
                                  <p className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in slide-in-from-left-2 duration-300 ${resetMessage.includes('Error') || resetMessage.includes('failed') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                     {resetMessage.includes('sent') ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                     {resetMessage}
                                  </p>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                         <div className="flex items-center gap-4">
                            <button className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">Cookies Policy</button>
                            <button className="text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">Global Sign-out</button>
                         </div>
                         <div className="flex items-center gap-6">
                            {saveStatus === "success" && <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest"><CheckCircle2 className="w-3.5 h-3.5" /> Synced</div>}
                            <button 
                              onClick={handleSave}
                              disabled={isSaving}
                              className="bg-slate-900 text-white px-10 py-3.5 rounded-xl font-black text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                            >
                              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Commit Changes"}
                            </button>
                         </div>
                      </div>
                   </section>
                </div>
             </div>

             <div className="lg:col-span-4 sticky top-8 space-y-6">
                <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl opacity-50 -translate-y-12 translate-x-12" />
                   
                   <div className="relative z-10 space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center text-4xl font-black border border-white/5 backdrop-blur-sm">
                            {profile?.profile_image ? (
                               <img src={profile.profile_image} className="w-full h-full object-cover rounded-3xl" />
                            ) : (
                               (name || "U")[0].toUpperCase()
                            )}
                         </div>
                         <div className="bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">{profile?.role || "Candidate"}</span>
                         </div>
                      </div>

                      <div>
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1 truncate">{name || "Unnamed User"}</h3>
                         <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                            {location || "Global Base"}
                         </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 italic text-slate-300 text-xs leading-relaxed min-h-[80px]">
                         {bio || "Your professional bio will appear here. Start typing to build your persona..."}
                      </div>

                      <button className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                         Upload Live Portrait
                      </button>
                   </div>
                </div>

                {/* Sub-info Card */}
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-4 shadow-sm">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Health</h5>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Verification</span>
                      <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Secured</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Last Sync</span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Just Now</span>
                   </div>
                </div>
             </div>
          </div>
        )}
        
        {activeTab === "Evolution History" && (
           <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <HistoryView />
           </div>
        )}

        {activeTab === "Billing" && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Your Plan */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase italic tracking-tighter">Your Plan</h2>
                   
                   <div className="p-8 rounded-[2rem] border border-rose-100 bg-rose-50/20 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <p className="text-xl font-black text-slate-900 mb-1">Expired Free Trial</p>
                            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-rose-500">Expired on Apr 5th, 2026</p>
                         </div>
                         <div className="bg-rose-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-rose-500/20">
                            <span className="material-symbols-outlined text-rose-500 text-sm italic">stars</span>
                            <span className="text-[9px] font-black text-rose-500 uppercase italic">Expired</span>
                         </div>
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 italic">Your subscription has expired. You won't be able to edit your resume until you renew it.</p>
                      <button className="text-primary font-black text-sm hover:underline underline-offset-4">Start Subscription</button>
                   </div>

                   <div className="mt-8 p-8 rounded-[2rem] border border-slate-100 bg-slate-50 relative group">
                      <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-black text-slate-900">Get more with Pro</h3>
                         <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">Upgrade</button>
                      </div>
                      <div className="space-y-4">
                         <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-widest border-b border-slate-200 pb-2">Benefits Track</p>
                         {[
                             { icon: 'temp_preferences_custom', text: 'Add Pro Sections' },
                             { icon: 'description', text: 'Compact template' },
                             { icon: 'playlist_add_check', text: 'Unlimited entries' },
                             { icon: 'auto_fix_high', text: '300 resumes and cover letters' },
                             { icon: 'neurology', text: 'Remove branding' }
                         ].map(item => (
                            <div key={item.text} className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-emerald-500 text-[18px]">{item.icon}</span>
                               <span className="text-[11px] font-bold text-slate-600 italic">{item.text}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="lg:col-span-6">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm min-h-[400px]">
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase italic tracking-tighter">Billing History</h2>
                   <div className="relative overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                            <th className="pb-4">Date</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4">Plan</th>
                            <th className="pb-4">Receipt</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan="4" className="pt-12 text-center">
                               <p className="text-slate-400 italic text-xs font-medium">Your transaction history will appear here.</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>

           </div>
        )}

      </main>

      {/* SECURE MODAL */}


    </div>
  );
};

export default Settings;
