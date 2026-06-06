import React from 'react';
import { Play, MessageSquare, Calendar, ArrowRight, Sparkles, Music, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center pt-24 bg-white">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-primary/5 to-transparent -skew-x-12 transform translate-x-20 z-0" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-[100px] animate-pulse z-0" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-5 py-2.5 mb-10 text-xs font-black uppercase tracking-[0.25em] text-primary bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
              <Sparkles className="w-4 h-4 mr-3 animate-spin-slow" />
              The Ultimate Media Platform
            </div>
            
            <h1 className="text-6xl md:text-[5.5rem] font-black text-dark mb-10 leading-[1.05] tracking-tight">
              Where Talent <br />
              Meets <span className="text-primary italic relative inline-block">
                Innovation
                <motion.svg 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute -bottom-4 left-0 w-full" 
                  height="12" 
                  viewBox="0 0 100 12" 
                  preserveAspectRatio="none"
                >
                  <path d="M0 10 Q 25 2, 50 10 T 100 10" stroke="currentColor" strokeWidth="6" fill="transparent" strokeLinecap="round" />
                </motion.svg>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-xl leading-relaxed font-medium">
              Join India's most advanced ecosystem for Music, Events, and Talent Discovery. Powered by Artificial Intelligence.
            </p>

            <div className="flex flex-wrap gap-6">
              <button className="btn-primary py-6 px-12 text-lg group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Calendar className="w-6 h-6 mr-3" />
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="btn-outline py-6 px-12 text-lg group">
                <Play className="w-6 h-6 mr-3 fill-current group-hover:scale-110 transition-transform" />
                Studio Tour
              </button>
            </div>

            <div className="mt-20 flex items-center gap-12">
              <div className="flex -space-x-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.img 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    src={`https://i.pravatar.cc/150?img=${i+20}`} 
                    alt="Artist" 
                    className="w-14 h-14 rounded-full border-4 border-white shadow-xl hover:z-10 hover:scale-110 transition-all cursor-pointer"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-accent fill-current" />)}
                  <span className="text-dark font-black ml-2 text-lg">4.9/5</span>
                </div>
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Rated by 1000+ Creators</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[16px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80" 
                alt="Studio" 
                className="w-full h-full object-cover aspect-[4/5] animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Music className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Live Session</span>
                </div>
                <h3 className="text-4xl font-black mb-2">Studio A-1 Premium</h3>
                <p className="text-white/70 font-medium">Currently hosting: International Artist Recording</p>
              </div>
            </div>
            
            {/* Floating AI Badge */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 top-1/4 glass-card p-8 rounded-[2.5rem] z-20 border-white/40 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-primary font-black text-xs uppercase tracking-widest mb-1">AI Enabled</p>
                  <p className="text-dark font-black text-xl leading-none">Auto-Mastering</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
