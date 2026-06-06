import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Grid, Layout, Download, Share2, Eye, Filter, Lock, Camera, MapPin, Calendar, QrCode, ArrowRight } from 'lucide-react';
import { API_URL } from '../config/api';

const GalleryPortal = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredGalleries = galleries.filter((g: any) => 
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="satyam-container">
        {/* Portal Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-black/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400">Memory Portal</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-8xl italic mb-6">Your <br/> <span className="text-primary">Galleries.</span></h1>
            <p className="text-xl text-neutral-500 font-medium leading-relaxed">Access your private event albums and experience the moments all over again with AI precision.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-secondary p-3 rounded-[2rem] border border-neutral-100 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
              <input 
                type="text" 
                placeholder="Search event name or location..." 
                className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Gallery Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6 border-b border-neutral-100 pb-10">
          <div className="flex gap-4 p-2 bg-secondary rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${viewMode === 'grid' ? 'bg-black text-white shadow-xl' : 'text-neutral-400 hover:bg-neutral-200'}`}
            >
              <Grid className="w-4 h-4" /> Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${viewMode === 'list' ? 'bg-black text-white shadow-xl' : 'text-neutral-400 hover:bg-neutral-200'}`}
            >
              <Layout className="w-4 h-4" /> List
            </button>
          </div>
          <p className="text-neutral-300 font-black uppercase text-[10px] tracking-[0.3em]">{filteredGalleries.length} Albums Available</p>
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="py-40 text-center">
            <div className="w-16 h-16 border-4 border-neutral-100 border-t-primary rounded-full animate-spin mx-auto mb-8" />
            <p className="heading-serif text-2xl italic text-neutral-300">Curating your memories...</p>
          </div>
        ) : filteredGalleries.length > 0 ? (
          <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredGalleries.map((album: any, i: number) => (
              <motion.div
                key={album._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group bg-white rounded-[3rem] overflow-hidden border border-neutral-50 shadow-premium hover:shadow-2xl transition-all duration-700 ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''}`}
              >
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-1/3 aspect-video md:aspect-auto' : 'aspect-[4/3]'}`}>
                  <img src={album.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={album.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Link to={`/gallery/${album.slug}`} className="btn-satyam-glass !py-3 !px-8">View Album</Link>
                  </div>
                  <div className="absolute top-8 right-8">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                      <Lock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">Private</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-4 text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {album.location}</span>
                      <span className="w-1.5 h-1.5 bg-neutral-200 rounded-full" />
                      <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(album.eventDate).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/gallery/${album.slug}`}>
                      <h3 className="heading-serif text-3xl italic text-black mb-6 group-hover:text-primary transition-colors">{album.title}</h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-neutral-50">
                    <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest">{album.media?.length || 0} Captures</p>
                    <div className="flex gap-3">
                      <button className="p-4 bg-secondary rounded-2xl hover:bg-black hover:text-white transition-all">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-4 bg-secondary rounded-2xl hover:bg-black hover:text-white transition-all">
                        <QrCode className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-secondary rounded-[4rem] border-2 border-dashed border-neutral-100">
             <Camera className="w-16 h-16 text-neutral-200 mx-auto mb-8" />
             <h3 className="heading-serif text-3xl italic text-neutral-300">No albums found matching your search.</h3>
          </div>
        )}

        {/* AI Help Section */}
        <div className="mt-40 bg-black rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="heading-serif text-4xl md:text-7xl italic mb-10 leading-tight">Can't find <br/>your photos?</h2>
            <p className="text-neutral-400 text-xl mb-16 leading-relaxed">Our AI Face Recognition tool can find all your photos from any event in seconds. Simply upload a selfie and let our engine do the rest.</p>
            <Link to="/ai-hub" className="btn-satyam-white !rounded-full !px-12">
              Try AI Face Search <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPortal;
