import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Scan, CreditCard, Download, CheckCircle, Search, UserCheck, Lock } from 'lucide-react';

const AIPhotoPay = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3000);
  };

  return (
    <section id="ai-photo-pay" className="py-24 bg-dark relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px] animate-pulse" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-6">
            <Scan className="w-4 h-4 mr-2" />
            <span className="text-xs font-black uppercase tracking-widest">AI Face Recognition</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Find Your Photos <span className="text-primary">Instantly</span></h2>
          <p className="text-gray-400 text-xl font-medium">
            Were you at one of our events? Upload a selfie and our AI will find all your professional photos in seconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
            <AnimatePresence mode="wait">
              {!scanComplete && !isScanning && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group cursor-pointer border-2 border-dashed border-primary/30 hover:border-primary transition-all">
                    <Camera className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Upload a Selfie</h3>
                  <p className="text-gray-400 font-medium mb-10">We'll use this to match your face in our event albums.</p>
                  <button onClick={startScan} className="btn-primary w-full py-5 text-lg">
                    Start AI Face Detection
                  </button>
                </motion.div>
              )}

              {isScanning && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="relative w-48 h-48 mx-auto mb-10">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <motion.div 
                      className="absolute inset-0 border-t-4 border-primary rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scan className="w-16 h-16 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Analyzing Face Patterns...</h3>
                  <p className="text-gray-400 font-medium">Searching through 5,000+ high-res event photos</p>
                </motion.div>
              )}

              {scanComplete && !showPayment && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <UserCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">12 Photos Found!</h3>
                  <p className="text-gray-400 font-medium mb-10">We found your matches from "Grand Wedding Gala 2024".</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                        <img src={`https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&q=80`} className="w-full h-full object-cover blur-sm group-hover:blur-0 transition-all" alt="Match" />
                        <div className="absolute inset-0 bg-dark/40 flex items-center justify-center">
                           <Lock className="w-5 h-5 text-white/50" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setShowPayment(true)} className="btn-primary w-full py-5 text-lg">
                    Unlock All Photos (₹299)
                  </button>
                </motion.div>
              )}

              {showPayment && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="bg-white rounded-3xl p-8 text-dark mb-8">
                    <h3 className="text-xl font-black mb-6 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 mr-2 text-primary" /> Secure Checkout
                    </h3>
                    <div className="space-y-4 text-left mb-8">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-400 font-bold uppercase text-xs">Items</span>
                        <span className="font-black">12 Digital Photos</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-400 font-bold uppercase text-xs">Event</span>
                        <span className="font-black">Gala 2024</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="font-black text-lg">Total</span>
                        <span className="font-black text-lg text-primary">₹299</span>
                      </div>
                    </div>
                    <button className="w-full bg-dark text-white py-4 rounded-2xl font-black flex items-center justify-center group">
                      Proceed to Pay <CheckCircle className="w-5 h-5 ml-2 text-emerald-500" />
                    </button>
                  </div>
                  <button onClick={() => setScanComplete(true)} className="text-gray-500 font-bold hover:text-white transition-colors">Go Back</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIPhotoPay;
