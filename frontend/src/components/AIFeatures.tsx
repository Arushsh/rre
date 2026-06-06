import React from 'react';
import { Cpu, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AIFeatures = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Cutting Edge Technology</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-dark mb-6">
            AI-Enhanced <span className="text-primary italic">Precision</span>
          </h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">
            We use advanced artificial intelligence to refine your sound while keeping the human emotion intact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "AI Noise Reduction",
              desc: "Crystal clear vocals using advanced neural networks to remove unwanted background noise.",
              icon: ShieldCheck,
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            {
              title: "Smart Mastering",
              desc: "AI-driven mastering that adapts to your genre and ensures perfect loudness levels.",
              icon: Cpu,
              color: "text-purple-600",
              bg: "bg-purple-50"
            },
            {
              title: "Automated Mixing",
              desc: "Intelligent level balancing and frequency separation for a cleaner, professional mix.",
              icon: Zap,
              color: "text-accent",
              bg: "bg-amber-50"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-12 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-premium transition-all duration-500 border border-transparent hover:border-gray-100"
            >
              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black text-dark mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
