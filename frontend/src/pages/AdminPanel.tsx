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
  LogOut,
  TrendingUp,
  Star,
  Users2,
  CreditCard,
  Clock
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
  const [uploadProgress, setUploadProgress] = useState<{
    show: boolean;
    total: number;
    current: number;
    percentage: number;
    speed: string;
    fileName: string;
  }>({ show: false, total: 0, current: 0, percentage: 0, speed: '0 KB/s', fileName: '' });
  const [lastCreatedGallery, setLastCreatedGallery] = useState<any>(null);
  const [activeGalleryForCamera, setActiveGalleryForCamera] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newGallery, setNewGallery] = useState({
    title: '', slug: '', eventDate: new Date().toISOString().split('T')[0], location: '', photographer: 'RRE Team', password: '', coverImage: '', media: [] as any[], revenue: 0, isPublic: false
  });

  const [services, setServices] = useState<any[]>([]);
  const [isEditingService, setIsEditingService] = useState(false);
  const [newService, setNewService] = useState({
    category: 'photography', title: '', description: '', price: '', features: ['']
  });

  const [team, setTeam] = useState<any[]>([]);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({
    name: '', role: '', bio: '', img: '', insta: ''
  });
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);

  const [newClient, setNewClient] = useState({
    name: '', email: '', password: ''
  });
  
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

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
      const [galRes, statRes, clientRes, servRes, teamRes, bookRes, payRes] = await Promise.all([
        fetch(`${API_URL}/api/galleries`),
        fetch(`${API_URL}/api/galleries/admin/stats`),
        fetch(`${API_URL}/api/users`),
        fetch(`${API_URL}/api/services`),
        fetch(`${API_URL}/api/team`),
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/payments`)
      ]);

      if (galRes.ok) setGalleries(await galRes.json());
      if (statRes.ok) setStats(await statRes.json());
      if (clientRes.ok) setClients(await clientRes.json());
      if (servRes.ok) setServices(await servRes.json());
      if (teamRes.ok) setTeam(await teamRes.json());
      if (bookRes.ok) setBookings(await bookRes.json());
      if (payRes.ok) setPayments(await payRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, gallerySlug: string | null = null) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress({
      show: true,
      total: files.length,
      current: 0,
      percentage: 0,
      speed: 'Calculating...',
      fileName: files[0].name
    });

    const uploadFile = (file: File, index: number) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const startTime = Date.now();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const uploaded = event.loaded;
            const total = event.total;
            const elapsed = (Date.now() - startTime) / 1000;
            const speedKB = elapsed > 0 ? uploaded / elapsed / 1024 : 0;
            
            const filePercentage = (uploaded / total) * 100;
            const overallPercentage = ((index / files.length) * 100) + (filePercentage / files.length);

            setUploadProgress(prev => ({
              ...prev,
              current: index + 1,
              percentage: Math.round(overallPercentage),
              speed: speedKB > 1024 ? `${(speedKB / 1024).toFixed(2)} MB/s` : `${speedKB.toFixed(2)} KB/s`,
              fileName: file.name
            }));
          }
        });

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error('Upload failed'));
            }
          }
        };

        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result;
          xhr.open('POST', `${API_URL}/api/galleries/${gallerySlug}/add-media`);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ media: [{ type: 'image', url: base64, thumbnail: '' }] }));
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      if (gallerySlug) {
        for (let i = 0; i < files.length; i++) {
          await uploadFile(files[i], i);
        }
        setUploadProgress(prev => ({ ...prev, percentage: 100 }));
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, show: false }));
          fetchData();
        }, 1500);
      } else {
        // Handle new gallery preview media
        const newMedia: any[] = [];
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          const filePromise = new Promise((resolve) => {
            reader.onload = (event) => resolve({ type: 'image', url: event.target?.result, thumbnail: '' });
          });
          reader.readAsDataURL(files[i]);
          newMedia.push(await filePromise);
        }
        setNewGallery(prev => ({ ...prev, media: [...prev.media, ...newMedia] }));
        setUploadProgress(prev => ({ ...prev, show: false }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please try again.');
      setUploadProgress(prev => ({ ...prev, show: false }));
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

    canvas.width = 600;
    canvas.height = 900;

    const gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 900);

    ctx.fillStyle = '#000000';
    ctx.font = '900 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('RAJAT RAJ ENTERTAINMENT', 300, 80);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('MEDIA & ENTERTAINMENT BRAND', 300, 110);

    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(50, 160, 500, 650, 40);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#000000';
    ctx.font = '900 42px Inter, sans-serif';
    ctx.fillText(lastCreatedGallery.title.toUpperCase(), 300, 240);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText(`${lastCreatedGallery.location} • ${new Date(lastCreatedGallery.eventDate).toLocaleDateString()}`, 300, 280);

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin);
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 125, 330, 350, 350);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('SCAN TO VIEW GALLERY', 300, 740);
      
      ctx.fillStyle = '#64748b';
      ctx.font = 'medium 14px Inter, sans-serif';
      ctx.fillText(`Password: ${lastCreatedGallery.password}`, 300, 770);

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
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access failed.");
      setIsCameraOpen(false);
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const handleCreateTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editingTeamMemberId) {
        res = await fetch(`${API_URL}/api/team/${editingTeamMemberId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTeamMember)
        });
      } else {
        res = await fetch(`${API_URL}/api/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTeamMember)
        });
      }
      if (res.ok) {
        fetchData();
        setNewTeamMember({ name: '', role: '', bio: '', img: '', insta: '' });
        setIsEditingTeam(false);
        setEditingTeamMemberId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    if (!confirm('Delete this team member?')) return;
    try {
      const res = await fetch(`${API_URL}/api/team/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const editTeamMember = (member: any) => {
    setNewTeamMember(member);
    setEditingTeamMemberId(member._id);
    setIsEditingTeam(true);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-28 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-8">
          <div>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary mb-6 shadow-sm">
              <Settings className="w-5 h-5 mr-3" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">RRE ADMIN</span>
            </div>
            <h1 className="heading-serif text-4xl sm:text-6xl mb-4 italic">Control Center</h1>
            <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase">Manage your studio operations</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={handleLogout} className="p-4 sm:p-5 bg-white rounded-[1.5rem] border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group shadow-sm">
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110" />
            </button>
            <button 
              onClick={() => setIsCreating(!isCreating)} 
              className="btn-quote flex items-center gap-3 !px-8 !py-5 !text-sm"
            >
              {isCreating ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span className="hidden sm:inline font-black">Create New Gallery</span>
              <span className="sm:hidden font-black">New</span>
            </button>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-hide w-full mb-10 gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'galleries', label: 'Galleries', icon: FolderOpen },
            { id: 'clients', label: 'Clients', icon: Users2 },
            { id: 'services', label: 'Services', icon: Settings },
            { id: 'team', label: 'Team', icon: Users },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'payments', label: 'Payments', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-black to-gray-900 text-white shadow-lg' 
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading && <div className="py-24 text-center"><RefreshCw className="w-12 h-12 animate-spin mx-auto text-gray-200" /></div>}

        <AnimatePresence mode="wait">
          {!loading && activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-16">
                {[
                  { label: 'Total Events', val: stats.totalEvents, icon: Layers, color: 'text-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-100' },
                  { label: 'Total Clients', val: stats.totalClients, icon: Users, color: 'text-purple-600', bg: 'from-purple-50 to-purple-100', border: 'border-purple-100' },
                  { label: 'Total Revenue', val: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'text-emerald-600', bg: 'from-emerald-50 to-emerald-100', border: 'border-emerald-100' },
                  { label: 'Total Downloads', val: stats.totalDownloads, icon: DownloadCloud, color: 'text-amber-600', bg: 'from-amber-50 to-amber-100', border: 'border-amber-100' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }} className="p-6 sm:p-10 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.bg} ${stat.border} border rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8`}>
                      <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                    </div>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-2 sm:mb-3">{stat.label}</p>
                    <p className="text-2xl sm:text-4xl font-black text-dark tracking-tighter">{stat.val}</p>
                  </motion.div>
                ))}
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white p-12 rounded-[3rem] border border-gray-100 shadow-lg text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h3 className="heading-serif text-4xl mb-6 italic">Welcome back, Admin!</h3>
                <p className="text-gray-600 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                  Your studio is operating smoothly. Use the tabs above to manage all your services, clients, galleries and team!
                </p>
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'galleries' && (
            <motion.div key="galleries" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Galleries</h2>
                <button onClick={() => setIsCreating(!isCreating)} className="btn-quote !py-5 !px-8 !text-sm">
                  {isCreating ? 'Cancel' : 'New Gallery'}
                </button>
              </div>

              {isCreating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-16">
                  <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl relative">
                    <form onSubmit={handleCreateGallery} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-7">
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Event Title</label>
                          <input type="text" placeholder="e.g., Wedding Ceremony" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newGallery.title} onChange={e => setNewGallery({...newGallery, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')})} required />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Event Date</label>
                          <input type="date" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newGallery.eventDate} onChange={e => setNewGallery({...newGallery, eventDate: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Location</label>
                          <div className="flex gap-4">
                            <input type="text" placeholder="Location Name" className="flex-grow px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newGallery.location} onChange={e => setNewGallery({...newGallery, location: e.target.value})} />
                            <button type="button" onClick={detectLocation} className="p-5 bg-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all"><Locate className="w-6 h-6" /></button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-7">
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Access Password</label>
                          <input type="text" placeholder="e.g., RRE2024" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newGallery.password} onChange={e => setNewGallery({...newGallery, password: e.target.value})} required />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Package Price (₹)</label>
                          <input type="number" placeholder="0.00" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newGallery.revenue} onChange={e => setNewGallery({...newGallery, revenue: parseInt(e.target.value) || 0})} />
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <input 
                            type="checkbox" 
                            id="isPublic" 
                            className="w-6 h-6 rounded border-gray-300 text-black focus:ring-black"
                            checked={newGallery.isPublic}
                            onChange={e => setNewGallery({...newGallery, isPublic: e.target.checked})}
                          />
                          <label htmlFor="isPublic" className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Make this Gallery Public</label>
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Cover Image</label>
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
                            className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" 
                          />
                          {newGallery.coverImage && (
                            <div className="mt-5 relative aspect-video rounded-2xl overflow-hidden shadow-sm">
                              <img src={newGallery.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Media Upload</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                             <button type="button" onClick={() => openCamera()} className="py-5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"><CameraIcon className="w-5 h-5" /> Live Camera</button>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                               <Upload className="w-5 h-5" /> Upload Photos
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
                        className="md:col-span-2 btn-quote py-6 mt-6 disabled:opacity-50 text-lg"
                      >
                        {isSubmitting ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : 'Save Gallery & Generate QR'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {galleries.length === 0 ? (
                <div className="py-28 text-center border-2 border-dashed border-gray-200 rounded-[3rem] bg-white">
                  <AlertCircle className="w-20 h-20 text-gray-200 mx-auto mb-8" />
                  <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-sm">No Galleries Created Yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {galleries.map((gallery: any) => (
                  <div key={gallery._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                      <img src={gallery.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                      <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-lg">Pass: {gallery.password}</div>
                    </div>
                    <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">{gallery.title}</h3>
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-gray-500 text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {gallery.location}
                      </p>
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-black text-gray-500">
                        {gallery.media?.length || 0} PHOTOS
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                       <span className="text-sm font-black text-emerald-600">₹{gallery.revenue}</span>
                       <div className="flex gap-4">
                         <CameraIcon onClick={() => openCamera(gallery.slug)} className="w-6 h-6 text-primary cursor-pointer hover:scale-110 transition-all" />
                         <label className="cursor-pointer">
                            <Upload className="w-6 h-6 text-emerald-600 hover:scale-110 transition-all" />
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
                            className="w-6 h-6 text-gray-400 cursor-pointer hover:text-black transition-all" 
                         />
                         <Trash2 className="w-6 h-6 text-red-300 cursor-pointer hover:text-red-600 transition-all" />
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Clients</h2>
                <button onClick={() => setIsAddingClient(!isAddingClient)} className="btn-quote !py-5 !px-8 !text-sm">
                  {isAddingClient ? 'Cancel' : 'Add New Client'}
                </button>
              </div>
              {isAddingClient && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-12">
                  <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl max-w-3xl mx-auto">
                    <form onSubmit={handleAddClient} className="space-y-6">
                      <input type="text" placeholder="Full Name" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
                      <input type="email" placeholder="Email Address" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
                      <input type="password" placeholder="Temp Password" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none focus:ring-4 focus:ring-primary/20" value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} required />
                      <button type="submit" className="w-full btn-quote py-5 text-lg">Register Client</button>
                    </form>
                  </div>
                </motion.div>
              )}
              <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Client</th>
                      <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Contact</th>
                      <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Status</th>
                      <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Events</th>
                      <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {clients.map((client: any) => (
                    <tr key={client._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                            {client.selfieUrl ? (
                              <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <UserIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-dark uppercase tracking-tight text-sm">{client.name}</p>
                            <p className="text-[11px] text-gray-400 font-bold">#{client._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> {client.email}</p>
                          <p className="text-sm text-gray-600 font-bold flex items-center gap-2"><Phone className="w-4 h-4" /> {client.mobile || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border ${
                          client.isVerified 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {client.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-wrap gap-2">
                          {client.myEvents?.map((ev: any) => (
                            <span key={ev._id} className="px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-full border border-primary/10">{ev.title}</span>
                          ))}
                          {client.myEvents?.length === 0 && <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest italic">None</span>}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <select 
                           onChange={(e) => { 
                             if (e.target.value) {
                               assignEventToClient(client._id, e.target.value);
                             }
                           }} 
                           className="bg-gray-50 border border-gray-100 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl px-5 py-4 focus:ring-0 cursor-pointer"
                         >
                           <option value="">Assign Event...</option>
                           {galleries.map((g: any) => {
                             return (<option key={g._id} value={g._id}>{g.title}</option>);
                           })}
                         </select>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-6">
                {clients.map((client: any) => (
                <div key={client._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      {client.selfieUrl ? (
                        <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <UserIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <p className="font-black text-dark uppercase tracking-tight text-lg">{client.name}</p>
                      <p className="text-[11px] text-gray-400 font-bold">#{client._id.slice(-6)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase border flex-shrink-0 ${
                      client.isVerified 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {client.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                    <p className="text-sm text-gray-600 font-bold flex items-center gap-2"><Mail className="w-4 h-4" /> {client.email}</p>
                    <p className="text-sm text-gray-600 font-bold flex items-center gap-2"><Phone className="w-4 h-4" /> {client.mobile || 'N/A'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {client.myEvents?.map((ev: any) => (
                      <span key={ev._id} className="px-4 py-2 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-full border border-primary/10">{ev.title}</span>
                    ))}
                    {client.myEvents?.length === 0 && <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest italic">No events assigned</span>}
                  </div>
                  <select 
                    onChange={(e) => { 
                      if (e.target.value) {
                        assignEventToClient(client._id, e.target.value);
                      }
                    }} 
                    className="w-full bg-gray-50 border border-gray-100 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl px-5 py-4 focus:ring-0 cursor-pointer"
                  >
                     <option value="">Assign Event...</option>
                     {galleries.map((g: any) => {
                       return (<option key={g._id} value={g._id}>{g.title}</option>);
                     })}
                  </select>
                </div>
              ))}
              {clients.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-white">
                  <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-sm">No Clients Yet</p>
                </div>
              )}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'services' && (
            <motion.div key="services" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Manage Services</h2>
                <button onClick={() => setIsEditingService(!isEditingService)} className="btn-quote !py-5 !px-8 !text-sm">
                  {isEditingService ? 'Cancel' : 'Add New Service'}
                </button>
              </div>

              {isEditingService && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-12">
                  <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl max-w-5xl mx-auto">
                    <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-7">
                        <select 
                          className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none"
                          value={newService.category}
                          onChange={e => setNewService({...newService, category: e.target.value})}
                        >
                          <option value="photography">Photography</option>
                          <option value="videography">Videography</option>
                          <option value="audio">Audio Recording</option>
                          <option value="production">Music Production</option>
                          <option value="live">Live Streaming</option>
                        </select>
                        <input type="text" placeholder="Service Title" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                        <input type="text" placeholder="Starting Price" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                      </div>
                      <div className="space-y-7">
                        <textarea placeholder="Description" rows={3} className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                        <textarea 
                          placeholder="Features (one per line)" 
                          rows={3} 
                          className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" 
                          value={newService.features.join('\n')} 
                          onChange={e => setNewService({...newService, features: e.target.value.split('\n')})} 
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="md:col-span-2 btn-quote py-6 text-lg">
                        {isSubmitting ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : 'Save Service'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service: any) => (
                <div key={service._id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                  <button 
                    onClick={() => deleteService(service._id)}
                    className="absolute top-7 right-7 p-3 bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className="inline-block px-5 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full mb-6">
                    {service.category}
                  </span>
                  <h3 className="text-2xl font-black mb-4">{service.title}</h3>
                  <p className="text-gray-500 text-base mb-6 line-clamp-2">{service.description}</p>
                  <p className="text-2xl font-black text-dark mb-8">{service.price}</p>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((f: string, i: number) => (
                      <li key={i} className="text-[11px] text-gray-500 font-bold flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-emerald-600" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Manage Team</h2>
                <button onClick={() => {
                  setIsEditingTeam(!isEditingTeam);
                  if (!isEditingTeam) {
                    setNewTeamMember({ name: '', role: '', bio: '', img: '', insta: '' });
                    setEditingTeamMemberId(null);
                  }
                }} className="btn-quote !py-5 !px-8 !text-sm">
                  {isEditingTeam ? 'Cancel' : 'Add New Member'}
                </button>
              </div>

              {isEditingTeam && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden mb-12">
                  <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl max-w-5xl mx-auto">
                    <form onSubmit={handleCreateTeamMember} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-7">
                        <input type="text" placeholder="Member Name" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} required />
                        <input type="text" placeholder="Role (e.g., CEO & Founder)" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} required />
                        <input type="text" placeholder="Profile Image URL" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newTeamMember.img} onChange={e => setNewTeamMember({...newTeamMember, img: e.target.value})} required />
                        <input type="text" placeholder="Instagram URL (optional)" className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newTeamMember.insta} onChange={e => setNewTeamMember({...newTeamMember, insta: e.target.value})} />
                      </div>
                      <div className="space-y-7">
                        <textarea placeholder="Bio" rows={6} className="w-full px-6 py-5 bg-gray-50 rounded-2xl font-bold border-none" value={newTeamMember.bio} onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} required />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="md:col-span-2 btn-quote py-6 text-lg">
                        {isSubmitting ? <RefreshCw className="w-6 h-6 animate-spin mx-auto" /> : (editingTeamMemberId ? 'Update Member' : 'Save Member')}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                {team.map((member: any) => (
                <div key={member._id} className="bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                  <div className="flex gap-2 sm:gap-3 absolute top-5 sm:top-7 right-5 sm:right-7 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => editTeamMember(member)} className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all">
                      <Settings className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteTeamMember(member._id)} className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">{member.name}</h3>
                  <p className="text-primary text-sm font-bold mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm line-clamp-3">{member.bio}</p>
                </div>
              ))}
              </div>
            </motion.div>
          )}

          {!loading && activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Event Bookings</h2>
                <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">
                    Total Bookings: {bookings.length}
                  </span>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-white p-16 rounded-[3rem] border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="heading-serif text-3xl mb-4 italic">No Bookings Yet</h3>
                  <p className="text-gray-500 font-medium max-w-xl mx-auto">
                    Bookings will appear here once your clients start booking services!
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-12 px-8 py-6 bg-gradient-to-r from-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Service</div>
                    <div className="col-span-2">Event Date</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-3">Status</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <motion.div key={booking._id} className="grid grid-cols-12 px-8 py-6 hover:bg-gray-50 transition-all duration-300">
                        <div className="col-span-3 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-black text-lg">{booking.customerName}</p>
                            <p className="text-gray-400 text-xs font-bold">{booking.customerEmail}</p>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <p className="font-black">{booking.service?.title || "Unknown Service"}</p>
                        </div>

                        <div className="col-span-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-500 text-sm font-bold">
                            {new Date(booking.eventDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <span className="font-black text-xl text-emerald-600">
                            ₹{booking.totalAmount / 100}
                          </span>
                        </div>

                        <div className="col-span-3 flex items-center justify-start gap-3">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            booking.paymentStatus === 'paid' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : booking.paymentStatus === 'failed' 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {booking.paymentStatus === 'paid' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {booking.paymentStatus}
                          </span>
                          
                          {/* Update Status Dropdown/Button */}
                          <select 
                            value={booking.status} 
                            onChange={async (e) => {
                              try {
                                await fetch(`${API_URL}/api/bookings/${booking._id}/status`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: e.target.value })
                                });
                                fetchData();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="text-sm font-bold px-3 py-2 bg-secondary rounded-xl border border-gray-100"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!loading && activeTab === 'payments' && (
            <motion.div key="payments" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <h2 className="heading-serif text-3xl sm:text-4xl">Payment History</h2>
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">
                    Total Revenue: ₹{payments.reduce((acc, p) => acc + (p.amount / 100), 0)}
                  </span>
                </div>
              </div>

              {payments.length === 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-white p-16 rounded-[3rem] border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CreditCard className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="heading-serif text-3xl mb-4 italic">No Payments Yet</h3>
                  <p className="text-gray-500 font-medium max-w-xl mx-auto">
                    Payments will appear here once your clients start downloading photos!
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-12 px-8 py-6 bg-gradient-to-r from-gray-50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Gallery</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Status</div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {payments.map((payment) => (
                      <motion.div key={payment._id} className="grid grid-cols-12 px-8 py-6 hover:bg-gray-50 transition-all duration-300">
                        <div className="col-span-3 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-black text-lg">{payment.customerName}</p>
                            <p className="text-gray-400 text-xs font-bold">{payment.customerEmail}</p>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <p className="font-black">{payment.gallery?.title || "Unknown Gallery"}</p>
                        </div>

                        <div className="col-span-2 flex items-center">
                          <span className="font-black text-xl text-emerald-600">
                            ₹{payment.amount / 100}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-500 text-sm font-bold">
                            {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="col-span-3 flex items-center justify-start">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            payment.status === 'paid' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : payment.status === 'failed' 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-amber-50 text-amber-700'
                          }`}>
                            {payment.status === 'paid' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {payment.status}
                          </span>
                        </div>

                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6">
            <button onClick={() => {
              const stream = videoRef.current?.srcObject as MediaStream;
              stream?.getTracks().forEach(track => track.stop());
              setIsCameraOpen(false);
            }} className="absolute top-8 right-8 text-white hover:text-primary transition-colors"><X className="w-14 h-14" /></button>
            <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-video bg-neutral-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <button onClick={capturePhoto} className="mt-16 w-32 h-32 bg-white rounded-full border-[12px] border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-black group-hover:border-primary transition-colors" />
            </button>
            <p className="mt-10 text-white text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">Click to Capture</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && lastCreatedGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white max-w-xl w-full rounded-[3.5rem] p-10 sm:p-16 text-center shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-8 right-8 p-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black"
              >
                <X className="w-7 h-7" />
              </button>
              <CheckCircle className="w-20 h-20 sm:w-28 sm:h-28 text-emerald-600 mx-auto mb-8" />
              <h3 className="heading-serif text-4xl sm:text-5xl mb-6 italic">Rajat Raj Entertainment</h3>
              <p className="text-gray-500 font-medium mb-12 text-lg">Gallery created and QR is ready for your event.</p>
              
              <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-[3rem] mb-12 border border-gray-100 flex items-center justify-center">
                <img 
                  src={lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin)} 
                  className="w-64 h-64 sm:w-80 sm:h-80 mx-auto" 
                  alt="QR" 
                  id="qr-image" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button 
                  onClick={handleDownloadQR} 
                  className="btn-quote !py-5 flex items-center justify-center gap-4 text-sm"
                >
                  <Download className="w-6 h-6" /> Download QR
                </button>
                <button 
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const onboardingUrl = `${baseUrl}/onboarding/${lastCreatedGallery.slug}`;
                    const text = `*RAJAT RAJ ENTERTAINMENT*\n\nCheck out the gallery for *${lastCreatedGallery.title}*\n\n📸 *View Photos*: ${onboardingUrl}\n🔑 *Password*: ${lastCreatedGallery.password}\n\n_Captured by Rajat Raj Entertainment_`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                  }} 
                  className="btn-satyam-white !py-5 flex items-center justify-center gap-4 text-sm"
                >
                  <Share2 className="w-6 h-6" /> Share WhatsApp
                </button>
                <button 
                  onClick={() => { 
                    const baseUrl = window.location.origin;
                    navigator.clipboard.writeText(`${baseUrl}/onboarding/${lastCreatedGallery.slug}`); 
                    alert('Link copied to clipboard!'); 
                  }} 
                  className="sm:col-span-2 btn-satyam-white !py-5 flex items-center justify-center gap-4 text-sm border-dashed border-2"
                >
                  <Copy className="w-6 h-6" /> Copy Gallery Link
                </button>
                <button onClick={() => setShowSuccessModal(false)} className="sm:col-span-2 btn-quote !bg-emerald-600 hover:!bg-emerald-700 !py-6 mt-6">
                  Done & Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress Dialog */}
      <AnimatePresence>
        {uploadProgress.show && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 right-10 z-[1000] w-96 bg-black text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="heading-serif text-xl italic">Uploading Media</h4>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">{uploadProgress.speed}</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                <span className="text-gray-400">Progress</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-[11px] font-black uppercase tracking-tight truncate">{uploadProgress.fileName}</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                  Photo {uploadProgress.current} of {uploadProgress.total}
                </p>
              </div>
              {uploadProgress.percentage === 100 && (
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
