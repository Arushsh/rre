import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Zap, Trophy, Camera, Video, Mic2, Radio, Sparkles } from 'lucide-react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">
      
      {/* 1. CINEMATIC HERO */}
      <Hero />

      {/* 2. EDITORIAL BRAND INTRO */}
      <section className="py-28 md:py-36 bg-[#000000] relative overflow-hidden border-t border-white/10">
        <div className="satyam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Boutique Media & AI Production</span>
              </div>

              <h2 className="heading-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05]">
                WE BELIEVE IN <br />
                <span className="italic font-normal text-white/80">THE ART OF OBSERVATION.</span>
              </h2>

              <p className="editorial-subhead text-base sm:text-xl text-white/70 font-normal leading-relaxed max-w-2xl">
                Rajat Raj Entertainment is a boutique media house dedicated to high-end photography, cinematic films, and world-class music production. We blend human emotion with artificial intelligence.
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-white/10 max-w-md">
                <div>
                  <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-1">
                    12k+
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    Captured Moments
                  </p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-1">
                    500+
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#00E5FF]">
                    Delighted Clients
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <GlassCard variant="strong" className="!p-4 border-white/20">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900">
                  <img
                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&q=80"
                    alt="RRE Studio Setup"
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#00E5FF] mb-1">
                      Studio A-1 Facilities
                    </p>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                      Dildarnagar, Uttar Pradesh
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. EDITORIAL SERVICES */}
      <Services />

      {/* 4. TALENT HUNT DISCOVERY BANNER */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <GlassCard variant="floating" className="!p-8 md:!p-16 border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-bold uppercase tracking-[0.25em]">
                  <Trophy className="w-4 h-4" />
                  <span>Season 2026 Live Auditions</span>
                </div>
                
                <h2 className="heading-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                  YOUR STAGE <span className="italic font-normal text-[#00E5FF]">AWAITS.</span>
                </h2>
                
                <p className="editorial-subhead text-sm sm:text-base text-white/70 max-w-xl font-normal leading-relaxed">
                  India's first AI-integrated talent hunt. Sing, act, or dance. Get scored by RRE AI and feature in our upcoming productions.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link to="/talent-hunt">
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Enter Audition →
                  </Button>
                </Link>
              </div>

            </div>
          </GlassCard>
        </div>
      </section>

      {/* 5. AI FEATURES HIGHLIGHT */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="NEXT-GEN TECHNOLOGY"
            title="AI-POWERED EXPERIENCES."
            description="We're redefining the media industry with AI — from instant face match search in galleries to automated audition pitch scoring."
            action={
              <Link to="/ai-hub">
                <Button variant="glass" size="md">
                  Explore AI Hub →
                </Button>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard variant="subtle" className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="heading-serif text-2xl font-bold text-white">
                AI Face Match Search
              </h3>
              <p className="editorial-subhead text-sm text-white/60 leading-relaxed">
                Upload a selfie inside any gallery album to instantly isolate all event photos containing your face using deep feature embeddings.
              </p>
              <Link to="/gallery" className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] hover:underline">
                Try Gallery Face Search →
              </Link>
            </GlassCard>

            <GlassCard variant="subtle" className="space-y-6">
              <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="heading-serif text-2xl font-bold text-white">
                AI Talent Audition Scoring
              </h3>
              <p className="editorial-subhead text-sm text-white/60 leading-relaxed">
                Automated audio and visual evaluation evaluating pitch stability, expression dynamics, and confidence metrics for artists.
              </p>
              <Link to="/talent-hunt" className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] hover:underline">
                Submit Audition →
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 6. FINAL EDITORIAL CTA */}
      <section className="py-32 bg-[#050708] border-t border-white/10 text-center relative overflow-hidden">
        <div className="satyam-container relative z-10 max-w-4xl mx-auto space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
            <span>Start a Project</span>
          </div>

          <h2 className="display-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none">
            LET'S CREATE <br />
            <span className="italic font-normal text-white/80">THE FUTURE.</span>
          </h2>

          <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
            Ready to capture your special event or record your next hit track? Get in touch with our team today.
          </p>

          <div>
            <Link to="/booking">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Work With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
