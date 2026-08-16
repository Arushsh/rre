import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── PRESERVED: Authentication flow ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'admin' && password === 'rre@2026') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid credentials. Check your Admin ID and password.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/2 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full glass-strong rounded-3xl p-8 sm:p-12 border border-white/12 text-center relative z-10 space-y-8"
      >
        <div className="w-16 h-16 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto text-white/70">
          <ShieldCheck className="w-8 h-8 text-white/80" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Control Center</span>
          <h1 className="heading-serif text-3xl sm:text-4xl font-bold text-white">Admin Access.</h1>
          <p className="text-sm text-white/50 leading-relaxed">
            Secure management console for Rajat Raj Entertainment.
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -8 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold text-left"
            role="alert"
          >
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Admin ID
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input 
                type="text" 
                placeholder="Admin ID" 
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input 
                type="password" 
                placeholder="••••••••" 
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Access Workspace <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 pt-2">
          Rajat Raj Entertainment • Secure Operations
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
