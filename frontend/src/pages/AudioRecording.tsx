import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Headphones, Sliders, Volume2, CheckCircle, ArrowRight, Zap, Music, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import GlassCard from '../components/ui/GlassCard';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';

const AudioRecording = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/audio`)
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
      title: "Vocal Recording",
      description: "Crystal clear vocal tracking using world-class microphones in an acoustically treated environment.",
      price: "₹1,500 / Hour",
      features: ["Neumann U87 Mic", "Universal Audio Interface", "Pro Tools / Logic Pro", "Engineer Included"]
    },
    {
      title: "Voice Over & Narration",
      description: "Professional voiceover recording for commercials, audiobooks, and corporate media.",
      price: "₹2,000 / Hour",
      features: ["Broadcast-Quality Clarity", "Dedicated Booth", "Fast Turnaround", "Multi-Language Support"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  const studioSpecs = [
    { icon: Headphones, label: "Monitoring", val: "Beyerdynamic DT 770 Pro" },
    { icon: Mic2, label: "Microphones", val: "Neumann & Shure" },
    { icon: Sliders, label: "Preamps", val: "Universal Audio" },
    { icon: Volume2, label: "Acoustics", val: "Pro Treated Room" },
  ];

  const process = [
    { step: "01", title: "Setup & Warmup", desc: "Mic positioning and levels calibrated precisely to your voice and genre." },
    { step: "02", title: "The Session", desc: "Multiple takes with creative guidance and technical support from our engineer." },
    { step: "03", title: "Post-Processing", desc: "Professional editing, tuning, de-breath, and sonic enhancement included." },
  ];

  return (
    <div className="bg-[#000000] text-white selection:bg-[#00E5FF] selection:text-black">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=85"
            alt="Audio Recording Studio"
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
              <Mic2 className="w-3.5 h-3.5" />
              <span>Professional Audio Recording</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter">
              SOUND THAT <br />
              <span className="italic font-normal text-white/80">SPEAKS.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/70 max-w-xl font-normal leading-relaxed">
              From soulful vocals to powerful voice-overs, we provide the acoustic environment and technical expertise to capture every nuance of your sound.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Link to="/booking">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Book Studio Time
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STUDIO SPECS BAR */}
      <section className="py-20 bg-[#050708] border-t border-white/10">
        <div className="satyam-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {studioSpecs.map((spec, i) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-1">{spec.label}</p>
                    <p className="text-sm font-bold text-white">{spec.val}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="01"
            category="STUDIO CAPABILITIES"
            title="ACOUSTICS. ENGINEERED."
            description="A professional recording environment built for clarity, warmth, and sonic excellence."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Mic2, title: "World-Class Mics", desc: "Neumann U87, Shure SM7B, and AKG C414 — a curated locker of legendary microphones." },
              { icon: Zap, title: "Zero-Latency Monitoring", desc: "Real-time monitoring through Universal Audio with rich reverbs and comping support." },
              { icon: Music, title: "Full Post Processing", desc: "Tuning, editing, de-breath, and mixing delivered as a studio-ready final file." }
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

      {/* PACKAGES */}
      <section className="py-28 bg-[#050708] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <SectionHeader
            index="02"
            category="RECORDING PACKAGES"
            title="STUDIO TIME. YOUR WAY."
            description="Flexible booking options for vocalists, podcasters, voice actors and musicians."
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
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">RRE Studio</span>
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
                          Reserve Slot →
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

      {/* RECORDING PROCESS */}
      <section className="py-28 bg-[#000000] border-t border-white/10 relative overflow-hidden">
        <div className="satyam-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            <div className="lg:col-span-5 space-y-10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] mb-3 block">The Process</span>
                <h2 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                  THE RECORDING <br />
                  <span className="italic font-normal text-white/80">EXPERIENCE.</span>
                </h2>
              </div>
              <p className="editorial-subhead text-base text-white/70 font-normal leading-relaxed">
                A great session is 50% technical and 50% vibe. Our studio is designed to make you feel comfortable, inspired, and ready to perform.
              </p>
              <div className="space-y-8">
                {process.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
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

            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden glass-strong border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1520529011348-637222444782?w=1200&q=80"
                  alt="Studio Setup"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AudioRecording;
