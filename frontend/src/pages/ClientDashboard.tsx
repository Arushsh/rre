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
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simple "Login" simulation
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-premium border border-gray-100 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <UserIcon className="w-10 h-10 text-primary" />
          </div>
          <h1 className="heading-serif text-3xl mb-4">Client Portal</h1>
          <p className="text-gray-400 font-medium mb-8">Enter your registered email to access your memories.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl border-none font-bold focus:ring-2 focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full btn-quote py-4">Access My Portal</button>
          </form>
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-300">Only for RRE Premium Clients</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-gray-100 pb-12">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
              <UserIcon className="w-4 h-4 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Client Portal</span>
            </div>
            <h1 className="heading-serif text-5xl md:text-7xl font-light text-dark tracking-tight">
              Namaste, <span className="italic">{user.name.split(' ')[0]}</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/ai-hub" className="btn-quote group">
              <Zap className="w-4 h-4 mr-3" /> AI Face Search
            </Link>
            <button onClick={() => setIsLoggedIn(false)} className="btn-satyam-white !px-6 !py-3">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Events */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">My Events</h2>
              </div>
              
              <div className="space-y-6">
                {user.myEvents?.map((event: any, i: number) => (
                  <Link to={`/gallery/${event.slug}`} key={i} className="group flex items-center gap-8 p-6 bg-gray-50 border border-gray-100 hover:border-black transition-all">
                    <div className="w-32 h-32 overflow-hidden shrink-0">
                      <img src={event.coverImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="heading-serif text-2xl mb-2 group-hover:italic transition-all">{event.title}</h3>
                      <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {new Date(event.eventDate).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-black group-hover:translate-x-2 transition-all" />
                  </Link>
                ))}
                {user.myEvents?.length === 0 && (
                  <div className="p-20 text-center border-2 border-dashed border-gray-100 text-gray-300 uppercase font-black tracking-widest text-xs">
                    No events assigned to you yet.
                  </div>
                )}
              </div>
            </div>

            {/* Favorites Section */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Favorite Photos</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.favorites?.length || 0} Saved</span>
              </div>
              {user.favorites?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {user.favorites.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square group overflow-hidden">
                      <img src={url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-gray-50 text-gray-300 text-[10px] font-black uppercase tracking-widest">
                  Start liking photos in your gallery to see them here.
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-8">
            <div className="bg-black text-white p-10">
              <h3 className="heading-serif text-2xl mb-8 italic">Memory Stats</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                    <DownloadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter">{user.myEvents?.length || 0}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
