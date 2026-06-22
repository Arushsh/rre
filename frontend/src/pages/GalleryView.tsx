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
  Maximize2,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { API_URL, RAZORPAY_KEY_ID } from '../config/api';

const GalleryView = () => {
  const { slug } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  
  // Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [hasPaid, setHasPaid] = useState(false);

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
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image.');
    }
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Payment
  const handlePayment = async (amount: number, type: 'single' | 'full') => {
    if (!hasPaid) {
      setPaymentAmount(amount);
      setIsPaymentModalOpen(true);
      return;
    }
    
    // Proceed to download if already paid
    if (type === 'full') {
      await handleDownloadFullSet();
    }
  };

  // Process Razorpay Payment
  const processPayment = async () => {
    setPaymentLoading(true);
    try {
      // Load script
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load');
        setPaymentLoading(false);
        return;
      }

      // Create order
      const orderRes = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentAmount,
          galleryId: gallery._id,
          userId: '66b8f0e356789abc12345678', // Dummy user ID for demo (replace with actual user)
          customerName: userName,
          customerEmail: userEmail,
          customerPhone: userPhone
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert('Order creation failed');
        setPaymentLoading(false);
        return;
      }

      // Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Rajat Raj Entertainment',
        description: 'Gallery Photo Download',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=200&q=60',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify payment
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
            alert('Payment Successful! You can now download photos');
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone
        },
        notes: {
          gallery: gallery.title
        },
        theme: {
          color: '#f472b6'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDownloadFullSet = async () => {
    if (!hasPaid) {
      handlePayment(2500, 'full'); // ₹2500 for full set download
      return;
    }
    if (!gallery.media || gallery.media.length === 0) return;
    alert('Starting download of all photos...');
    for (let i = 0; i < gallery.media.length; i++) {
      await handleDownload(gallery.media[i].url);
      // Small delay to avoid browser blocking multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

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
              <button onClick={handleDownloadFullSet} className="btn-satyam-black !rounded-2xl !py-4 flex-grow lg:flex-grow-0">
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
          {gallery.media?.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedMedia(item)}
              className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-zoom-in group bg-secondary"
            >
              <img src={item.url || item} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`Capture ${i}`} />
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
                <img src={selectedMedia.url || selectedMedia} className="w-full h-full object-contain" alt="Selected Capture" />
              </div>
              
              <div className="flex gap-6">
                <button 
                  onClick={() => handleDownload(selectedMedia.url || selectedMedia)}
                  className="btn-satyam-glass !border-primary text-white !rounded-full !px-12"
                >
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

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full shadow-2xl"
            >
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-primary" />
                </div>
                <h2 className="heading-serif text-3xl md:text-4xl mb-3 italic">Complete Payment</h2>
                <p className="text-neutral-600 font-medium">To download the full photo collection</p>
              </div>

              <div className="bg-secondary/50 rounded-[2rem] p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-600 font-bold uppercase tracking-wide text-sm">Amount</span>
                  <span className="text-3xl font-black text-black">₹{paymentAmount}</span>
                </div>
                <p className="text-neutral-500 text-sm">Includes full resolution images + watermark-free copies</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); processPayment(); }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-6 py-5 bg-secondary rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-6 py-5 bg-secondary rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-6 py-5 bg-secondary rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                  required
                />

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full btn-satyam-black !rounded-2xl !py-6 flex items-center justify-center gap-3"
                >
                  {paymentLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-6 h-6" />
                  )}
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </form>

              <p className="text-center text-neutral-400 text-xs mt-8 uppercase tracking-widest">
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
