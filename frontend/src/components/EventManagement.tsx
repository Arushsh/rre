import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Camera, Video, MapPin, Calculator, Sparkles, CheckCircle, ArrowRight, DollarSign, Heart, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventManagement = () => {
  const [budget, setBudget] = useState(50000);

  const getPackage = (val: number) => {
    if (val < 40000) return "Starter Pack";
    if (val < 80000) return "Professional Pack";
    if (val < 150000) return "Cinematic Elite Pack";
    return "Royal Grand Pack";
  };

  const getFeatures = (val: number) => {
    if (val < 40000) return ["Single Camera", "Standard Editing", "4 Hour Coverage", "Digital Delivery"];
    if (val < 80000) return ["Dual Camera", "Cinematic Editing", "Full Day Coverage", "Drone Shots", "Premium Album"];
    if (val < 150000) return ["4K Cinematic Setup", "Multiple Drones", "Same Day Edit Teaser", "Live Streaming", "Coffee Table Book"];
    return ["Master Crew (5+)", "8K RAW Recording", "International Travel", "Full Live Broadcast", "Luxury Leather Album"];
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 bg-secondary overflow-hidden">
        <div className="satyam-container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-black/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400">Events & Weddings</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-8xl mb-12 leading-[1.1]">
              Moments into <br /> <span className="italic">Masterpieces.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-500 font-medium leading-relaxed max-w-2xl">
              From grand weddings to corporate launches, we bring a cinematic perspective to every event we cover.
            </p>
          </motion.div>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block opacity-20">
          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80" className="w-full h-full object-cover" alt="Event BG" />
        </div>
      </section>

      {/* AI Planner Section */}
      <section className="py-24 md:py-40">
        <div className="satyam-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <div className="space-y-12">
              <h2 className="heading-serif text-4xl md:text-6xl italic">Smart AI <br/>Event Planning.</h2>
              <p className="text-lg text-neutral-500 font-medium leading-relaxed">
                Use our AI-driven budget planner to find the perfect coverage for your special day. Simply slide to your budget and see what we can offer.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Heart className="w-8 h-8 text-primary" />
                  <h4 className="font-black uppercase tracking-tight">Personalized</h4>
                  <p className="text-sm text-neutral-400">Tailored to your story.</p>
                </div>
                <div className="space-y-2">
                  <Star className="w-8 h-8 text-primary" />
                  <h4 className="font-black uppercase tracking-tight">Premium</h4>
                  <p className="text-sm text-neutral-400">World-class quality.</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[4rem] p-8 md:p-16 shadow-premium border border-neutral-100"
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                  <Calculator className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase tracking-tight">Budget Planner</h4>
                  <p className="text-neutral-400 text-sm font-medium">Find your perfect package</p>
                </div>
              </div>

              <div className="space-y-12">
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Target Budget</span>
                    <span className="text-3xl font-black italic">₹{budget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="20000" 
                    max="300000" 
                    step="5000" 
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-black"
                  />
                </div>

                <div className="p-10 bg-secondary rounded-[3rem] border border-neutral-100 relative group hover:bg-black transition-colors duration-500">
                  <div className="absolute top-8 right-8">
                    <Sparkles className="w-8 h-8 text-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Recommended</p>
                  <h5 className="text-3xl font-black mb-8 group-hover:text-white transition-colors">{getPackage(budget)}</h5>
                  
                  <ul className="space-y-4 mb-12">
                    {getFeatures(budget).map((f, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-bold text-neutral-500 group-hover:text-neutral-400 transition-colors">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link to="/booking" className="btn-satyam-black w-full !rounded-2xl group-hover:bg-white group-hover:text-black transition-colors">
                    Book This Package
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 md:py-40 bg-black text-white">
        <div className="satyam-container">
          <div className="text-center mb-24">
            <h2 className="heading-serif text-5xl md:text-8xl italic mb-8">What We Cover</h2>
            <div className="w-24 h-[1px] bg-primary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Grand Weddings", icon: Heart, desc: "From Mehendi to Reception, every ritual captured." },
              { title: "Corporate Galas", icon: Users, desc: "Professional coverage for launches and annual meets." },
              { title: "Fashion Shows", icon: Camera, desc: "High-speed ramp and backstage BTS coverage." },
              { title: "Live Concerts", icon: Video, desc: "Multi-cam setup with professional stage audio." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[3rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
              >
                <item.icon className="w-10 h-10 text-primary mb-8" />
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                <p className="text-sm text-neutral-500 font-medium leading-relaxed group-hover:text-neutral-400 transition-colors">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventManagement;
