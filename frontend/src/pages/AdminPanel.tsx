import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  Save, 
  Link as LinkIcon, 
  Calendar, 
  MapPin, 
  User as UserIcon, 
  Lock,
  QrCode,
  CheckCircle,
  Upload,
  DollarSign,
  Users,
  DownloadCloud,
  Layers,
  Share2,
  LayoutDashboard,
  Users as UsersIcon,
  FolderOpen,
  UserPlus,
  Camera as CameraIcon,
  X,
  Download,
  Copy,
  Locate,
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  LogOut
} from 'lucide-react';
import { API_URL } from '../config/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [galleries, setGalleries] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalClients: 0,
    totalRevenue: 0,
    totalDownloads: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastCreatedGallery, setLastCreatedGallery] = useState<any>(null);
  const [activeGalleryForCamera, setActiveGalleryForCamera] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [newGallery, setNewGallery] = useState({
    title: '', slug: '', eventDate: new Date().toISOString().split('T')[0], location: '', photographer: 'RRE Team', password: '', coverImage: '', media: [] as any[], revenue: 0, isPublic: false
  });

  const [services, setServices] = useState<any[]>([]);
  const [isEditingService, setIsEditingService] = useState(false);
  const [newService, setNewService] = useState({
    category: 'photography', title: '', description: '', price: '', features: ['']
  });

  const [newClient, setNewClient] = useState({
    name: '', email: '', password: ''
  });

  // Check auth and fetch data
  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    if (auth !== 'true') {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const galRes = await fetch(`${API_URL}/api/galleries`);
      if (galRes.ok) setGalleries(await galRes.json());

      const statRes = await fetch(`${API_URL}/api/galleries/admin/stats`);
      if (statRes.ok) setStats(await statRes.json());

      const clientRes = await fetch(`${API_URL}/api/users`);
      if (clientRes.ok) setClients(await clientRes.json());

      const servRes = await fetch(`${API_URL}/api/services`);
      if (servRes.ok) setServices(await servRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, gallerySlug: string | null = null) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const filePromise = new Promise((resolve) => {
        reader.onload = (event) => {
          resolve({ type: 'image', url: event.target?.result, thumbnail: '' });
        };
      });
      reader.readAsDataURL(files[i]);
      newMedia.push(await filePromise);
    }

    if (gallerySlug) {
      // Add to existing gallery
      try {
        const res = await fetch(`${API_URL}/api/galleries/${gallerySlug}/add-media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ media: newMedia })
        });
        if (res.ok) {
          alert(`${files.length} photos uploaded successfully!`);
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Add to new gallery creation form
      setNewGallery(prev => ({
        ...prev,
        media: [...prev.media, ...newMedia]
      }));
    }
  };

  const openQrModal = (gallery: any) => {
    setLastCreatedGallery(gallery);
    setShowSuccessModal(true);
  };

  const handleDownloadQR = () => {
    if (!lastCreatedGallery) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (Google Pay style vertical card)
    canvas.width = 600;
    canvas.height = 900;

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 900);

    // 2. Header Branding
    ctx.fillStyle = '#000000';
    ctx.font = '900 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RAJAT RAJ ENTERTAINMENT', 300, 80);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('MEDIA & ENTERTAINMENT BRAND', 300, 110);

    // 3. Card Shadow/Border
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(50, 160, 500, 650, 40);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Event Info
    ctx.fillStyle = '#000000';
    ctx.font = '900 42px Inter, sans-serif';
    ctx.fillText(lastCreatedGallery.title.toUpperCase(), 300, 240);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(`${lastCreatedGallery.location} • ${new Date(lastCreatedGallery.eventDate).toLocaleDateString()}`, 300, 280);

    // 5. Load and Draw QR Code
    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin);
    qrImg.onload = () => {
      // Draw QR Code centered
      ctx.drawImage(qrImg, 125, 330, 350, 350);

      // 6. Footer Text
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('SCAN TO VIEW GALLERY', 300, 740);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'medium 14px Inter, sans-serif';
      ctx.fillText(`Password: ${lastCreatedGallery.password}`, 300, 770);

      // Download
      const link = document.createElement('a');
      link.download = `RRE-${lastCreatedGallery.slug}-QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/galleries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGallery)
      });
      if (res.ok) {
        const data = await res.json();
        setLastCreatedGallery(data);
        setShowSuccessModal(true);
        await fetchData();
        setIsCreating(false);
        setNewGallery({
          title: '', slug: '', eventDate: new Date().toISOString().split('T')[0], location: '', photographer: 'RRE Team', password: '', coverImage: '', media: [], revenue: 0, isPublic: false
        });
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Failed to create gallery'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Connection Error: Is the backend server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewGallery(prev => ({ ...prev, location: "Live Event Location (Mumbai)" }));
      }, () => {
        alert("Location access denied.");
      });
    } else {
      alert("Geolocation not supported.");
    }
  };

  const openCamera = async (gallerySlug: string | null = null) => {
    setActiveGalleryForCamera(gallerySlug);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access failed.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoUrl = canvasRef.current.toDataURL('image/jpeg');
        
        if (activeGalleryForCamera) {
          try {
            const res = await fetch(`${API_URL}/api/galleries/${activeGalleryForCamera}/add-media`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ media: [{ type: 'image', url: photoUrl, thumbnail: '' }] })
            });
            if (res.ok) {
              alert('Uploaded Successfully!');
              fetchData();
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          setNewGallery(prev => ({
            ...prev,
            media: [...prev.media, { type: 'image', url: photoUrl, thumbnail: '' }]
          }));
        }
        
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCameraOpen(false);
        setActiveGalleryForCamera(null);
      }
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      if (res.ok) {
        fetchData();
        setIsAddingClient(false);
        setNewClient({ name: '', email: '', password: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const assignEventToClient = async (userId: string, eventId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/assign-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, eventId })
      });
      if (res.ok) {
        fetchData();
        alert('Assigned!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      });
      if (res.ok) {
        fetchData();
        setNewService({ category: 'photography', title: '', description: '', price: '', features: [''] });
        setIsEditingService(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch(`${API_URL}/api/services/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-20">
      <div className="satyam-container">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="heading-serif text-3xl sm:text-5xl mb-1 sm:mb-3 italic">Control Center</h1>
              <p className="text-gray-400 font-medium tracking-widest text-[10px] uppercase">RRE Administrative Interface</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button onClick={handleLogout} className="p-3 sm:p-4 bg-white rounded-2xl border border-gray-100 text-gray-400 hover:text-red-500 transition-all group">
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110" />
              </button>
              <button 
                onClick={() => setIsCreating(!isCreating)} 
                className="btn-quote flex items-center gap-2 !px-4 !py-2.5 !text-[11px] sm:!px-8 sm:!py-4 sm:!text-[15px]"
              >
                {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span className="hidden sm:inline">{isCreating ? 'Cancel Creation' : 'Create New Gallery'}</span>
                <span className="sm:hidden">{isCreating ? 'Cancel' : 'New Gallery'}</span>
              </button>
            </div>
          </div>

          {/* Tabs - scrollable on mobile */}
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide w-full">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'galleries', label: 'Galleries', icon: FolderOpen },
              { id: 'clients', label: 'Clients', icon: UsersIcon },
              { id: 'services', label: 'Services', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading && <div className="py-20 text-center"><RefreshCw className="w-10 h-10 animate-spin mx-auto text-gray-200" /></div>}

        <AnimatePresence mode="wait">
          {!loading && activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { label: 'Total Events', val: stats.totalEvents, icon: Layers, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { label: 'Total Clients', val: stats.totalClients, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                  { label: 'Total Revenue', val: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                  { label: 'Total Downloads', val: stats.totalDownloads, icon: DownloadCloud, color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-dark tracking-tighter">{stat.val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-sm text-center">
                 <h3 className="heading-serif text-3xl mb-4 italic">Welcome, Admin</h3>
                 <p className="text-gray-400 max-w-lg mx-auto font-medium">Use the navigation above to manage galleries and clients. Your studio is currently running smoothly.</p>
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'galleries' && (
            <motion.div key="galleries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                <h2 className="heading-serif text-3xl sm:text-4xl">Galleries</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn-quote !py-3 !px-6 !text-[12px]">
                  {isCreating ? 'Cancel' : 'New Gallery'}
                </button>
              </div>

              {isCreating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-16">
                  <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-2xl relative">
                    <form onSubmit={handleCreateGallery} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Event Title</label>
                          <input type="text" placeholder="e.g. Wedding Ceremony" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')})} required />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Event Date</label>
                          <input type="date" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newGallery.eventDate} onChange={e => setNewGallery({...newGallery, eventDate: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Location</label>
                          <div className="flex gap-4">
                            <input type="text" placeholder="Location Name" className="flex-grow px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newGallery.location} onChange={e => setNewGallery({...newGallery, location: e.target.value})} />
                            <button type="button" onClick={detectLocation} className="p-4 bg-gray-100 rounded-xl hover:bg-black hover:text-white transition-all"><Locate className="w-5 h-5" /></button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Access Password</label>
                          <input type="text" placeholder="e.g. RRE2024" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newGallery.password} onChange={e => setNewGallery({...newGallery, password: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Package Price (₹)</label>
                          <input type="number" placeholder="0.00" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newGallery.revenue} onChange={e => setNewGallery({...newGallery, revenue: parseInt(e.target.value) || 0})} />
                        </div>
                        <div className="flex items-center gap-3 pt-4">
                          <input 
                            type="checkbox" 
                            id="isPublic" 
                            className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                            checked={newGallery.isPublic}
                            onChange={e => setNewGallery({...newGallery, isPublic: e.target.checked})}
                          />
                          <label htmlFor="isPublic" className="text-[10px] font-black uppercase tracking-widest text-gray-400">Make this Gallery Public (Show in Website Gallery)</label>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Cover Image</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setNewGallery(prev => ({ ...prev, coverImage: event.target?.result as string }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" 
                          />
                          {newGallery.coverImage && (
                            <div className="mt-4 relative aspect-video rounded-xl overflow-hidden shadow-sm">
                              <img src={newGallery.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Media Upload</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <button type="button" onClick={() => openCamera()} className="py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><CameraIcon className="w-4 h-4" /> Live Camera</button>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="py-4 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                               <Upload className="w-4 h-4" /> Upload Photos
                             </button>
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(e)} 
                             />
                          </div>
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="md:col-span-2 btn-quote py-6 mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Save Gallery & Generate QR'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {galleries.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white">
                  <AlertCircle className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                  <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-xs">No Galleries Created Yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {galleries.map((gallery: any) => (
                    <div key={gallery._id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                        <img src={gallery.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">Pass: {gallery.password}</div>
                      </div>
                      <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{gallery.title}</h3>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2"><MapPin className="w-3 h-3" /> {gallery.location}</p>
                      <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                         <span className="text-xs font-black text-emerald-500">₹{gallery.revenue}</span>
                         <div className="flex gap-4">
                           <CameraIcon onClick={() => openCamera(gallery.slug)} className="w-5 h-5 text-primary cursor-pointer hover:scale-110 transition-all" />
                           <label className="cursor-pointer">
                              <Upload className="w-5 h-5 text-emerald-500 hover:scale-110 transition-all" />
                              <input 
                                type="file" 
                                className="hidden" 
                                multiple 
                                accept="image/*" 
                                onChange={(e) => handleFileUpload(e, gallery.slug)} 
                              />
                           </label>
                           <QrCode 
                              onClick={() => openQrModal(gallery)} 
                              className="w-5 h-5 text-gray-300 cursor-pointer hover:text-black transition-all" 
                           />
                           <Trash2 className="w-5 h-5 text-red-200 cursor-pointer hover:text-red-500 transition-all" />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!loading && activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                <h2 className="heading-serif text-3xl sm:text-4xl">Clients</h2>
                <button onClick={() => setIsAddingClient(!isAddingClient)} className="btn-quote !py-3 !px-6 !text-[12px]">
                  {isAddingClient ? 'Cancel' : 'Add New Client'}
                </button>
              </div>
              {isAddingClient && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-8 sm:mb-12">
                  <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl max-w-2xl mx-auto">
                    <form onSubmit={handleAddClient} className="space-y-4 sm:space-y-6">
                      <input type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
                      <input type="email" placeholder="Email Address" className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
                      <input type="password" placeholder="Temp Password" className="w-full px-5 py-4 bg-gray-50 rounded-xl font-bold border-none focus:ring-2 focus:ring-black/5" value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} required />
                      <button type="submit" className="w-full btn-quote py-4 sm:py-5">Register Client</button>
                    </form>
                  </div>
                </motion.div>
              )}
              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
                <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Client</th>
                      <th className="px-6 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contact</th>
                      <th className="px-6 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Status</th>
                      <th className="px-6 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Events</th>
                      <th className="px-6 lg:px-10 py-6 lg:py-8 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {clients.map((client: any) => (
                      <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                              {client.selfieUrl ? (
                                <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <UserIcon className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-dark uppercase tracking-tight text-sm">{client.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold">#{client._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                          <div className="space-y-1">
                            <p className="text-xs text-gray-600 font-bold flex items-center gap-2"><Mail className="w-3 h-3" /> {client.email}</p>
                            <p className="text-xs text-gray-600 font-bold flex items-center gap-2"><Phone className="w-3 h-3" /> {client.mobile || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                            client.isVerified 
                              ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                              : 'bg-amber-50 text-amber-500 border-amber-100'
                          }`}>
                            {client.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                          <div className="flex flex-wrap gap-1.5">
                            {client.myEvents?.map((ev: any) => (
                              <span key={ev._id} className="px-2 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-full border border-primary/10">{ev.title}</span>
                            ))}
                            {client.myEvents?.length === 0 && <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest italic">None</span>}
                          </div>
                        </td>
                        <td className="px-6 lg:px-10 py-6 lg:py-8">
                           <select onChange={(e) => e.target.value && assignEventToClient(client._id, e.target.value)} className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-3 focus:ring-0 cursor-pointer">
                             <option value="">Assign Event...</option>
                             {galleries.map((g: any) => (<option key={g._id} value={g._id}>{g.title}</option>))}
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {clients.map((client: any) => (
                  <div key={client._id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                        {client.selfieUrl ? (
                          <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <UserIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-dark uppercase tracking-tight">{client.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold">#{client._id.slice(-6)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border flex-shrink-0 ${
                        client.isVerified 
                          ? 'bg-emerald-50 text-emerald-500 border-emerald-100' 
                          : 'bg-amber-50 text-amber-500 border-amber-100'
                      }`}>
                        {client.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-1 mb-4 pb-4 border-b border-gray-50">
                      <p className="text-xs text-gray-600 font-bold flex items-center gap-2"><Mail className="w-3 h-3" /> {client.email}</p>
                      <p className="text-xs text-gray-600 font-bold flex items-center gap-2"><Phone className="w-3 h-3" /> {client.mobile || 'N/A'}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {client.myEvents?.map((ev: any) => (
                        <span key={ev._id} className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-full border border-primary/10">{ev.title}</span>
                      ))}
                      {client.myEvents?.length === 0 && <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest italic">No events assigned</span>}
                    </div>
                    <select onChange={(e) => e.target.value && assignEventToClient(client._id, e.target.value)} className="w-full bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-3 focus:ring-0 cursor-pointer">
                      <option value="">Assign Event...</option>
                      {galleries.map((g: any) => (<option key={g._id} value={g._id}>{g.title}</option>))}
                    </select>
                  </div>
                ))}
                {clients.length === 0 && (
                  <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-[2rem] bg-white">
                    <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-xs">No Clients Yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
                <h2 className="heading-serif text-3xl sm:text-4xl">Manage Services</h2>
                <button onClick={() => setIsEditingService(!isEditingService)} className="btn-quote !py-3 !px-6 !text-[12px]">
                  {isEditingService ? 'Cancel' : 'Add New Service'}
                </button>
              </div>

              {isEditingService && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-8 sm:mb-12">
                  <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl max-w-4xl mx-auto">
                    <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                      <div className="space-y-6">
                        <select 
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none"
                          value={newService.category}
                          onChange={e => setNewService({...newService, category: e.target.value})}
                        >
                          <option value="photography">Photography</option>
                          <option value="videography">Videography</option>
                          <option value="audio">Audio Recording</option>
                          <option value="production">Music Production</option>
                          <option value="live">Live Streaming</option>
                        </select>
                        <input type="text" placeholder="Service Title" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                        <input type="text" placeholder="Starting Price" className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                      </div>
                      <div className="space-y-6">
                        <textarea placeholder="Description" rows={3} className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                        <textarea 
                          placeholder="Features (one per line)" 
                          rows={3} 
                          className="w-full px-6 py-4 bg-gray-50 rounded-xl font-bold border-none" 
                          value={newService.features.join('\n')} 
                          onChange={e => setNewService({...newService, features: e.target.value.split('\n')})} 
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="md:col-span-2 btn-quote py-5">
                        {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : 'Save Service'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service: any) => (
                  <div key={service._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                    <button 
                      onClick={() => deleteService(service._id)}
                      className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full mb-4">
                      {service.category}
                    </span>
                    <h3 className="text-xl font-black mb-2">{service.title}</h3>
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                    <p className="text-lg font-black text-dark mb-4">{service.price}</p>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((f: string, i: number) => (
                        <li key={i} className="text-[10px] text-gray-400 font-bold flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Camera View */}
        <AnimatePresence>
          {isCameraOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-10">
              <button onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach(t => t.stop());
                setIsCameraOpen(false);
              }} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-white hover:text-primary transition-colors"><X className="w-10 h-10 sm:w-12 sm:h-12" /></button>
              <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-video bg-neutral-900 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <button onClick={capturePhoto} className="mt-16 w-28 h-28 bg-white rounded-full border-[10px] border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group">
                <div className="w-16 h-16 bg-white rounded-full border-4 border-black group-hover:border-primary transition-colors" />
              </button>
              <p className="mt-8 text-white text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Click to Capture</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Success Modal */}
        <AnimatePresence>
          {showSuccessModal && lastCreatedGallery && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ scale: 0.8, y: 50 }} 
                animate={{ scale: 1, y: 0 }} 
                className="bg-white max-w-lg w-full rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-16 text-center shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide"
              >
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-black"
                >
                  <X className="w-6 h-6" />
                </button>
                <CheckCircle className="w-16 h-16 sm:w-24 sm:h-24 text-emerald-500 mx-auto mb-6 sm:mb-10" />
                <h3 className="heading-serif text-3xl sm:text-4xl mb-4 italic">Rajat Raj Entertainment</h3>
                <p className="text-gray-400 font-medium mb-8 sm:mb-12 text-sm sm:text-base">Gallery created and QR is ready for your event.</p>
                
                <div className="bg-gray-50 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] mb-8 sm:mb-12 border border-gray-100 flex items-center justify-center">
                  <img 
                    src={lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin)} 
                    className="w-48 h-48 sm:w-64 sm:h-64 mx-auto" 
                    alt="QR" 
                    id="qr-image" 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={handleDownloadQR} 
                    className="btn-quote !py-4 flex items-center justify-center gap-3 text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" /> Download QR
                  </button>
                  <button 
                    onClick={() => {
                      const baseUrl = window.location.origin;
                      const onboardingUrl = `${baseUrl}/onboarding/${lastCreatedGallery.slug}`;
                      const text = `*Rajat Raj Entertainment*\n\nCheck out the gallery for *${lastCreatedGallery.title}*\n\n📸 *View Photos:* ${onboardingUrl}\n🔑 *Password:* ${lastCreatedGallery.password}\n\n_Captured by Rajat Raj Entertainment_`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                    }} 
                    className="btn-satyam-white !py-4 flex items-center justify-center gap-3 text-xs sm:text-sm"
                  >
                    <Share2 className="w-4 h-4" /> Share WhatsApp
                  </button>
                  <button 
                    onClick={() => { 
                      const baseUrl = window.location.origin;
                      navigator.clipboard.writeText(`${baseUrl}/onboarding/${lastCreatedGallery.slug}`); 
                      alert('Link copied to clipboard!'); 
                    }} 
                    className="sm:col-span-2 btn-satyam-white !py-4 flex items-center justify-center gap-3 text-xs sm:text-sm border-dashed border-2"
                  >
                    <Copy className="w-4 h-4" /> Copy Gallery Link
                  </button>
                  <button onClick={() => setShowSuccessModal(false)} className="sm:col-span-2 btn-quote !bg-emerald-500 hover:!bg-emerald-600 !py-4 mt-4">
                    Done & Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPanel;
