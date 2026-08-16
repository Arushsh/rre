import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Grid, Layout, Download, Share2, Lock, Camera, MapPin, Calendar, QrCode, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { API_URL } from '../config/api';

const GalleryPortal = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ── PRESERVED: API fetch for public galleries ──
  useEffect(() => {
    fetch(`${API_URL}/api/galleries`)
      .then(res => res.json())
      .then(data => {
        // Only show public galleries in the main portal
        const publicGalleries = data.filter((g: any) => g.isPublic);
        setGalleries(publicGalleries);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // ── PRESERVED: search filter logic ──
  const filteredGalleries = galleries.filter((g: any) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-20">

      {/* ── CINEMATIC PORTAL HERO ── */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 border-b border-white/10">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt="Gallery Portal"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>

        <div className="satyam-container relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl space-y-4"
            >
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Memory Portal</span>
              <h1 className="display-title text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white leading-none">
                YOUR <br />
                <span className="italic font-normal text-white/70">GALLERIES.</span>
              </h1>
              <p className="editorial-subhead text-base text-white/55 font-normal leading-relaxed max-w-lg">
                Access your private event albums and relive your moments with precision. Your memories, preserved with artistry.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full lg:w-auto lg:min-w-[360px]"
            >
              <div className="relative glass-subtle rounded-2xl border border-white/10">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search event or location..."
                  className="w-full pl-12 pr-6 py-4 bg-transparent text-white text-sm font-medium placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 rounded-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search galleries"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VIEW CONTROLS BAR ── */}
      <div className="border-b border-white/10 bg-[#000000]/80 backdrop-blur-xl sticky top-16 z-30">
        <div className="satyam-container py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-1 glass-subtle rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                viewMode === 'grid' ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                viewMode === 'list' ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> List
            </button>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            {loading ? '—' : filteredGalleries.length} Albums Available
          </p>
        </div>
      </div>

      {/* ── GALLERY GRID ── */}
      <section className="py-16 md:py-20">
        <div className="satyam-container">

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-3xl overflow-hidden glass-subtle border border-white/10 animate-pulse">
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 bg-white/5 rounded w-24" />
                    <div className="h-5 bg-white/8 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredGalleries.length === 0 && (
            <div className="py-40 text-center space-y-4 border border-white/10 rounded-3xl glass-subtle">
              <Camera className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">No Albums Found</p>
              <p className="text-white/20 text-sm">
                {searchTerm ? 'Try a different search term.' : 'No public galleries are available yet.'}
              </p>
            </div>
          )}

          {/* Gallery cards */}
          {!loading && filteredGalleries.length > 0 && (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
              {filteredGalleries.map((album: any, i: number) => (
                <motion.div
                  key={album._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={`group glass-subtle border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 ${
                    viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                  }`}
                >
                  {/* Cover image */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-64 shrink-0' : 'aspect-[16/10]'}`}>
                    <img
                      src={album.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'}
                      alt={album.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Private badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center gap-1.5 glass-subtle px-3 py-1.5 rounded-full border border-white/20 text-[9px] font-bold uppercase tracking-widest text-white/80">
                        <Lock className="w-3 h-3" /> Private
                      </div>
                    </div>

                    {/* Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        to={`/gallery/${album.slug}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Album <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className={`p-6 md:p-8 flex flex-col justify-between flex-grow ${viewMode === 'list' ? 'py-6' : ''}`}>
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.25em] text-white/35">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" /> {album.location}
                        </span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> {new Date(album.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <Link to={`/gallery/${album.slug}`}>
                        <h3 className="heading-serif text-xl md:text-2xl font-bold text-white group-hover:text-white/80 transition-colors leading-tight">
                          {album.title}
                        </h3>
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                        {album.media?.length || 0} Captures
                      </span>
                      <div className="flex gap-2">
                        <button aria-label="Share gallery" className="w-8 h-8 rounded-full glass-subtle border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button aria-label="QR code" className="w-8 h-8 rounded-full glass-subtle border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── AI FACE SEARCH CTA ── */}
      <section className="py-20 border-t border-white/10">
        <div className="satyam-container">
          <div className="relative glass-strong rounded-3xl border border-white/15 overflow-hidden p-10 md:p-16 text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-white/3 rounded-full blur-[80px]" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-white/20 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Face Recognition</span>
              </div>
              <h2 className="display-title text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
                CAN'T FIND <br />
                <span className="italic font-normal text-white/70">YOUR PHOTOS?</span>
              </h2>
              <p className="editorial-subhead text-base text-white/55 leading-relaxed">
                Our AI Face Recognition engine can find all your photos from any event in seconds — just upload a selfie.
              </p>
              <Link
                to="/ai-hub"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
              >
                Try AI Face Search <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default GalleryPortal;
