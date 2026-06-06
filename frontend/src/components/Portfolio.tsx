import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Music, Play, Maximize2, X, ArrowRight, ExternalLink } from 'lucide-react';

const Portfolio = () => {
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = [
    { id: 1, type: 'photo', category: 'wedding', title: 'The Royal Union', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', desc: 'A grand destination wedding in Jaipur.' },
    { id: 2, type: 'video', category: 'commercial', title: 'Urban Beats Ad', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', desc: 'Cinematic commercial for a leading fashion brand.' },
    { id: 3, type: 'photo', category: 'fashion', title: 'Vogue Editorial', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', desc: 'Studio fashion shoot for a seasonal collection.' },
    { id: 4, type: 'music', category: 'studio', title: 'Midnight Soul', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80', desc: 'Professional vocal production and mastering.' },
    { id: 5, type: 'photo', category: 'wedding', title: 'Eternal Vows', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', desc: 'Intimate garden wedding ceremony.' },
    { id: 6, type: 'video', category: 'music-video', title: 'Neon Nights', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a300c?w=800&q=80', desc: 'High-energy music video production.' },
  ];

  const filteredItems = filter === 'all' ? items : items.filter(item => item.type === filter || item.category === filter);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 bg-secondary">
        <div className="satyam-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h1 className="heading-serif text-6xl md:text-9xl mb-8 italic">Our <br /> <span className="text-primary">Legacy.</span></h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium">A curated selection of our finest work across photography, cinema, and sound.</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24">
        <div className="satyam-container">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-20 justify-center">
            {['all', 'photo', 'video', 'music', 'wedding'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-black text-white shadow-xl' : 'bg-secondary text-neutral-400 hover:bg-neutral-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden mb-6 bg-secondary shadow-premium">
                    <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-8">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6">
                        {item.type === 'photo' && <Camera className="w-8 h-8 text-black" />}
                        {item.type === 'video' && <Play className="w-8 h-8 text-black fill-current" />}
                        {item.type === 'music' && <Music className="w-8 h-8 text-black" />}
                      </div>
                      <h3 className="text-white text-2xl font-black uppercase tracking-tight mb-2">{item.title}</h3>
                      <p className="text-white/60 text-xs font-black uppercase tracking-widest">{item.category}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-20"
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
              <X className="w-10 h-10" />
            </button>
            
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-neutral-900 shadow-2xl">
                <img src={selectedItem.img} className="w-full h-full object-cover" alt={selectedItem.title} />
              </div>
              <div className="text-white space-y-8">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 rounded-full border border-white/20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedItem.type}</span>
                </div>
                <h2 className="heading-serif text-5xl md:text-7xl italic leading-tight">{selectedItem.title}</h2>
                <p className="text-xl text-neutral-400 font-medium leading-relaxed">{selectedItem.desc}</p>
                <div className="pt-8 flex gap-6">
                  <button className="btn-satyam-glass !border-primary text-white">Full Case Study</button>
                  <button className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                    <ExternalLink className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
