import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Share2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  User,
  Image as ImageIcon,
  Video,
  QrCode,
  X,
  ArrowRight,
  Maximize2,
  CreditCard,
  CheckCircle,
  Loader2,
  Play
} from 'lucide-react';
import { API_URL, RAZORPAY_KEY_ID } from '../config/api';
import toast from 'react-hot-toast';

const GalleryView = () => {
  const { slug } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ── PRESERVED: Payment State ──
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [hasPaid, setHasPaid] = useState(false);

  // ── PRESERVED: Download handler ──
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `RRE-${slug}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Image downloaded!');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download image.');
    }
  };

  // ── PRESERVED: Load Razorpay Script ──
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── PRESERVED: Handle Payment ──
  const handlePayment = async (amount: number, type: 'single' | 'full') => {
    if (!hasPaid) {
      setPaymentAmount(amount);
      setIsPaymentModalOpen(true);
      return;
    }
    if (type === 'full') {
      await handleDownloadFullSet();
    }
  };

  // ── PRESERVED: Process Razorpay Payment ──
  const processPayment = async () => {
    setPaymentLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        setPaymentLoading(false);
        return;
      }

      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentAmount,
          galleryId: gallery._id,
          userId: '66b8f0e356789abc12345678',
          customerName: userName,
          customerEmail: userEmail,
          customerPhone: userPhone
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        toast.error('Order creation failed');
        setPaymentLoading(false);
        return;
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Rajat Raj Entertainment',
        description: 'Gallery Photo Download',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=200&q=60',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setPaymentSuccess(true);
            setHasPaid(true);
            setIsPaymentModalOpen(false);
            toast.success('Payment Successful! You can now download photos');
          }
        },
        prefill: { name: userName, email: userEmail, contact: userPhone },
        notes: { gallery: gallery.title },
        theme: { color: '#f472b6' }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  // ── PRESERVED: Download full set ──
  const handleDownloadFullSet = async () => {
    if (!hasPaid) {
      handlePayment(2500, 'full');
      return;
    }
    if (!gallery.media || gallery.media.length === 0) return;
    toast.success('Starting download of all photos...');
    for (let i = 0; i < gallery.media.length; i++) {
      await handleDownload(gallery.media[i].url);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // ── PRESERVED: Fetch gallery by slug ──
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

  // ── PRESERVED: Password verify handler ──
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

  // ── PRESERVED: Share handler ──
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out my photos from ${gallery.title} at Rajat Raj Entertainment!`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  // ── Lightbox keyboard nav ──
  const mediaItems = gallery?.media || [];
  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + mediaItems.length) % mediaItems.length);
  }, [lightboxIndex, mediaItems.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % mediaItems.length);
  }, [lightboxIndex, mediaItems.length]);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

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

  // ── LOADING STATE ──
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-white gap-6">
      <Loader2 className="w-10 h-10 animate-spin text-white/30" />
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Unlocking Gallery…</p>
    </div>
  );

  // ── NOT FOUND ──
  if (!gallery) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-white text-center p-6 gap-6">
      <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">Gallery Not Found</p>
      <h2 className="heading-serif text-3xl font-bold text-white/60">We couldn't find this gallery.</h2>
      <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3 glass-subtle border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:border-white/40 transition-all">
        <ChevronLeft className="w-4 h-4" /> Return to Portal
      </Link>
    </div>
  );

  // ── ACCESS CODE SCREEN ──
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {gallery.coverImage && (
            <img src={gallery.coverImage} alt="" className="w-full h-full object-cover opacity-10 scale-105 blur-sm" />
          )}
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-md w-full glass-strong border border-white/15 rounded-3xl p-10 md:p-14 text-center text-white space-y-8"
        >
          {/* Lock icon */}
          <div className="w-14 h-14 rounded-2xl bg-white/8 border border-white/20 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-white/60" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/35 block">Private Gallery</span>
            <h1 className="heading-serif text-2xl md:text-3xl font-bold text-white leading-tight">{gallery.title}</h1>
            <p className="text-sm text-white/45 font-normal leading-relaxed">
              This is a private collection. Enter your secure access code to unlock.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="password"
              placeholder="ACCESS CODE"
              aria-label="Access code"
              className="w-full px-6 py-4 bg-white/5 border border-white/15 focus:border-white/35 focus:outline-none rounded-2xl text-white text-center tracking-[0.5em] text-base font-bold uppercase placeholder-white/20 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white/90 transition-colors"
            >
              Access Gallery <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Portal
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── GALLERY VIEW (UNLOCKED) ──
  const activeMedia = lightboxIndex !== null ? mediaItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-20">

      {/* ── GALLERY HEADER ── */}
      <section className="py-12 md:py-16 border-b border-white/10">
        <div className="satyam-container">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors mb-10"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Portal
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="space-y-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/35">Private Collection</span>
              <h1 className="heading-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                {gallery.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                {gallery.location && (
                  <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {gallery.location}</span>
                )}
                {gallery.eventDate && (
                  <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(gallery.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                )}
                {gallery.photographer && (
                  <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {gallery.photographer}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <button
                onClick={handleDownloadFullSet}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                {hasPaid ? 'Download All' : 'Download Full Set'}
              </button>
              <button
                onClick={() => handleShare('copy')}
                aria-label="Share gallery"
                className="w-11 h-11 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                aria-label="QR code"
                className="w-11 h-11 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
              >
                <QrCode className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEDIA COUNT ── */}
      <div className="satyam-container py-6 border-b border-white/10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          {mediaItems.length} {mediaItems.length === 1 ? 'Capture' : 'Captures'}
        </p>
      </div>

      {/* ── MEDIA GRID ── */}
      <section className="py-10 md:py-14">
        <div className="satyam-container">
          {mediaItems.length === 0 ? (
            <div className="py-32 text-center space-y-4 border border-white/10 rounded-3xl glass-subtle">
              <ImageIcon className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30">No Media Yet</p>
              <p className="text-white/20 text-sm">This gallery is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
              {mediaItems.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.5) }}
                  onClick={() => openLightbox(i)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in group bg-neutral-900"
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                      <Play className="w-8 h-8 text-white/40" />
                    </div>
                  ) : (
                    <img
                      src={item.url || item}
                      alt={`Capture ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CINEMATIC LIGHTBOX ── */}
      <AnimatePresence>
        {activeMedia && lightboxIndex !== null && (
          <motion.div
            key="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/97 backdrop-blur-2xl flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute top-5 right-5 w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/50 hover:text-white z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25 z-10">
              {(lightboxIndex + 1).toString().padStart(2, '0')} / {mediaItems.length.toString().padStart(2, '0')}
            </div>

            {/* Media */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl w-full max-h-[75vh] px-14 md:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              {activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url || activeMedia}
                  controls
                  className="w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain bg-black"
                />
              ) : (
                <img
                  src={activeMedia.url || activeMedia}
                  alt={`Capture ${lightboxIndex + 1}`}
                  className="w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
            </motion.div>

            {/* Lightbox actions */}
            <div
              className="mt-6 flex items-center gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleDownload(activeMedia.url || activeMedia)}
                className="flex items-center gap-2 px-6 py-2.5 glass-subtle border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:border-white/40 transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                aria-label="Share on WhatsApp"
                className="w-9 h-9 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Prev / Next */}
            <div className="absolute inset-y-0 left-2 md:left-5 flex items-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-2 md:right-5 flex items-center" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={goNext}
                aria-label="Next image"
                className="w-10 h-10 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PAYMENT MODAL (presentation redesigned, all business logic preserved) ── */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong border border-white/15 rounded-3xl p-8 md:p-12 max-w-lg w-full text-white relative"
            >
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full glass-subtle border border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center mx-auto mb-5">
                  <CreditCard className="w-7 h-7 text-white/60" />
                </div>
                <h2 className="heading-serif text-2xl md:text-3xl font-bold text-white mb-2">Complete Payment</h2>
                <p className="text-white/45 text-sm">To download the full photo collection</p>
              </div>

              <div className="glass-subtle border border-white/10 rounded-2xl p-5 mb-7">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Amount</span>
                  <span className="text-3xl font-black text-white">₹{paymentAmount}</span>
                </div>
                <p className="text-white/35 text-xs">Full resolution + watermark-free copies</p>
              </div>

              <form
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); processPayment(); }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/15 focus:border-white/35 focus:outline-none rounded-xl text-white placeholder-white/25 font-medium transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/15 focus:border-white/35 focus:outline-none rounded-xl text-white placeholder-white/25 font-medium transition-colors"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/15 focus:border-white/35 focus:outline-none rounded-xl text-white placeholder-white/25 font-medium transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  {paymentLoading ? 'Processing…' : 'Pay Now'}
                </button>
              </form>

              <p className="text-center text-white/25 text-[10px] uppercase tracking-widest mt-6">
                Secure payment powered by Razorpay
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GalleryView;
