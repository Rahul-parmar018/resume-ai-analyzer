import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const Register = () => {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [terms,    setTerms]    = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const friendlyError = (code) => ({
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/invalid-email":        "Please enter a valid email address.",
    "auth/weak-password":        "Password must be at least 6 characters.",
    "auth/popup-closed-by-user": "Sign-in popup was closed.",
  })[code] || "Something went wrong. Please try again.";

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!terms) { setError("Please agree to the Terms of Service."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(user, { displayName: name });
      navigate("/app");
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/app");
    } catch (err) { setError(friendlyError(err.code)); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-[#f7f9fb] font-body">

      {/* Left: Branding Panel */}
      <section className="relative hidden md:flex md:w-1/2 lg:w-3/5 overflow-hidden flex-col justify-between p-12 lg:p-24">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary-container to-[#050d1a]">
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 75% 30%, #4edea3 0%, transparent 45%), radial-gradient(circle at 15% 80%, #6ffbbe 0%, transparent 35%)" }}></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">Candidex AI</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="font-headline text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Build a resume that gets results.
          </h1>
          <p className="text-on-primary-container text-lg lg:text-xl font-light leading-relaxed mb-12">
            Harness the precision of architectural design principles and AI intelligence to craft a career narrative that demands attention.
          </p>

          {/* Benefit cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary-container/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-4 block">auto_awesome</span>
              <h3 className="font-headline text-white font-medium mb-2">AI-Powered Tailoring</h3>
              <p className="text-on-primary-container text-sm leading-snug">Instant alignment with high-value job descriptions.</p>
            </div>
            <div className="bg-primary-container/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm">
              <span className="material-symbols-outlined text-tertiary-fixed-dim mb-4 block">architecture</span>
              <h3 className="font-headline text-white font-medium mb-2">Editorial Layouts</h3>
              <p className="text-on-primary-container text-sm leading-snug">Designer-grade templates for the modern executive.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-on-primary-container/60 text-xs uppercase tracking-widest font-medium">
          © 2024 Candidex AI — The Digital Architect for Modern Careers
        </div>
      </section>

      {/* Right: Registration Form */}
      <section className="w-full md:w-1/2 lg:w-2/5 bg-white flex items-center justify-center p-8 sm:p-12 lg:p-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-md space-y-10"
        >

          {/* Header */}
          <div className="space-y-3">
            <div className="md:hidden mb-8">
              <span className="font-headline font-bold text-xl tracking-tighter text-primary">Candidex AI</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-primary tracking-tight">Create your account</h2>
            <p className="text-on-surface-variant">Start your journey toward a more impactful career.</p>
          </div>

          {error && (
            <div className="bg-error-container/40 border border-error-container text-error text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="full_name" className="block text-sm font-semibold text-primary">Full Name</label>
              <input
                id="full_name" type="text"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none placeholder:text-outline/50"
                placeholder="Johnathan Doe"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-primary">Email Address</label>
              <input
                id="email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none placeholder:text-outline/50"
                placeholder="name@company.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-primary">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPw ? "text" : "password"} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all outline-none placeholder:text-outline/50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              <p className="text-[11px] text-outline px-1">Must be at least 8 characters with one special symbol.</p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 py-2">
              <input
                id="terms" type="checkbox" name="terms"
                checked={terms} onChange={(e) => setTerms(e.target.checked)}
                className="h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-highest mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-on-surface-variant leading-snug">
                I agree to the{" "}
                <a href="#" className="text-primary font-medium underline underline-offset-4 hover:opacity-80">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary font-medium underline underline-offset-4 hover:opacity-80">Privacy Policy</a>.
              </label>
            </div>

            {/* CTA */}
            <div className="pt-4 space-y-6">
              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Creating account…" : "Get Started"}</span>
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold bg-surface px-4 text-outline">or</div>
              </div>

              <button
                type="button" onClick={handleGoogle} disabled={loading}
                className="w-full py-3.5 bg-surface-container-low text-primary font-semibold rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>

          {/* Footer CTA */}
          <div className="text-center pt-8">
            <p className="text-on-surface-variant text-sm">
              Already have an account?
              <Link to="/login" className="text-primary font-bold ml-1 hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Toast */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 backdrop-blur-md bg-white/85 px-6 py-4 rounded-2xl shadow-2xl border border-outline-variant/10 z-50">
        <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim flex items-center justify-center">
          <span className="material-symbols-outlined text-on-tertiary-fixed text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <p className="text-sm font-medium text-primary">Join 50k+ professionals designing their future.</p>
      </div>

    </main>
  );
};

export default Register;
