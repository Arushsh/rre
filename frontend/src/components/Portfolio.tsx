import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Video, Music, Play, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

// Portfolio data — preserved from original, no fake replacements
const items = [
  { id: 1, type: 'photo', category: 'WEDDING', title: 'The Royal Union', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85', desc: 'A grand destination wedding in Jaipur, India.', span: 'col-span-1 md:col-span-2 row-span-2' },
  { id: 2, type: 'video', category: 'COMMERCIAL', title: 'Urban Beats Ad', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85', desc: 'Cinematic commercial for a leading fashion brand.', span: 'col-span-1 row-span-1' },
  { id: 3, type: 'photo', category: 'FASHION', title: 'Vogue Editorial', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85', desc: 'Studio fashion shoot for a seasonal collection.', span: 'col-span-1 row-span-1' },
  { id: 4, type: 'music', category: 'STUDIO', title: 'Midnight Soul', img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&q=85', desc: 'Professional vocal production and mastering session.', span: 'col-span-1 row-span-1' },
  { id: 5, type: 'photo', category: 'WEDDING', title: 'Eternal Vows', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85', desc: 'Intimate garden wedding ceremony.', span: 'col-span-1 md:col-span-2 row-span-1' },
  { id: 6, type: 'video', category: 'MUSIC VIDEO', title: 'Neon Nights', img: 'https://images.unsplash.com/photo-1514525253361-bee8718a300c?w=1200&q=85', desc: 'High-energy music video production.', span: 'col-span-1 row-span-1' },
];

const filters = ['ALL', 'PHOTO', 'VIDEO', 'MUSIC', 'WEDDING'];

const Portfolio = () => {
  const [filter, setFilter] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = filter === 'ALL' ? items : items.filter(item =>
    item.type.toUpperCase() === filter || item.category.replace(' ', '-') === filter
  );

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, goPrev, goNext]);

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="bg-[#000000] text-white">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=85"
            alt="RRE Portfolio"
            className="w-full h-full object-cover opacity-35 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl space-y-6"
          >
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">
              Selected Work
            </span>
            <h1 className="display-hero text-white tracking-tighter leading-none">
              A COLLECTION <br />
              <span className="italic font-normal text-white/75">OF STORIES IN</span><br />
              FRAME AND MOTION.
            </h1>
            <p className="editorial-subhead text-base sm:text-lg text-white/60 max-w-xl font-normal leading-relaxed">
              A curated archive of our finest work across photography, cinema, and sound — preserved in frame and motion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── EDITORIAL FILTER BAR ── */}
      <section className="sticky top-16 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="satyam-container py-5">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.35em] transition-all duration-300 pb-1 ${
                  filter === f
                    ? 'text-white border-b border-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── ASYMMETRIC EDITORIAL GRID ── */}
      <section className="py-16 md:py-24">
        <div className="satyam-container">
          <AnimatePresence mode="popLayout">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[28vw] md:auto-rows-[22vw] lg:auto-rows-[18vw]"
            >
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => openLightbox(idx)}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-neutral-900 ${item.span}`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] brightness-90 group-hover:brightness-100"
                  />

                  {/* Always-visible bottom metadata */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.35em] text-white/50 mb-1">{item.category}</span>
                    <div className="flex items-end justify-between">
                      <h3 className="heading-serif text-lg md:text-xl font-bold text-white leading-tight">{item.title}</h3>
                      <span className="text-white/0 group-hover:text-white transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                  </div>

                  {/* Type indicator */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full glass-subtle border border-white/30 flex items-center justify-center text-white">
                      {item.type === 'photo' && <Camera className="w-3.5 h-3.5" />}
                      {item.type === 'video' && <Play className="w-3.5 h-3.5 fill-current" />}
                      {item.type === 'music' && <Music className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="py-32 text-center space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">No Work Found</p>
              <p className="text-white/20 text-sm">Try another category.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CINEMATIC LIGHTBOX ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black/96 backdrop-blur-2xl flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-6 right-6 w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/60 hover:text-white z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 z-10">
              {(lightboxIndex! + 1).toString().padStart(2, '0')} / {filteredItems.length.toString().padStart(2, '0')}
            </div>

            {/* Media */}
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full max-h-[75vh] px-4 md:px-20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeItem.img}
                alt={activeItem.title}
                className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>

            {/* Metadata */}
            <div className="mt-6 text-center space-y-1 px-4" onClick={(e) => e.stopPropagation()}>
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">{activeItem.category}</span>
              <p className="heading-serif text-xl sm:text-2xl text-white font-bold">{activeItem.title}</p>
              <p className="text-xs text-white/50 font-normal">{activeItem.desc}</p>
            </div>

            {/* Prev / Next */}
            <div className="absolute inset-y-0 left-2 md:left-6 flex items-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-2 md:right-6 flex items-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={goNext}
                aria-label="Next image"
                className="w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Portfolio;
