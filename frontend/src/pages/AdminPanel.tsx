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
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { API_URL } from '../config/api';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'galleries', label: 'Galleries', icon: FolderOpen },
  { id: 'clients', label: 'Clients', icon: Users2 },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [galleries, setGalleries] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
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
  const teamPhotoRef = useRef<HTMLInputElement>(null);
  
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
  const [teamPhotoPreview, setTeamPhotoPreview] = useState<string>('');

  const [newClient, setNewClient] = useState({
    name: '', email: '', password: ''
  });
  
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);

  // ── PRESERVED: Authentication verification & polling ──
  useEffect(() => {
    const auth = localStorage.getItem('isAdminAuthenticated');
    if (auth !== 'true') {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchData();
      
      // Real-time polling every 10 seconds for live updates
      const interval = setInterval(() => {
        fetchData(true);
      }, 10000);
      return () => {
        clearInterval(interval);
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  // ── PRESERVED: Fetch data endpoints ──
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const galRes = await fetch(`${API_URL}/api/galleries`);
      if (galRes.ok) setGalleries(await galRes.json());

      const statRes = await fetch(`${API_URL}/api/galleries/admin/stats`);
      if (statRes.ok) setStats(await statRes.json());

      const clientRes = await fetch(`${API_URL}/api/users`);
      if (clientRes.ok) setClients(await clientRes.json());

      const servRes = await fetch(`${API_URL}/api/services`);
      if (servRes.ok) setServices(await servRes.json());

      const teamRes = await fetch(`${API_URL}/api/team`);
      if (teamRes.ok) setTeam(await teamRes.json());

      const bookRes = await fetch(`${API_URL}/api/bookings`);
      if (bookRes.ok) setBookings(await bookRes.json());

      const payRes = await fetch(`${API_URL}/api/payments`);
      if (payRes.ok) setPayments(await payRes.json());
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ── PRESERVED: File Upload with real-time XHR progress tracking ──
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
      toast.error('Upload failed. Please try again.');
      setUploadProgress(prev => ({ ...prev, show: false }));
    }
  };

  const openQrModal = (gallery: any) => {
    setLastCreatedGallery(gallery);
    setShowSuccessModal(true);
  };

  // ── PRESERVED: QR Canvas Generator ──
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

  // ── PRESERVED: Gallery creation ──
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
        toast.success('Gallery created successfully!');
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message || 'Failed to create gallery'}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection Error: Is the backend server running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNewGallery(prev => ({ ...prev, location: "Live Event Location (Mumbai)" }));
        toast.success('Location detected');
      }, () => {
        toast.error("Location access denied.");
      });
    } else {
      toast.error("Geolocation not supported.");
    }
  };

  // ── PRESERVED: Camera handler ──
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = async (gallerySlug: string | null = null) => {
    setActiveGalleryForCamera(gallerySlug);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Camera access failed.");
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
              toast.success('Uploaded Successfully!');
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

  // ── PRESERVED: Client management ──
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
        toast.success('Client registered!');
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
        toast.success('Event assigned!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── PRESERVED: Services CRUD ──
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
        toast.success('Service saved!');
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
      if (res.ok) {
        fetchData();
        toast.success('Service deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── PRESERVED: Team CRUD ──
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
        setTeamPhotoPreview('');
        setIsEditingTeam(false);
        setEditingTeamMemberId(null);
        toast.success(editingTeamMemberId ? 'Team member updated' : 'Team member added');
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
      if (res.ok) {
        fetchData();
        toast.success('Team member removed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const editTeamMember = (member: any) => {
    setNewTeamMember(member);
    setTeamPhotoPreview(member.img || '');
    setEditingTeamMemberId(member._id);
    setIsEditingTeam(true);
  };

  // ── PRESERVED: Gallery delete and update ──
  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this gallery? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_URL}/api/galleries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Gallery deleted');
        fetchData();
      } else {
        toast.error('Failed to delete gallery');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error');
    }
  };

  const handleUpdateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGallery) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/galleries/${editingGallery._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingGallery)
      });
      if (res.ok) {
        toast.success('Gallery updated!');
        setEditingGallery(null);
        fetchData();
      } else {
        toast.error('Failed to update gallery');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white pt-24 pb-20">
      <div className="satyam-container space-y-8">

        {/* ── ADMIN HEADER ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-8 border-b border-white/10 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-subtle border border-white/15 text-[10px] font-bold uppercase tracking-[0.35em] text-white/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RRE Operations Control</span>
            </div>
            <h1 className="heading-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Management Console.
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
              Live studio oversight & resources
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCreating(!isCreating)} 
              className="flex items-center gap-2 px-5 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isCreating ? 'Cancel' : 'New Gallery'}</span>
            </button>
            <button 
              onClick={handleLogout} 
              aria-label="Log Out"
              className="p-3 glass-subtle border border-white/15 rounded-xl text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── TAB NAVIGATION BAR ── */}
        <div className="flex items-center gap-1.5 glass-strong border border-white/10 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-black font-black shadow-md'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── LOADING SKELETON ── */}
        {loading && (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-white/30" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Loading Studio State…</p>
          </div>
        )}

        {/* ── ACTIVE TAB CONTENT ── */}
        <AnimatePresence mode="wait">

          {/* ════ TAB 1: DASHBOARD OVERVIEW ════ */}
          {!loading && activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Events', val: stats.totalEvents, icon: Layers },
                  { label: 'Total Clients', val: stats.totalClients, icon: Users },
                  { label: 'Total Revenue', val: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign },
                  { label: 'Total Downloads', val: stats.totalDownloads, icon: DownloadCloud },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 15 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: i * 0.08 }} 
                      className="p-6 rounded-2xl glass-strong border border-white/12 space-y-4"
                    >
                      <div className="flex items-center justify-between text-white/40">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">{stat.label}</span>
                        <div className="w-9 h-9 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/60">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{stat.val}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="glass-subtle border border-white/10 p-8 sm:p-12 rounded-3xl space-y-4 text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center mx-auto text-amber-400">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
                <h3 className="heading-serif text-2xl sm:text-3xl font-bold text-white">System Status: Operational</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  All microservices, galleries, booking workflows, and client repositories are running with synchronized state.
                </p>
              </div>
            </motion.div>
          )}

          {/* ════ TAB 2: GALLERIES ════ */}
          {!loading && activeTab === 'galleries' && (
            <motion.div 
              key="galleries" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              {/* Gallery Creation Form */}
              {isCreating && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="glass-strong p-8 sm:p-10 rounded-3xl border border-white/15 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h3 className="heading-serif text-xl font-bold text-white">Create New Event Gallery</h3>
                      <button onClick={() => setIsCreating(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>

                    <form onSubmit={handleCreateGallery} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Event Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Royal Wedding Gala" 
                            className="w-full px-4 py-3 bg-white/5 border border-white/12 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium" 
                            value={newGallery.title} 
                            onChange={e => setNewGallery({...newGallery, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')})} 
                            required 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Event Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 bg-white/5 border border-white/12 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium [color-scheme:dark]" 
                            value={newGallery.eventDate} 
                            onChange={e => setNewGallery({...newGallery, eventDate: e.target.value})} 
                            required 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Location</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="City / Venue" 
                              className="flex-grow px-4 py-3 bg-white/5 border border-white/12 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium" 
                              value={newGallery.location} 
                              onChange={e => setNewGallery({...newGallery, location: e.target.value})} 
                            />
                            <button type="button" onClick={detectLocation} className="p-3 glass-subtle border border-white/15 rounded-xl hover:border-white/30 text-white/60 hover:text-white"><Locate className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Access Password</label>
                          <input 
                            type="text" 
                            placeholder="e.g. RRE2026" 
                            className="w-full px-4 py-3 bg-white/5 border border-white/12 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium" 
                            value={newGallery.password} 
                            onChange={e => setNewGallery({...newGallery, password: e.target.value})} 
                            required 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Package Price (₹)</label>
                          <input 
                            type="number" 
                            placeholder="Optional amount" 
                            className="w-full px-4 py-3 bg-white/5 border border-white/12 focus:border-white/40 focus:outline-none rounded-xl text-white text-sm font-medium" 
                            value={newGallery.revenue || ''} 
                            onChange={e => setNewGallery({...newGallery, revenue: parseInt(e.target.value) || 0})} 
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <input 
                            type="checkbox" 
                            id="isPublic" 
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-white focus:ring-0"
                            checked={newGallery.isPublic}
                            onChange={e => setNewGallery({...newGallery, isPublic: e.target.checked})}
                          />
                          <label htmlFor="isPublic" className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Make Gallery Public</label>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Cover Image</label>
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
                            className="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer" 
                          />
                          {newGallery.coverImage && (
                            <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-white/15">
                              <img src={newGallery.coverImage} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 pt-2 flex flex-col sm:flex-row gap-3">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="flex items-center justify-center gap-2 py-3 px-5 glass-subtle border border-white/15 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Photos
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          multiple 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e)} 
                        />
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50"
                        >
                          {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Gallery & Generate QR'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Gallery Grid */}
              {galleries.length === 0 ? (
                <div className="py-20 text-center glass-subtle rounded-3xl border border-white/10 space-y-3">
                  <AlertCircle className="w-10 h-10 text-white/20 mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">No Galleries Created Yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.map((gallery: any) => (
                    <div key={gallery._id} className="glass-strong p-6 rounded-3xl border border-white/12 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                          <img 
                            src={gallery.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} 
                            className="w-full h-full object-cover" 
                            alt={gallery.title} 
                            loading="lazy" 
                          />
                          <div className="absolute top-3 right-3 glass-strong px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white border border-white/15">
                            Pass: {gallery.password}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h3 className="heading-serif text-xl font-bold text-white leading-tight">{gallery.title}</h3>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-white/40">
                            <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {gallery.location}</span>
                            <span className="glass-subtle px-2 py-0.5 rounded border border-white/10 text-white/60">{gallery.media?.length || 0} Captures</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <span className="text-xs font-mono font-bold text-emerald-400">{gallery.revenue ? `₹${gallery.revenue.toLocaleString('en-IN')}` : '—'}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openCamera(gallery.slug)} aria-label="Camera" className="p-2 glass-subtle rounded-lg text-white/50 hover:text-white border border-white/10">
                            <CameraIcon className="w-4 h-4" />
                          </button>
                          <label className="p-2 glass-subtle rounded-lg text-white/50 hover:text-white border border-white/10 cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileUpload(e, gallery.slug)} />
                          </label>
                          <button onClick={() => openQrModal(gallery)} aria-label="QR Code" className="p-2 glass-subtle rounded-lg text-white/50 hover:text-white border border-white/10">
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingGallery({ ...gallery })} aria-label="Edit" className="p-2 glass-subtle rounded-lg text-white/50 hover:text-white border border-white/10">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteGallery(gallery._id)} aria-label="Delete" className="p-2 glass-subtle rounded-lg text-red-400 hover:text-red-300 border border-white/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════ TAB 3: CLIENTS ════ */}
          {!loading && activeTab === 'clients' && (
            <motion.div 
              key="clients" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="heading-serif text-2xl font-bold">Client Directory</h2>
                <button 
                  onClick={() => setIsAddingClient(!isAddingClient)} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingClient ? 'Cancel' : 'Add Client'}</span>
                </button>
              </div>

              {isAddingClient && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="glass-strong p-8 rounded-3xl border border-white/12 max-w-2xl mx-auto space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Register New Client</h3>
                    <form onSubmit={handleAddClient} className="space-y-3">
                      <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
                      <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
                      <input type="password" placeholder="Temporary Password" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium" value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} required />
                      <button type="submit" className="w-full py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90">Register Client</button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Client List (Desktop Table) */}
              <div className="hidden md:block glass-strong rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Client</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Contact</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Status</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Events</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Assign</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.map((client: any) => (
                      <tr key={client._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center">
                              {client.selfieUrl ? (
                                <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                              ) : (
                                <UserIcon className="w-4 h-4 text-white/40" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{client.name}</p>
                              <p className="text-[10px] text-white/30 font-mono">#{client._id.slice(-6)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/70">
                          <p>{client.email}</p>
                          <p className="text-white/40 text-[10px]">{client.mobile || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            client.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {client.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {client.myEvents?.map((ev: any) => (
                              <span key={ev._id} className="px-2 py-0.5 glass-subtle text-[9px] font-bold uppercase rounded border border-white/10">{ev.title}</span>
                            ))}
                            {(!client.myEvents || client.myEvents.length === 0) && <span className="text-[10px] text-white/20">None</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            onChange={(e) => { 
                              if (e.target.value) {
                                assignEventToClient(client._id, e.target.value);
                              }
                            }} 
                            className="bg-white/5 border border-white/12 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer [color-scheme:dark]"
                          >
                            <option value="">Assign Event…</option>
                            {galleries.map((g: any) => (
                              <option key={g._id} value={g._id}>{g.title}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {clients.map((client: any) => (
                  <div key={client._id} className="glass-strong rounded-2xl border border-white/10 p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/20 flex-shrink-0 flex items-center justify-center">
                        {client.selfieUrl ? (
                          <img src={client.selfieUrl} className="w-full h-full object-cover" alt={client.name} />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-sm text-white">{client.name}</p>
                        <p className="text-[10px] text-white/40">{client.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                        client.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {client.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>

                    <select 
                      onChange={(e) => { 
                        if (e.target.value) {
                          assignEventToClient(client._id, e.target.value);
                        }
                      }} 
                      className="w-full bg-white/5 border border-white/12 text-[10px] font-bold uppercase tracking-wider rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer [color-scheme:dark]"
                    >
                      <option value="">Assign Event…</option>
                      {galleries.map((g: any) => (
                        <option key={g._id} value={g._id}>{g.title}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ TAB 4: SERVICES ════ */}
          {!loading && activeTab === 'services' && (
            <motion.div 
              key="services" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="heading-serif text-2xl font-bold">Services Configuration</h2>
                <button 
                  onClick={() => setIsEditingService(!isEditingService)} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEditingService ? 'Cancel' : 'Add Service'}</span>
                </button>
              </div>

              {isEditingService && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="glass-strong p-8 rounded-3xl border border-white/12 max-w-3xl mx-auto space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Create New Service</h3>
                    <form onSubmit={handleCreateService} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <select 
                          className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium [color-scheme:dark]"
                          value={newService.category}
                          onChange={e => setNewService({...newService, category: e.target.value})}
                        >
                          <option value="photography">Photography</option>
                          <option value="videography">Videography</option>
                          <option value="audio">Audio Recording</option>
                          <option value="production">Music Production</option>
                          <option value="live">Live Streaming</option>
                        </select>
                        <input type="text" placeholder="Service Title" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                        <input type="text" placeholder="Starting Price (e.g. ₹50,000)" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                      </div>
                      <textarea placeholder="Description" rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                      <textarea 
                        placeholder="Features (one per line)" 
                        rows={3} 
                        className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" 
                        value={newService.features.join('\n')} 
                        onChange={e => setNewService({...newService, features: e.target.value.split('\n')})} 
                      />
                      <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90">
                        {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Save Service'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <div key={service._id} className="glass-strong p-8 rounded-3xl border border-white/10 space-y-4 relative group flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider glass-subtle text-white/70 border border-white/10">
                          {service.category}
                        </span>
                        <button 
                          onClick={() => deleteService(service._id)}
                          aria-label="Delete Service"
                          className="p-2 glass-subtle rounded-lg text-red-400 hover:text-red-300 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="heading-serif text-2xl font-bold text-white">{service.title}</h3>
                      <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{service.description}</p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <p className="text-lg font-black text-white font-mono">{service.price}</p>
                      <ul className="space-y-1.5">
                        {service.features.slice(0, 3).map((f: string, i: number) => (
                          <li key={i} className="text-[10px] text-white/60 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ TAB 5: TEAM ════ */}
          {!loading && activeTab === 'team' && (
            <motion.div 
              key="team" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="heading-serif text-2xl font-bold">Team Management</h2>
                <button 
                  onClick={() => {
                    setIsEditingTeam(!isEditingTeam);
                    if (!isEditingTeam) {
                      setNewTeamMember({ name: '', role: '', bio: '', img: '', insta: '' });
                      setTeamPhotoPreview('');
                      setEditingTeamMemberId(null);
                    }
                  }} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isEditingTeam ? 'Cancel' : 'Add Member'}</span>
                </button>
              </div>

              {isEditingTeam && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                  <div className="glass-strong p-8 rounded-3xl border border-white/12 max-w-3xl mx-auto space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {editingTeamMemberId ? 'Edit Team Member' : 'Add Team Member'}
                    </h3>
                    <form onSubmit={handleCreateTeamMember} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} required />
                        <input type="text" placeholder="Role (e.g. Lead Cinematographer)" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} required />
                        <input type="text" placeholder="Instagram Profile URL (optional)" className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newTeamMember.insta} onChange={e => setNewTeamMember({...newTeamMember, insta: e.target.value})} />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Profile Photo (Max 5MB)</label>
                        <div
                          onClick={() => teamPhotoRef.current?.click()}
                          className="w-full py-8 glass-subtle border-2 border-dashed border-white/15 rounded-2xl hover:border-white/30 cursor-pointer flex flex-col items-center justify-center gap-2 text-center"
                        >
                          {teamPhotoPreview ? (
                            <img src={teamPhotoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-white/20" />
                          ) : (
                            <>
                              <CameraIcon className="w-6 h-6 text-white/40" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Upload Photo</span>
                            </>
                          )}
                        </div>
                        <input
                          ref={teamPhotoRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('Photo must be under 5MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              setTeamPhotoPreview(dataUrl);
                              setNewTeamMember(prev => ({ ...prev, img: dataUrl }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </div>

                      <textarea placeholder="Biography" rows={4} className="w-full px-4 py-3 bg-white/5 border border-white/12 rounded-xl text-white text-sm" value={newTeamMember.bio} onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} required />

                      <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90">
                        {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : (editingTeamMemberId ? 'Update Member' : 'Save Member')}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member: any) => (
                  <div key={member._id} className="glass-strong p-6 rounded-3xl border border-white/10 space-y-4 relative group">
                    <div className="flex gap-2 absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editTeamMember(member)} aria-label="Edit" className="p-2 glass-subtle rounded-lg text-white hover:bg-white/20">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteTeamMember(member._id)} aria-label="Delete" className="p-2 glass-subtle rounded-lg text-red-400 hover:bg-red-500/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 relative">
                      <img 
                        src={member.img} 
                        alt={member.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy" 
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'} 
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="heading-serif text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{member.role}</p>
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-3 pt-1">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ TAB 6: BOOKINGS ════ */}
          {!loading && activeTab === 'bookings' && (
            <motion.div 
              key="bookings" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="heading-serif text-2xl font-bold">Event Bookings</h2>
                <span className="glass-subtle border border-white/15 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Total: {bookings.length}
                </span>
              </div>

              {bookings.length === 0 ? (
                <div className="py-20 text-center glass-subtle rounded-3xl border border-white/10 space-y-3">
                  <Calendar className="w-10 h-10 text-white/20 mx-auto" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">No Bookings Recorded</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking._id} className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-4">
                        
                        {/* Customer */}
                        <div className="md:col-span-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl glass-subtle border border-white/15 flex items-center justify-center text-white/60 shrink-0">
                            <UserIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-white truncate">{booking.customerName}</p>
                            <p className="text-[10px] text-white/40 truncate">{booking.customerEmail}</p>
                            {booking.customerPhone && <p className="text-[10px] text-white/40">{booking.customerPhone}</p>}
                          </div>
                        </div>

                        {/* Service */}
                        <div className="md:col-span-3">
                          <p className="text-xs font-bold text-white">{booking.service?.title || 'Unknown Service'}</p>
                          <p className="text-[10px] text-white/35 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> {new Date(booking.eventDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        {/* Amount */}
                        <div className="md:col-span-2">
                          <span className="font-mono font-bold text-base text-emerald-400">
                            ₹{(booking.totalAmount / 100).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-2 flex-wrap">
                          {booking.paymentStatus === 'paid' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Pending
                            </span>
                          )}

                          <select
                            value={booking.status}
                            onChange={async (e) => {
                              try {
                                await fetch(`${API_URL}/api/bookings/${booking._id}/status`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ status: e.target.value })
                                });
                                toast.success('Status updated');
                                fetchData();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                            className="text-xs font-bold px-3 py-1.5 bg-white/5 rounded-lg border border-white/15 focus:outline-none cursor-pointer [color-scheme:dark]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Detail Footer */}
                      {(booking.eventLocation || booking.additionalNotes || booking.bookingId) && (
                        <div className="px-6 py-3 bg-white/3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/40">
                          <div className="flex items-center gap-4 flex-wrap">
                            {booking.bookingId && <span className="font-mono text-white/50">#{booking.bookingId}</span>}
                            {booking.eventLocation && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.eventLocation}</span>}
                            {booking.additionalNotes && <span className="italic">Note: {booking.additionalNotes}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════ TAB 7: PAYMENTS ════ */}
          {!loading && activeTab === 'payments' && (
            (() => {
              const allTransactions = [
                ...payments.map(p => ({
                  _id: p._id,
                  customerName: p.customerName,
                  customerEmail: p.customerEmail,
                  title: p.gallery?.title || "Gallery Access",
                  amount: p.amount / 100,
                  date: p.createdAt,
                  status: p.status,
                  type: 'Gallery Purchase'
                })),
                ...bookings.filter(b => b.paymentStatus !== 'pending' && b.paymentStatus).map(b => ({
                  _id: b._id,
                  customerName: b.customerName,
                  customerEmail: b.customerEmail,
                  title: b.service?.title || "Event Booking",
                  amount: b.totalAmount / 100,
                  date: b.updatedAt || b.createdAt,
                  status: b.paymentStatus,
                  type: 'Booking Payment'
                })),
                ...galleries.filter(g => g.revenue > 0).map(g => ({
                  _id: g._id + '_manual',
                  customerName: "Direct Payment",
                  customerEmail: "Recorded via Gallery",
                  title: g.title,
                  amount: g.revenue,
                  date: g.createdAt,
                  status: 'paid',
                  type: 'Manual Entry'
                }))
              ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

              const totalRevenue = allTransactions
                .filter(t => t.status === 'paid' || t.status === 'confirmed')
                .reduce((acc, t) => acc + (t.amount || 0), 0);

              return (
                <motion.div 
                  key="payments" 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -15 }} 
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="heading-serif text-2xl font-bold">Transaction History</h2>
                    <span className="glass-subtle border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-mono font-black">
                      Total: ₹{totalRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {allTransactions.length === 0 ? (
                    <div className="py-20 text-center glass-subtle rounded-3xl border border-white/10 space-y-3">
                      <CreditCard className="w-10 h-10 text-white/20 mx-auto" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">No Transactions Yet</p>
                    </div>
                  ) : (
                    <div className="glass-strong rounded-3xl border border-white/10 overflow-hidden">
                      <div className="hidden md:grid grid-cols-12 px-6 py-3.5 bg-white/5 border-b border-white/10 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                        <div className="col-span-4">Customer</div>
                        <div className="col-span-3">Item / Service</div>
                        <div className="col-span-3">Amount</div>
                        <div className="col-span-2 text-right">Status</div>
                      </div>

                      <div className="divide-y divide-white/5">
                        {allTransactions.map((payment) => (
                          <div key={payment._id} className="grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-start md:items-center gap-3 md:gap-0 hover:bg-white/3 transition-colors">
                            <div className="md:col-span-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg glass-subtle border border-white/15 flex items-center justify-center text-white/60 shrink-0">
                                <UserIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-white truncate">{payment.customerName}</p>
                                <p className="text-[10px] text-white/35 truncate">{payment.customerEmail}</p>
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <p className="text-xs font-bold text-white truncate">{payment.title}</p>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">{payment.type}</span>
                            </div>

                            <div className="md:col-span-3">
                              <span className="font-mono font-bold text-sm text-emerald-400">
                                ₹{payment.amount?.toLocaleString('en-IN') || 0}
                              </span>
                              <p className="text-[9px] text-white/30">
                                {new Date(payment.date).toLocaleDateString('en-IN')}
                              </p>
                            </div>

                            <div className="md:col-span-2 text-left md:text-right">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                payment.status === 'paid' || payment.status === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })()
          )}

        </AnimatePresence>

      </div>

      {/* ── MODAL 1: LIVE CAMERA VIEWPORT ── */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
            <button onClick={() => {
              const stream = videoRef.current?.srcObject as MediaStream;
              stream?.getTracks().forEach(track => track.stop());
              setIsCameraOpen(false);
            }} className="absolute top-8 right-8 text-white/50 hover:text-white"><X className="w-10 h-10" /></button>
            <div className="relative w-full max-w-3xl aspect-[3/4] sm:aspect-video bg-neutral-900 rounded-3xl overflow-hidden border border-white/15">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <button onClick={capturePhoto} className="mt-10 w-20 h-20 rounded-full border-4 border-white/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center bg-white text-black">
              <CameraIcon className="w-8 h-8" />
            </button>
            <p className="mt-4 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Click to Capture</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: SUCCESS QR FLYER ── */}
      <AnimatePresence>
        {showSuccessModal && lastCreatedGallery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              className="glass-strong max-w-md w-full rounded-3xl p-8 sm:p-10 text-center border border-white/15 space-y-6 relative"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full glass-subtle text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="heading-serif text-2xl font-bold text-white">{lastCreatedGallery.title}</h3>
                <p className="text-xs text-white/40">Gallery initialized & QR ready</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl flex items-center justify-center">
                <img 
                  src={lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin)} 
                  className="w-48 h-48" 
                  alt="QR" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={handleDownloadQR} 
                  className="py-3 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download QR
                </button>
                <button 
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const onboardingUrl = `${baseUrl}/onboarding/${lastCreatedGallery.slug}`;
                    const text = `*RAJAT RAJ ENTERTAINMENT*\n\nCheck out the gallery for *${lastCreatedGallery.title}*\n\n📸 *View Photos*: ${onboardingUrl}\n🔑 *Password*: ${lastCreatedGallery.password}\n\n_Captured by Rajat Raj Entertainment_`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
                  }} 
                  className="py-3 px-4 glass-subtle border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:border-white/40 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> WhatsApp
                </button>
                <button 
                  onClick={() => { 
                    const baseUrl = window.location.origin;
                    navigator.clipboard.writeText(`${baseUrl}/onboarding/${lastCreatedGallery.slug}`); 
                    toast.success('Link copied to clipboard!'); 
                  }} 
                  className="sm:col-span-2 py-3 px-4 glass-subtle border border-white/15 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-white flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Copy Direct Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: UPLOAD PROGRESS DIALOG ── */}
      <AnimatePresence>
        {uploadProgress.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[1000] w-80 glass-strong text-white p-6 rounded-2xl border border-white/20 shadow-2xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Uploading Media</h4>
              <span className="text-[9px] font-mono text-emerald-400">{uploadProgress.speed}</span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-white/40">
                <span>{uploadProgress.fileName}</span>
                <span>{uploadProgress.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress.percentage}%` }}
                />
              </div>
            </div>

            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 flex justify-between items-center">
              <span>Photo {uploadProgress.current} / {uploadProgress.total}</span>
              {uploadProgress.percentage === 100 && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL 4: EDIT GALLERY ── */}
      <AnimatePresence>
        {editingGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[700] bg-black/85 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-strong max-w-lg w-full rounded-3xl p-8 border border-white/15 space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingGallery(null)}
                className="absolute top-6 right-6 p-2 rounded-full glass-subtle text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="heading-serif text-2xl font-bold text-white">Edit Gallery</h3>
              
              <form onSubmit={handleUpdateGallery} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Event Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-white/40"
                    value={editingGallery.title}
                    onChange={e => setEditingGallery({ ...editingGallery, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Event Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium [color-scheme:dark]"
                      value={editingGallery.eventDate?.split('T')[0] || ''}
                      onChange={e => setEditingGallery({ ...editingGallery, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium"
                      value={editingGallery.location}
                      onChange={e => setEditingGallery({ ...editingGallery, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Access Password</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium"
                      value={editingGallery.password}
                      onChange={e => setEditingGallery({ ...editingGallery, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Price (₹)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/12 rounded-xl text-white text-sm font-medium"
                      value={editingGallery.revenue || ''}
                      onChange={e => setEditingGallery({ ...editingGallery, revenue: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                    checked={editingGallery.isPublic}
                    onChange={e => setEditingGallery({ ...editingGallery, isPublic: e.target.checked })}
                  />
                  <label htmlFor="editIsPublic" className="text-[10px] font-bold uppercase tracking-widest text-white/50">Public Gallery</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingGallery(null)}
                    className="flex-1 py-3 glass-subtle border border-white/15 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPanel;
