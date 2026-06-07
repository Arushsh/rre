import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Heart, Star, CheckCircle, ArrowRight, Sparkles, Zap, Award, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const Photography = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/photography`)
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
      title: "Wedding Photography", 
      description: "Cinematic and traditional coverage of your big day with high-end post-processing.",
      price: "Starts from ₹25,000",
      features: ["Full Day Coverage", "400+ Edited Photos", "Premium Album", "Drone Shots Included"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&q=80" 
            className="w-full h-full object-cover animate-slow-zoom" 
            alt="Photography Hero" 
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="satyam-container relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-white/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Premium Entertainment House</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-7xl lg:text-8xl mb-8 italic">Capturing <br/>Pure Emotion.</h1>
            <p className="text-lg md:text-xl text-white/70 font-medium mb-12 leading-relaxed max-w-xl">
              From grand weddings to intimate portraits, we blend technical excellence with artistic vision to freeze your most precious moments in time.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/booking" className="btn-satyam-glass">
                Book a Session <ArrowRight className="ml-3 w-4 h-4" />
              </Link>
              <Link to="/portfolio" className="btn-satyam-outline !text-white !border-white/20 hover:!bg-white hover:!text-black">
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl mb-6">Why RRE Photography?</h2>
            <div className="w-20 h-1 bg-black mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "High-End Gear", desc: "We use top-tier Sony and Canon full-frame cameras with prime G-Master lenses for unmatched clarity." },
              { icon: Sparkles, title: "Artistic Editing", desc: "Every photo goes through a meticulous color grading process to match our signature RRE aesthetic." },
              { icon: Award, title: "Expert Direction", desc: "Our photographers are masters of lighting and posing, ensuring you look your absolute best." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-12 rounded-[3rem] shadow-premium border border-neutral-50 group hover:bg-black transition-colors duration-500"
              >
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                  <feature.icon className="w-8 h-8 text-black group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-neutral-400 group-hover:text-neutral-500 transition-colors leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-32 bg-white">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" className="w-full h-full object-cover" alt="Wedding Detail" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-black text-white p-12 rounded-[3rem] hidden md:block shadow-2xl">
                <p className="text-5xl font-black italic mb-2">10k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Moments Captured</p>
              </div>
            </motion.div>

            <div className="space-y-12">
              <h2 className="heading-serif text-5xl italic">Bespoke <br/>Photography Packages</h2>
              <div className="space-y-8">
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
                ) : displayServices.map((service, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-gray-50 rounded-[2.5rem] border border-neutral-100 hover:border-black transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-black uppercase tracking-tight">{service.title}</h4>
                      <span className="text-xs font-black text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">{service.price}</span>
                    </div>
                    <p className="text-neutral-500 mb-6 font-medium">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-3">
                      {service.features.map((f: any, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          <CheckCircle className="w-3 h-3 text-black" /> {f}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" className="w-full h-full object-cover" alt="CTA BG" />
        </div>
        <div className="satyam-container relative z-10">
          <div className="max-w-2xl">
            <h2 className="heading-serif text-6xl mb-8 italic">Ready to create <br/>something timeless?</h2>
            <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
              Don't leave your memories to chance. Book the professionals who care about your story as much as you do.
            </p>
            <Link to="/booking" className="btn-satyam-white">
              Start Your Project <ArrowRight className="ml-4 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photography;
