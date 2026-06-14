import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Mail, Phone, MessageSquare, Send, CheckCircle, Sparkles, ArrowRight, Loader2, Camera, Video, Mic2, Radio, MapPin, Clock, Users } from 'lucide-react';
import { API_URL, RAZORPAY_KEY_ID } from '../config/api';

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    guestCount: '',
    additionalNotes: '',
  });
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  // Fetch services on load
  useEffect(() => {
    const fetchServices = async () => {
      const res = await fetch(`${API_URL}/api/services`);
      const data = await res.json();
      setServices(data);
    };
    fetchServices();
  }, []);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle service selection
  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    setStep(2);
  };

  // State for OTP
  const [otpInput, setOtpInput] = useState('');
  
  // Handle booking creation
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create booking
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          serviceId: selectedService._id,
          totalAmount: parseInt(selectedService.price) || 5000,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreatedBooking(data.booking);
        setStep(3); // Go to OTP step instead of directly to payment!
        alert(data.message || 'OTP sent to your email!');
      } else {
        alert('Failed to create booking');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
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
        setStep(4); // Proceed to payment step!
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/bookings/${createdBooking._id}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        alert('OTP resent!');
      }
    } catch (err) {
      console.error(err);
      alert('Error resending OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
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
          // Verify payment
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
            setStep(5);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: bookingForm.customerName,
          email: bookingForm.customerEmail,
          contact: bookingForm.customerPhone,
        },
        theme: {
          color: '#f472b6',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Payment error');
    } finally {
      setLoading(false);
    }
  };

  // Get icon for service category
  const getServiceIcon = (category: string) => {
    switch(category) {
      case 'photography': return Camera;
      case 'videography': return Video;
      case 'audio': return Mic2;
      case 'production': return Radio;
      case 'live': return Radio;
      default: return Sparkles;
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="satyam-container">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Left: Info */}
            <div className="lg:w-1/3 space-y-12">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="heading-serif text-5xl md:text-7xl mb-8 italic">Book Your <br /> <span className="text-primary">Event.</span></h1>
                <p className="text-xl text-neutral-400 font-medium mb-12">
                  Select a service, fill the details, and complete payment to confirm your booking!
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-6 items-center p-6 bg-secondary rounded-[2rem] border border-neutral-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Instant Confirmation</h4>
                      <p className="font-bold">After Payment</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-center p-6 bg-secondary rounded-[2rem] border border-neutral-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Secure Payment</h4>
                      <p className="font-bold">Razorpay</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Form */}
            <div className="lg:w-2/3 w-full">
              <div className="bg-white rounded-[4rem] p-8 md:p-16 shadow-premium border border-neutral-100 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* Step 1: Select Service */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">Choose your service</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        {services.map((s) => {
                          const IconComponent = getServiceIcon(s.category);
                          return (
                            <button
                              key={s._id}
                              onClick={() => handleServiceSelect(s)}
                              className={`p-10 rounded-[2.5rem] border-2 text-left transition-all group hover:shadow-xl ${
                                selectedService?._id === s._id ? 'border-black bg-black text-white' : 'border-neutral-100 bg-neutral-50 hover:border-neutral-200'
                              }`}
                            >
                              <IconComponent className={`w-10 h-10 mb-6 ${selectedService?._id === s._id ? 'text-white' : 'text-primary'}`} />
                              <p className="text-xl font-black uppercase tracking-tight mb-3">{s.title}</p>
                              {s.price && (
                                <p className="text-2xl font-black text-emerald-600">₹{s.price}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Fill Details */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-8 hover:text-black transition-colors">← Back to Services</button>
                      <h3 className="heading-serif text-3xl md:text-4xl mb-10 italic">Event Details</h3>
                      <form onSubmit={handleCreateBooking} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="text" placeholder="Full Name" required 
                              value={bookingForm.customerName}
                              onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="email" placeholder="Email Address" required 
                              value={bookingForm.customerEmail}
                              onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="tel" placeholder="Phone Number" required 
                              value={bookingForm.customerPhone}
                              onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                          <div className="relative">
                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="date" required 
                              value={bookingForm.eventDate}
                              onChange={(e) => setBookingForm({ ...bookingForm, eventDate: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                          <div className="relative">
                            <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="time" placeholder="Event Time" required 
                              value={bookingForm.eventTime}
                              onChange={(e) => setBookingForm({ ...bookingForm, eventTime: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                          <div className="relative">
                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-300" />
                            <input 
                              type="number" placeholder="Number of Guests" 
                              value={bookingForm.guestCount}
                              onChange={(e) => setBookingForm({ ...bookingForm, guestCount: e.target.value })}
                              className="w-full pl-16 pr-8 py-5 bg-secondary rounded-2xl border-none focus:ring-2 focus:ring-primary/20 font-bold"
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-8 w-5 h-5 text-neutral-300" />
                          <input 
                            type="text" placeholder="Event Location" required 
                            value={bookingForm.eventLocation}
                            onChange={(e) => setBookingForm({ ...bookingForm, eventLocation: e.target.value })}
                            className="w-full pl-16 pr-8 py-8 bg-secondary rounded-[2rem] border-none focus:ring-2 focus:ring-primary/20 font-bold"
                          />
                        </div>
                        <div className="relative">
                          <MessageSquare className="absolute left-6 top-8 w-5 h-5 text-neutral-300" />
                          <textarea 
                            placeholder="Additional Notes (optional)" rows={4} 
                            value={bookingForm.additionalNotes}
                            onChange={(e) => setBookingForm({ ...bookingForm, additionalNotes: e.target.value })}
                            className="w-full pl-16 pr-8 py-8 bg-secondary rounded-[2rem] border-none focus:ring-2 focus:ring-primary/20 font-bold"
                          ></textarea>
                        </div>
                        
                        <div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-[2rem] border border-primary/20">
                          <p className="text-sm text-neutral-600 font-bold uppercase tracking-widest">Total Amount</p>
                          <p className="text-3xl font-black text-primary">₹{parseInt(selectedService.price) || 5000}</p>
                        </div>
                        
                        <button disabled={loading} className="btn-satyam-black w-full !rounded-2xl !py-6">
                          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Proceed to Payment <ArrowRight className="ml-3 w-5 h-5" /></>}
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {/* Step 3: OTP Verification */}
                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-12">
                      <button onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest text-neutral-300 mb-8 hover:text-black transition-colors">← Back to Details</button>
                      
                      <div className="text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                          <Mail className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="heading-serif text-3xl md:text-4xl mb-4 italic">Verify your Email</h3>
                        <p className="text-neutral-500 font-medium mb-12">
                          We have sent an OTP to <span className="font-black">{createdBooking.customerEmail}</span>
                        </p>

                        <div className="max-w-md mx-auto mb-12">
                          <input 
                            type="text" 
                            placeholder="Enter 6-digit OTP" 
                            maxLength={6} 
                            value={otpInput} 
                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center text-4xl font-black tracking-widest py-8 bg-secondary rounded-[2rem] border-none focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                          <button 
                            onClick={handleResendOtp} 
                            disabled={loading} 
                            className="text-primary font-black text-sm hover:underline"
                          >
                            Resend OTP
                          </button>
                        </div>

                        <button 
                          disabled={loading || otpInput.length < 6} 
                          onClick={handleVerifyOtp} 
                          className="btn-satyam-black w-full !rounded-full !py-6"
                        >
                          {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Verify OTP'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Payment */}
                  {step === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="heading-serif text-4xl mb-6 italic">Booking Verified!</h3>
                      <p className="text-xl text-neutral-500 font-medium mb-4">
                        Booking ID: <span className="font-black text-black">{createdBooking.bookingId}</span>
                      </p>
                      <p className="text-lg text-neutral-500 mb-12 max-w-sm mx-auto">
                        Please complete the payment to confirm your booking.
                      </p>
                      
                      <div className="bg-secondary p-8 rounded-[2rem] mb-12">
                        <p className="text-sm font-black uppercase tracking-widest text-neutral-500 mb-2">Total Amount</p>
                        <p className="text-4xl font-black">₹{createdBooking.totalAmount / 100}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button onClick={() => setStep(2)} className="btn-satyam-outline !rounded-full">
                          Edit Details
                        </button>
                        <button disabled={loading} onClick={handlePayment} className="btn-satyam-black !rounded-full">
                          {loading ? <Loader2 className="w-5 h-5 animate-spin inline" /> : <><Sparkles className="w-5 h-5 mr-2" /> Pay Now</>}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Success */}
                  {step === 5 && (
                    <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                      </div>
                      <h3 className="heading-serif text-4xl mb-6 italic">Booking Confirmed!</h3>
                      <p className="text-xl text-neutral-500 font-medium mb-4">
                        Booking ID: <span className="font-black text-black">{createdBooking.bookingId}</span>
                      </p>
                      <p className="text-lg text-neutral-500 mb-12 max-w-sm mx-auto">
                        Thank you for your payment! Our team will contact you shortly.
                      </p>
                      <button onClick={() => { setStep(1); setSelectedService(null); setCreatedBooking(null); setOtpInput(''); setBookingForm({ customerName: '', customerEmail: '', customerPhone: '', eventDate: '', eventTime: '', eventLocation: '', guestCount: '', additionalNotes: '' }); }} className="btn-satyam-outline !rounded-full">Book Another Service</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
