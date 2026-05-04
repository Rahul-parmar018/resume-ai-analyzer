import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useMode } from "../context/ModeContext";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { 
  User, 
  Mail, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  X
} from "lucide-react";
import api from "../api-client";

const Settings = () => {
    const { user, profile, refreshProfile } = useAuth();
    const { mode, setMode } = useMode();
    const navigate = useNavigate();
    
    // Profile State
    const [name, setName] = useState(profile?.display_name || "");
    const [location, setLocation] = useState(profile?.location || "");
    const [bio, setBio] = useState(profile?.bio || "");
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchingRole, setIsSwitchingRole] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Sync profile
    useEffect(() => {
        if (profile) {
            setName(profile.display_name || "");
            setLocation(profile.location || "");
            setBio(profile.bio || "");
        }
    }, [profile]);

    const handleSave = async () => {
        setIsLoading(true);
        setMessage({ type: "", text: "" });
        try {
            await api.patch('/user/profile/update/', {
                display_name: name,
                location: location,
                bio: bio
            });
            await refreshProfile();
            setMessage({ type: "success", text: "Profile updated successfully." });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update profile." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchRole = async (newRole) => {
        if (newRole === mode) return;
        setIsSwitchingRole(true);
        try {
            await setMode(newRole);
            setMessage({ type: "success", text: `Switched to ${newRole} mode.` });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to switch mode." });
        } finally {
            setIsSwitchingRole(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(firebaseAuth, user.email);
            setMessage({ type: "success", text: "Password reset link sent to your email." });
            setShowPasswordModal(false);
        } catch (err) {
            setMessage({ type: "error", text: "Failed to send reset link." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your professional persona and workspace preferences.</p>
            </header>

            {/* Feedback Toast */}
            {message.text && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                    message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wider">{message.text}</span>
                </div>
            )}

            {/* Profile Section */}
            <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <User className="text-purple-500" size={20} />
                    <h2 className="text-lg font-bold">Profile Information</h2>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 transition-all outline-none text-white"
                                placeholder="Rahul Parmar"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-[#0B0F1A] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500/50 transition-all outline-none text-white"
                                    placeholder="Ahmedabad, India"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Summary</label>
                        <textarea 
                            rows={4}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="w-full bg-[#0B0F1A] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 transition-all outline-none resize-none text-white"
                            placeholder="Tell us about your expertise..."
                        />
                    </div>
                </div>
            </section>

            {/* Account Section */}
            <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <ShieldCheck className="text-purple-500" size={20} />
                    <h2 className="text-lg font-bold">Account & Security</h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                            <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-slate-500 uppercase font-bold tracking-tighter">Locked</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#0B0F1A] p-3 rounded-xl border border-white/5 opacity-60 cursor-not-allowed">
                            <Mail size={16} className="text-slate-500" />
                            <span className="text-sm font-medium text-slate-400 truncate">{user?.email}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Password</label>
                        <button 
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full flex items-center justify-center gap-3 py-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-600/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                        >
                            <Lock size={16} />
                            Change Password
                        </button>
                    </div>
                </div>
            </section>

            {/* Workspace Mode Section */}
            <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <RefreshCw className="text-purple-500" size={20} />
                    <h2 className="text-lg font-bold">Workspace Mode</h2>
                </div>
                <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-sm font-bold text-white mb-1">Current Active Mode: <span className="text-purple-500 capitalize">{mode}</span></h4>
                        <p className="text-xs text-slate-500">Switch between job seeker and hiring tools to access different dashboard features.</p>
                    </div>
                    <div className="flex p-1 bg-[#0B0F1A] rounded-xl border border-white/10">
                        {['candidate', 'recruiter'].map((r) => (
                            <button
                                key={r}
                                disabled={isSwitchingRole}
                                onClick={() => handleSwitchRole(r)}
                                className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                                    mode === r 
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                                        : 'text-slate-500 hover:text-white'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-white text-black px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl disabled:opacity-50 flex items-center gap-3"
                >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {isLoading ? "Saving Changes..." : "Save Profile"}
                </button>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowPasswordModal(false)}
                    />
                    <div className="relative bg-[#0B0F1A] border border-white/10 w-full max-w-md rounded-2xl p-8 animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-black text-white mb-2">Update Password</h3>
                        <p className="text-sm text-slate-500 mb-6">We will send a secure password reset link to your registered email address.</p>
                        
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-6">
                            <div className="flex items-center gap-3 text-white/60">
                                <Mail size={16} />
                                <span className="text-sm font-bold truncate">{user?.email}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handlePasswordReset}
                            disabled={isLoading}
                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-3"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                            Send Reset Broadcast
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Settings;
