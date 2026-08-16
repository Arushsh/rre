import React from 'react';
import { Camera, Video, Mic2, Music, Radio, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from './ui/SectionHeader';
import GlassCard from './ui/GlassCard';

const serviceItems = [
  {
    index: "01",
    title: "Photography",
    description: "High-end portrait, wedding, fashion, and editorial photography captured with artistic intention.",
    href: "/photography",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80",
    badge: "Public & Private Portfolios",
  },
  {
    index: "02",
    title: "Videography",
    description: "Cinematic film production, music videos, commercials, and professional post-production color grading.",
    href: "/videography",
    icon: Video,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80",
    badge: "4K Cinematic Recording",
  },
  {
    index: "03",
    title: "Audio Recording",
    description: "Acoustically tuned studio recording for vocals, voiceovers, podcasts, and acoustic instruments.",
    href: "/audio-recording",
    icon: Mic2,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80",
    badge: "Studio A-1 Facilities",
  },
  {
    index: "04",
    title: "Music Production",
    description: "Full track arrangement, beat production, sound design, mixing, and radio-ready mastering.",
    href: "/music-production",
    icon: Music,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&q=80",
    badge: "Composition & Beats",
  },
  {
    index: "05",
    title: "Live Streaming",
    description: "Multi-camera live broadcast, low-latency streaming, and dedicated event landing experiences.",
    href: "/live-streaming",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80",
    badge: "HD Broadcast Production",
  },
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-28 bg-[#000000] relative overflow-hidden">
      <div className="satyam-container relative z-10">
        
        {/* Vantage Section Header */}
        <SectionHeader
          index="01"
          category="CREATIVE EXPERTISE"
          title="SERVICES TAILORED FOR IMPACT."
          description="High-end media solutions across photography, videography, audio engineering, and live broadcasting."
          action={
            <Link to="/booking" className="btn-vantage-glass">
              Book a Service →
            </Link>
          }
        />

        {/* Editorial Service Block Stack */}
        <div className="space-y-6">
          {serviceItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <Link to={item.href} className="block group">
                  <GlassCard
                    variant="subtle"
                    className="!p-6 md:!p-8 hover:bg-white/10 hover:border-white/25 group-hover:translate-x-1"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: Index & Category Details */}
                      <div className="lg:col-span-1 flex items-center justify-between lg:justify-start">
                        <span className="text-sm font-extrabold tracking-[0.3em] text-[#00E5FF]">
                          {item.index}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white lg:hidden">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="lg:col-span-7 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="heading-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#00E5FF] transition-colors">
                            {item.title}
                          </h3>
                          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white/70">
                            {item.badge}
                          </span>
                        </div>
                        <p className="editorial-subhead text-sm text-white/60 font-normal leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Right: Media Thumbnail & Arrow Indicator */}
                      <div className="lg:col-span-4 flex items-center justify-between lg:justify-end gap-6">
                        <div className="hidden sm:block w-32 h-20 rounded-xl overflow-hidden bg-neutral-900 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                          />
                        </div>

                        <div className="w-12 h-12 rounded-xl glass-floating flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all shrink-0">
                          <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
