import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Mail, Phone, MessageSquare, Send, CheckCircle, Sparkles, ArrowRight, Loader2, Camera, Video, Mic2, Radio } from 'lucide-react';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState('');

  const services = [
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'videography', label: 'Videography', icon: Video },
    { id: 'music', label: 'Music Production', icon: Mic2 },
    { id: 'stream', label: 'Live Stream', icon: Radio },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="satyam-container">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Left: Info */}
            <div className="lg:w-1/3 space-y-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="heading-serif text-5xl md:text-7xl mb-8 italic">Start Your <br /> <span className="text-primary">Journey.</span></h1>
                <p className="text-xl text-neutral-400 font-medium mb-12">
                  Tell us about your project and let's create something extraordinary together.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-6 items-center p-6 bg-secondary rounded-[2rem] border border-neutral-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Response Time</h4>
                      <p className="font-bold">Within 24 Hours</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center p-6 bg-secondary rounded-[2rem] border border-neutral-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Free Consultation</h4>
                      <p className="font-bold">Included</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-premium border border-neutral-100 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">What are you looking for?</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        {services.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => { setService(s.id); setStep(2); }}
                            className={`p-10 rounded-[2.5rem] border-2 text-left transition-all group ${service === s.id ? 'border-black bg-black text-white' : 'border-neutral-50 bg-neutral-50 hover:border-neutral-200'}`}
                          >
                            <s.icon className={`w-10 h-10 mb-6 ${service === s.id ? 'text-white' : 'text-black'}`} />
                            <p className="text-xl font-black uppercase tracking-tight">{s.label}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-8 hover:text-black transition-colors">← Back to Services</button>
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">Project Details</h3>
                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input type="text" placeholder="Full Name" required className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-black/5 font-bold" />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input type="email" placeholder="Email Address" required className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-black/5 font-bold" />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input type="tel" placeholder="Phone Number" required className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-black/5 font-bold" />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input type="date" required className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-black/5 font-bold" />
                          </div>
                        </div>
                        <div className="relative">
                          <MessageSquare className="absolute left-6 top-8 w-5 h-5 text-neutral-300" />
                          <textarea placeholder="Tell us about your project..." rows={4} className="w-full pl-16 pr-8 py-8 bg-secondary rounded-[2rem] border-none focus:ring-2 focus:ring-black/5 font-bold"></textarea>
                        </div>
                        <button disabled={loading} className="btn-satyam-black w-full !rounded-2xl !py-6">
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Inquiry <Send className="ml-3 w-5 h-5" /></>}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h3 className="heading-serif text-4xl mb-6 italic">Inquiry Sent!</h3>
                      <p className="text-xl text-neutral-500 font-medium mb-12 max-w-sm mx-auto">
                        Thank you for reaching out. Our team will contact you shortly to discuss your project.
                      </p>
                      <button onClick={() => { setStep(1); setService(''); }} className="btn-satyam-outline !rounded-full">Send Another Inquiry</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
