import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Youtube, ChevronDown, Camera, Video, Mic2, Music, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceLinks = [
    { name: 'Photography', href: '/photography', icon: Camera, desc: 'Professional Photoshoots' },
    { name: 'Videography', href: '/videography', icon: Video, desc: 'Cinematic Films & BTS' },
    { name: 'Audio Recording', href: '/audio-recording', icon: Mic2, desc: 'Studio Vocal Sessions' },
    { name: 'Music Production', href: '/music-production', icon: Music, desc: 'Beats & Arrangement' },
    { name: 'Live Streaming', href: '/live-streaming', icon: Radio, desc: 'Multi-cam Broadcast' },
  ];

  const mainLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/booking' },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="satyam-container flex justify-between items-center">
        {/* Minimalist Logo */}
        <Link to="/" className="flex flex-col items-center group">
          <span className="text-2xl font-light tracking-[0.5em] text-black leading-none mb-1">RAJATRAJ</span>
          <span className="text-[0.6rem] font-bold tracking-[0.4em] text-neutral-400 group-hover:text-black transition-colors uppercase ml-2">ENTERTAINMENT</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-10">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-black' : ''}`}>Home</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'text-black' : ''}`}>About</Link>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShowServices(true)}
            onMouseLeave={() => setShowServices(false)}
          >
            <button className={`nav-link flex items-center gap-1 ${serviceLinks.some(s => s.href === location.pathname) ? 'text-black' : ''}`}>
              Services <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showServices ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showServices && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-6"
                >
                  <div className="bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] border border-neutral-50 p-6 w-[450px] grid grid-cols-1 gap-2">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-300 mb-4 px-4">Our Creative Services</div>
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="group flex items-center gap-6 p-4 hover:bg-neutral-50 transition-all"
                        onClick={() => setShowServices(false)}
                      >
                        <div className="w-12 h-12 bg-neutral-50 flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white">
                          <service.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black mb-1">{service.name}</p>
                          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">{service.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'text-black' : ''}`}>Gallery</Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'text-black' : ''}`}>My Portal</Link>
          
          <Link to="/booking" className="btn-quote !px-6 !py-2.5 !text-[14px] ml-4">
            Book Now
          </Link>
          
          <div className="flex items-center space-x-6 border-l border-neutral-100 pl-8 ml-4">
            <a href="https://www.instagram.com/kundan_rajat_raj?utm_source=qr&igsh=MXYzamZ0NXpsdDZqYQ==" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-black transition-all hover:scale-110"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-neutral-400 hover:text-black transition-all hover:scale-110"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-black p-2">
          {isOpen ? <X className="w-8 h-8 stroke-[1px]" /> : <Menu className="w-8 h-8 stroke-[1px]" />}
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[150] transition-all duration-700 lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute top-8 right-8">
          <button onClick={() => setIsOpen(false)} className="text-black p-2 hover:rotate-90 transition-transform duration-300">
            <X className="w-10 h-10 stroke-[1px]" />
          </button>
        </div>
        <div className="h-full flex flex-col justify-center items-center space-y-6 px-10 text-center overflow-y-auto pt-20">
          <Link to="/" className="text-3xl font-light tracking-[0.3em] uppercase" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="text-3xl font-light tracking-[0.3em] uppercase" onClick={() => setIsOpen(false)}>About</Link>
          
          <div className="w-full max-w-xs">
            <button 
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex justify-center items-center gap-4 text-3xl font-light tracking-[0.3em] uppercase py-4"
            >
              Services <ChevronDown className={`w-6 h-6 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {mobileServicesOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4 pt-4 border-t border-neutral-50"
                >
                  {serviceLinks.map((service) => (
                    <Link
                      key={service.name}
                      to={service.href}
                      className="block text-sm font-black uppercase tracking-[0.2em] text-neutral-400 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/gallery" className="text-3xl font-light tracking-[0.3em] uppercase" onClick={() => setIsOpen(false)}>Gallery</Link>
          <Link to="/booking" className="text-3xl font-light tracking-[0.3em] uppercase" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className="flex space-x-8 pt-10">
            <Instagram className="w-6 h-6" />
            <Facebook className="w-6 h-6" />
            <Youtube className="w-6 h-6" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
