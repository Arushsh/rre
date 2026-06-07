import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Share2, 
  Lock, 
  ChevronLeft, 
  Calendar, 
  MapPin, 
  User, 
  Image as ImageIcon, 
  Video,
  QrCode,
  X,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { API_URL } from '../config/api';

const GalleryView = () => {
  const { slug } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/galleries/${slug}`)
      .then(res => res.json())
      .then(data => {
        setGallery(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/galleries/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setGallery({ ...gallery, media: data.media });
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out my photos from ${gallery.title} at Rajat Raj Entertainment!`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-neutral-100 border-t-primary rounded-full animate-spin mb-8" />
      <p className="heading-serif text-2xl italic text-neutral-300">Unlocking gallery...</p>
    </div>
  );
  
  if (!gallery) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <h2 className="heading-serif text-4xl italic text-neutral-300 mb-8">Gallery not found.</h2>
      <Link to="/gallery" className="btn-satyam-outline !rounded-full">Return to Portal</Link>
    </div>
  );

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[4rem] p-10 md:p-16 shadow-premium text-center border border-neutral-100"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="heading-serif text-3xl italic text-black mb-4">{gallery.title}</h1>
          <p className="text-neutral-400 font-medium mb-12">This is a private collection. Please enter your secure access code.</p>
          
          <form onSubmit={handleVerify} className="space-y-6">
            <input 
              type="password" 
              placeholder="ACCESS CODE"
              className="w-full px-8 py-6 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-black text-center tracking-[0.5em] text-lg uppercase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs font-black uppercase tracking-widest">{error}</p>}
            <button type="submit" className="w-full btn-satyam-black !rounded-2xl !py-6">
              Access Gallery <ArrowRight className="ml-3 w-5 h-5" />
            </button>
          </form>
          
          <Link to="/gallery" className="inline-flex items-center gap-3 mt-12 text-neutral-300 hover:text-black font-black uppercase text-[10px] tracking-widest transition-all">
            <ChevronLeft className="w-5 h-5" /> Back to Portal
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="satyam-container">
        {/* Gallery Header */}
        <div className="mb-20">
          <Link to="/gallery" className="inline-flex items-center gap-3 text-neutral-300 hover:text-black font-black uppercase text-[10px] tracking-widest transition-all mb-12">
            <ChevronLeft className="w-5 h-5" /> Back to Portal
          </Link>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
            <div>
              <h1 className="heading-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl italic mb-8 leading-tight">{gallery.title}</h1>
              <div className="flex flex-wrap gap-4 md:gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                <span className="flex items-center gap-3"><MapPin className="w-4 h-4" /> {gallery.location}</span>
                <span className="flex items-center gap-3"><Calendar className="w-4 h-4" /> {new Date(gallery.eventDate).toLocaleDateString()}</span>
                <span className="flex items-center gap-3"><User className="w-4 h-4" /> {gallery.photographer}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 w-full lg:w-auto">
              <button className="btn-satyam-black !rounded-2xl !py-4 flex-grow lg:flex-grow-0">
                <Download className="w-4 h-4 mr-3" /> Download Full Set
              </button>
              <button className="p-4 bg-secondary rounded-2xl border border-neutral-100 hover:bg-black hover:text-white transition-all">
                <QrCode className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
          {gallery.media.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMedia(item)}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-zoom-in group bg-secondary"
            >
              <img src={item} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`Capture ${i}`} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 transform scale-0 group-hover:scale-100 transition-all duration-500">
                  <Maximize2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20"
          >
            <button onClick={() => setSelectedMedia(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
              <X className="w-10 h-10" />
            </button>
            
            <div className="max-w-6xl w-full flex flex-col items-center">
              <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[70vh] rounded-[3rem] overflow-hidden shadow-2xl bg-neutral-900 mb-10">
                <img src={selectedMedia} className="w-full h-full object-contain" alt="Selected Capture" />
              </div>
              
              <div className="flex gap-6">
                <button className="btn-satyam-glass !border-primary text-white !rounded-full !px-12">
                  <Download className="w-4 h-4 mr-3" /> Download High-Res
                </button>
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="p-5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all text-white"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryView;
