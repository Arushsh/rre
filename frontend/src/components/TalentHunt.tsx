import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music, Video, Users, Activity, CheckCircle, ArrowRight, ArrowLeft,
  Brain, Sparkles, Camera, Trophy, Star
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Singer',
    icon: Music,
    desc: 'Vocals & Instruments',
    index: '01',
    img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
  },
  {
    name: 'Actor',
    icon: Video,
    desc: 'Film & Theatre',
    index: '02',
    img: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
  },
  {
    name: 'Model',
    icon: Users,
    desc: 'Fashion & Ramp',
    index: '03',
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
  },
  {
    name: 'Dancer',
    icon: Activity,
    desc: 'Classical & Modern',
    index: '04',
    img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
  },
];

const WHY_REGISTER = [
  {
    icon: Brain,
    title: 'AI Audition',
    desc: 'Our AI analyzes your pitch, expression, and confidence in real-time.',
  },
  {
    icon: Sparkles,
    title: 'Global Exposure',
    desc: 'Shortlisted talents get featured on our platforms with millions of reach.',
  },
  {
    icon: Camera,
    title: 'Professional Portfolio',
    desc: 'Get a free professional shoot if you make it to the top 50.',
  },
];

const STEPS = [
  { num: 1, label: 'CATEGORY' },
  { num: 2, label: 'DETAILS' },
  { num: 3, label: 'CONFIRMED' },
];

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

const TalentHunt = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', city: '' });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const selectCategory = (name: string) => {
    setCategory(name);
    goTo(2);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Valid email is required.';
    if (!formData.phone.trim() || formData.phone.length < 10)
      newErrors.phone = 'Valid phone number is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) goTo(3);
  };

  const reset = () => {
    setCategory('');
    setFormData({ name: '', email: '', phone: '', city: '' });
    setErrors({});
    goTo(1);
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-20">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1920&q=85"
            alt="Talent Hunt"
            className="w-full h-full object-cover opacity-35 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-white/15 text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
              <Trophy className="w-3.5 h-3.5" />
              <span>Season 2024 is Live</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter leading-none">
              YOUR TALENT <br />
              <span className="italic font-normal text-white/75">DESERVES A STAGE.</span>
            </h1>

            <p className="editorial-subhead text-base sm:text-lg text-white/60 max-w-xl font-normal leading-relaxed">
              India's first AI-integrated talent hunt. Showcase your skills, get evaluated, and win a chance to feature in our next production.
            </p>

            <div className="flex items-center gap-8 pt-2">
              {[{ n: '5000+', l: 'Artists Registered' }, { n: '4', l: 'Categories' }, { n: 'AI', l: 'Powered Evaluation' }].map((s, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-lg sm:text-2xl font-black text-white">{s.n}</p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/35">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="py-16 md:py-24">
        <div className="satyam-container">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start">

            {/* ── LEFT: WHY REGISTER ── */}
            <div className="lg:w-[36%] space-y-12">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35">Opportunities</span>
                <h2 className="heading-serif text-3xl md:text-4xl font-bold text-white leading-tight">
                  WHY REGISTER?
                </h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  Join thousands of artists who have started their journey with Rajat Raj Entertainment.
                </p>
              </div>

              <div className="space-y-8">
                {WHY_REGISTER.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="flex gap-5 group"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 pt-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">{item.title}</h4>
                        <p className="text-xs text-white/45 leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Decorative separator */}
              <div className="hidden lg:block h-px bg-white/10 w-full" />

              <p className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                Rajat Raj Entertainment — Talent Hunt 2024
              </p>
            </div>

            {/* ── RIGHT: FORM PANEL ── */}
            <div className="lg:w-[64%] w-full">
              <div className="glass-strong border border-white/12 rounded-3xl p-8 md:p-12 relative overflow-hidden">

                {/* Subtle ambient glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/3 rounded-full blur-[80px] pointer-events-none" />

                {/* ── STEP INDICATOR ── */}
                <div className="relative flex items-center mb-12">
                  {/* Track line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
                  <div
                    className="absolute top-1/2 left-0 h-px bg-white/40 -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${((step - 1) / 2) * 100}%` }}
                  />
                  <div className="relative z-10 flex justify-between w-full">
                    {STEPS.map((s) => {
                      const done = step > s.num;
                      const active = step === s.num;
                      return (
                        <div key={s.num} className="flex flex-col items-center gap-2">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-400 border ${
                            done
                              ? 'bg-white border-white text-black'
                              : active
                                ? 'border-white/60 text-white bg-white/10'
                                : 'border-white/15 text-white/25 bg-transparent'
                          }`}>
                            {done ? <CheckCircle className="w-4 h-4" /> : s.num}
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-[0.3em] transition-colors ${active ? 'text-white/70' : done ? 'text-white/40' : 'text-white/20'}`}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── STEP CONTENT ── */}
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>

                    {/* STEP 1 — CATEGORY */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="mb-8">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block mb-2">Step 01</span>
                          <h3 className="heading-serif text-2xl md:text-3xl font-bold text-white">Select Your Category.</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = category === cat.name;
                            return (
                              <button
                                key={cat.name}
                                onClick={() => selectCategory(cat.name)}
                                className={`group relative text-left rounded-2xl overflow-hidden border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                                  isSelected
                                    ? 'border-white/50 bg-white/10'
                                    : 'border-white/10 hover:border-white/25 bg-white/3'
                                }`}
                              >
                                {/* Image background */}
                                <div className="absolute inset-0">
                                  <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className={`w-full h-full object-cover transition-all duration-500 ${
                                      isSelected ? 'opacity-25 scale-105' : 'opacity-10 group-hover:opacity-20'
                                    }`}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="relative p-6 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30">{cat.index}</span>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                  </div>
                                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                                    isSelected ? 'border-white/40 bg-white/15 text-white' : 'border-white/15 bg-white/5 text-white/50'
                                  }`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-base font-black uppercase tracking-tight text-white mb-0.5">{cat.name}</p>
                                    <p className="text-[11px] text-white/40">{cat.desc}</p>
                                  </div>
                                  <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    isSelected ? 'text-white' : 'text-white/30 group-hover:text-white/60'
                                  }`}>
                                    Select <ArrowRight className="w-3 h-3" />
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2 — DETAILS */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="mb-8">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block mb-2">Step 02 — {category}</span>
                          <h3 className="heading-serif text-2xl md:text-3xl font-bold text-white">Your Information.</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                          {[
                            { field: 'name' as const, label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                            { field: 'email' as const, label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
                            { field: 'phone' as const, label: 'Mobile Number', type: 'tel', placeholder: '+91 00000 00000' },
                            { field: 'city' as const, label: 'City', type: 'text', placeholder: 'Mumbai, Delhi…' },
                          ].map(({ field, label, type, placeholder }) => (
                            <div key={field} className="space-y-2">
                              <label
                                htmlFor={`talent-${field}`}
                                className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40"
                              >
                                {label}
                              </label>
                              <input
                                id={`talent-${field}`}
                                type={type}
                                placeholder={placeholder}
                                value={formData[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className={`w-full px-5 py-4 bg-white/5 border rounded-xl text-white text-sm font-medium placeholder-white/20 focus:outline-none transition-all ${
                                  errors[field]
                                    ? 'border-red-500/60 focus:border-red-400'
                                    : 'border-white/12 focus:border-white/40 hover:border-white/20'
                                }`}
                                aria-invalid={!!errors[field]}
                                aria-describedby={errors[field] ? `err-${field}` : undefined}
                              />
                              {errors[field] && (
                                <p id={`err-${field}`} className="text-[10px] text-red-400 font-bold uppercase tracking-widest" role="alert">
                                  {errors[field]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            type="button"
                            onClick={() => goTo(1)}
                            className="flex items-center justify-center gap-2 px-6 py-4 glass-subtle border border-white/15 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
                          >
                            <ArrowLeft className="w-4 h-4" /> Back
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors"
                          >
                            Submit Application <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3 — SUCCESS */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center py-10 space-y-8"
                      >
                        <motion.div
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                          className="w-20 h-20 rounded-2xl bg-white/8 border border-white/20 flex items-center justify-center mx-auto"
                        >
                          <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>

                        <div className="space-y-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Application Received</span>
                          <h3 className="heading-serif text-3xl md:text-4xl font-bold text-white">
                            You're In.
                          </h3>
                          <p className="text-sm text-white/55 max-w-sm mx-auto leading-relaxed">
                            Your application for <span className="text-white font-bold">{category}</span> has been received.
                            Our team will review your profile and be in touch for the AI audition round.
                          </p>
                        </div>

                        {/* Submitted details summary */}
                        <div className="glass-subtle border border-white/10 rounded-2xl p-6 text-left space-y-3 max-w-xs mx-auto">
                          {[
                            { l: 'Name', v: formData.name },
                            { l: 'Category', v: category },
                            { l: 'City', v: formData.city },
                          ].map(({ l, v }) => v && (
                            <div key={l} className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{l}</span>
                              <span className="text-sm font-bold text-white/80">{v}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={reset}
                          className="inline-flex items-center gap-2 px-7 py-3 glass-subtle border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-white/40 transition-all"
                        >
                          Register Another Talent
                        </button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default TalentHunt;
