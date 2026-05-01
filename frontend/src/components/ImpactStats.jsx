import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImpactStats = () => {
  const sectionRef = useRef(null);
  const card95Ref = useRef(null);
  const card10kRef = useRef(null);
  const card4xRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very subtle parallax for cards
      gsap.to(card95Ref.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -30,
        rotation: 2,
      });

      gsap.to(card10kRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
        y: -50,
        rotation: -2,
      });

      gsap.to(card4xRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
        y: -40,
        rotation: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-transparent overflow-hidden flex flex-col items-center py-12 md:py-16"
    >
      {/* Background Ambient Glow (More concentrated) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[400px] bg-purple-600/[0.04] rounded-full blur-[100px]"></div>
      </div>

      {/* 1. DENSE HEADING */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-30 text-center mb-10 px-6"
      >
        <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">
          The Impact,
        </span>
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none select-none">
          Quantified<span className="text-purple-500/80 italic font-serif">.</span>
        </h2>
        <div className="h-[1px] w-16 bg-white/10 mx-auto mt-6 mb-4"></div>
        <p className="text-white/20 text-[8px] font-black tracking-[0.3em] uppercase">
          Neural Intelligence &bull; High Velocity
        </p>
      </motion.div>

      {/* 2. DENSE CARD CLUSTER (PULLED IN) */}
      <div className="relative z-20 w-full max-w-5xl px-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        
        {/* Card 1: 95% */}
        <div ref={card95Ref} className="w-full md:w-[240px] pointer-events-auto">
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-xl transition-all duration-700 opacity-80 scale-95 hover:opacity-100 hover:scale-100 group">
            <div className="text-4xl font-black text-purple-400 mb-1">95%+</div>
            <div className="text-white/30 font-black uppercase tracking-widest text-[8px] mb-2 leading-none">Accuracy</div>
            <p className="text-white/40 text-[10px] leading-snug">Neural extraction that captures every detail with precision.</p>
          </div>
        </div>

        {/* Card 2: 10k+ (Focus Card) */}
        <div ref={card10kRef} className="w-full md:w-[250px] pointer-events-auto">
          <div className="bg-white/[0.04] backdrop-blur-[40px] border border-white/20 p-7 rounded-[2rem] shadow-2xl transition-all duration-700 opacity-100 scale-100 md:scale-105 hover:bg-white/[0.06] group">
            <div className="text-4xl font-black text-blue-400 mb-1">10k+</div>
            <div className="text-white/40 font-black uppercase tracking-widest text-[8px] mb-2 leading-none">Rules</div>
            <p className="text-white/50 text-[10px] leading-snug">Validated against the world's most rigorous industry standards.</p>
          </div>
        </div>

        {/* Card 3: 4x */}
        <div ref={card4xRef} className="w-full md:w-[240px] pointer-events-auto">
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-xl transition-all duration-700 opacity-80 scale-95 hover:opacity-100 hover:scale-100 group">
            <div className="text-4xl font-black text-emerald-400 mb-1">4x</div>
            <div className="text-white/30 font-black uppercase tracking-widest text-[8px] mb-2 leading-none">Velocity</div>
            <p className="text-white/40 text-[10px] leading-snug">Recruiters slash screening time while improving quality.</p>
          </div>
        </div>

      </div>

    </section>
  );
};

export default ImpactStats;
