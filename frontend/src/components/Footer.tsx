import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone, ArrowUp, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer id="contact" className="bg-[#050708] border-t border-white/10 pt-20 pb-12 relative overflow-hidden text-white">
      {/* Vantage subtle dark teal glow background */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="satyam-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex flex-col inline-block group">
              <span className="text-2xl font-black tracking-[0.35em] text-white leading-none group-hover:text-[#00E5FF] transition-colors">
                RAJATRAJ
              </span>
              <span className="text-[0.6rem] font-extrabold tracking-[0.45em] text-white/50 group-hover:text-white transition-colors uppercase mt-1">
                ENTERTAINMENT
              </span>
            </Link>
            
            <p className="text-sm font-normal text-white/60 leading-relaxed max-w-xs">
              India's premier AI-integrated media house. Redefining how memories are captured, stories are told, and music is created.
            </p>
            
            <div className="flex items-center space-x-3 pt-2">
              {[
                { icon: Instagram, href: "https://www.instagram.com/kundan_rajat_raj?utm_source=qr&igsh=MXYzamZ0NXpsdDZqYQ==" },
                { icon: Youtube, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                    aria-label="Social Link"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-[#00E5FF] mb-8">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Our Story', path: '/about' },
                { label: 'Talent Hunt', path: '/talent-hunt' },
                { label: 'AI Hub', path: '/ai-hub' },
                { label: 'Book Project', path: '/booking' },
                { label: 'Client Portal', path: '/dashboard' }
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.path} 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-[#00E5FF] mb-8">
              Expertise
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Photography', path: '/photography' },
                { label: 'Videography', path: '/videography' },
                { label: 'Music Studio', path: '/audio-recording' },
                { label: 'Music Production', path: '/music-production' },
                { label: 'Live Streaming', path: '/live-streaming' }
              ].map((item) => (
                <li key={item.label}>
                  <Link 
                    to={item.path} 
                    className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-[#00E5FF] mb-8">
              Connect
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-[#00E5FF] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-white/60 leading-relaxed">
                  Near Dildarnagar Railway Station,<br />Behind Sayar Maa Mandir,<br />PIN — 232326
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-[#00E5FF] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+918898134049" className="text-xs font-medium text-white/60 hover:text-white transition-colors">
                  +91 88981 34049
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg glass-subtle flex items-center justify-center text-[#00E5FF] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:rajatrajentertainment@gmail.com" className="text-xs font-medium text-white/60 hover:text-white transition-colors break-all">
                  rajatrajentertainment@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 text-center sm:text-left">
            © 2026 Rajat Raj Entertainment. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/admin/login" 
              className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors"
            >
              Admin Access
            </Link>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
