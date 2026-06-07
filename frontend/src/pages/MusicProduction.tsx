import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Disc, Mic2, CheckCircle, ArrowRight, Zap, Sliders, Volume2, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const MusicProduction = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/services/category/production`)
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
      title: "Music Arrangement",
      description: "Transform your raw melodies into full-fledged compositions with professional instrumentation.",
      price: "Starts from ₹10,000",
      features: ["Custom Beats", "Full Instrumentation", "Genre Expertise", "Live Instruments"]
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&q=80" 
            className="w-full h-full object-cover opacity-40 animate-slow-zoom" 
            alt="Music Production Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="satyam-container relative z-10 text-white">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-white/30" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Entertainment Innovation</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-7xl lg:text-8xl mb-8 italic">Crafting <br/>Hit Sounds.</h1>
            <p className="text-lg md:text-xl text-white/60 font-medium mb-12 leading-relaxed max-w-xl">
              Your vision, our expertise. We bring world-class production, arrangement, and sound design to help you create music that resonates.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/booking" className="btn-satyam-glass !bg-primary !border-primary">
                Start Producing <Music className="ml-3 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Production Values */}
      <section className="py-32 bg-gray-50">
        <div className="satyam-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Sliders, title: "Modern Workflow", desc: "Using the latest DAWs and plugins like Ableton, Logic, and Waves for cutting-edge sound." },
              { icon: Sparkles, title: "Creative Direction", desc: "We don't just produce; we help you find your unique sonic identity and brand." },
              { icon: Volume2, title: "Hybrid Setup", desc: "Combining analog warmth with digital precision for the best of both worlds." }
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
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl mb-6">Music Production Services</h2>
            <div className="w-20 h-1 bg-black mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : displayServices.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-12 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black">{service.title}</h3>
                  <span className="text-primary font-black text-sm uppercase bg-primary/5 px-4 py-2 rounded-xl">{service.price}</span>
                </div>
                <p className="text-neutral-500 mb-8 font-medium leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {service.features.map((f: any, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      <CheckCircle className="w-3 h-3 text-black" /> {f}
                    </div>
                  ))}
                </div>
                <Link to="/booking" className="btn-satyam-black w-full !rounded-2xl group-hover:bg-primary group-hover:border-primary transition-colors">
                  Get Started <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborative Process */}
      <section className="py-32 bg-black text-white">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="heading-serif text-5xl italic">From Idea <br/>To Anthem</h2>
              <p className="text-neutral-400 font-medium leading-relaxed">
                Music is a journey. We work closely with you at every stage, from the initial scratch demo to the final mastered track, ensuring your vision is never compromised.
              </p>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Vision Meeting", desc: "We discuss your influences, goals, and the sound you want to achieve." },
                  { step: "02", title: "Draft Production", desc: "Building the core arrangement and vibe of the track." },
                  { step: "03", title: "Polishing", desc: "Final instrumentation, vocal production, and high-end mixing." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-2xl font-black text-white/10">{s.step}</span>
                    <div>
                      <h4 className="font-black uppercase tracking-widest mb-1">{s.title}</h4>
                      <p className="text-sm text-neutral-500 font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1514525253361-bee8718a300c?w=800&q=80" className="w-full h-full object-cover" alt="Production Session" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicProduction;
