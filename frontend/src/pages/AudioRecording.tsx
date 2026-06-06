import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic2, Headphones, Disc, CheckCircle, ArrowRight, Music, Zap, Sliders, Volume2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

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
            alt="Studio Hero" 
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
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">Audio Entertainment</span>
            </div>
            <h1 className="heading-serif text-6xl md:text-8xl mb-8 italic">Sound That <br/>Speaks.</h1>
            <p className="text-lg md:text-xl text-white/60 font-medium mb-12 leading-relaxed max-w-xl">
              From soulful vocals to powerful voiceovers, we provide the acoustic environment and technical expertise to capture every nuance of your sound.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/booking" className="btn-satyam-glass !bg-primary !border-primary">
                Book Studio Time <Mic2 className="ml-3 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Equipment Specs */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="satyam-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Headphones, label: "Monitoring", val: "Beyerdynamic DT 770" },
              { icon: Mic2, label: "Microphones", val: "Neumann & Shure" },
              { icon: Sliders, label: "Preamps", val: "Universal Audio" },
              { icon: Volume2, label: "Acoustics", val: "Pro Treated Room" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">{stat.label}</p>
                <p className="font-bold">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-32 bg-gray-50">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl mb-6">Our Audio Solutions</h2>
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
                  Reserve Slot <ArrowRight className="ml-3 w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recording Process */}
      <section className="py-32 bg-white">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="heading-serif text-5xl italic">The Recording <br/>Experience</h2>
              <p className="text-neutral-500 font-medium leading-relaxed">
                We believe a great recording session is 50% technical and 50% vibe. Our entertainment house is designed to make you feel comfortable, inspired, and ready to perform.
              </p>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Setup & Warmup", desc: "Mic positioning and levels tailored to your voice." },
                  { step: "02", title: "The Session", desc: "Multiple takes with creative guidance from our engineer." },
                  { step: "03", title: "Post-Processing", desc: "Professional editing, tuning, and sonic enhancement." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-2xl font-black text-neutral-200">{s.step}</span>
                    <div>
                      <h4 className="font-black uppercase tracking-widest mb-1">{s.title}</h4>
                      <p className="text-sm text-neutral-400 font-medium">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1520529011348-637222444782?w=800&q=80" className="w-full h-full object-cover" alt="Studio Setup" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AudioRecording;
