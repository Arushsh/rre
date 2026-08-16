import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Loader2,
  Image as ImageIcon,
  Download,
  Share2,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { API_URL, AI_URL } from '../config/api';
import toast from 'react-hot-toast';

const STEPS = [
  { num: 1, label: 'SELFIE' },
  { num: 2, label: 'DETAILS' },
  { num: 3, label: 'VERIFY' },
  { num: 4, label: 'GALLERY' }
];

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 })
};

const ClientOnboarding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  });
  const [otp, setOtp] = useState('');
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // ── PRESERVED: Auto-fill form after selfie capture ──
  const handleSelfieCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
        setTimeout(() => goTo(2), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  // ── PRESERVED: Send OTP → POST /api/users/send-otp ──
  const handleSendOtp = async () => {
    if (!formData.mobile.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile })
      });
      if (response.ok) {
        toast.success('OTP sent to your mobile');
        goTo(3);
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP Error:', error);
      toast.error('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: Verify OTP → POST /api/users/verify-otp ──
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error('Please enter OTP');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mobile: formData.mobile, 
          otp, 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          selfieUrl: selfie,
          slug 
        })
      });
      if (response.ok) {
        await response.json();
        await performAiMatch();
        goTo(4);
        toast.success('OTP verified!');
      } else {
        toast.error('Invalid or expired OTP');
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.error('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: AI Match execution ──
  const performAiMatch = async () => {
    setIsSearching(true);
    try {
      // 1. Get gallery media
      const galleryRes = await fetch(`${API_URL}/api/galleries/${slug}`);
      const galleryData = await galleryRes.json();
      const mediaItems = galleryData.media || [];
      const mediaUrls = mediaItems.map((item: any) => typeof item === 'string' ? item : item.url);

      // 2. Call AI Search
      const aiRes = await fetch(`${AI_URL}/api/face-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_image_url: selfie,
          gallery_urls: mediaUrls
        })
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        setGalleryPhotos(aiData.matches || []);
      } else {
        throw new Error('AI Search failed');
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      // Fallback for local development if AI service is not available
      if (window.location.hostname === 'localhost') {
        setGalleryPhotos([
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80'
        ]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // ── PRESERVED: Download handler ──
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `RRE-Match-${Date.now()}.jpg`;
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

  // ── PRESERVED: Share handler ──
  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wedding Photo',
          text: 'Check out my photo from the wedding captured by Rajat Raj Entertainment!',
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* ── STEPPER ── */}
        <div className="relative flex items-center justify-between px-2">
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-px bg-white/40 -translate-y-1/2 transition-all duration-500 z-0"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          {STEPS.map((s) => {
            const done = step > s.num;
            const active = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 border ${
                    done
                      ? 'bg-white border-white text-black'
                      : active
                      ? 'border-white/60 text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                      : 'border-white/15 text-white/30 bg-[#000000]'
                  }`}
                >
                  {done ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.25em] transition-colors ${
                    active ? 'text-white' : done ? 'text-white/50' : 'text-white/20'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── MAIN INTERACTIVE CONTAINER ── */}
        <div className="glass-strong border border-white/12 rounded-3xl p-8 sm:p-12 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>

            {/* ── STEP 1: CAPTURE SELFIE ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-8"
              >
                <div className="w-16 h-16 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto text-white/70">
                  <Camera className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">AI Face Index</span>
                  <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-white">Let's Find Your Photos.</h2>
                  <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
                    Take or upload a quick selfie. Our neural engine will scan the event gallery to find all your moments.
                  </p>
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-square max-w-[240px] mx-auto rounded-3xl border-2 border-dashed border-white/15 hover:border-white/35 flex items-center justify-center cursor-pointer transition-all overflow-hidden group bg-white/3"
                >
                  {selfie ? (
                    <img src={selfie} className="w-full h-full object-cover" alt="Selfie" />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <Camera className="w-10 h-10 text-white/30 mx-auto group-hover:scale-110 transition-transform" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Click to Capture</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    capture="user"
                    onChange={handleSelfieCapture}
                  />
                </div>

                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors"
                >
                  {selfie ? 'Retake Selfie' : 'Open Camera / Choose Photo'}
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: REGISTRATION FORM ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto text-white/70 mb-4">
                    <User className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Step 02</span>
                  <h2 className="heading-serif text-3xl font-bold text-white">Your Information.</h2>
                  <p className="text-sm text-white/50">Enter your details to receive your personal gallery album.</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        <input 
                          type="text" 
                          placeholder="First Name" 
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                        <input 
                          type="text" 
                          placeholder="Last Name" 
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input 
                        type="email" 
                        placeholder="email@example.com" 
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input 
                        type="tel" 
                        placeholder="+91 00000 00000" 
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => goTo(1)}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 glass-subtle border border-white/15 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button 
                      onClick={handleSendOtp}
                      disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.mobile}
                      className="flex-1 flex items-center justify-center gap-3 py-3.5 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: OTP VERIFICATION ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-8"
              >
                <div className="w-16 h-16 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto text-white/70">
                  <ShieldCheck className="w-8 h-8 text-white/80" />
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Step 03</span>
                  <h2 className="heading-serif text-3xl font-bold text-white">Verify Your Mobile.</h2>
                  <p className="text-sm text-white/50">
                    We sent a 6-digit verification code to <span className="text-white font-bold">{formData.mobile}</span>
                  </p>
                </div>

                <div className="max-w-xs mx-auto space-y-5">
                  <input 
                    type="text" 
                    inputMode="numeric"
                    placeholder="• • • • • •" 
                    maxLength={6}
                    className="w-full text-center text-3xl font-black tracking-[0.6em] py-5 bg-white/5 border border-white/15 hover:border-white/25 focus:border-white/45 focus:outline-none rounded-2xl text-white placeholder-white/15 transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />

                  <button 
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 6}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Unlock Gallery'}
                  </button>

                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-2">
                    <button 
                      onClick={() => goTo(2)}
                      className="text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Edit Details
                    </button>
                    <button 
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4: PHOTO GALLERY RESULTS ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                {/* Greeting Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/12 bg-white/5 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Verified Client</span>
                      </div>
                      <h2 className="heading-serif text-2xl sm:text-3xl font-bold text-white">
                        Welcome, {formData.firstName}!
                      </h2>
                      <p className="text-xs text-white/50">Your AI-matched memories from this collection.</p>
                    </div>

                    <div className="flex items-center gap-3 glass-subtle border border-white/15 px-4 py-3 rounded-2xl">
                      <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                      <div>
                        <p className="text-lg font-black text-white leading-none">
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-white/60" /> : galleryPhotos.length}
                        </p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Matches</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">AI Matched Photos</span>
                    {galleryPhotos.length > 0 && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                        {galleryPhotos.length} {galleryPhotos.length === 1 ? 'Capture' : 'Captures'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {isSearching ? (
                      [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl animate-pulse border border-white/10" />
                      ))
                    ) : galleryPhotos.length > 0 ? (
                      galleryPhotos.map((photo, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                        >
                          <img src={photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Match ${index + 1}`} />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button 
                              onClick={() => handleDownload(photo)}
                              aria-label="Download Photo"
                              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShare(photo)}
                              aria-label="Share Photo"
                              className="w-10 h-10 rounded-full glass-subtle border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center glass-subtle rounded-2xl border border-white/10 space-y-3">
                        <ImageIcon className="w-10 h-10 text-white/20 mx-auto" />
                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">No matching photos found in this album</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return CTA */}
                <div className="text-center pt-4">
                  <button 
                    onClick={() => navigate(`/gallery/${slug}`)}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors"
                  >
                    View Full Event Gallery <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ClientOnboarding;
