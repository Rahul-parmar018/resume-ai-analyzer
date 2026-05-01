import React from 'react';
import { motion } from 'framer-motion';

const ReviewCard = ({ text, name, ix }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      }
    }}
    whileHover={{ y: -10, scale: 1.02, rotate: 1 }}
    className="glass-panel p-8 hover:border-purple-500/20 transition-all duration-300 group cursor-default"
  >
    <div className="flex gap-1 text-purple-400 mb-4 group-hover:scale-110 transition-transform origin-left">
      {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[18px]">star</span>)}
    </div>
    <p className="text-white/70 font-bold leading-relaxed mb-6 italic">"{text}"</p>
    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-black text-purple-400">
        {name[0]}
      </div>
      <div>
        <p className="text-xs font-black text-white leading-none mb-1">{name}</p>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none">Verified Candidate</p>
      </div>
    </div>
  </motion.div>
);

const ReviewSection = () => {
  const reviews = [
    { text: "Got shortlisted in 3 days after optimizing my resume.", name: "Rahul S." },
    { text: "Finally a tool that understands context, not just keywords.", name: "Ankit P." },
    { text: "Saved hours of manual editing. Worth it.", name: "Priya M." },
    { text: "Better than ATS checkers I used before.", name: "Dev K." },
    { text: "Helped me identify real gaps in my resume.", name: "Sneha R." },
    { text: "The rewrite feature is insanely useful.", name: "Aman T." }
  ];

  return (
    <section className="py-20 px-6 bg-black/40 backdrop-blur-md relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-purple-400 font-extrabold text-xs uppercase tracking-[0.4em]">Success Stories</h2>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Loved by Candidates & Hiring Teams</h1>
        </div>

        {/* REVIEW GRID */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} ix={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewSection;
