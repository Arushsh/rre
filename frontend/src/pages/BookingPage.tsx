import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, User, Mail, Phone, MessageSquare,
  CheckCircle, Sparkles, ArrowRight, ArrowLeft,
  Loader2, Camera, Video, Mic2, Radio, MapPin,
} from 'lucide-react';
import { API_URL, RAZORPAY_KEY_ID } from '../config/api';
import toast from 'react-hot-toast';

// ── BOOKING FLOW AUDIT ──────────────────────────────────────────────────────
// Step 1: Select service  → GET /api/services
// Step 2: Event details   → POST /api/bookings {…bookingForm, serviceId}
// Step 3: OTP verify      → POST /api/bookings/verify-otp {bookingId, otp}
//                           POST /api/bookings/:id/resend-otp
// Step 4: Confirmed       → shows createdBooking.bookingId
//
// handlePayment (Razorpay) exists in original but is never invoked by any step.
// It is preserved here exactly in case it is wired in the future.
// ────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: 'SERVICE' },
  { num: 2, label: 'DETAILS' },
  { num: 3, label: 'VERIFY' },
  { num: 4, label: 'CONFIRMED' },
];

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -28 : 28 }),
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    eventLocation: '',
    additionalNotes: '',
  });
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [otpInput, setOtpInput] = useState('');

  // ── PRESERVED: Fetch services on load + query param preselection ──
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        const data = await res.json();
        setServices(data);

        // Pre-select service from URL query param if present
        const serviceParam = searchParams.get('service') || searchParams.get('category');
        if (serviceParam && Array.isArray(data) && data.length > 0) {
          const match = data.find((s: any) =>
            s.category?.toLowerCase() === serviceParam.toLowerCase() ||
            s.title?.toLowerCase().includes(serviceParam.toLowerCase()) ||
            s._id === serviceParam
          );
          if (match) {
            setSelectedService(match);
            setStep(2);
          }
        }
      } catch (err) {
        console.error('Failed to load services', err);
      }
    };
    fetchServices();
  }, [searchParams]);

  // ── PRESERVED: Load Razorpay script ──
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // ── PRESERVED: Service selection ──
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    goTo(2);
  };

  // ── PRESERVED: Booking creation → POST /api/bookings ──
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          serviceId: selectedService._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedBooking(data.booking);
        goTo(3);
        toast.success(data.message || 'OTP sent to your phone!');
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error creating booking: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: OTP verification → POST /api/bookings/verify-otp ──
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: createdBooking._id,
          otp: otpInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedBooking(data.booking);
        goTo(4);
        toast.success('OTP verified! Booking confirmed!');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: Resend OTP → POST /api/bookings/:id/resend-otp ──
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${createdBooking._id}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('OTP resent!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: Razorpay payment handler (not invoked in current flow) ──
  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: createdBooking.totalAmount,
        currency: 'INR',
        name: 'Rajat Raj Entertainment',
        description: `${selectedService.title} Booking`,
        order_id: createdBooking.razorpayOrderId,
        handler: async (response: any) => {
          const verifyRes = await fetch(`${API_URL}/api/bookings/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: createdBooking._id,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setCreatedBooking(verifyData.booking);
            goTo(5);
            toast.success('Payment successful!');
          } else {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: bookingForm.customerName,
          email: bookingForm.customerEmail,
          contact: bookingForm.customerPhone,
        },
        theme: { color: '#f472b6' },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment error');
    } finally {
      setLoading(false);
    }
  };

  // ── PRESERVED: Service icon helper ──
  const getServiceIcon = (category: string) => {
    switch (category) {
      case 'photography': return Camera;
      case 'videography': return Video;
      case 'audio': return Mic2;
      case 'production': return Radio;
      case 'live': return Radio;
      default: return Sparkles;
    }
  };

  const resetBooking = () => {
    setStep(1);
    setDirection(1);
    setSelectedService(null);
    setCreatedBooking(null);
    setOtpInput('');
    setBookingForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      eventDate: '',
      eventLocation: '',
      additionalNotes: '',
    });
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen pt-20">

      {/* ── COMPACT CINEMATIC HEADER ── */}
      <section className="relative py-14 md:py-20 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
        <div className="satyam-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl space-y-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block">Book a Service</span>
            <h1 className="display-title text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              LET'S CREATE SOMETHING <br />
              <span className="italic font-normal text-white/70">WORTH REMEMBERING.</span>
            </h1>
            <p className="text-sm text-white/50 leading-relaxed max-w-md">
              Select your service, share your event details, verify your phone, and your booking is confirmed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── STEPPER + FORM PANEL ── */}
      <section className="py-14 md:py-20">
        <div className="satyam-container">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">

            {/* ── LEFT RAIL ── */}
            <div className="lg:w-[30%] space-y-10 lg:sticky lg:top-28">

              {/* Step tracker */}
              <div className="space-y-3">
                {STEPS.map((s) => {
                  const done = step > s.num;
                  const active = step === s.num;
                  return (
                    <div key={s.num} className={`flex items-center gap-4 transition-all ${active ? 'opacity-100' : done ? 'opacity-50' : 'opacity-25'}`}>
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-black transition-all ${
                        done ? 'bg-white border-white text-black' : active ? 'border-white/50 text-white bg-white/8' : 'border-white/15 text-white/30'
                      }`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.3em] ${active ? 'text-white' : 'text-white/40'}`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Booking summary (step 2+) */}
              {selectedService && step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-subtle border border-white/10 rounded-2xl p-6 space-y-4"
                >
                  <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 block">Your Project</span>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Service</p>
                      <p className="text-sm font-bold text-white">{selectedService.title}</p>
                    </div>
                    {bookingForm.eventDate && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Date</p>
                        <p className="text-sm font-bold text-white">
                          {new Date(bookingForm.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                    {bookingForm.eventLocation && (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">Location</p>
                        <p className="text-sm font-bold text-white">{bookingForm.eventLocation}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Trust badges */}
              <div className="space-y-3">
                {[
                  { icon: CheckCircle, label: 'Instant Confirmation', sub: 'After OTP Verification' },
                  { icon: Sparkles, label: 'Secure & Trusted', sub: 'Razorpay Powered' },
                ].map(({ icon: Icon, label, sub }, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl glass-subtle border border-white/12 flex items-center justify-center text-white/40 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/70">{label}</p>
                      <p className="text-[10px] text-white/30">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── FORM PANEL ── */}
            <div className="lg:w-[70%] w-full">
              <div className="glass-strong border border-white/12 rounded-3xl p-8 md:p-12 overflow-hidden">
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" custom={direction}>

                    {/* ── STEP 1: SELECT SERVICE ── */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="mb-8">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block mb-2">Step 01</span>
                          <h3 className="heading-serif text-2xl md:text-3xl font-bold text-white">Choose Your Service.</h3>
                        </div>

                        {services.length === 0 ? (
                          <div className="py-20 text-center space-y-3">
                            <Loader2 className="w-8 h-8 animate-spin text-white/25 mx-auto" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">Loading Services…</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((s) => {
                              const IconComp = getServiceIcon(s.category);
                              const isSelected = selectedService?._id === s._id;
                              return (
                                <button
                                  key={s._id}
                                  onClick={() => handleServiceSelect(s)}
                                  className={`group text-left rounded-2xl border p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                                    isSelected
                                      ? 'border-white/50 bg-white/10'
                                      : 'border-white/10 hover:border-white/25 bg-white/3 hover:bg-white/5'
                                  }`}
                                >
                                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 transition-all ${
                                    isSelected ? 'border-white/40 bg-white/15 text-white' : 'border-white/15 bg-white/5 text-white/40 group-hover:text-white/70'
                                  }`}>
                                    <IconComp className="w-5 h-5" />
                                  </div>
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-black uppercase tracking-tight text-white">{s.title}</p>
                                    {isSelected && <CheckCircle className="w-4 h-4 text-white shrink-0" />}
                                  </div>
                                  {s.description && (
                                    <p className="text-xs text-white/35 mt-1.5 line-clamp-2">{s.description}</p>
                                  )}
                                  <div className={`flex items-center gap-1 mt-4 text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    isSelected ? 'text-white' : 'text-white/25 group-hover:text-white/50'
                                  }`}>
                                    Select <ArrowRight className="w-3 h-3" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* ── STEP 2: DETAILS ── */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="mb-8">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block mb-2">
                            Step 02 — {selectedService?.title}
                          </span>
                          <h3 className="heading-serif text-2xl md:text-3xl font-bold text-white">Event Details.</h3>
                        </div>

                        <form onSubmit={handleCreateBooking} className="space-y-5">
                          {/* 2-column grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Customer Name */}
                            <div className="space-y-1.5">
                              <label htmlFor="bk-name" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                                Full Name
                              </label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                <input
                                  id="bk-name"
                                  type="text"
                                  placeholder="Your name"
                                  required
                                  value={bookingForm.customerName}
                                  onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                              <label htmlFor="bk-email" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                                Email Address
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                <input
                                  id="bk-email"
                                  type="email"
                                  placeholder="email@example.com"
                                  required
                                  value={bookingForm.customerEmail}
                                  onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                                />
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                              <label htmlFor="bk-phone" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                                Phone Number
                              </label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                <input
                                  id="bk-phone"
                                  type="tel"
                                  placeholder="+91 00000 00000"
                                  required
                                  value={bookingForm.customerPhone}
                                  onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                                />
                              </div>
                            </div>

                            {/* Date */}
                            <div className="space-y-1.5">
                              <label htmlFor="bk-date" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                                Event Date
                              </label>
                              <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                                <input
                                  id="bk-date"
                                  type="date"
                                  required
                                  value={bookingForm.eventDate}
                                  onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                                  className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium transition-all [color-scheme:dark]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="space-y-1.5">
                            <label htmlFor="bk-location" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                              Event Location
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                              <input
                                id="bk-location"
                                type="text"
                                placeholder="Delhi, Mumbai, etc."
                                required
                                value={bookingForm.eventLocation}
                                onChange={(e) => setBookingForm({ ...bookingForm, eventLocation: e.target.value })}
                                className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all"
                              />
                            </div>
                          </div>

                          {/* Notes */}
                          <div className="space-y-1.5">
                            <label htmlFor="bk-notes" className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                              Additional Notes <span className="text-white/20">(Optional)</span>
                            </label>
                            <div className="relative">
                              <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-white/25" />
                              <textarea
                                id="bk-notes"
                                rows={3}
                                placeholder="Any specific requirements…"
                                value={bookingForm.additionalNotes}
                                onChange={(e) => setBookingForm({ ...bookingForm, additionalNotes: e.target.value })}
                                className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/12 hover:border-white/20 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium placeholder-white/20 transition-all resize-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                              type="button"
                              onClick={() => goTo(1)}
                              className="flex items-center justify-center gap-2 px-6 py-3.5 glass-subtle border border-white/15 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
                            >
                              <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className="flex-1 flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>Proceed <ArrowRight className="w-4 h-4" /></>
                              )}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* ── STEP 3: OTP ── */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-8"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/35 block mb-2">Step 03</span>
                          <h3 className="heading-serif text-2xl md:text-3xl font-bold text-white">Verify Your Phone.</h3>
                          <p className="text-sm text-white/45 mt-3 leading-relaxed">
                            We sent a 6-digit code to{' '}
                            <span className="font-bold text-white/75">{createdBooking?.customerPhone}</span>
                          </p>
                        </div>

                        {/* OTP input */}
                        <div className="max-w-xs mx-auto">
                          <label htmlFor="bk-otp" className="sr-only">6-digit OTP</label>
                          <input
                            id="bk-otp"
                            type="text"
                            inputMode="numeric"
                            placeholder="• • • • • •"
                            maxLength={6}
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            aria-label="Enter 6-digit OTP"
                            className="w-full text-center text-3xl font-black tracking-[0.6em] py-5 bg-white/5 border border-white/15 hover:border-white/25 focus:border-white/45 focus:outline-none rounded-2xl text-white placeholder-white/15 transition-all"
                          />
                        </div>

                        <div className="space-y-4">
                          <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otpInput.length < 6}
                            className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 px-6 py-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-white/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify OTP'}
                          </button>

                          <button
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="block mx-auto text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors disabled:opacity-50"
                          >
                            Resend Code
                          </button>
                        </div>

                        <button
                          onClick={() => goTo(2)}
                          className="flex items-center justify-center gap-1.5 mx-auto text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Back to Details
                        </button>
                      </motion.div>
                    )}

                    {/* ── STEP 4: BOOKING CONFIRMED ── */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center space-y-8 py-6"
                      >
                        <motion.div
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
                          className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto"
                        >
                          <CheckCircle className="w-9 h-9 text-emerald-400" />
                        </motion.div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400/70 block">Booking Confirmed</span>
                          <h3 className="heading-serif text-3xl md:text-4xl font-bold text-white">You're Booked.</h3>
                          <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
                            Our team will contact you shortly to discuss the final details.
                          </p>
                        </div>

                        {/* Booking details */}
                        <div className="glass-subtle border border-white/10 rounded-2xl p-6 text-left space-y-4 max-w-sm mx-auto">
                          {createdBooking?.bookingId && (
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-1">Booking ID</p>
                              <p className="text-sm font-bold text-white font-mono">{createdBooking.bookingId}</p>
                            </div>
                          )}
                          {selectedService?.title && (
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-1">Service</p>
                              <p className="text-sm font-bold text-white">{selectedService.title}</p>
                            </div>
                          )}
                          {bookingForm.customerName && (
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-1">Customer</p>
                              <p className="text-sm font-bold text-white">{bookingForm.customerName}</p>
                            </div>
                          )}
                          {bookingForm.eventDate && (
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-1">Event Date</p>
                              <p className="text-sm font-bold text-white">
                                {new Date(bookingForm.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={resetBooking}
                          className="inline-flex items-center gap-2 px-7 py-3 glass-subtle border border-white/15 rounded-full text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/30 transition-all"
                        >
                          Book Another Service
                        </button>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default BookingPage;
