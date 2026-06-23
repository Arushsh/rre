import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, Globe, ShieldCheck, Instagram, Phone, Mail, MapPin, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const About = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team`);
      if (res.ok) setTeam(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 bg-secondary overflow-hidden">
        <div className="satyam-container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-black/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400">Our Story</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-8xl mb-12 leading-[1.1]">
              Redefining the <br /> <span className="italic">Media House.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed max-w-2xl">
              Rajat Raj Entertainment is more than a house. We are a collective of visionaries, engineers, and artists dedicated to pushing the boundaries of creative expression.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white hidden lg:block" />
        <div className="absolute top-1/2 right-20 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] hidden lg:block" />
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-40">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80" 
                  alt="Our Vision" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-black text-white rounded-[3rem] flex-col items-center justify-center text-center p-8 shadow-2xl hidden md:flex">
                <p className="text-4xl font-black mb-1">10+</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-neutral-500">Years of Innovation</p>
              </div>
            </motion.div>
            
            <div className="space-y-12">
              <h2 className="heading-serif text-4xl md:text-6xl italic">Driven by <br/>Human Emotion.</h2>
              <p className="text-lg text-neutral-500 font-medium leading-relaxed">
                Founded in 2016, RRE was built on a simple premise: technology should enhance, not replace, human creativity. We use AI to solve technical hurdles, allowing artists to focus entirely on their craft.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "Our Mission", desc: "To empower every creator with world-class tools and professional guidance.", icon: Target },
                  { title: "Our Vision", desc: "To become the global standard for AI-integrated media production.", icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-black" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{item.title}</h4>
                    <p className="text-sm text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet the Team ── */}
      <section className="py-24 md:py-40 bg-black text-white overflow-hidden">
        <div className="satyam-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-24"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">The People</span>
              <div className="h-[1px] w-12 bg-white/20" />
            </div>
            <h2 className="heading-serif text-4xl sm:text-6xl md:text-7xl italic mb-6">The Faces <br className="hidden sm:block"/> Behind RRE.</h2>
            <p className="text-white/50 font-medium max-w-xl mx-auto text-base sm:text-lg">
              Every great project begins with passionate people. Meet the team that breathes life into your stories.
            </p>
          </motion.div>

          {/* Cards */}
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-white/20" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {team.map((member: any, i: number) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all duration-700"
                >
                  {/* Photo */}
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback if image not yet added
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80';
                      }}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white/70 mb-3">
                      {member.role}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">{member.name}</h3>
                    <p className="text-white/50 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                      {member.bio}
                    </p>
                    {member.insta && (
                      <a
                        href={member.insta}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                      >
                        <Instagram className="w-3.5 h-3.5" /> Follow on Instagram
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 md:py-40 bg-secondary">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl md:text-7xl mb-6 italic">Our Core Values</h2>
            <div className="w-20 h-1 bg-black mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
             {[
               { title: "Excellence", desc: "We don't settle for 'good enough'. Every frame and every note must be perfect.", icon: Award },
               { title: "Integrity", desc: "Transparent pricing, honest feedback, and unwavering commitment to our clients.", icon: ShieldCheck },
               { title: "Innovation", desc: "Constantly evolving our workflow with the latest in AI and media tech.", icon: Zap },
             ].map((value, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="p-12 bg-white rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 group"
               >
                 <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-colors">
                   <value.icon className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{value.title}</h3>
                 <p className="text-neutral-500 font-medium leading-relaxed">{value.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-16 sm:py-20 bg-white border-t border-neutral-100">
        <div className="satyam-container">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6 sm:gap-12 md:gap-20">
            <a href="tel:+918898134049" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-300 mb-0.5">Call Us</p>
                <p className="font-black text-dark">+91 88981 34049</p>
              </div>
            </a>
            <a href="mailto:rajatrajentertainment@gmail.com" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-300 mb-0.5">Email Us</p>
                <p className="font-black text-dark text-sm">rajatrajentertainment@gmail.com</p>
              </div>
            </a>
            <a href="https://www.instagram.com/kundan_rajat_raj?utm_source=qr&igsh=MXYzamZ0NXpsdDZqYQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-300 mb-0.5">Instagram</p>
                <p className="font-black text-dark">@kundan_rajat_raj</p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-300 mb-0.5">Studio Address</p>
                <p className="font-black text-dark text-sm leading-snug">Near Dildarnagar Railway Station,<br/>Behind Sayar Maa Mandir — 232326</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-40">
        <div className="satyam-container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="heading-serif text-5xl md:text-7xl mb-12 italic">Join the RRE Family</h2>
            <p className="text-xl text-neutral-500 font-medium mb-16 leading-relaxed">
              Whether you're a budding artist or an established brand, we have the tools and the passion to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/booking" className="btn-satyam-black !rounded-full">Start a Project</Link>
              <Link to="/talent-hunt" className="btn-satyam-outline !rounded-full">Join Talent Hunt</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
