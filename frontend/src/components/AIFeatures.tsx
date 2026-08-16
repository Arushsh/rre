import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Zap, Sparkles } from 'lucide-react';
import GlassCard from './ui/GlassCard';

// These features describe AI-enhanced audio capabilities (noise reduction,
// smart mastering, automated mixing) that are presented as RRE studio services.
// No real-time AI API calls are made from this component.

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'AI Noise Reduction',
    desc: 'Crystal clear vocals using advanced neural networks to remove unwanted background noise.',
  },
  {
    icon: Cpu,
    title: 'Smart Mastering',
    desc: 'AI-driven mastering that adapts to your genre and ensures professional loudness levels.',
  },
  {
    icon: Zap,
    title: 'Automated Mixing',
    desc: 'Intelligent level balancing and frequency separation for a cleaner, professional mix.',
  },
];

const AIFeatures = () => {
  return (
    <section className="py-24 md:py-32 bg-[#050708] border-t border-white/10 text-white relative overflow-hidden">
      <div className="satyam-container relative z-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-white/12 text-[10px] font-bold uppercase tracking-[0.35em] text-white/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cutting Edge Technology</span>
            </div>
            <h2 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              AI-ENHANCED <br />
              <span className="italic font-normal text-white/70">PRECISION.</span>
            </h2>
          </div>
          <p className="text-sm text-white/45 max-w-sm leading-relaxed">
            We use advanced AI to refine your sound while keeping the human emotion at the core.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard variant="subtle" className="h-full space-y-6 group">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/30 transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="heading-serif text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default AIFeatures;
