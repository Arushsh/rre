import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Film, Play, CheckCircle, ArrowRight, Monitor, Zap, Music, Star, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const Videography = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showreelOpen, setShowreelOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/videography`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fallbackPackages = [
    {
      title: "Cinematic Wedding Film",
      description: "A high-end cinematic retelling of your wedding story with professional color grading.",
      price: "Starts from ₹45,000",
      features: ["3 Cinematographers", "4K Raw Recording", "Drone Shots", "Same Day Edit Teaser"]
    },
    {
      title: "Commercial & Brand Film",
      description: "Impactful brand documentaries, commercial ads, and promotional films.",
      price: "Starts from ₹35,000",
      features: ["Script & Storyboarding", "4K Cinema Cameras", "Studio Lighting Setup", "Color Grading & Sound FX"]
    }
  ];

  const displayPackages = services.length > 0 ? services : (loading ? [] : fallbackPackages);

  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=85"
            alt="Videography Hero"
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
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Film & Video Production</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter">
              FILMS THAT <br />
              <span className="italic font-normal text-white/80">MOVE YOU.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed">
              We don't just record video; we craft cinematic experiences that preserve the soul of every moment with 4K clarity.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link to="/booking">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start a Project
                </Button>
              </Link>
              <Button
                variant="glass"
                size="lg"
                leftIcon={<Play className="w-4 h-4 fill-current text-[#00E5FF]" />}
                onClick={() => setShowreelOpen(true)}
              >
                Watch Showreel
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTION VALUES */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="01"
            category="CINEMATIC STANDARDS"
            title="FILMMAKING QUALITY."
            description="Every frame is engineered for visual impact, depth, and emotional resonance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Film, title: "4K Resolution", desc: "Ultra-high definition capture for crisp detail and future-proof archive quality." },
              { icon: Monitor, title: "Color Grading", desc: "Hollywood-grade color science giving every scene a distinct filmic look." },
              { icon: Zap, title: "Fast Delivery", desc: "Optimized post-production workflow providing teasers and final films on schedule." },
              { icon: Music, title: "Sound Design", desc: "Crystal clear multi-channel audio mixed with custom atmospheric soundscapes." }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <GlassCard variant="subtle" className="h-full space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="heading-serif text-xl font-bold text-white">{item.title}</h3>
                    <p className="editorial-subhead text-xs text-white/60 leading-relaxed">{item.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC CINEMATIC PACKAGES */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="PRODUCTION PACKAGES"
            title="TAILORED TO YOUR VISION."
            description="Complete videography solutions for weddings, commercials, and music videos."
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#00E5FF]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {displayPackages.map((pkg, i) => (
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
                        <h3 className="heading-serif text-2xl font-bold text-white">{pkg.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">RRE Cinema</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF] px-4 py-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                        {pkg.price}
                      </span>
                    </div>

                    <p className="editorial-subhead text-sm text-white/70 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {pkg.features.map((f: any, j: number) => (
                        <div key={j} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/80">
                          <CheckCircle className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <Link to="/booking">
                        <Button variant="glass" size="md" className="w-full">
                          Enquire Now →
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

      {/* SHOWCASE SECTION */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
                <Star className="w-4 h-4" />
                <span>Showcase Portfolio</span>
              </div>
              <h2 className="display-title text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
                THE RRE SHOWREEL.
              </h2>
              <p className="editorial-subhead text-base text-white/70 font-normal leading-relaxed">
                Take a look at our finest work across weddings, music videos, and commercial projects. Quality that speaks for itself.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div
                onClick={() => setShowreelOpen(true)}
                className="relative aspect-video rounded-3xl overflow-hidden glass-strong border border-white/20 group cursor-pointer"
              >
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80"
                  alt="Showreel Thumbnail"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full glass-floating border border-white/40 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-[#00E5FF] transition-all">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SHOWREEL MODAL */}
      {showreelOpen && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8">
          <div className="relative w-full max-w-4xl glass-strong rounded-3xl p-4 sm:p-8 border border-white/20">
            <button
              onClick={() => setShowreelOpen(false)}
              className="absolute top-4 right-4 p-3 rounded-full glass-subtle text-white hover:rotate-90 transition-transform"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <iframe
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="RRE Videography Showreel"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Videography;
