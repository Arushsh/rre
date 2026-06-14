import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Loader2,
  Image as ImageIcon,
  Download,
  Share2
} from 'lucide-react';
import { API_URL, AI_URL } from '../config/api';

const ClientOnboarding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: ''
  });
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelfieCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelfie(reader.result as string);
        setTimeout(() => setStep(2), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!formData.mobile.trim()) {
      alert('Please enter your mobile number before continuing.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/onboard-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          googleToken: credentialResponse.credential, 
          mobile: formData.mobile, 
          selfieUrl: selfie, 
          slug 
        })
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, name: data.user.name }));
        setStep(3);
        performAiMatch();
      } else {
        alert('Google Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback for demo
      setStep(3);
      performAiMatch();
    } finally {
      setLoading(false);
    }
  };

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
       // Only show demo photos in local development if AI service is not available
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
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image.');
    }
  };

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
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                step >= s ? 'bg-black text-white' : 'bg-white text-gray-300 border-2 border-gray-200'
              }`}
            >
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-10 shadow-premium border border-gray-100 text-center"
            >
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Camera className="w-12 h-12 text-primary" />
              </div>
              <h2 className="heading-serif text-3xl mb-4">Let's Find Your Photos</h2>
              <p className="text-gray-400 font-medium mb-10">Capture a selfie to help our AI find all your moments from the event.</p>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-square max-w-[250px] mx-auto mb-10 border-4 border-dashed border-gray-100 rounded-[2rem] flex items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden"
              >
                {selfie ? (
                  <img src={selfie} className="w-full h-full object-cover" alt="Selfie" />
                ) : (
                  <div className="text-center p-6">
                    <Camera className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-300">Click to Capture</p>
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
                className="w-full btn-quote py-5 flex items-center justify-center gap-3"
              >
                {selfie ? 'Retake Selfie' : 'Open Camera'}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[3rem] p-10 shadow-premium border border-gray-100"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <h2 className="heading-serif text-3xl mb-2">Registration</h2>
                <p className="text-gray-400 font-medium">Continue with Google to complete your registration.</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number *" 
                    required
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-primary/20"
                    value={formData.mobile}
                    onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  />
                  {!formData.mobile && <p className="text-xs text-red-400 font-semibold mt-2 pl-2">Required before signing in with Google</p>}
                </div>
                
                <div className="flex justify-center pt-4">
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => alert('Google login failed')}
                      useOneTap
                      shape="pill"
                      theme="filled_black"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Wedding Hero Card */}
              <div className="bg-white rounded-[3rem] overflow-hidden shadow-premium border border-gray-100 relative group">
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" 
                    alt="Wedding" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="heading-serif text-4xl sm:text-5xl text-white mb-4 italic">The Royal Wedding</h2>
                      <div className="w-20 h-0.5 bg-primary mx-auto mb-6" />
                      <p className="text-white/80 font-bold tracking-[0.3em] text-xs uppercase">Welcome, {formData.name}</p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                  {isSearching ? (
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                  ) : (
                    <div className="text-4xl font-black text-black mb-2">{galleryPhotos.length}</div>
                  )}
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {isSearching ? 'AI Searching...' : 'Photos Found With AI'}
                  </div>
                </div>
                <div className="bg-black p-8 rounded-[2.5rem] shadow-premium text-center flex items-center justify-center gap-4 cursor-pointer hover:bg-black/90 transition-all">
                  <ImageIcon className="w-6 h-6 text-primary" />
                  <span className="text-white font-bold">View My Album</span>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {isSearching ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse" />
                  ))
                ) : galleryPhotos.length > 0 ? (
                  galleryPhotos.map((photo, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-100"
                    >
                      <img src={photo} className="w-full h-full object-cover" alt={`Match ${index}`} />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button 
                          onClick={() => handleDownload(photo)}
                          className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                        >
                          <Download className="w-5 h-5 text-black" />
                        </button>
                        <button 
                          onClick={() => handleShare(photo)}
                          className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                        >
                          <Share2 className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No Photos Found for You</p>
                  </div>
                )}
              </div>

              <div className="text-center pt-8">
                <button 
                  onClick={() => navigate(`/gallery/${slug}`)}
                  className="btn-quote !bg-white !text-black border-2 border-black/5"
                >
                  View Full Event Gallery
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientOnboarding;
