import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, AlertCircle, RefreshCw } from 'lucide-react';
import { API_URL } from '../config/api';

type Message = { role: 'user' | 'assistant'; text: string; error?: boolean };

const TypingDots = () => (
  <div className="flex items-center gap-1 py-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-white/30"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </div>
);

const AIAssistant = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Namaste! I am your RRE AI Assistant. Ask me anything about our photography, music production, pricing, or how to find your event photos.',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── PRESERVED: actual API call to /api/ai/chat ──
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I'm having trouble connecting. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    // Remove last error message, re-send
    setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1));
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    setInput(lastUser.text);
    setTimeout(() => handleSend(fakeEvent), 0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">

      {/* ── CHAT PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 w-[340px] sm:w-[390px] h-[520px] flex flex-col rounded-3xl overflow-hidden glass-floating border border-white/20 shadow-2xl"
            role="dialog"
            aria-label="RRE AI Assistant"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-white/5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">RRE AI</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                className="w-7 h-7 rounded-full glass-subtle border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:rotate-90 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/40 backdrop-blur-xl"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                      {msg.error ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-white/60" />
                      )}
                    </div>
                  )}
                  <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed font-medium ${
                        msg.role === 'user'
                          ? 'bg-white text-black rounded-tr-sm'
                          : msg.error
                            ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-tl-sm'
                            : 'bg-white/8 border border-white/10 text-white/85 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.error && (
                      <button
                        onClick={retry}
                        className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors mt-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-white/60" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 justify-start"
                  aria-label="RRE AI is thinking"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white/60" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="px-4 py-4 bg-black/50 border-t border-white/10 shrink-0"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something…"
                  aria-label="Message input"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-white/6 border border-white/12 hover:border-white/20 focus:border-white/35 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/25 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TRIGGER BUTTON ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative w-14 h-14 rounded-2xl glass-floating border border-white/25 shadow-2xl flex items-center justify-center text-white"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Online indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
        )}
      </motion.button>

    </div>
  );
};

export default AIAssistant;
