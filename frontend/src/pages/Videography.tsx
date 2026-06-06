import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Film, Play, CheckCircle, ArrowRight, Monitor, Camera, Zap, Music, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const Videography = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/videography`)
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

  const fallbackPackages = [
    {
      title: "Cinematic Wedding Film",
      description: "A high-end cinematic retelling of your wedding story with professional color grading.",
      price: "Starts from ₹45,000",
      features: ["3 Cinematographers", "4K Raw Recording", "Drone Shots", "Same Day Edit Teaser"]
    }
  ];

  const displayPackages = services.length > 0 ? services : (loading ? [] : fallbackPackages);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80" 
            className="w-full h-full object-cover" 
            alt="Videography Hero" 
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
        </div>
        
        <div className="satyam-container relative z-10 text-white text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-white/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Cinematic Excellence</span>
              <div className="h-[1px] w-12 bg-white/30" />
            </div>
            <h1 className="heading-serif text-6xl md:text-9xl mb-8 italic">Films That <br/>Move You.</h1>
            <p className="text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
              We don't just record video; we craft cinematic experiences that preserve the soul of every moment.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/booking" className="btn-satyam-glass !bg-primary !border-primary text-white">
                Start a Project <Play className="ml-3 w-4 h-4 fill-current" />
              </Link>
              <Link to="/portfolio" className="btn-satyam-outline !text-white !border-white/20 hover:!bg-white hover:!text-black">
                Watch Showreel
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Production Values */}
      <section className="py-32 bg-gray-50">
        <div className="satyam-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Film, title: "4K Resolution", desc: "Every frame captured in stunning ultra-high definition for future-proof quality." },
              { icon: Monitor, title: "Pro Grading", desc: "Hollywood-standard color grading to give your film a distinct cinematic look." },
              { icon: Zap, title: "Fast Delivery", desc: "Our optimized workflow ensures you get your edited films in record time." },
              { icon: Music, title: "Sound Design", desc: "Crystal clear audio and custom soundscapes that enhance the visual emotion." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm"
              >
                <item.icon className="w-10 h-10 text-black mb-6" />
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Grid */}
      <section className="py-32 bg-white">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl mb-6 italic">Cinematic Packages</h2>
            <p className="text-neutral-400 font-medium uppercase tracking-[0.2em] text-[10px]">Tailored to your vision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {loading ? (
              <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : displayPackages.map((pkg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-12 bg-gray-50 rounded-[4rem] border border-neutral-100 hover:border-black transition-all duration-500 hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                    <Video className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Pricing</p>
                    <p className="text-xl font-black">{pkg.price}</p>
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4">{pkg.title}</h3>
                <p className="text-neutral-500 mb-8 font-medium leading-relaxed">{pkg.description}</p>
                <ul className="space-y-4 mb-10">
                  {pkg.features.map((f: any, j: number) => (
                    <li key={j} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-neutral-400">
                      <div className="w-1.5 h-1.5 bg-black rounded-full" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="btn-satyam-black w-full !rounded-2xl">
                  Enquire Now <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-32 bg-black text-white">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="heading-serif text-6xl mb-8 italic">The RRE <br/>Showreel 2024</h2>
              <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
                Take a look at our finest work across weddings, music videos, and commercial projects. Quality that speaks for itself.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/10">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold">Voted #1 Media Agency for Cinematic Wedding Films</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/10 relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=80" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="Showreel" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Videography;
