import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Target, 
  Zap, 
  Globe, 
  ShieldCheck, 
  Instagram, 
  Phone, 
  Mail, 
  MapPin, 
  RefreshCw,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const CORE_VALUES = [
  {
    title: 'Excellence',
    desc: "We don't settle for 'good enough'. Every frame, mix, and capture is refined to perfection.",
    icon: Award
  },
  {
    title: 'Integrity',
    desc: 'Transparent workflows, dependable timelines, and unwavering commitment to client trust.',
    icon: ShieldCheck
  },
  {
    title: 'Innovation',
    desc: 'Constantly advancing our production pipeline with state-of-the-art cinematic tools and AI indexing.',
    icon: Zap
  }
];

const About = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── PRESERVED: Team API fetch from /api/team ──
  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team`);
      if (res.ok) setTeam(await res.json());
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24 pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=85"
            alt="About RRE"
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
              Our Story & Philosophy
            </span>
            <h1 className="display-hero text-white tracking-tighter leading-none">
              WE CREATE <br />
              <span className="italic font-normal text-white/75">STORIES THAT</span><br />
              STAY.
            </h1>
            <p className="editorial-subhead text-base sm:text-lg text-white/60 max-w-xl font-normal leading-relaxed">
              Rajat Raj Entertainment is a creative house dedicated to cinematic excellence across photography, film, sound, and live media production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PHILOSOPHY SECTION ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* Visual media */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80" 
                  alt="Our Vision" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
            </motion.div>
            
            {/* Philosophy text */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">The Studio</span>
                <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  DRIVEN BY <br />
                  <span className="italic font-normal text-white/70">HUMAN EMOTION.</span>
                </h2>
              </div>
              
              <p className="editorial-subhead text-base text-white/55 leading-relaxed">
                Founded with a conviction that artistry and innovation must work as one, RRE unites world-class creative talent with modern production tools. We solve technical barriers so that artists and clients can focus entirely on genuine expression.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/60">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Our Mission</h4>
                  <p className="text-xs text-white/45 leading-relaxed">
                    To empower every client and creator with uncompromising production quality and storytelling.
                  </p>
                </div>

                <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/60">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">Our Vision</h4>
                  <p className="text-xs text-white/45 leading-relaxed">
                    To set the benchmark for AI-integrated creative media across photography, cinema, and audio.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">The Collective</span>
              <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                THE FACES BEHIND <br />
                <span className="italic font-normal text-white/70">THE CRAFT.</span>
              </h2>
            </div>
            <p className="editorial-subhead text-sm text-white/45 max-w-sm leading-relaxed">
              Every production begins with dedicated artists, technicians, and directors passionate about storytelling.
            </p>
          </motion.div>

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white/20" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {team.map((member: any, i: number) => (
                <motion.div
                  key={member._id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative rounded-3xl overflow-hidden border border-white/10 glass-subtle hover:border-white/25 transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img
                      src={member.img}
                      alt={member.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>

                  <div className="p-6 sm:p-8 space-y-3 flex-grow flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/15 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/70 w-fit">
                      {member.role}
                    </span>
                    <h3 className="heading-serif text-2xl font-bold text-white leading-tight">{member.name}</h3>
                    {member.bio && (
                      <p className="text-white/50 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {member.bio}
                      </p>
                    )}
                    {member.insta && (
                      <a
                        href={member.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 pt-2 text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Instagram className="w-3.5 h-3.5" /> Instagram
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container">
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Guiding Principles</span>
            <h2 className="display-title text-4xl sm:text-5xl font-bold text-white tracking-tight">OUR CORE VALUES.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-8 rounded-3xl glass-subtle border border-white/10 space-y-6 hover:border-white/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-wider text-white">{value.title}</h3>
                    <p className="text-xs text-white/45 leading-relaxed">{value.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CONTACT STRIP ── */}
      <section className="py-16 border-t border-white/10">
        <div className="satyam-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <a href="tel:+918898134049" className="flex items-center gap-4 p-5 glass-subtle border border-white/10 rounded-2xl hover:border-white/25 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white transition-all shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Call Direct</p>
                <p className="text-xs font-bold text-white truncate">+91 88981 34049</p>
              </div>
            </a>

            <a href="mailto:rajatrajentertainment@gmail.com" className="flex items-center gap-4 p-5 glass-subtle border border-white/10 rounded-2xl hover:border-white/25 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white transition-all shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Email Studio</p>
                <p className="text-xs font-bold text-white truncate">rajatrajentertainment@gmail.com</p>
              </div>
            </a>

            <a href="https://www.instagram.com/kundan_rajat_raj?utm_source=qr&igsh=MXYzamZ0NXpsdDZqYQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 glass-subtle border border-white/10 rounded-2xl hover:border-white/25 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white transition-all shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Instagram</p>
                <p className="text-xs font-bold text-white truncate">@kundan_rajat_raj</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 glass-subtle border border-white/10 rounded-2xl">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Studio Location</p>
                <p className="text-xs font-bold text-white/80 leading-snug truncate">Dildarnagar — 232326</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-20 md:py-32 border-t border-white/10">
        <div className="satyam-container text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="display-title text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
              JOIN THE <br />
              <span className="italic font-normal text-white/70">RRE EXPERIENCE.</span>
            </h2>
            <p className="editorial-subhead text-base text-white/50 max-w-lg mx-auto leading-relaxed">
              Whether you are planning a landmark event or an artist ready to showcase your talent, we bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link 
                to="/booking" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
              >
                Start a Project <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/talent-hunt" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-subtle border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:border-white/40 transition-all"
              >
                Join Talent Hunt
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
