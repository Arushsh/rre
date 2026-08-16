import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Clock, 
  MapPin, 
  User as UserIcon,
  Zap, 
  Star, 
  ChevronRight, 
  LogOut, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Camera, 
  Image as ImageIcon,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── PRESERVED: Login via GET /api/users/login/:email ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/login/${email}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
        toast.success('Welcome back!');
      } else {
        toast.error('Client not found. Use an email registered by Admin.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── UNREGISTERED / LOGGED-OUT STATE ──
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden">
        {/* Subtle ambient light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/2 rounded-full blur-[140px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
          className="max-w-md w-full glass-strong p-8 sm:p-12 rounded-3xl border border-white/12 text-center relative z-10 space-y-8"
        >
          <div className="w-16 h-16 rounded-2xl glass-subtle border border-white/15 flex items-center justify-center mx-auto text-white/70">
            <UserIcon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Private Access</span>
            <h1 className="heading-serif text-3xl sm:text-4xl font-bold text-white">Client Portal.</h1>
            <p className="text-sm text-white/50 leading-relaxed">
              Enter your registered email to access your personal memory vault and event collections.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label htmlFor="client-email" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input 
                  id="client-email"
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating…' : <>Access My Portal <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
            Authorized RRE Premium Clients Only
          </p>
        </motion.div>
      </div>
    );
  }

  // ── AUTHENTICATED CLIENT PORTAL ──
  const clientFirstName = user?.name ? user.name.split(' ')[0] : 'Client';

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-28 pb-20">
      <div className="satyam-container space-y-14">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-8 border-b border-white/10 gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-subtle border border-white/15 text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Private Client Portal</span>
            </div>
            <h1 className="display-title text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              NAMASTE, <br />
              <span className="italic font-normal text-white/70">{clientFirstName}.</span>
            </h1>
            <p className="editorial-subhead text-base text-white/50 leading-relaxed">
              Welcome back to your private archive. View your captured moments, favorites, and project updates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/ai-hub" 
              className="flex items-center gap-2 px-5 py-3 glass-subtle border border-white/20 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:border-white/40 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-[#00E5FF]" /> AI Face Search
            </Link>
            <button 
              onClick={() => setIsLoggedIn(false)} 
              aria-label="Log Out"
              className="flex items-center gap-2 px-5 py-3 glass-subtle border border-white/15 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* ── SUMMARY METRICS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-8 rounded-3xl glass-strong border border-white/12 space-y-4"
          >
            <div className="flex items-center justify-between text-white/40">
              <div className="w-11 h-11 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/60">
                <Calendar className="w-5 h-5" />
              </div>
              <TrendingUp className="w-5 h-5 text-white/25" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">{user.myEvents?.length || 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">Active Events</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.08 }} 
            className="p-8 rounded-3xl glass-strong border border-white/12 space-y-4"
          >
            <div className="flex items-center justify-between text-white/40">
              <div className="w-11 h-11 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/60">
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              <ImageIcon className="w-5 h-5 text-white/25" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">{user.favorites?.length || 0}</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">Saved Captures</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.16 }} 
            className="p-8 rounded-3xl glass-strong border border-white/12 space-y-4"
          >
            <div className="flex items-center justify-between text-white/40">
              <div className="w-11 h-11 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-amber-400">
                <Star className="w-5 h-5" />
              </div>
              <Camera className="w-5 h-5 text-white/25" />
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">Premium</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mt-1">Client Tier</p>
            </div>
          </motion.div>
        </div>

        {/* ── 2-COLUMN MAIN CONTENT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Events & Favorites */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* My Events */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-white/50" />
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">My Collections & Events</h2>
              </div>
              
              <div className="space-y-4">
                {user.myEvents?.map((event: any, i: number) => (
                  <Link 
                    to={`/gallery/${event.slug}`} 
                    key={i} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 glass-subtle border border-white/10 rounded-3xl hover:border-white/25 hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="w-full sm:w-36 h-36 shrink-0 rounded-2xl overflow-hidden border border-white/10 relative">
                      <img 
                        src={event.coverImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={event.title} 
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <h3 className="heading-serif text-2xl font-bold text-white group-hover:text-white/80 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> 
                          {new Date(event.eventDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full glass-subtle border border-white/15 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/10 transition-all self-end sm:self-center">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </Link>
                ))}

                {(!user.myEvents || user.myEvents.length === 0) && (
                  <div className="py-16 text-center glass-subtle border border-white/10 rounded-3xl space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">No Events Assigned Yet</p>
                    <p className="text-xs text-white/20">Your upcoming project collections will appear here.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Photos */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-400" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Favorite Captures</h2>
                </div>
                {user.favorites?.length > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 glass-subtle px-3 py-1 rounded-full border border-white/10">
                    {user.favorites.length} Saved
                  </span>
                )}
              </div>

              {user.favorites && user.favorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {user.favorites.map((url: string, i: number) => (
                    <div key={i} className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                      <img src={url} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-3">
                        <Heart className="text-red-400 fill-red-400 w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-14 text-center glass-subtle rounded-3xl border border-white/10 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">No Favorites Yet</p>
                  <p className="text-xs text-white/20">Favorite photos in your gallery to view them in your private shortlist.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Actions & Info */}
          <div className="space-y-6">
            <div className="glass-strong border border-white/12 rounded-3xl p-8 space-y-6">
              <h3 className="heading-serif text-2xl font-bold text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/ai-hub" 
                  className="flex items-center gap-4 p-4 glass-subtle border border-white/10 rounded-2xl hover:border-white/25 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/60 group-hover:text-[#00E5FF] transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white">AI Face Search</p>
                    <p className="text-white/40 text-xs">Find your captures instantly</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </Link>

                <Link 
                  to="/booking" 
                  className="flex items-center gap-4 p-4 glass-subtle border border-white/10 rounded-2xl hover:border-white/25 hover:bg-white/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-white">Book New Shoot</p>
                    <p className="text-white/40 text-xs">Schedule next production</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </Link>
              </div>
            </div>

            <div className="glass-subtle border border-white/10 rounded-3xl p-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 block">The RRE Standard</span>
              <h3 className="heading-serif text-xl font-bold text-white">Cinematic Distinction</h3>
              <p className="text-xs text-white/45 leading-relaxed">
                Rajat Raj Entertainment delivers world-class creative production, cinematic storytelling, and state-of-the-art AI indexing for premier clientele.
              </p>
              <div className="flex items-center gap-2 text-amber-400/90 pt-2 text-xs font-bold uppercase tracking-wider">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>5-Star Premier Studio</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
