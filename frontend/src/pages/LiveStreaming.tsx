import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Globe, Zap, Shield, Monitor, CheckCircle, ArrowRight, Wifi, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const LiveStreaming = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/live`)
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
      title: "Wedding Live Stream",
      description: "Share your special moments with loved ones across the globe in real-time high definition.",
      price: "Starts from ₹15,000",
      features: ["Multi-cam Setup", "Private Landing Page", "Zero Lag Stream", "Full Recording Provided"]
    },
    {
      title: "Corporate Broadcast",
      description: "Professional live streaming for conferences, product launches, and town halls.",
      price: "Starts from ₹20,000",
      features: ["Branded Overlays", "Q&A Integration", "Recorded Archive", "Platform Distribution"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  const techSpecs = [
    { icon: Globe, title: "Global Reach", desc: "Streams optimized for viewers in 150+ countries with adaptive bitrate delivery." },
    { icon: Shield, title: "Rock Solid", desc: "Dual-internet bonded backup systems ensuring your stream never drops, no matter what." },
    { icon: Zap, title: "Zero Lag", desc: "Sub-second latency technology enabling real-time interaction with your live audience." },
    { icon: Wifi, title: "Bonded Internet", desc: "Combining multiple 4G/5G/Fiber lines for an unbreakable, fault-tolerant connection." },
  ];

  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=85"
            alt="Live Streaming Hero"
            className="w-full h-full object-cover opacity-40 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        {/* LIVE INDICATOR */}
        <div className="absolute top-32 right-8 md:right-16 z-20">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-600/90 backdrop-blur-sm border border-red-500/50 text-[11px] font-black uppercase tracking-[0.2em]">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>Live Ready</span>
          </div>
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-subtle text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
              <Radio className="w-3.5 h-3.5" />
              <span>Global Live Broadcast</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter">
              BROADCAST <br />
              <span className="italic font-normal text-white/80">WITHOUT LIMITS.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed">
              High-definition, low-latency live streaming solutions for any event. Connect your audience anywhere in the world with broadcast-grade quality.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link to="/booking">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go Live Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECH CAPABILITIES GRID */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="01"
            category="BROADCAST TECHNOLOGY"
            title="PRO-GRADE INFRASTRUCTURE."
            description="We deploy the same multi-redundant systems used by major broadcast networks to guarantee your stream."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {techSpecs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <GlassCard variant="subtle" className="h-full space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="heading-serif text-xl font-bold text-white">{spec.title}</h3>
                    <p className="editorial-subhead text-sm text-white/60 leading-relaxed">{spec.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BROADCAST PACKAGES */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="BROADCAST SOLUTIONS"
            title="EVERY EVENT. LIVE."
            description="From intimate weddings to large corporate conferences — we stream it all flawlessly."
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
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">RRE Broadcast</span>
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

      {/* CONTROL ROOM SHOWCASE */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-3 block">Mission Control</span>
                <h2 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  MULTI-CAMERA <br />
                  <span className="italic font-normal text-white/80">BROADCAST TECH.</span>
                </h2>
              </div>
              <p className="editorial-subhead text-base text-white/70 font-normal leading-relaxed">
                We deploy broadcast-grade hardware including vMix / OBS production suites, multi-camera switching, and bonded cellular internet — the same tech trusted by major news networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Monitor, title: "vMix / OBS Setup", desc: "Professional production software with branded overlays and real-time graphics." },
                  { icon: Users, title: "Multi-Cam Control", desc: "Seamless switching between up to 6 camera angles for cinema-level production." },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2 text-[#00E5FF]">
                        <Icon className="w-4 h-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest">{item.title}</h4>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="aspect-video rounded-3xl overflow-hidden glass-strong border border-white/20 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&q=80"
                  alt="Live Broadcast Control Room"
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-red-600/90 backdrop-blur-sm border border-red-500/40 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Live Stream Active</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LiveStreaming;
