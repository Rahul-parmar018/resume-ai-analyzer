import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const RESUMES = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop",
    match: "98%",
    skills: ["React", "Python", "AWS", "Node.js"],
    experience: "6+ Years",
    summary: "Passionate developer building scalable cloud architectures and high-performance web apps."
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Lead Product Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
    match: "96%",
    skills: ["Figma", "UI/UX", "Motion", "Design Ops"],
    experience: "8+ Years",
    summary: "Creating user-centric experiences that bridge the gap between complex tech and human needs."
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Data Scientist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&auto=format&fit=crop",
    match: "99%",
    skills: ["PyTorch", "NLP", "Big Data", "TensorFlow"],
    experience: "5+ Years",
    summary: "Leveraging machine learning to unlock deep insights from unstructured data sets at scale."
  }
];

const ResumeCard = ({ resume, isActive }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: isActive ? 1 : 0.9, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: -20 }}
    className={`w-full h-full bg-white text-slate-900 p-5 flex flex-col rounded-2xl shadow-inner transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}
  >
    {/* CV Header */}
    <div className="flex items-center gap-3 mb-4">
      <img src={resume.image} alt={resume.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm" />
      <div className="flex-1">
        <h4 className="text-sm font-black tracking-tight">{resume.name}</h4>
        <p className="text-[10px] text-slate-500 font-bold">{resume.role}</p>
      </div>
      <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg">
        <span className="text-[10px] font-black">{resume.match}</span>
      </div>
    </div>

    {/* Metrics Bar */}
    <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl mb-4 border border-slate-100">
      <div className="text-center px-2">
        <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Experience</p>
        <p className="text-[10px] font-black">{resume.experience}</p>
      </div>
      <div className="w-px h-4 bg-slate-200" />
      <div className="text-center px-2">
        <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Skills</p>
        <p className="text-[10px] font-black">{resume.skills.length}+ Key</p>
      </div>
      <div className="w-px h-4 bg-slate-200" />
      <div className="text-center px-2">
        <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Status</p>
        <p className="text-[10px] font-black text-emerald-500">Verified</p>
      </div>
    </div>

    {/* Summary */}
    <div className="mb-4">
      <p className="text-[9px] text-slate-500 leading-relaxed font-medium italic">"{resume.summary}"</p>
    </div>

    {/* Skills Tag Cloud */}
    <div className="flex flex-wrap gap-1.5 mb-6">
      {resume.skills.map((skill, i) => (
        <span key={i} className="text-[8px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
          {skill}
        </span>
      ))}
    </div>

    {/* Bottom Section (Experience Preview) */}
    <div className="flex-1 border-t border-slate-100 pt-4 space-y-3">
      <div className="space-y-1">
         <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Latest Experience</p>
         <div className="flex justify-between items-start">
            <div>
               <p className="text-[10px] font-black">Senior Engineer</p>
               <p className="text-[9px] text-slate-500 font-medium">TechNova Solutions &bull; 2021 - Present</p>
            </div>
         </div>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "85%" }}
          className="h-full bg-purple-500"
        />
      </div>
    </div>

    {/* AI Badge */}
    <div className="mt-4 bg-purple-600 text-white p-3 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
         <span className="material-symbols-outlined text-sm">auto_awesome</span>
         <span className="text-[10px] font-black">AI OPTIMIZED</span>
      </div>
      <span className="text-[10px] opacity-70">ATS Score: 98</span>
    </div>
  </motion.div>
);

const MobileShowcase = () => {
  const [activeResume, setActiveResume] = useState(0);
  const containerRef = useRef(null);

  // 3D Tilt Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), { stiffness: 100, damping: 30 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveResume((prev) => (prev + 1) % RESUMES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 px-6 bg-transparent relative overflow-hidden flex flex-col items-center">
      
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* LEFT CONTENT */}
        <div className="space-y-10 text-center lg:text-left">
           <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="voxr-pill w-fit mx-auto lg:mx-0"
              >
                <span className="material-symbols-outlined text-sm">smartphone</span>
                Next-Gen Experience
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                 Your Career, <br />
                 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent italic font-serif">Reimagined.</span>
              </h2>
              <p className="text-white/40 text-xl leading-relaxed max-w-xl font-medium">
                 Experience the first AI-driven resume platform that designs for impact. Swipe through templates, optimize in real-time, and get noticed by top employers.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-10 py-5 bg-purple-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-purple-500/20 hover:bg-purple-500 hover:-translate-y-1 transition-all duration-300">
                 Build Your AI Resume
              </button>
              <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                 View Templates
              </button>
           </div>

           {/* Floating Features HUD */}
           <div className="grid grid-cols-2 gap-6 pt-10">
              {[
                { label: "Design Quality", val: "Premium" },
                { label: "Optimization", val: "Real-time" }
              ].map((item, i) => (
                <div key={i} className="glass-panel p-6 border-white/5">
                   <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{item.label}</p>
                   <p className="text-xl font-black text-white">{item.val}</p>
                </div>
              ))}
           </div>
        </div>

        {/* RIGHT CONTENT: 3D PHONE SHOWCASE */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center justify-center h-[700px] perspective-[2000px]"
        >
           {/* Particles/Floating Elements */}
           <motion.div 
             animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
             transition={{ duration: 8, repeat: Infinity }}
             className="absolute top-10 right-10 w-20 h-20 glass-panel border-white/10 flex items-center justify-center text-purple-400 z-0"
           >
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
           </motion.div>
           <motion.div 
             animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute bottom-20 left-0 w-16 h-16 glass-panel border-white/10 flex items-center justify-center text-blue-400 z-0"
           >
              <span className="material-symbols-outlined text-2xl">bolt</span>
           </motion.div>

           {/* THE PHONE CONTAINER */}
           <motion.div
             style={{
               rotateX,
               rotateY,
               transformStyle: "preserve-3d"
             }}
             className="relative w-[300px] h-[600px] bg-[#050505] rounded-[3.5rem] p-4 shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/10 z-20"
           >
              {/* Phone Bezel/Highlight */}
              <div className="absolute inset-0 rounded-[3.5rem] border-[1px] border-white/20 pointer-events-none z-30 opacity-50 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"></div>
              
              {/* Speaker/Dynamic Island */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-40 border border-white/5 flex items-center justify-center">
                 <div className="w-1 h-1 rounded-full bg-slate-800 ml-10"></div>
              </div>

              {/* PHONE SCREEN CONTENT */}
              <div className="w-full h-full bg-slate-100 rounded-[2.8rem] overflow-hidden relative shadow-inner">
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={activeResume}
                      className="w-full h-full p-4"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                       <ResumeCard resume={RESUMES[activeResume]} isActive={true} />
                    </motion.div>
                 </AnimatePresence>

                 {/* Pagination Dots */}
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                    {RESUMES.map((_, i) => (
                      <div 
                        key={i}
                        onClick={() => setActiveResume(i)}
                        className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${activeResume === i ? 'bg-purple-600 w-4' : 'bg-slate-300'}`}
                      />
                    ))}
                 </div>
              </div>

              {/* Side Buttons (3D realism) */}
              <div className="absolute top-24 -right-[2px] w-[3px] h-12 bg-white/10 rounded-l-md border-l border-white/20"></div>
              <div className="absolute top-44 -right-[2px] w-[3px] h-8 bg-white/10 rounded-l-md border-l border-white/20"></div>
              <div className="absolute top-24 -left-[2px] w-[3px] h-10 bg-white/10 rounded-r-md border-r border-white/20"></div>
           </motion.div>

           {/* Phone Shadow (Interactive) */}
           <motion.div 
             style={{ rotateX, rotateY }}
             className="absolute bottom-[-40px] w-[200px] h-[40px] bg-black/60 blur-3xl rounded-[100%] z-0"
           />
        </div>

      </div>
    </section>
  );
};

export default MobileShowcase;
