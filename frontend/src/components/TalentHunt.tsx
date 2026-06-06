import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Video, Music, CheckCircle, Upload, Star, Brain, Activity, TrendingUp, ArrowRight, Camera, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const TalentHunt = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });

  const categories = [
    { name: 'Singer', icon: Music, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Vocals & Instruments' },
    { name: 'Actor', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Film & Theatre' },
    { name: 'Model', icon: Users, color: 'text-pink-600', bg: 'bg-pink-50', desc: 'Fashion & Ramp' },
    { name: 'Dancer', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Classical & Modern' },
  ];

  const handleNext = () => setStep(step + 1);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1600&q=80" className="w-full h-full object-cover opacity-40 animate-slow-zoom" alt="Talent Hunt" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="satyam-container relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-8">
              <Trophy className="w-4 h-4 mr-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Season 2024 is Live</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-9xl mb-8 italic leading-tight">Your Stage <br/> <span className="text-primary">Awaits.</span></h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium mb-12 max-w-2xl mx-auto">
              India's first AI-integrated talent hunt. Show your skills, get analyzed by RRE AI, and win a chance to feature in our next production.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-32">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Left: Info */}
            <div className="lg:w-1/3 space-y-12">
              <div className="space-y-6">
                <h2 className="heading-serif text-4xl md:text-5xl italic">Why Register?</h2>
                <p className="text-neutral-500 font-medium">Join 5000+ artists who have already started their journey with Rajat Raj Entertainment.</p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "AI Audition", desc: "Our AI analyzes your pitch, expression, and confidence in real-time.", icon: Brain },
                  { title: "Global Exposure", desc: "Shortlisted talents get featured on our platforms with millions of reach.", icon: Sparkles },
                  { title: "Professional Portfolio", desc: "Get a free professional shoot if you make it to the top 50.", icon: Camera },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-tight mb-2">{item.title}</h4>
                      <p className="text-sm text-neutral-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Registration Form */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-premium border border-neutral-100 relative overflow-hidden">
                {/* Progress */}
                <div className="flex justify-between items-center mb-16 relative">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-100 -translate-y-1/2 z-0" />
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-black transition-all duration-500 ${step >= s ? 'bg-black text-white' : 'bg-white text-neutral-300 border-2 border-neutral-100'}`}>
                      {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">Select Category</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {categories.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() => { setCategory(cat.name); handleNext(); }}
                            className={`p-8 rounded-[2.5rem] border-2 text-left transition-all group ${category === cat.name ? 'border-black bg-black text-white' : 'border-neutral-50 bg-neutral-50 hover:border-neutral-200'}`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${category === cat.name ? 'bg-white/10' : 'bg-white'}`}>
                              <cat.icon className={`w-7 h-7 ${category === cat.name ? 'text-white' : 'text-black'}`} />
                            </div>
                            <p className="text-xl font-black uppercase tracking-tight mb-2">{cat.name}</p>
                            <p className={`text-sm ${category === cat.name ? 'text-neutral-400' : 'text-neutral-400'}`}>{cat.desc}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Full Name</label>
                          <input type="text" placeholder="Your Name" className="w-full bg-secondary border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-black/5 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Email Address</label>
                          <input type="email" placeholder="email@example.com" className="w-full bg-secondary border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-black/5 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">Mobile No</label>
                          <input type="tel" placeholder="+91 00000 00000" className="w-full bg-secondary border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-black/5 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 ml-2">City</label>
                          <input type="text" placeholder="Mumbai, Delhi, etc." className="w-full bg-secondary border-none rounded-2xl px-8 py-5 focus:ring-2 focus:ring-black/5 font-bold" />
                        </div>
                      </div>
                      <button onClick={handleNext} className="btn-satyam-black w-full !rounded-2xl !py-6">
                        Continue Registration <ArrowRight className="ml-3 w-5 h-5" />
                      </button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center py-10">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h3 className="heading-serif text-4xl mb-6 italic">Registration Successful!</h3>
                      <p className="text-neutral-500 font-medium mb-12 max-w-sm mx-auto">
                        Your application for {category} has been received. Our team will review your profile and contact you for the AI audition.
                      </p>
                      <button onClick={() => setStep(1)} className="btn-satyam-outline !rounded-2xl">Register Another Talent</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TalentHunt;
