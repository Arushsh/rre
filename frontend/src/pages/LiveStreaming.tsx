import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Video, Users, CheckCircle, ArrowRight, Globe, Zap, Shield, Monitor, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

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
    }
  ];

  const displayServices = services.length > 0 ? services : (loading ? [] : fallbackServices);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-black pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&q=80" 
            className="w-full h-full object-cover opacity-40 animate-slow-zoom" 
            alt="Live Streaming Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Global Broadcast</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-7xl lg:text-8xl mb-8 italic">Broadcast <br/>Without Limits.</h1>
            <p className="text-lg md:text-xl text-white/60 font-medium mb-12 leading-relaxed max-w-xl">
              High-definition, low-latency live streaming solutions for any event. Connect with your audience anywhere in the world.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/booking" className="btn-satyam-glass !bg-primary !border-primary">
                Go Live Now <Radio className="ml-3 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-24 bg-gray-50">
        <div className="satyam-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Globe, title: "Global Reach", desc: "Our streams are optimized for viewers in over 150 countries with adaptive bitrate." },
              { icon: Shield, title: "Rock Solid", desc: "Dual-internet backup systems ensure your stream never drops, no matter what." },
              { icon: Zap, title: "Zero Lag", desc: "Low-latency technology that allows for real-time interaction with your audience." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-10 rounded-[3rem] border border-neutral-50 shadow-sm hover:shadow-xl transition-all"
              >
                <feature.icon className="w-10 h-10 text-black mb-6" />
                <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-white">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl mb-6 italic">Broadcast Solutions</h2>
            <p className="text-neutral-400 font-medium uppercase tracking-[0.2em] text-[10px]">Seamlessly connecting worlds</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : displayServices.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-12 bg-gray-50 rounded-[4rem] border border-neutral-100 hover:border-black transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors shadow-sm">
                    <Monitor className="w-8 h-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Starts at</p>
                    <p className="text-xl font-black">{service.price}</p>
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4">{service.title}</h3>
                <p className="text-neutral-500 mb-8 font-medium leading-relaxed">{service.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {service.features.map((f: any, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      <CheckCircle className="w-3 h-3 text-black" /> {f}
                    </div>
                  ))}
                </div>
                <Link to="/booking" className="btn-satyam-black w-full !rounded-2xl group-hover:bg-primary group-hover:border-primary transition-colors">
                  Enquire Now <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-32 bg-black text-white">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="heading-serif text-6xl italic">Pro-Grade <br/>Broadcast Tech</h2>
              <p className="text-neutral-400 font-medium leading-relaxed">
                We use the same technology as major news networks to ensure your live stream is of the highest possible quality. From multi-cam switchers to bonded cellular internet, we've got it covered.
              </p>
              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: "Bonded Internet", desc: "Combining multiple 4G/5G/Fiber lines for unbreakable connectivity." },
                  { title: "vMix/OBS Setup", desc: "Professional production software for branded overlays and graphics." }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-black uppercase tracking-widest text-primary text-xs">{item.title}</h4>
                    <p className="text-sm text-neutral-500 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Live Tech" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-3 bg-red-600 px-6 py-3 rounded-full animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full" />
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
