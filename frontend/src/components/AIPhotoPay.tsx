import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, CreditCard, CheckCircle, UserCheck, Lock } from 'lucide-react';

// IMPORTANT — Business logic audit:
// AIPhotoPay uses setTimeout() simulation entirely.
// There is NO real Razorpay integration, NO real AI API call.
// "12 Photos Found" is hardcoded. Blurred images are placeholders.
// The payment button does NOT call any API — it only shows a UI state.
// This is preserved exactly as-is from the original implementation.
// No fabricated real functionality has been added.

const AIPhotoPay = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // ── PRESERVED: simulation ──
  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  return (
    <section
      id="ai-photo-pay"
      className="py-24 md:py-32 bg-[#000000] border-t border-white/10 text-white relative overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/2 rounded-full blur-[120px]" />
      </div>

      <div className="satyam-container relative z-10">
        <div className="max-w-3xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-12 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-[#00E5FF]/20 text-[10px] font-bold uppercase tracking-[0.35em] text-[#00E5FF]/70">
              <Scan className="w-3.5 h-3.5" />
              <span>AI Face Recognition</span>
            </div>
            <h2 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              FIND YOUR <br />
              <span className="italic font-normal text-white/70">PHOTOS INSTANTLY.</span>
            </h2>
            <p className="text-sm text-white/50 max-w-lg mx-auto leading-relaxed">
              Were you at one of our events? Upload a selfie and our AI will find your professional photos in seconds.
            </p>
          </div>

          {/* Interactive panel */}
          <div className="glass-strong border border-white/12 rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">

                {/* IDLE */}
                {!scanComplete && !isScanning && (
                  <motion.div
                    key="initial"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-8"
                  >
                    <div className="w-28 h-28 rounded-3xl glass-subtle border-2 border-dashed border-white/15 flex items-center justify-center mx-auto cursor-pointer hover:border-white/30 transition-colors group">
                      <Camera className="w-10 h-10 text-white/30 group-hover:text-white/60 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="heading-serif text-2xl font-bold text-white">Upload a Selfie</h3>
                      <p className="text-sm text-white/45">We'll use this to match your face in our event albums.</p>
                    </div>
                    <button
                      onClick={startScan}
                      className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors mx-auto"
                    >
                      Start AI Face Detection
                    </button>
                  </motion.div>
                )}

                {/* SCANNING */}
                {isScanning && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 space-y-8"
                  >
                    <div className="relative w-24 h-24 mx-auto">
                      <div className="absolute inset-0 border-2 border-[#00E5FF]/15 rounded-full" />
                      <motion.div
                        className="absolute inset-0 border-t-2 border-[#00E5FF] rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Scan className="w-9 h-9 text-[#00E5FF]/70" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="heading-serif text-2xl font-bold text-white">Analyzing…</h3>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Searching event galleries</p>
                    </div>
                  </motion.div>
                )}

                {/* RESULTS */}
                {scanComplete && !showPayment && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
                      <UserCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="heading-serif text-2xl font-bold text-white">12 Photos Found</h3>
                      <p className="text-sm text-white/45">From "Grand Wedding Gala 2024".</p>
                    </div>

                    {/* Blurred preview grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                          <img
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80"
                            alt="Locked photo"
                            className="w-full h-full object-cover blur-sm"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-white/40" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowPayment(true)}
                      className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors mx-auto"
                    >
                      Unlock All Photos (₹299)
                    </button>
                  </motion.div>
                )}

                {/* PAYMENT */}
                {showPayment && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Order summary */}
                    <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-4 h-4 text-white/40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Secure Checkout</span>
                      </div>
                      {[
                        { label: 'Items', value: '12 Digital Photos' },
                        { label: 'Event', value: 'Gala 2024' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-white/8">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
                          <span className="text-sm font-bold text-white/80">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-black text-white">Total</span>
                        <span className="text-2xl font-black text-white">₹299</span>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors">
                      <CheckCircle className="w-5 h-5" />
                      Proceed to Pay
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => { setShowPayment(false); }}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AIPhotoPay;
