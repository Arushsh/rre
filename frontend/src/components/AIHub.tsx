import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, Camera, Brain, Sliders,
  ArrowRight, CheckCircle, Image as ImageIcon,
  X, Download, Loader2
} from 'lucide-react';
import GlassCard from './ui/GlassCard';

// IMPORTANT: handleProcess uses setTimeout simulation — no real AI API calls exist.
// Face search results are hardcoded Unsplash URLs.
// Caption gen and Audio cleanup return static mock values.
// This is preserved exactly as-is from the original implementation.
// Do NOT fabricate real AI API calls.

const TABS = [
  { id: 'face-search', label: 'Face Search', icon: Search, desc: 'Find yourself in our event galleries' },
  { id: 'caption-gen', label: 'Caption Generator', icon: Brain, desc: 'AI-generated social media captions' },
  { id: 'audio-cleanup', label: 'Audio Cleanup', icon: Sliders, desc: 'Remove noise from recordings' },
];

const AIHub = () => {
  const [activeTab, setActiveTab] = useState('face-search');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // ── PRESERVED: file handling ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => { setPreviewUrl(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  // ── PRESERVED: simulation logic (no real API exists) ──
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
        setResult([
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
          'https://images.unsplash.com/photo-1465495910483-0d6749ee9f4a?w=800&q=80',
        ]);
      } else if (activeTab === 'caption-gen') {
        setResult("A match made in heaven. ✨ Captured at Rajat Raj Entertainment. ❤️ #WeddingVibes #RREEntertainment");
      } else {
        setResult(true);
      }
    }, 3000);
  };

  const resetTab = (tabId: string) => {
    setActiveTab(tabId);
    setResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const activeTabData = TABS.find(t => t.id === activeTab)!;

  return (
    <div className="bg-[#000000] text-white">

      {/* ── CINEMATIC HERO ── */}
      <section className="relative min-h-[75vh] flex flex-col justify-end overflow-hidden pb-16 md:pb-24">
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=85"
            alt="RRE AI Hub"
            className="w-full h-full object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </div>

        <div className="satyam-container relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-[#00E5FF]/25 text-[10px] font-bold uppercase tracking-[0.35em] text-[#00E5FF]/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Intelligence</span>
            </div>

            <h1 className="display-hero text-white tracking-tighter leading-none">
              INTELLIGENCE <br />
              <span className="italic font-normal text-white/75">FOR THE CREATIVE</span><br />
              EXPERIENCE.
            </h1>

            <p className="editorial-subhead text-base sm:text-xl text-white/60 max-w-xl font-normal leading-relaxed">
              RRE's AI tools help you find your event photos, generate social captions, and enhance your recordings — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE HUB ── */}
      <section className="py-16 md:py-24 border-t border-white/10">
        <div className="satyam-container">
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Tab bar */}
            <div className="flex flex-wrap gap-3">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => resetTab(tab.id)}
                    className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                      isActive
                        ? 'bg-white text-black border-white'
                        : 'glass-subtle border-white/12 text-white/50 hover:text-white hover:border-white/25'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Hub panel */}
            <div className="glass-strong border border-white/12 rounded-3xl overflow-hidden">
              {/* Panel header */}
              <div className="px-8 md:px-12 py-6 border-b border-white/10 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/35">AI Feature</span>
                  <p className="text-sm font-bold text-white">{activeTabData.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[#00E5FF]">
                  <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Preview</span>
                </div>
              </div>

              {/* Panel content */}
              <div className="min-h-[420px] flex flex-col items-center justify-center p-8 md:p-16">
                <AnimatePresence mode="wait">

                  {/* IDLE */}
                  {!result && !isProcessing && (
                    <motion.div
                      key={`idle-${activeTab}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="text-center max-w-sm space-y-8"
                    >
                      {/* Preview image for face search */}
                      {previewUrl && activeTab === 'face-search' ? (
                        <div className="relative w-36 h-36 mx-auto group">
                          <img
                            src={previewUrl}
                            alt="Selected photo"
                            className="w-full h-full object-cover rounded-2xl border border-white/20"
                          />
                          <button
                            onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                            aria-label="Remove photo"
                            className="absolute -top-2 -right-2 w-7 h-7 bg-black border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto">
                          {activeTab === 'face-search' && <Camera className="w-9 h-9 text-white/40" />}
                          {activeTab === 'caption-gen' && <Brain className="w-9 h-9 text-white/40" />}
                          {activeTab === 'audio-cleanup' && <Sliders className="w-9 h-9 text-white/40" />}
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="heading-serif text-2xl font-bold text-white">
                          {previewUrl && activeTab === 'face-search' ? 'Photo Ready' : 'Ready to Start'}
                        </h3>
                        <p className="text-sm text-white/45 leading-relaxed">
                          {activeTab === 'face-search' && (previewUrl
                            ? "We're ready to search event galleries for your face."
                            : "Upload a photo to find every moment you were captured at our events.")}
                          {activeTab === 'caption-gen' && "Generate a social media caption powered by AI."}
                          {activeTab === 'audio-cleanup' && "Remove background noise from a voice note or recording."}
                        </p>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />

                      <button
                        onClick={handleProcess}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors mx-auto"
                      >
                        {activeTab === 'face-search' && !previewUrl ? 'Upload Photo' : 'Run AI'}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* PROCESSING */}
                  {isProcessing && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-8"
                    >
                      <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 border-2 border-[#00E5FF]/15 rounded-full" />
                        <motion.div
                          className="absolute inset-0 border-t-2 border-[#00E5FF] rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-7 h-7 text-[#00E5FF]/70" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="heading-serif text-2xl font-bold text-white">Analyzing…</h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">RRE AI is working</p>
                      </div>
                    </motion.div>
                  )}

                  {/* RESULT */}
                  {result && !isProcessing && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full space-y-8"
                    >
                      <div className="flex items-center justify-center gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Complete</span>
                      </div>

                      {/* Face search result */}
                      {activeTab === 'face-search' && Array.isArray(result) && (
                        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                          {result.map((url: string, i: number) => (
                            <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden group relative">
                              <img
                                src={url}
                                alt={`Match ${i + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `RRE-Match-${i}.jpg`;
                                    link.click();
                                  }}
                                  aria-label="Download photo"
                                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Caption result */}
                      {activeTab === 'caption-gen' && typeof result === 'string' && (
                        <div className="max-w-md mx-auto glass-subtle border border-white/10 rounded-2xl p-6 text-center space-y-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Generated Caption</span>
                          <p className="text-white/85 text-base leading-relaxed italic">"{result}"</p>
                        </div>
                      )}

                      {/* Audio cleanup result */}
                      {activeTab === 'audio-cleanup' && result === true && (
                        <div className="max-w-sm mx-auto space-y-5">
                          <div className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Noise Removed</span>
                              <span className="text-sm font-black text-emerald-400">Done</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          onClick={() => resetTab(activeTab)}
                          className="text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors border-b border-white/15 pb-0.5"
                        >
                          Try Another
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

    </div>
  );
};

export default AIHub;
