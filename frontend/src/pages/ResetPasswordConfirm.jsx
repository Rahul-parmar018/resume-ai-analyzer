import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import api from "../api-client";

const ResetPasswordConfirm = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setStatus("error");
            setMessage("Neural keys do not match.");
            return;
        }
        if (password.length < 6) {
            setStatus("error");
            setMessage("Key must be at least 6 characters.");
            return;
        }

        setStatus("loading");
        try {
            const res = await api.post(`/user/reset-password-confirm/${uidb64}/${token}/`, { password });
            setStatus("success");
            setMessage("Neural key successfully rotated.");
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.error || "Security token invalid or expired.");
        }
    };


    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-body">
            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl mb-8 group overflow-hidden">
                        <ShieldCheck className="w-10 h-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">Protocol: Reset Key</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Identity Verified via Secure Link</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-900/5 relative overflow-hidden">
                    {status === "success" ? (
                        <div className="text-center space-y-6 py-4 animate-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Key Synchronized</h3>
                                <p className="text-sm text-slate-500 font-medium italic">Your new neural key is now active across all Candidex nodes.</p>
                            </div>
                            <Link to="/login" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                                Authenticate Now
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">New Neural Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                            placeholder="Min 6 symbols"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Confirm Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-12 py-4 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                                            placeholder="Verify Neural Key"
                                        />
                                    </div>
                                </div>
                            </div>

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100 animate-in shake duration-300">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{message}</p>
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {status === "loading" ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying Token...</> : "Rotate Neural Key"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-all">
                        <ArrowLeft className="w-3 h-3" />
                        Return to Secure Perimeter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordConfirm;
