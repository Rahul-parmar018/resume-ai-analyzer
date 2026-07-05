import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const friendlyError = (code) => ({
    "auth/invalid-credential":  "Invalid email or password.",
    "auth/user-not-found":      "No account found with this email.",
    "auth/wrong-password":      "Incorrect password.",
    "auth/too-many-requests":   "Too many attempts. Try again later.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
  })[code] || "Something went wrong. Please try again.";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back! Logged in successfully.");
      navigate("/dashboard");
    } catch (err) { 
      toast.error(friendlyError(err.code)); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      
      // IDENTITY STABILIZATION: Force a token refresh to wake up the backend
      await result.user.getIdToken(true);
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) { 
      toast.error(friendlyError(err.code)); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0B] text-white font-body">

      {/* Left: Visual Panel */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden flex-col justify-between p-12">
        {/* Dark gradient background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#120B2E] via-[#0A0A0B] to-[#0A0A0B]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 40%)" }}></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center p-2 shadow-2xl border border-white/10">
            <img src="/images/logo.png" alt="Candidex AI Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-headline text-2xl font-bold tracking-tighter italic">Candidex AI</span>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 max-w-lg mb-12">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-medium tracking-widest uppercase">Success Story</span>
            <h2 className="text-white font-headline text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              "The precision of Candidex AI turned my career history into a compelling narrative."
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/20">
                <span className="text-white font-headline font-bold">MC</span>
              </div>
              <div>
                <p className="text-white font-semibold text-base leading-none">Marcus Chen</p>
                <p className="text-white/70 text-sm mt-1">Senior Lead Designer @ ArchiTech</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right: Login Form */}
      <section className="flex-1 flex flex-col bg-[#0B0F1A] border-l border-white/5 z-10 shadow-2xl md:shadow-none">

        {/* Mobile header */}
        <div className="md:hidden p-6 flex justify-between items-center bg-[#0B0F1A]/80 backdrop-blur-sm border-b border-white/5">
          <span className="font-headline text-xl font-bold tracking-tighter text-white">Candidex AI</span>
          <Link to="/register" className="text-sm font-semibold text-purple-400 hover:text-purple-300">Sign up</Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 max-w-2xl mx-auto w-full"
        >
          <div className="mb-12">
            <h1 className="font-headline text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">Welcome back</h1>
            <p className="text-slate-400 font-medium">Continue your journey toward architectural career precision.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 ml-1">Work Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors text-lg">mail</span>
                <input
                  id="email" type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/[0.07] transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-300">Password</label>
                <a href="#" className="text-xs font-semibold text-purple-400 hover:text-purple-300 hover:underline">Forgot password?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors text-lg">lock</span>
                <input
                  id="password" type={showPw ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/20 focus:bg-white/[0.07] transition-all outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors">
                  <span className="material-symbols-outlined text-lg">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button
                type="submit" disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-2xl text-white font-semibold text-base shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-slate-500">
                  <span className="bg-[#0B0F1A] px-4">Or continue with</span>
                </div>
              </div>

              <button
                type="button" onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl text-white font-semibold text-sm border border-white/10 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.02.68-2.33 1.08-3.71 1.08-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>
          </form>

          <div className="mt-auto pt-12 text-center md:text-left">
            <p className="text-slate-400 text-sm">
              New to Candidex AI?
              <Link to="/register" className="text-purple-400 font-bold hover:underline ml-1">Sign up for free</Link>
            </p>
          </div>
        </motion.div>

        <footer className="p-8 mt-auto border-t border-white/5">
          <div className="max-w-2xl mx-auto flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-600 w-full md:w-auto mb-2 md:mb-0">© 2026 Candidex AI</span>
            {["Privacy Policy", "Terms of Service", "Support"].map((l) => (
              <a key={l} href="#" className="text-[10px] uppercase tracking-widest font-bold text-slate-600 hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </footer>
      </section>

    </main>
  );
};

export default Login;
