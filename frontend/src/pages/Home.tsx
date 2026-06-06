import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Facebook, Youtube, Camera, Video, Mic2, Radio, Star, Users, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white selection:bg-black selection:text-white">
      {/* Hero Section - Ultra Responsive */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80" 
            className="w-full h-full object-cover opacity-60 animate-slow-zoom" 
            alt="RRE Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>
        
        <div className="satyam-container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "circOut" }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="h-[1px] w-8 md:w-12 bg-primary/50" />
              <span className="text-[10px] md:text-xs font-black tracking-[0.6em] uppercase text-white/70">Premium Media Brand</span>
              <div className="h-[1px] w-8 md:w-12 bg-primary/50" />
            </div>
            
            <h1 className="heading-serif text-5xl sm:text-7xl md:text-[10rem] font-light text-white mb-12 leading-[1.1] tracking-tight">
              Eternal <br className="hidden sm:block" /> <span className="italic font-normal text-primary">Moments</span>
            </h1>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8">
              <Link to="/booking" className="btn-quote w-full sm:w-auto group">
                Request a Quote
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="btn-satyam-glass w-full sm:w-auto">
                Explore Work
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Socials - Responsive hide on mobile */}
        <div className="absolute left-6 md:left-12 bottom-12 hidden md:flex flex-col space-y-8 text-white z-20">
          <a href="#" className="hover:text-primary transition-all uppercase text-[0.6rem] font-black tracking-widest rotate-[-90deg] origin-left">Instagram</a>
          <a href="#" className="hover:text-primary transition-all uppercase text-[0.6rem] font-black tracking-widest rotate-[-90deg] origin-left">Facebook</a>
          <a href="#" className="hover:text-primary transition-all uppercase text-[0.6rem] font-black tracking-widest rotate-[-90deg] origin-left">Youtube</a>
        </div>
        
        <div className="absolute right-6 md:right-12 bottom-12 z-20 flex flex-col items-end gap-4">
           <div className="w-[1px] h-20 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
           <span className="text-[0.6rem] font-black tracking-[0.4em] uppercase text-white/40 rotate-[-90deg] origin-right">Scroll</span>
        </div>
      </section>

      {/* Intro Section - Clean & Responsive */}
      <section className="py-24 md:py-40 bg-white">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <h2 className="heading-serif text-4xl md:text-7xl font-light text-black leading-[1.2] mb-12">
                We believe in <span className="italic underline underline-offset-[12px] decoration-1 decoration-neutral-200">the art of observation</span>.
              </h2>
              <p className="text-lg md:text-xl text-neutral-400 font-medium leading-relaxed mb-12">
                Rajat Raj Entertainment is a boutique media house dedicated to high-end photography, cinematic films, and world-class music production. We blend human emotion with AI precision.
              </p>
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-3xl md:text-4xl font-black mb-2">12k+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Captures</p>
                </div>
                <div>
                  <p className="text-3xl md:text-4xl font-black mb-2">500+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Clients</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/5] rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-2xl"
            >
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&q=80" className="w-full h-full object-cover" alt="Studio Setup" />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-all duration-700" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Services - Large Responsive Grid */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="satyam-container">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="heading-serif text-4xl md:text-6xl italic mb-6">Our Expertise</h2>
              <p className="text-neutral-500 font-medium">Delivering world-class media solutions across all creative domains.</p>
            </div>
            <Link to="/portfolio" className="btn-satyam-outline">View All Work</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { title: "Photography", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&q=80", link: "/photography", icon: Camera },
              { title: "Videography", img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80", link: "/videography", icon: Video },
              { title: "Music Studio", img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000&q=80", link: "/audio-recording", icon: Mic2 },
              { title: "Live Stream", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&q=80", link: "/live-streaming", icon: Radio },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={item.link} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-8 bg-neutral-100 shadow-premium">
                    <img src={item.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-md px-8 py-4 text-[10px] font-black uppercase tracking-[0.4em] text-black">Learn More</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="heading-serif text-3xl font-light text-black uppercase tracking-widest group-hover:italic transition-all">{item.title}</h3>
                    </div>
                    <ArrowRight className="w-6 h-6 text-neutral-300 group-hover:text-black group-hover:translate-x-2 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-24 md:py-40 bg-black text-white overflow-hidden">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/20 rounded-full border border-primary/30">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Next-Gen Technology</span>
              </div>
              <h2 className="heading-serif text-5xl md:text-8xl italic">AI Powered <br/>Experiences</h2>
              <p className="text-xl text-neutral-400 font-medium leading-relaxed max-w-xl">
                We're redefining the media industry with AI. From instant face search in galleries to automated talent analysis, we bring the future to you today.
              </p>
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Face Match</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Talent AI</span>
                </div>
              </div>
              <Link to="/ai-hub" className="btn-satyam-glass inline-flex">Explore AI Hub</Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden border border-white/10">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80" className="w-full h-full object-cover opacity-60" alt="AI Tech" />
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 bg-white">
        <div className="satyam-container text-center">
          <h2 className="heading-serif text-5xl md:text-[8rem] font-light text-black mb-16 leading-none">
            Let's create <br/> <span className="italic">the future.</span>
          </h2>
          <Link to="/booking" className="btn-satyam-black !rounded-full !px-16 !py-8 text-sm">
            Work with us <ArrowRight className="ml-4 w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
