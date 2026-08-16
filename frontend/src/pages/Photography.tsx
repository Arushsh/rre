import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, ArrowRight, Sparkles, Zap, Award, Loader2, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const Photography = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/photography`)
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

  const fallbackServices = [
    {
      title: "Wedding Photography",
      description: "Cinematic and traditional coverage of your big day with high-end post-processing.",
      price: "Starts from ₹25,000",
      features: ["Full Day Coverage", "400+ Edited Photos", "Premium Album", "Drone Shots Included"]
    },
    {
      title: "Fashion & Editorial Shoot",
      description: "High-fashion lookbooks, model portfolios, and brand campaign photography.",
      price: "Starts from ₹18,000",
      features: ["Studio or Outdoor", "Professional Retouching", "Styling Guidance", "High-Res Digital Files"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&q=85"
            alt="Photography Hero"
            className="w-full h-full object-cover opacity-45 animate-slow-zoom"
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
              <Camera className="w-3.5 h-3.5" />
              <span>Editorial & Portrait Photography</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter">
              CAPTURING <br />
              <span className="italic font-normal text-white/80">PURE EMOTION.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed">
              From grand weddings to intimate portraits, we blend technical excellence with artistic vision to freeze your most precious moments in time.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link to="/booking">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Book a Session
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="ghost" size="lg">
                  View Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY RRE PHOTOGRAPHY (EDITORIAL CARDS) */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="01"
            category="STANDARDS OF EXCELLENCE"
            title="WHY RRE PHOTOGRAPHY."
            description="We combine flagship camera optics with bespoke color grading to deliver iconic imagery."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Flagship Optics", desc: "Top-tier Sony and Canon full-frame sensors with prime G-Master lenses for supreme sharpness." },
              { icon: Sparkles, title: "Artistic Grading", desc: "Every capture undergoes custom color tuning to match our signature cinematic RRE look." },
              { icon: Award, title: "Master Direction", desc: "Expert lighting setups and guidance so every subject feels natural and confident." }
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

      {/* PACKAGES & DYNAMIC SERVICES */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="SERVICE OFFERINGS"
            title="BESPOKE PACKAGES."
            description="Tailored photography experiences designed for weddings, editorial campaigns, and events."
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
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">RRE Photography</span>
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
                          Book This Package →
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

      {/* FINAL CTA */}
      <section className="py-32 bg-[#000000] border-t border-white/10 text-center relative overflow-hidden">
        <div className="satyam-container relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="display-title text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            READY TO CREATE <br />
            <span className="italic font-normal text-white/80">SOMETHING TIMELESS?</span>
          </h2>
          <p className="editorial-subhead text-base sm:text-lg text-white/70">
            Book our photography team today to preserve your story with cinematic perfection.
          </p>
          <div>
            <Link to="/booking">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Photography;
