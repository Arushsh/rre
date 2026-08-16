import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Star, 
  Users, 
  Camera, 
  Video, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  Calculator,
  Layers,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EVENT_CATEGORIES = [
  {
    title: 'Grand Weddings',
    icon: Heart,
    desc: 'From intimate pre-wedding rituals to multi-day grand celebrations, captured with cinematic intimacy.',
    tag: 'Celebration'
  },
  {
    title: 'Corporate Galas',
    icon: Users,
    desc: 'Flawless multi-camera coverage, keynote recording, and live broadcast for enterprise events.',
    tag: 'Enterprise'
  },
  {
    title: 'Fashion & BTS',
    icon: Camera,
    desc: 'High-speed runway visuals, editorial lighting, and behind-the-scenes brand storytelling.',
    tag: 'Editorial'
  },
  {
    title: 'Live Concerts',
    icon: Video,
    desc: 'Stage multi-cam setup, synchronized high-fidelity audio, and dynamic audience cinematography.',
    tag: 'Stage Media'
  }
];

const EventManagement = () => {
  const [budget, setBudget] = useState(75000);

  // ── PRESERVED: Package calculator logic ──
  const getPackage = (val: number) => {
    if (val < 40000) return 'Starter Pack';
    if (val < 80000) return 'Professional Pack';
    if (val < 150000) return 'Cinematic Elite Pack';
    return 'Royal Grand Pack';
  };

  const getFeatures = (val: number) => {
    if (val < 40000) return ['Single Camera Setup', 'Standard Color Grade', '4 Hour Event Coverage', 'Digital High-Res Delivery'];
    if (val < 80000) return ['Dual Camera Angle Setup', 'Cinematic Edit & Color Grading', 'Full Day Coverage', 'Aerial Drone Cinematography', 'Curated Premium Album'];
    if (val < 150000) return ['4K Cinema Camera Rig', 'Multi-Drone Coverage', 'Same-Day Teaser Edit', 'Multi-Platform Live Streaming', 'Hardbound Coffee Table Book'];
    return ['Master Cinema Crew (5+)', '8K RAW Multi-Cam Recording', 'Full Live Production Broadcast', 'Luxury Leather Bound Album', 'Dedicated On-Site Director'];
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24 pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=85"
            alt="Events & Weddings"
            className="w-full h-full object-cover opacity-25 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
              Live Production & Weddings
            </span>
            <h1 className="display-hero text-white tracking-tighter leading-none">
              MOMENTS INTO <br />
              <span className="italic font-normal text-white/75">CINEMATIC</span><br />
              MASTERPIECES.
            </h1>
            <p className="editorial-subhead text-base sm:text-lg text-white/60 max-w-xl font-normal leading-relaxed">
              From landmark wedding celebrations to large-scale concert stages, we bring high-end direction and technical mastery to every production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE BUDGET ESTIMATOR ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* Left explanation */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Transparent Planning</span>
                <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  SMART EVENT <br />
                  <span className="italic font-normal text-white/70">PLANNING.</span>
                </h2>
              </div>
              
              <p className="editorial-subhead text-base text-white/55 leading-relaxed">
                Use our interactive production planner to tailor the right coverage package for your celebration. Adjust your budget to explore crew configurations and deliverables.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Bespoke Story</h4>
                  <p className="text-xs text-white/45">Customized storytelling for every tradition and timeline.</p>
                </div>
                <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-2">
                  <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Cinema Standard</h4>
                  <p className="text-xs text-white/45">Broadcast-ready color correction and pristine audio.</p>
                </div>
              </div>
            </div>

            {/* Right Estimator Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong border border-white/15 rounded-3xl p-8 sm:p-12 space-y-8"
            >
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/70">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Package Planner</h3>
                    <p className="text-xs text-white/40">Adjust target budget</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00E5FF] glass-subtle border border-[#00E5FF]/20 px-3 py-1 rounded-full">
                  Real-time
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Target Budget</span>
                  <span className="text-3xl font-black text-white font-mono">₹{budget.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min="20000" 
                  max="300000" 
                  step="5000" 
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                  aria-label="Event Budget Slider"
                />
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/30">
                  <span>₹20,000</span>
                  <span>₹3,00,000+</span>
                </div>
              </div>

              {/* Package Card */}
              <div className="glass-subtle border border-white/12 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Recommended Package</span>
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                </div>
                
                <h4 className="heading-serif text-2xl sm:text-3xl font-bold text-white">{getPackage(budget)}</h4>
                
                <ul className="space-y-3">
                  {getFeatures(budget).map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-white/70">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/booking" 
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors"
                >
                  Book This Package <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── EVENT CATEGORIES SHOWCASE ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container space-y-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Production Scope</span>
            <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight">WHAT WE COVER.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_CATEGORIES.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-8 rounded-3xl glass-subtle border border-white/10 space-y-6 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{item.tag}</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="heading-serif text-xl font-bold text-white leading-tight">{item.title}</h3>
                      <p className="text-xs text-white/45 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <Link 
                    to="/booking" 
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors pt-2"
                  >
                    Inquire <ArrowRight className="w-3 h-3" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 md:py-28 border-t border-white/10">
        <div className="satyam-container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              RESERVE YOUR <br />
              <span className="italic font-normal text-white/70">EVENT DATE.</span>
            </h2>
            <p className="editorial-subhead text-base text-white/50 leading-relaxed">
              Dates fill up quickly across wedding and corporate seasons. Connect with our directors early to lock in your production crew.
            </p>
            <div className="pt-2">
              <Link 
                to="/booking" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
              >
                Start Event Booking <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default EventManagement;
