import React from 'react';
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-white pt-16 sm:pt-24 pb-8 sm:pb-12 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="satyam-container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-12 sm:mb-24">

          {/* Brand — full width on mobile */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6 sm:mb-10">
              <span className="text-2xl sm:text-3xl font-black text-black tracking-tighter italic">RRE<span className="text-primary">.</span></span>
            </div>
            <p className="text-neutral-400 mb-6 sm:mb-10 leading-relaxed font-medium text-sm max-w-xs">
              India's premier AI-integrated media house. Redefining how memories are captured, stories are told, and music is made.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {[
                { icon: Instagram, href: "https://www.instagram.com/kundan_rajat_raj?utm_source=qr&igsh=MXYzamZ0NXpsdDZqYQ==" },
                { icon: Youtube, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-secondary flex items-center justify-center text-neutral-400 hover:bg-black hover:text-white hover:shadow-2xl transition-all duration-500"
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-black font-black text-[10px] mb-6 sm:mb-10 uppercase tracking-[0.4em]">Company</h4>
            <ul className="space-y-4 sm:space-y-6">
              {[
                { label: 'Our Story', path: '/about' },
                { label: 'Talent Hunt', path: '/talent-hunt' },
                { label: 'AI Hub', path: '/ai-hub' },
                { label: 'Booking', path: '/booking' }
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="text-neutral-500 hover:text-black transition-colors font-black uppercase text-[10px] tracking-widest">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services links */}
          <div>
            <h4 className="text-black font-black text-[10px] mb-6 sm:mb-10 uppercase tracking-[0.4em]">Expertise</h4>
            <ul className="space-y-4 sm:space-y-6">
              {[
                { label: 'Photography', path: '/photography' },
                { label: 'Videography', path: '/videography' },
                { label: 'Music Studio', path: '/audio-recording' },
                { label: 'Live Stream', path: '/live-streaming' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-neutral-500 hover:text-black transition-colors font-black uppercase text-[10px] tracking-widest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-black font-black text-[10px] mb-6 sm:mb-10 uppercase tracking-[0.4em]">Connect</h4>
            <ul className="space-y-4 sm:space-y-8">
              <li className="flex items-start gap-4 sm:gap-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-secondary flex items-center justify-center text-black shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-neutral-500 text-sm font-medium leading-relaxed">Near Dildarnagar Railway Station,<br/>Behind Sayar Maa Mandir,<br/>PIN — 232326</span>
              </li>
              <li className="flex items-center gap-4 sm:gap-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-secondary flex items-center justify-center text-black shrink-0">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <a href="tel:+918898134049" className="text-neutral-500 text-sm font-medium hover:text-black transition-colors">+91 88981 34049</a>
              </li>
              <li className="flex items-center gap-4 sm:gap-6">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-secondary flex items-center justify-center text-black shrink-0">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <a href="mailto:rajatrajentertainment@gmail.com" className="text-neutral-500 text-sm font-medium hover:text-black transition-colors break-all sm:break-normal">rajatrajentertainment@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-12 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300">
            © 2026 Rajat Raj Entertainment. All rights reserved.
          </p>
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/admin/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-300 hover:text-black transition-colors">Admin Access</Link>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-neutral-100 flex items-center justify-center text-neutral-300 hover:border-black hover:text-black transition-all"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
