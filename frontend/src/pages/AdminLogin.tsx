import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcoded credentials for demo security
    setTimeout(() => {
      if (username === 'admin' && password === 'rre@2026') {
        localStorage.setItem('isAdminAuthenticated', 'true');
        navigate('/admin');
      } else {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-premium border border-gray-100"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="heading-serif text-3xl mb-2 italic">Admin Portal</h1>
          <p className="text-gray-400 font-medium">Restricted Access</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
          >
            <ShieldAlert className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              placeholder="Admin ID" 
              required
              className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-primary/20"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-quote py-5 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Access Dashboard <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="mt-10 text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.3em]">
          Powered by Rajat Raj Entertainment
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
