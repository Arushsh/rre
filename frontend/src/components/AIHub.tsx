import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Camera, Zap, Brain, Sliders, ArrowRight, CheckCircle, Loader2, Image as ImageIcon, X, Download } from 'lucide-react';

const AIHub = () => {
  const [activeTab, setActiveTab] = useState('face-search');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = () => {
    if (activeTab === 'face-search' && !selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setTimeout(() => {
      setIsProcessing(false);
      if (activeTab === 'face-search') {
        // In a real app, we'd send selectedFile to AI_URL
        setResult([
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', 
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
          'https://images.unsplash.com/photo-1465495910483-0d6749ee9f4a?w=800&q=80'
        ]);
      } else if (activeTab === 'caption-gen') {
        setResult("A match made in heaven. ✨ Captured at Rajat Raj Entertainment. ❤️ #WeddingVibes #RREEntertainment");
      } else {
        setResult(true);
      }
    }, 3000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80" className="w-full h-full object-cover opacity-40 animate-slow-zoom" alt="AI Hub" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>
        
        <div className="satyam-container relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-8">
              <Zap className="w-4 h-4 mr-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Future of Media</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-9xl mb-8 italic">AI <span className="text-primary">Hub.</span></h1>
            <p className="text-xl md:text-2xl text-neutral-400 font-medium max-w-2xl mx-auto">
              Welcome to the RRE AI Engine. Experience the power of artificial intelligence in photography and music.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Hub */}
      <section className="py-24 md:py-32">
        <div className="satyam-container">
          <div className="max-w-5xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                { id: 'face-search', label: 'Face Search', icon: Search },
                { id: 'caption-gen', label: 'Caption Gen', icon: Brain },
                { id: 'audio-cleanup', label: 'Audio Cleanup', icon: Sliders },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setResult(null); }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${activeTab === tab.id ? 'bg-black text-white shadow-xl' : 'bg-secondary text-neutral-400 hover:bg-neutral-200'}`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Hub Content */}
            <div className="bg-secondary rounded-[4rem] p-8 md:p-20 shadow-premium border border-neutral-100 min-h-[500px] flex flex-col items-center justify-center text-center">
              <AnimatePresence mode="wait">
                {!result && !isProcessing && (
                  <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-lg">
                    {previewUrl && activeTab === 'face-search' ? (
                      <div className="relative w-40 h-40 mx-auto mb-10 group">
                        <img src={previewUrl} className="w-full h-full object-cover rounded-[2rem] shadow-lg" alt="Preview" />
                        <button 
                          onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
                        <Camera className="w-10 h-10 text-primary" />
                      </div>
                    )}
                    
                    <h3 className="heading-serif text-3xl md:text-4xl mb-6 italic">
                      {previewUrl && activeTab === 'face-search' ? "Photo Ready!" : "Ready to start?"}
                    </h3>
                    
                    <p className="text-neutral-500 font-medium mb-12">
                      {activeTab === 'face-search' && (previewUrl ? "We're ready to search all galleries for your face." : "Upload a photo to find every moment you were captured in our events.")}
                      {activeTab === 'caption-gen' && "Our AI will analyze your photo and generate the perfect viral caption."}
                      {activeTab === 'audio-cleanup' && "Upload a noisy voice note and let our AI make it studio-quality."}
                    </p>

                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />

                    <button onClick={handleProcess} className="btn-satyam-black !rounded-full !px-12">
                      {activeTab === 'face-search' && !previewUrl ? "Upload Photo" : "Initialize AI Engine"} 
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-10">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                      <motion.div 
                        className="absolute inset-0 border-t-4 border-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <h3 className="heading-serif text-3xl italic mb-4">Processing...</h3>
                    <p className="text-neutral-400 font-black uppercase tracking-widest text-xs">RRE Neural Engine is working</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-neutral-100 max-w-3xl mx-auto">
                      <div className="flex items-center gap-3 mb-10 justify-center">
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Analysis Complete</span>
                      </div>

                      {activeTab === 'face-search' && (
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                          {result.map((url: string, i: number) => (
                            <div key={i} className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg group relative">
                              <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Match" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                <ImageIcon className="w-8 h-8 text-white" />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `RRE-Match-${i}.jpg`;
                                    link.click();
                                  }}
                                  className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'caption-gen' && (
                        <div className="p-8 bg-secondary rounded-2xl text-xl font-medium italic text-black">
                          "{result}"
                        </div>
                      )}

                      {activeTab === 'audio-cleanup' && (
                        <div className="py-12">
                          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden mb-6">
                            <motion.div 
                              className="h-full bg-black"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 2 }}
                            />
                          </div>
                          <p className="text-sm font-black uppercase tracking-widest text-neutral-400">Audio Restored (98% Clarity)</p>
                        </div>
                      )}

                      <button onClick={() => setResult(null)} className="mt-12 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:opacity-50 transition-opacity">
                        Try Another Task
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIHub;
