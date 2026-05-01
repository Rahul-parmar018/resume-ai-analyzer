import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Deep Neural Parse",
    desc: "Our AI breaks down your resume into 500+ semantic tokens, identifying hidden strengths that standard ATS systems miss.",
  },
  {
    number: "02",
    title: "ATS Simulation",
    desc: "We run your profile against 10,000+ proprietary screening rules to calculate your exact compatibility score.",
  },
  {
    number: "03",
    title: "Keyword Injection",
    desc: "Receive real-time, context-aware keyword suggestions that bridge the gap between your experience and the job description.",
  },
  {
    number: "04",
    title: "Decision Grade",
    desc: "Finalize your optimized resume with a production-grade report that guarantees a 95%+ match for target roles.",
  }
];

const HorizontalScrollShowcase = () => {
  const component = useRef(null);
  const slider = useRef(null);
  const pathRef = useRef(null);
  const cardRefs = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ──────────────────────────────────────────────────────────
  // DYNAMIC SINE WAVE (Shifted Down + Reduced Glow)
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    let animationFrame;
    let time = 0;

    const animate = () => {
      time += 0.02;
      const path = pathRef.current;
      if (path) {
        // Line starts slightly below center (540px)
        let d = `M 0 540 `;
        const points = 120;
        const width = 5000;
        const step = width / points;
        
        const amplitude = 30 + (scrollProgress * 15);

        for (let i = 0; i <= points; i++) {
          const x = i * step;
          // Curve that follows the journey but stays lower
          const y = 540 + Math.sin(i * 0.2 + time) * amplitude;
          d += `L ${x} ${y} `;
        }
        path.setAttribute('d', d);

        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length * (1 - scrollProgress);
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [scrollProgress]);

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      let ctx = gsap.context(() => {
        const panels = gsap.utils.toArray(".panel");
        const cards = cardRefs.current;
        const totalScrollWidth = slider.current.offsetWidth - window.innerWidth;

        // 1. Horizontal Pin + Scroll (Tightened end trigger)
        gsap.to(panels, {
          x: -totalScrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: component.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + totalScrollWidth,
            onUpdate: (self) => setScrollProgress(self.progress),
            invalidateOnRefresh: true,
          }
        });

        // 2. Card Interaction Triggers (Always visible base, Active focus)
        cards.forEach((card, i) => {
          if (!card) return;
          
          const startProgress = (i + 1) / (panels.length - 1);
          
          gsap.timeline({
            scrollTrigger: {
              trigger: component.current,
              start: () => "top top-=" + (totalScrollWidth * (startProgress - 0.1)),
              end: () => "top top-=" + (totalScrollWidth * (startProgress + 0.1)),
              scrub: 0.5,
            }
          })
          .fromTo(card, 
            { scale: 0.95, opacity: 0.7, y: 0 },
            { 
              scale: 1.05, 
              opacity: 1, 
              y: -20, 
              borderColor: "rgba(255,255,255,0.2)",
              backgroundColor: "rgba(20, 20, 25, 0.9)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              duration: 0.4 
            }
          )
          .to(card, { 
            scale: 0.95, 
            opacity: 0.7, 
            y: 0,
            borderColor: "rgba(255,255,255,0.05)",
            backgroundColor: "rgba(20, 20, 25, 0.8)",
            boxShadow: "none",
            duration: 0.4 
          });
        });

      }, component);

      return () => ctx.revert();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={component} className="relative overflow-hidden bg-[#020202] py-20">
      
      {/* ──────────────────────────────────────────────────────────
          THE JOURNEY LINE (BEHIND CARDS, z-0)
          ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
         <svg className="w-[500vw] h-full overflow-visible" viewBox="0 0 5000 1000" preserveAspectRatio="none">
            <defs>
               <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#EC4899" />
               </linearGradient>
               {/* Reduced glow as requested */}
               <filter id="wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
            </defs>
            
            <path 
              ref={pathRef}
              fill="none" 
              stroke="url(#wave-grad)" 
              strokeWidth="3" 
              strokeLinecap="round"
              filter="url(#wave-glow)"
            />
         </svg>
      </div>

      <div ref={slider} className="flex flex-nowrap h-[80vh] w-[450vw] relative z-10 items-center">
        
        {/* 0. INTRO PANEL */}
        <div className="panel w-[75vw] h-full flex-shrink-0 flex items-center justify-start px-12 md:px-24">
           <div className="max-w-3xl space-y-4">
              <div className="voxr-pill !bg-white/5 !border-white/10 w-fit">How it Works</div>
              <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-[0.95]">
                Your Path from Resume <br />
                <span className="text-white/30 italic font-serif">to Career Success</span>
              </h2>
              <p className="text-white/40 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                Transform your existing credentials into a high-converting profile.
              </p>
           </div>
        </div>

        {/* JOURNEY STEPS (Tighter gap) */}
        {JOURNEY_STEPS.map((step, i) => (
          <div 
            key={i} 
            className="panel w-[75vw] h-full flex-shrink-0 flex items-center justify-center px-6"
          >
            <div 
              ref={el => cardRefs.current[i] = el}
              className={`w-[360px] md:w-[520px] p-10 md:p-14 rounded-[3rem] bg-[#141419]/80 backdrop-blur-xl border border-white/5 shadow-2xl opacity-70 transition-all duration-500 group ${i % 2 === 0 ? '-translate-y-20' : 'translate-y-20'}`}
            >
               <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-sm font-black text-white/40">
                  {step.number}
               </div>
               <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                 {step.title}
               </h3>
               <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed">
                 {step.desc}
               </p>
            </div>
          </div>
        ))}

        {/* FINAL CTA PANEL (Centered) */}
        <div className="panel w-[75vw] h-full flex-shrink-0 flex items-center justify-center">
           <div className="max-w-4xl text-center space-y-12 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
              
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95]">
                   Ready for More <br />
                   <span className="text-white/30 italic font-serif">Shortlists?</span>
                 </h2>
              </div>

              <button className="group relative px-10 py-6 bg-white text-black rounded-full font-black text-xl flex items-center gap-4 mx-auto overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                 Try it now
                 <span className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                 </span>
              </button>
           </div>
        </div>

      </div>
    </section>
  );
};

export default HorizontalScrollShowcase;
