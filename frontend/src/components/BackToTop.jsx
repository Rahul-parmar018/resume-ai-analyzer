import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      // Throttle scroll events to optimize rendering performance
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setIsVisible(window.scrollY > 300);
        timeoutId = null;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed z-40 flex items-center justify-center rounded-full bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-lg shadow-purple-500/10 hover:border-purple-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50
                     w-11 h-11 bottom-5 right-4
                     md:w-12 md:h-12 md:bottom-6 md:right-6"
        >
          <ArrowUp className="w-5 h-5 text-white/85" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
