import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Sparkles, X } from 'lucide-react';
import Button from './ui/Button';

const Hero: React.FC = () => {
  const [showReelModal, setShowReelModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Vantage-inspired line reveal animation settings
  const lineRevealVariants = {
    hidden: { y: '110%', skewY: shouldReduceMotion ? 0 : 3 },
    visible: (custom: number) => ({
      y: '0%',
      skewY: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.9,
        delay: shouldReduceMotion ? 0 : custom * 0.15,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden bg-[#000000] pt-28 pb-16 md:pb-24">
      {/* 1. FULL-BLEED CINEMATIC MEDIA BACKGROUND */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=85"
          alt="RRE Cinematic Background"
          className="w-full h-full object-cover opacity-50 animate-slow-zoom"
        />
        {/* Vantage multi-layer dark vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/80 via-[#000000]/40 to-[#000000]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/90 via-[#000000]/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* 2. HERO CONTENT CONTAINER (ANCHORED BOTTOM-LEFT WITH GENERATION SPACING) */}
      <div className="satyam-container relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          
          {/* LEFT HERO TEXT & CTA (7 COLS ON DESKTOP) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Tagline Badge */}
            <motion.div
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>India's AI-Integrated Entertainment House</span>
            </motion.div>

            {/* Signature Line-by-Line Headline Reveal */}
            <div className="space-y-1 md:space-y-2">
              <div className="overflow-hidden py-1">
                <motion.h1
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={lineRevealVariants}
                  className="display-hero text-white tracking-tighter"
                >
                  STORIES MADE
                </motion.h1>
              </div>
              <div className="overflow-hidden py-1">
                <motion.h1
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={lineRevealVariants}
                  className="display-hero text-white/90 italic tracking-tighter"
                >
                  TIMELESS.
                </motion.h1>
              </div>
            </div>

            {/* Supporting Copy */}
            <motion.p
              custom={0.7}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed"
            >
              High-end photography, cinematic films, and studio music production. Powered by Artificial Intelligence.
            </motion.p>

            {/* Primary CTA & Secondary Action */}
            <motion.div
              custom={0.9}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              className="flex flex-wrap items-center gap-5 pt-2"
            >
              <Link to="/booking">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Request a Quote
                </Button>
              </Link>
              
              <Link to="/portfolio">
                <Button variant="ghost" size="lg">
                  Explore Work
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT FLOATING GLASS MEDIA CARD (4 COLS ON DESKTOP, BOTTOM-RIGHT) */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <motion.div
              custom={1.05}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.05, ease: [0.22, 1, 0.3, 1] }}
              className="w-full max-w-sm glass-strong rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/20 relative group hover:border-white/35 transition-all duration-500"
            >
              {/* Media Thumbnail with Play Overlay */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-neutral-900">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80"
                  alt="RRE Showreel Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Small Circular Glass Play Button */}
                <button
                  onClick={() => setShowReelModal(true)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full glass-floating flex items-center justify-center text-white hover:scale-110 hover:border-[#00E5FF] transition-all duration-300 shadow-2xl group/play"
                  aria-label="Play RRE Showreel"
                >
                  <Play className="w-5 h-5 ml-0.5 fill-white text-white group-hover/play:text-[#00E5FF] transition-colors" />
                </button>
              </div>

              {/* Card Meta Footer */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#00E5FF]">
                    2026 Production Reel
                  </p>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    RRE Studio Showcase
                  </p>
                </div>
                <button
                  onClick={() => setShowReelModal(true)}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
                >
                  Watch Reel →
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Showreel Modal Dialog */}
      {showReelModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8">
          <div className="relative w-full max-w-4xl glass-strong rounded-3xl p-4 sm:p-8 border border-white/20">
            <button
              onClick={() => setShowReelModal(false)}
              className="absolute top-4 right-4 p-3 rounded-full glass-subtle text-white hover:rotate-90 transition-transform"
              aria-label="Close Showreel Modal"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="RRE Showreel"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
