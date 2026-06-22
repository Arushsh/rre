import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Download, 
  Share2, 
  Grid, 
  Layout, 
  Clock, 
  MapPin, 
  User as UserIcon,
  Search,
  Zap,
  Star,
  DownloadCloud,
  ChevronRight,
  LogOut,
  Mail,
  Calendar,
  TrendingUp,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users/login/${email}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
      } else {
        alert('Client not found. Use an email registered by Admin.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
          <UserIcon className="w-12 h-12 text-white" />
        </div>
        <h1 className="heading-serif text-4xl mb-4">Client Portal</h1>
        <p className="text-gray-500 font-medium mb-10 text-lg">Enter your registered email to access your memories</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="w-full pl-14 pr-6 py-5 bg-gray-50 rounded-2xl border-none font-bold focus:ring-4 focus:ring-primary/20 focus:bg-white transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full btn-quote py-5 text-lg">Access My Portal</button>
        </form>
        <p className="mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Only for RRE Premium Clients</p>
      </motion.div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-20 gap-10">
          <div className="w-full lg:w-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary mb-6 shadow-sm">
              <UserIcon className="w-5 h-5 mr-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Client Portal</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-7xl font-light text-dark tracking-tight mb-4">
              Namaste, <span className="italic font-medium">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">Welcome back to your memory vault</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/ai-hub" className="btn-quote !flex items-center group !px-8 !py-5">
              <Zap className="w-5 h-5 mr-3" /> AI Face Search
            </Link>
            <button onClick={() => setIsLoggedIn(false)} className="btn-satyam-white !px-8 !py-5 flex items-center gap-3">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 bg-gradient-to-br from-black to-gray-900 rounded-[3rem] text-white shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <TrendingUp className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-6xl font-black tracking-tighter mb-3">{user.myEvents?.length || 0}</p>
            <p className="text-white/60 font-medium text-sm uppercase tracking-[0.4em]">Active Events</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-10 bg-gradient-to-br from-gray-50 to-white rounded-[3rem] border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <Heart className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-6xl font-black tracking-tighter mb-3 text-dark">{user.favorites?.length || 0}</p>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-[0.4em]">Saved Photos</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-10 bg-gradient-to-br from-gray-50 to-white rounded-[3rem] border border-gray-100 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
                <Camera className="w-8 h-8 text-yellow-600" />
              </div>
              <Star className="w-8 h-8 text-yellow-200" />
            </div>
            <p className="text-6xl font-black tracking-tighter mb-3 text-dark">Premium</p>
            <p className="text-gray-500 font-medium text-sm uppercase tracking-[0.4em]">Client Status</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Events */}
          <div className="lg:col-span-2 space-y-16">
            <div>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.45em] text-gray-400">My Events</h2>
                </div>
              </div>
              
              <div className="space-y-6">
                {user.myEvents?.map((event: any, i: number) => (
                  <Link to={`/gallery/${event.slug}`} key={i} className="group flex items-center gap-8 p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] hover:border-black/10 hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                    <div className="w-40 h-40 overflow-hidden shrink-0 rounded-2xl border border-gray-100">
                      <img src={event.coverImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={event.title} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="heading-serif text-3xl mb-4 group-hover:italic transition-all">
                        {event.title}
                      </h3>
                      <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(event.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long' })}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                      <ChevronRight className="w-7 h-7" />
                    </div>
                  </Link>
                ))}
                {user.myEvents?.length === 0 && (
                  <div className="p-20 text-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300 uppercase font-black tracking-widest text-sm">
                    No events assigned to you yet.
                  </div>
                )}
              </div>
            </div>

            {/* Favorites Section */}
            <div>
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.45em] text-gray-400">Favorite Photos</h2>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-4 py-2 rounded-full">{user.favorites?.length || 0} Saved</span>
              </div>
              {user.favorites?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {user.favorites.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-[4/5 group overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                      <img src={url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Heart className="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 w-6 h-6 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center bg-gradient-to-br from-gray-50 to-white rounded-[3rem] text-gray-400 text-[11px] font-black uppercase tracking-widest border border-gray-100">
                  Start liking photos in your gallery to see them here.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-black to-gray-900 text-white p-10 rounded-[3rem]">
              <h3 className="heading-serif text-3xl mb-8 italic">Quick Actions</h3>
              <div className="space-y-6">
                <Link to="/ai-hub" className="flex items-center gap-5 p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">AI Face Search</p>
                    <p className="text-white/50 text-sm">Find your photos instantly</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </Link>
                <Link to="/booking" className="flex items-center gap-5 p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">Book New Shoot</p>
                    <p className="text-white/50 text-sm">Capture new memories</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </Link>
              </div>
            </div>

            <div className="p-10 bg-gradient-to-br from-gray-50 to-white rounded-[3rem] border border-gray-100">
              <h3 className="heading-serif text-2xl mb-6">About RRE</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Rajat Raj Entertainment is dedicated to preserving your most precious moments with cinematic excellence and cutting-edge AI technology.
              </p>
              <div className="flex items-center gap-3 text-primary font-bold">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>5-Star Rated Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
