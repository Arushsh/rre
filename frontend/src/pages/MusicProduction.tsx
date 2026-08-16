import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Sliders, Disc, CheckCircle, ArrowRight, Sparkles, Volume2, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const MusicProduction = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/production`)
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fallbackServices = [
    {
      title: "Music Arrangement",
      description: "Transform your raw melodies into full-fledged compositions with professional instrumentation.",
      price: "Starts from ₹10,000",
      features: ["Custom Beats", "Full Instrumentation", "Genre Expertise", "Live Instruments"]
    },
    {
      title: "Mixing & Mastering",
      description: "Industry-standard mixing and mastering to give your track the commercial punch it deserves.",
      price: "Starts from ₹8,000",
      features: ["Stem Mixing", "Loudness Normalisation", "Streaming-Ready Master", "Revision Rounds"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  const phases = [
    { step: "01", title: "Vision Meeting", desc: "We discuss your influences, goals, and the sonic identity you want to achieve." },
    { step: "02", title: "Draft Production", desc: "Building the core arrangement, chord structure and instrumental vibe of the track." },
    { step: "03", title: "Polish & Master", desc: "Final instrumentation, vocal production, professional mixing and mastering." },
  ];

  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1514525253361-bee8718a300c?w=1920&q=85"
            alt="Music Production Studio"
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
              <Disc className="w-3.5 h-3.5" />
              <span>Music Production & Sound Design</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter">
              CRAFTING <br />
              <span className="italic font-normal text-white/80">HIT SOUNDS.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed">
              Your vision, our expertise. World-class production, arrangement, and sound design to help you create music that resonates globally.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link to="/booking">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Producing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTION CAPABILITIES */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="01"
            category="PRODUCTION STANDARDS"
            title="BUILT TO CHART."
            description="A hybrid production environment merging analog warmth with digital precision for the best of both worlds."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sliders, title: "Modern Workflow", desc: "Ableton, Logic Pro X, and Waves plugins — cutting-edge tools for an elite sonic palette." },
              { icon: Sparkles, title: "Creative Direction", desc: "We don't just produce; we help you find your unique sonic identity and build your brand sound." },
              { icon: Volume2, title: "Hybrid Setup", desc: "Combining vintage analog preamps and outboard gear with top digital processing for unmatched texture." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                >
                  <GlassCard variant="subtle" className="h-full space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="heading-serif text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="editorial-subhead text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="MUSIC PRODUCTION SERVICES"
            title="FROM IDEA TO ANTHEM."
            description="Custom beats, live instrumentation, mixing, mastering — everything your track needs."
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#00E5FF]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displayServices.map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard variant="strong" className="space-y-6">
                    <div className="flex justify-between items-start flex-wrap gap-4 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="heading-serif text-2xl font-bold text-white">{service.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">RRE Production</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] px-4 py-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                        {service.price}
                      </span>
                    </div>

                    <p className="editorial-subhead text-sm text-white/70 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {service.features.map((f: any, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/80">
                          <CheckCircle className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Link to="/booking">
                        <Button variant="glass" size="md" className="w-full">
                          Get Started →
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUCTION PROCESS */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-strong border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=80"
                  alt="Music Production Session"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-3 block">Collaborative Process</span>
                <h2 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  FROM IDEA <br />
                  <span className="italic font-normal text-white/80">TO ANTHEM.</span>
                </h2>
              </div>
              <p className="editorial-subhead text-base text-white/70 font-normal leading-relaxed">
                Music is a journey. We work closely with you at every stage — from scratch demo to the final mastered track — ensuring your vision is never compromised.
              </p>
              <div className="space-y-8">
                {phases.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex gap-6 items-start"
                  >
                    <span className="text-3xl font-black text-white/10 tabular-nums select-none">{s.step}</span>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">{s.title}</h4>
                      <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default MusicProduction;
