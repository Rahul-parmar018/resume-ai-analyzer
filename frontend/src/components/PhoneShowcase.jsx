import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const RESUMES = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "AI Software Engineer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop",
    match: "98%",
    skills: ["React", "Python", "PyTorch"],
    experience: "5+ Years",
    summary: "Passionate engineer specialized in neural architectures and high-velocity web systems.",
    latestExp: "Senior AI Dev @ TechNova"
  },
  {
    id: 2,
    name: "Marcus Thorne",
    role: "Product Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop",
    match: "96%",
    skills: ["Figma", "UI/UX", "Motion"],
    experience: "8+ Years",
    summary: "Creating user-centric experiences that bridge the gap between complex tech and human needs.",
    latestExp: "Design Lead @ Studio X"
  }
];

const ResumeUI = ({ resume, isActive }) => {
  if (!resume) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="w-full h-full bg-white flex flex-col pt-12 p-5"
    >
      {/* 1. Header: Profile (Top Left) + Name/Role + Match */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex gap-3">
          <img 
            src={resume.image} 
            alt={resume.name} 
            className="w-12 h-12 rounded-xl object-cover shadow-sm ring-2 ring-slate-50" 
          />
          <div className="pt-0.5">
            <h4 className="text-[13px] font-black text-slate-900 tracking-tight leading-tight">{resume.name}</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{resume.role}</p>
          </div>
        </div>
        <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-lg shadow-lg shadow-emerald-500/20">
          <span className="text-[9px] font-black">{resume.match}</span>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="flex gap-3 mb-5">
         <div className="flex-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Experience</p>
            <p className="text-[10px] font-black text-slate-800">{resume.experience}</p>
         </div>
         <div className="flex-1 bg-slate-50 border border-slate-100 p-2.5 rounded-xl text-center">
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Status</p>
            <p className="text-[10px] font-black text-emerald-600 flex items-center justify-center gap-1">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
              Verified
            </p>
         </div>
      </div>

      {/* 3. Summary */}
      <div className="mb-5">
         <p className="text-[10px] text-slate-600 leading-relaxed font-medium italic">
            "{resume.summary}"
         </p>
      </div>

      {/* 4. Skills */}
      <div className="flex flex-wrap gap-1.5 mb-6">
         {resume.skills.map((skill, i) => (
           <span key={i} className="bg-slate-100 text-slate-600 text-[8px] font-black px-2.5 py-1 rounded-full">
              {skill}
           </span>
         ))}
      </div>

      {/* 5. Latest Experience */}
      <div className="flex-1">
         <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Latest Activity</p>
            <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                     <span className="material-symbols-outlined text-[14px]">work</span>
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-slate-800 leading-none">{resume.latestExp}</p>
                     <p className="text-[8px] text-slate-400 font-bold mt-1">Ready for scan</p>
                  </div>
               </div>
               <span className="material-symbols-outlined text-[10px] text-slate-300">chevron_right</span>
            </div>
         </div>
      </div>

      {/* 6. CTA Button */}
      <div className="mt-4">
         <button className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2">
            Score Optimized
            <span className="material-symbols-outlined text-[12px]">bolt</span>
         </button>
      </div>
    </motion.div>
  );
};

const PhoneShowcase = () => {
  const [activeResume, setActiveResume] = useState(0);
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 100, damping: 30 });

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
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center h-[550px] w-full perspective-[2000px] pointer-events-auto"
    >
       <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
          <div className="w-[300px] h-[400px] bg-purple-600/[0.06] rounded-full blur-[100px]"></div>
       </div>

       <motion.div
         style={{
           rotateX,
           rotateY,
           transformStyle: "preserve-3d"
         }}
         className="relative w-[250px] h-[520px] bg-[#080808] rounded-[2.8rem] p-[8px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 z-20 overflow-hidden"
       >
          <div className="absolute inset-0 rounded-[2.8rem] border-[1px] border-white/15 pointer-events-none z-30 opacity-40"></div>
          
          {/* TOP NOTCH (Adjusted height and position) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#000] rounded-full z-50 border border-white/[0.05]"></div>

          <div className="w-full h-full bg-white rounded-[2.3rem] overflow-hidden relative">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeResume}
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                   <ResumeUI resume={RESUMES[activeResume]} isActive={true} />
                </motion.div>
             </AnimatePresence>
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-200 rounded-full opacity-30"></div>
          </div>
       </motion.div>

       {/* Floating Meta (Shrunk) */}
       <motion.div 
         animate={{ y: [-5, 5, -5] }}
         transition={{ duration: 5, repeat: Infinity }}
         className="absolute top-10 right-[-20px] glass-panel p-3 z-10 border-white/5 opacity-30 scale-50 hidden xl:block"
       >
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural V4</span>
       </motion.div>
    </div>
  );
};

export default PhoneShowcase;
