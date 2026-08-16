import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Camera, Video, Mic2, Music, Radio, Sparkles, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileServicesOpen(false);
    setShowServices(false);
  }, [location.pathname]);

  // Lock body scroll on mobile menu open & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Outside click handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Service Links
  const serviceLinks = [
    { name: 'Photography', href: '/photography', icon: Camera, desc: 'Editorial & Event Captures' },
    { name: 'Videography', href: '/videography', icon: Video, desc: 'Cinematic Films & BTS' },
    { name: 'Audio Recording', href: '/audio-recording', icon: Mic2, desc: 'Studio Vocal Sessions' },
    { name: 'Music Production', href: '/music-production', icon: Music, desc: 'Beats & Arrangement' },
    { name: 'Live Streaming', href: '/live-streaming', icon: Radio, desc: 'Multi-cam Broadcast' },
  ];

  const mainLinks = [
    { name: 'Work', href: '/portfolio' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Talent Hunt', href: '/talent-hunt' },
    { name: 'AI Hub', href: '/ai-hub' },
    { name: 'About', href: '/about' },
  ];

  const isServiceActive = serviceLinks.some((s) => s.href === location.pathname);

  return (
    <>
      {/* ── TOP STICKY HEADER ── */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#050708]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="satyam-container flex justify-between items-center">
          {/* Minimalist Editorial Logo */}
          <Link to="/" className="flex flex-col group py-1" aria-label="RRE Home">
            <span className="text-xl md:text-2xl font-black tracking-[0.35em] text-white leading-none group-hover:text-[#00E5FF] transition-colors">
              RAJATRAJ
            </span>
            <span className="text-[0.55rem] font-extrabold tracking-[0.45em] text-white/50 group-hover:text-white transition-colors uppercase mt-0.5">
              ENTERTAINMENT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" aria-label="Main Navigation">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'text-white active' : ''}`}
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
            >
              <button
                className={`nav-link flex items-center gap-1.5 ${isServiceActive ? 'text-white active' : ''}`}
                aria-expanded={showServices}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    showServices ? 'rotate-180 text-white' : 'text-white/60'
                  }`}
                />
              </button>

              <AnimatePresence>
                {showServices && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[420px]"
                  >
                    <div className="glass-strong rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border border-white/15">
                      <div className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-[#00E5FF] mb-3 px-3">
                        Creative Services
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                        {serviceLinks.map((service) => {
                          const Icon = service.icon;
                          return (
                            <Link
                              key={service.name}
                              to={service.href}
                              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                              onClick={() => setShowServices(false)}
                            >
                              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/70 group-hover:bg-[#00E5FF] group-hover:text-black transition-all shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-[#00E5FF] transition-colors">
                                  {service.name}
                                </p>
                                <p className="text-[9px] text-white/50 font-medium">
                                  {service.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'text-white active' : ''}`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === '/dashboard' ? 'text-white active' : ''}`}
            >
              My Portal
            </Link>

            {/* Book Now Primary Button */}
            <Link to="/booking" className="btn-vantage-primary !py-2.5 !px-6 !text-[11px] ml-2">
              Book Now
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all focus:outline-none"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* ── SEPARATE FULL-SCREEN MOBILE DRAWER (OUTSIDE HEADER TO PREVENT CLIPPING) ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Slide-out Drawer */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 w-full max-w-sm h-full h-[100dvh] bg-[#050708] border-l border-white/15 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl"
            >
              <div>
                {/* Header in Drawer */}
                <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <div className="flex flex-col">
                    <span className="text-lg font-black tracking-[0.3em] text-white">RAJATRAJ</span>
                    <span className="text-[0.5rem] font-bold tracking-[0.4em] text-white/50 uppercase">ENTERTAINMENT</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="py-6 space-y-3">
                  <Link
                    to="/"
                    className="block text-base font-bold uppercase tracking-[0.2em] text-white/90 hover:text-[#00E5FF] transition-colors py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>

                  {/* Accordion Services for Mobile */}
                  <div className="py-1">
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex justify-between items-center text-base font-bold uppercase tracking-[0.2em] text-white/90 hover:text-[#00E5FF] transition-colors py-1.5"
                    >
                      <span>Services</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          mobileServicesOpen ? 'rotate-180 text-[#00E5FF]' : 'text-white/40'
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pl-4 space-y-2.5 pt-2 border-l border-white/10 ml-2"
                        >
                          {serviceLinks.map((service) => (
                            <Link
                              key={service.name}
                              to={service.href}
                              className="block text-xs font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors py-1"
                              onClick={() => setIsOpen(false)}
                            >
                              {service.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {mainLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block text-base font-bold uppercase tracking-[0.2em] text-white/90 hover:text-[#00E5FF] transition-colors py-1.5"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}

                  <Link
                    to="/dashboard"
                    className="block text-base font-bold uppercase tracking-[0.2em] text-white/90 hover:text-[#00E5FF] transition-colors py-1.5"
                    onClick={() => setIsOpen(false)}
                  >
                    My Portal
                  </Link>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <Link
                  to="/booking"
                  className="btn-vantage-primary w-full py-3.5 text-center block text-xs"
                  onClick={() => setIsOpen(false)}
                >
                  Book Now <ArrowRight className="inline-block w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
