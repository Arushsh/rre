import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
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
  TrendingDown,
  Star,
  Users2,
  CreditCard,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  FileText,
  Bookmark,
  Compass,
  ExternalLink,
  Menu
} from 'lucide-react';
import { API_URL } from '../config/api';
import toast from 'react-hot-toast';

// ── NAVIGATION MODULES ──────────────────────────────────────────────────────
const MAIN_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'galleries', label: 'Galleries', icon: FolderOpen },
  { id: 'clients', label: 'Clients', icon: Users2 },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

const FAVORITES_MENU = [
  { label: 'Live Website', href: '/', icon: ExternalLink, external: true },
  { label: 'Client Onboarding', href: '/onboarding/sample', icon: UserPlus, external: false },
  { label: 'Public Portfolio', href: '/portfolio', icon: ImageIcon, external: true },
  { label: 'AI Intelligence Hub', href: '/ai-hub', icon: Sparkles, external: true },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'public' | 'private'>('all');
  
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

  // ── UNIFIED PAYMENTS & REVENUE CALCULATION ──
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

  const computedTotalRevenue = allTransactions
    .filter(t => t.status === 'paid' || t.status === 'confirmed')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const displayRevenue = stats.totalRevenue > 0 ? stats.totalRevenue : computedTotalRevenue;
  const avgOrderRevenue = bookings.length > 0 ? Math.round(displayRevenue / bookings.length) : 0;

  // Filtered galleries for dashboard view
  const displayedGalleries = galleries.filter(g => {
    if (galleryFilter === 'public') return g.isPublic;
    if (galleryFilter === 'private') return !g.isPublic;
    return true;
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#07090b] text-white flex flex-col lg:flex-row selection:bg-[#00E5FF] selection:text-black">

      {/* ── MOBILE HEADER BAR ── */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-[#0d1117] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black">
            ⚡
          </div>
          <div>
            <span className="text-xs font-black tracking-wider text-white">RRE ADMIN</span>
            <span className="text-[8px] font-bold tracking-widest text-white/40 block">Control Center</span>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── LEFT PERSISTENT SIDEBAR ── */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#0a0d12] border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6 overflow-y-auto scrollbar-hide pr-1">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)] font-black text-sm">
                ⚡
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider text-white">RRE ADMIN</h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/40">Control Center</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Access / Favorites */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 px-3 block">
              Favorites
            </span>
            <div className="space-y-0.5">
              {FAVORITES_MENU.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.external ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-all group"
                >
                  <item.icon className="w-3.5 h-3.5 text-white/30 group-hover:text-[#00E5FF] transition-colors" />
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main Navigation Menu */}
          <div className="space-y-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 px-3 block">
              Main Menu
            </span>
            <nav className="space-y-1">
              {MAIN_MENU.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all relative ${
                      isActive
                        ? 'bg-white/[0.08] text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#00E5FF] rounded-r-full shadow-[0_0_8px_#00E5FF]" />
                      )}
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#00E5FF]' : 'text-white/40'}`} />
                      <span>{tab.label}</span>
                    </div>

                    {/* Notification badges */}
                    {tab.id === 'bookings' && bookings.length > 0 && (
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {bookings.length}
                      </span>
                    )}
                    {tab.id === 'galleries' && galleries.length > 0 && (
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-white/60">
                        {galleries.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Action Card in Sidebar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-[#00E5FF]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live Operations</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Auto-sync active across bookings, gallery uploads, and client requests.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-2 px-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> New Gallery
            </button>
          </div>

        </div>

        {/* User Account / Profile at bottom of sidebar */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/80 font-bold text-xs shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin User</p>
              <p className="text-[9px] text-white/40 font-medium truncate">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ── MAIN WORKSPACE AREA ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Navbar */}
        <header className="h-16 px-6 bg-[#07090b] border-b border-white/10 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-medium text-white/40">
            <span className="text-white/30">Studio</span>
            <span>/</span>
            <span className="text-white font-bold capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search input with shortcut badge */}
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search studio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-10 py-1.5 bg-white/[0.05] border border-white/10 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-white/30 px-1 py-0.5 rounded bg-white/5 border border-white/10">
                ⌘K
              </span>
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white/60 hover:text-white relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 right-1.5 shadow-[0_0_6px_#fbbf24]" />
            </button>

            {/* Quick Action Button */}
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90 transition-colors shadow-sm"
            >
              {isCreating ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCreating ? 'Close Form' : 'New Gallery'}</span>
            </button>
          </div>
        </header>

        {/* Content Container (Main Grid + Right Panel) */}
        <div className="flex-1 flex flex-col xl:flex-row min-w-0">

          {/* Central Workspace */}
          <div className="flex-1 p-6 md:p-8 space-y-8 min-w-0 overflow-y-auto">

            {/* ════ TAB: DASHBOARD (REFERENCE COMPOSITION) ════ */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                {/* ── 1. PRIMARY REVENUE HERO ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-white/40 block">
                      Your total revenue
                    </span>
                    <div className="flex items-baseline gap-2">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-mono">
                        ₹{displayRevenue.toLocaleString('en-IN')}<span className="text-amber-400 text-3xl sm:text-4xl">.00</span>
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 text-xs font-bold text-white/70 hover:text-white transition-all">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      <span>Select Dates</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 text-xs font-bold text-white/70 hover:text-white transition-all">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
                      <span>Filters</span>
                    </button>
                  </div>
                </div>

                {/* ── 2. THREE KPI CARDS WITH SPARKLINE CURVES ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* KPI 1: Bookings */}
                  <div className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-white/50">Total Bookings</span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black text-white font-mono">{bookings.length}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-bold">
                          <span>↑ 15%</span>
                          <span className="text-white/35 font-normal text-[10px]">vs last month</span>
                        </div>
                      </div>
                      {/* Mini Sparkline SVG curve */}
                      <svg className="w-24 h-10 overflow-visible" viewBox="0 0 100 40">
                        <path
                          d="M0,35 Q25,30 45,20 T80,10 T100,5"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 2: Active Clients */}
                  <div className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-white/50">Active Clients</span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black text-white font-mono">{clients.length}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-400 font-bold">
                          <span>↑ 4%</span>
                          <span className="text-white/35 font-normal text-[10px]">registered users</span>
                        </div>
                      </div>
                      {/* Mini Sparkline SVG curve */}
                      <svg className="w-24 h-10 overflow-visible" viewBox="0 0 100 40">
                        <path
                          d="M0,30 Q20,32 40,25 T70,12 T100,22"
                          fill="none"
                          stroke="#f97316"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 3: Avg Order Value */}
                  <div className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-white/50">Avg. Event Value</span>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-3xl font-black text-white font-mono">₹{avgOrderRevenue.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400 font-bold">
                          <span>↑ 8%</span>
                          <span className="text-white/35 font-normal text-[10px]">per booking</span>
                        </div>
                      </div>
                      {/* Mini Sparkline SVG curve */}
                      <svg className="w-24 h-10 overflow-visible" viewBox="0 0 100 40">
                        <path
                          d="M0,35 Q20,28 40,30 T75,18 T100,8"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* ── 3. RECENT GALLERIES & PRODUCTIONS SECTION ── */}
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <h2 className="text-lg font-bold text-white tracking-tight">Recent Galleries</h2>
                      <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5 text-xs">
                        <button
                          onClick={() => setGalleryFilter('all')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            galleryFilter === 'all' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          All <span className="text-[10px] opacity-60">({galleries.length})</span>
                        </button>
                        <button
                          onClick={() => setGalleryFilter('public')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            galleryFilter === 'public' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          Public <span className="text-[10px] opacity-60">({galleries.filter(g => g.isPublic).length})</span>
                        </button>
                        <button
                          onClick={() => setGalleryFilter('private')}
                          className={`px-3 py-1 rounded-lg font-bold transition-all ${
                            galleryFilter === 'private' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'
                          }`}
                        >
                          Private <span className="text-[10px] opacity-60">({galleries.filter(g => !g.isPublic).length})</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('galleries')}
                      className="text-xs font-bold text-white/50 hover:text-white hover:underline transition-colors text-right"
                    >
                      View All
                    </button>
                  </div>

                  {/* Cards Grid Inspired by Reference */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {displayedGalleries.slice(0, 5).map((gallery: any, idx: number) => {
                      const brandIcons = ['📷', '🎬', '🎙️', '🎧', '⚡'];
                      const iconSymbol = brandIcons[idx % brandIcons.length];
                      return (
                        <div
                          key={gallery._id}
                          className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4 group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-sm">
                                {iconSymbol}
                              </div>
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                gallery.isPublic
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {gallery.isPublic ? 'Public' : 'Pass-Protected'}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                              {gallery.title}
                            </h3>

                            <p className="text-[11px] text-white/40 font-medium">
                              Location: <span className="text-white/70">{gallery.location || 'Studio'}</span> • {new Date(gallery.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                            <span>{gallery.media?.length || 0} Photos</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openQrModal(gallery)}
                                title="QR Flyer"
                                className="hover:text-white"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingGallery({ ...gallery })}
                                title="Edit"
                                className="hover:text-white"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add Gallery Card */}
                    <div
                      onClick={() => setIsCreating(true)}
                      className="p-5 rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center min-h-[160px] group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:scale-110 transition-all">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white/60 group-hover:text-white transition-colors">
                        Add New Gallery
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── 4. RECENT TRANSACTIONS TABLE ── */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h2>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-xs font-bold text-white/50 hover:text-white hover:underline transition-colors"
                    >
                      View All
                    </button>
                  </div>

                  <div className="rounded-2xl bg-[#0c1015] border border-white/10 overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-white/40">
                      <div className="col-span-4">Customer</div>
                      <div className="col-span-3">Item / Service</div>
                      <div className="col-span-3">Amount</div>
                      <div className="col-span-2 text-right">Status</div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {allTransactions.slice(0, 5).map((payment) => (
                        <div key={payment._id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-3.5 items-start md:items-center gap-2 md:gap-0 hover:bg-white/[0.02] transition-colors">
                          <div className="md:col-span-4 flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/50 text-xs shrink-0">
                              <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-white truncate">{payment.customerName}</p>
                              <p className="text-[10px] text-white/30 truncate">{payment.customerEmail}</p>
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-semibold text-white/80 truncate">{payment.title}</p>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">{payment.type}</span>
                          </div>

                          <div className="md:col-span-3">
                            <span className="font-mono font-bold text-xs text-emerald-400">
                              ₹{payment.amount?.toLocaleString('en-IN') || 0}
                            </span>
                            <p className="text-[9px] text-white/30">
                              {new Date(payment.date).toLocaleDateString('en-IN')}
                            </p>
                          </div>

                          <div className="md:col-span-2 text-left md:text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              payment.status === 'paid' || payment.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}

                      {allTransactions.length === 0 && (
                        <div className="py-10 text-center text-xs text-white/30">
                          No transactions recorded yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ════ TAB: GALLERIES CRUD ════ */}
            {activeTab === 'galleries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Galleries Directory</h2>
                  <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreating ? 'Cancel' : 'New Gallery'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleries.map((gallery: any) => (
                    <div key={gallery._id} className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                          <img 
                            src={gallery.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} 
                            className="w-full h-full object-cover" 
                            alt={gallery.title} 
                            loading="lazy" 
                          />
                          <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[9px] font-mono font-bold text-white border border-white/10">
                            Pass: {gallery.password}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-sm text-white leading-tight">{gallery.title}</h3>
                          <p className="text-[11px] text-white/40 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {gallery.location || 'Studio'} • {new Date(gallery.eventDate).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {gallery.revenue ? `₹${gallery.revenue.toLocaleString('en-IN')}` : '—'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openCamera(gallery.slug)} aria-label="Camera" className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white">
                            <CameraIcon className="w-3.5 h-3.5" />
                          </button>
                          <label className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileUpload(e, gallery.slug)} />
                          </label>
                          <button onClick={() => openQrModal(gallery)} aria-label="QR Code" className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white">
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingGallery({ ...gallery })} aria-label="Edit" className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white">
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteGallery(gallery._id)} aria-label="Delete" className="p-1.5 rounded-lg bg-white/5 text-red-400 hover:text-red-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB: CLIENTS CRUD ════ */}
            {activeTab === 'clients' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Client Accounts</h2>
                  <button 
                    onClick={() => setIsAddingClient(!isAddingClient)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isAddingClient ? 'Cancel' : 'Add Client'}</span>
                  </button>
                </div>

                {isAddingClient && (
                  <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 max-w-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Register Client</h3>
                    <form onSubmit={handleAddClient} className="space-y-3">
                      <input type="text" placeholder="Full Name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
                      <input type="email" placeholder="Email" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} required />
                      <input type="password" placeholder="Password" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs" value={newClient.password} onChange={e => setNewClient({...newClient, password: e.target.value})} required />
                      <button type="submit" className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90">Save Client</button>
                    </form>
                  </div>
                )}

                <div className="rounded-2xl bg-[#0c1015] border border-white/10 overflow-hidden">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-white/40">
                      <tr>
                        <th className="px-5 py-3">Client</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Events</th>
                        <th className="px-5 py-3">Assign</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {clients.map((client: any) => (
                        <tr key={client._id} className="hover:bg-white/[0.02]">
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-white">{client.name}</p>
                            <p className="text-[10px] text-white/30 font-mono">#{client._id.slice(-6)}</p>
                          </td>
                          <td className="px-5 py-3.5 text-white/60">
                            <p>{client.email}</p>
                            <p className="text-[10px] text-white/40">{client.mobile || '—'}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                              client.isVerified ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {client.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {client.myEvents?.map((ev: any) => (
                                <span key={ev._id} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-medium text-white/70">{ev.title}</span>
                              ))}
                              {(!client.myEvents || client.myEvents.length === 0) && <span className="text-white/25">None</span>}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              onChange={(e) => e.target.value && assignEventToClient(client._id, e.target.value)}
                              className="bg-white/5 border border-white/10 text-[10px] font-bold rounded-lg px-2.5 py-1 focus:outline-none [color-scheme:dark]"
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
              </div>
            )}

            {/* ════ TAB: BOOKINGS CRUD ════ */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Service Bookings</h2>
                  <span className="text-xs font-bold text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Total: {bookings.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {bookings.map((booking: any) => (
                    <div key={booking._id} className="p-4 rounded-2xl bg-[#0c1015] border border-white/10 space-y-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div>
                          <p className="font-bold text-sm text-white">{booking.customerName}</p>
                          <p className="text-xs text-white/40">{booking.customerEmail} • {booking.customerPhone || 'No Phone'}</p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="font-bold text-xs text-white/80">{booking.service?.title || 'Custom Service'}</p>
                          <p className="text-xs font-mono font-bold text-emerald-400">₹{(booking.totalAmount / 100).toLocaleString('en-IN')}</p>
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="text-xs font-bold px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 [color-scheme:dark]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="py-12 text-center text-xs text-white/30">No bookings recorded.</div>
                  )}
                </div>
              </div>
            )}

            {/* ════ TAB: SERVICES CRUD ════ */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Services Catalog</h2>
                  <button
                    onClick={() => setIsEditingService(!isEditingService)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEditingService ? 'Cancel' : 'New Service'}</span>
                  </button>
                </div>

                {isEditingService && (
                  <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 max-w-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Create Service</h3>
                    <form onSubmit={handleCreateService} className="space-y-3">
                      <select 
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs [color-scheme:dark]"
                        value={newService.category}
                        onChange={e => setNewService({...newService, category: e.target.value})}
                      >
                        <option value="photography">Photography</option>
                        <option value="videography">Videography</option>
                        <option value="audio">Audio Recording</option>
                        <option value="production">Music Production</option>
                        <option value="live">Live Streaming</option>
                      </select>
                      <input type="text" placeholder="Title" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
                      <input type="text" placeholder="Price (e.g. ₹50,000)" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                      <textarea placeholder="Description" rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required />
                      <button type="submit" className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl">Save Service</button>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {services.map((service: any) => (
                    <div key={service._id} className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/60">
                            {service.category}
                          </span>
                          <button onClick={() => deleteService(service._id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h3 className="font-bold text-sm text-white">{service.title}</h3>
                        <p className="text-xs text-white/40 line-clamp-2">{service.description}</p>
                      </div>
                      <p className="font-mono font-bold text-sm text-white pt-2 border-t border-white/5">{service.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB: TEAM CRUD ════ */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Studio Team</h2>
                  <button
                    onClick={() => {
                      setIsEditingTeam(!isEditingTeam);
                      if (!isEditingTeam) {
                        setNewTeamMember({ name: '', role: '', bio: '', img: '', insta: '' });
                        setTeamPhotoPreview('');
                        setEditingTeamMemberId(null);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isEditingTeam ? 'Cancel' : 'Add Member'}</span>
                  </button>
                </div>

                {isEditingTeam && (
                  <div className="p-6 rounded-2xl bg-[#0c1015] border border-white/10 space-y-4 max-w-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      {editingTeamMemberId ? 'Update Member' : 'New Member'}
                    </h3>
                    <form onSubmit={handleCreateTeamMember} className="space-y-3">
                      <input type="text" placeholder="Full Name" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newTeamMember.name} onChange={e => setNewTeamMember({...newTeamMember, name: e.target.value})} required />
                      <input type="text" placeholder="Role" className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newTeamMember.role} onChange={e => setNewTeamMember({...newTeamMember, role: e.target.value})} required />
                      <textarea placeholder="Bio" rows={2} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white" value={newTeamMember.bio} onChange={e => setNewTeamMember({...newTeamMember, bio: e.target.value})} required />
                      <button type="submit" className="w-full py-2.5 bg-white text-black text-xs font-bold rounded-xl">Save Member</button>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {team.map((member: any) => (
                    <div key={member._id} className="p-5 rounded-2xl bg-[#0c1015] border border-white/10 space-y-3">
                      <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10">
                        <img src={member.img} alt={member.name} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'} />
                      </div>
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm text-white">{member.name}</h3>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => editTeamMember(member)} className="text-white/40 hover:text-white"><Settings className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteTeamMember(member._id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#00E5FF] font-semibold">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB: PAYMENTS CRUD ════ */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Transaction History</h2>
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Total: ₹{computedTotalRevenue.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="rounded-2xl bg-[#0c1015] border border-white/10 overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-white/40">
                    <div className="col-span-4">Customer</div>
                    <div className="col-span-3">Item / Service</div>
                    <div className="col-span-3">Amount</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  <div className="divide-y divide-white/5">
                    {allTransactions.map((payment) => (
                      <div key={payment._id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-3.5 items-start md:items-center gap-2 md:gap-0 hover:bg-white/[0.02] transition-colors">
                        <div className="md:col-span-4 flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/50 text-xs shrink-0">
                            <UserIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-white truncate">{payment.customerName}</p>
                            <p className="text-[10px] text-white/30 truncate">{payment.customerEmail}</p>
                          </div>
                        </div>

                        <div className="md:col-span-3">
                          <p className="text-xs font-semibold text-white/80 truncate">{payment.title}</p>
                          <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">{payment.type}</span>
                        </div>

                        <div className="md:col-span-3">
                          <span className="font-mono font-bold text-xs text-emerald-400">
                            ₹{payment.amount?.toLocaleString('en-IN') || 0}
                          </span>
                          <p className="text-[9px] text-white/30">
                            {new Date(payment.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>

                        <div className="md:col-span-2 text-left md:text-right">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
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
              </div>
            )}

          </div>

          {/* ── RIGHT INFORMATION PANEL (INSPIRATION FROM REFERENCE) ── */}
          <aside className="w-full xl:w-72 bg-[#0a0d12] border-t xl:border-t-0 xl:border-l border-white/10 p-6 space-y-6 shrink-0">
            
            {/* Recent Documents / Quick Galleries */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight">Recent Galleries</span>
                <span className="text-[10px] text-white/40 font-mono">{galleries.length} total</span>
              </div>

              <div className="space-y-2.5">
                {galleries.slice(0, 4).map((g: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setEditingGallery({ ...g })}>
                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden border border-white/10 shrink-0">
                      <img 
                        src={g.coverImage || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'} 
                        className="w-full h-full object-cover" 
                        alt="" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">{g.title}</p>
                      <p className="text-[10px] text-white/35 truncate">Updated {new Date(g.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Mates / Crew Section */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-tight">Studio Crew</span>
                <span className="text-[10px] text-white/40 font-mono">{team.length}</span>
              </div>

              <div className="space-y-2.5">
                {team.slice(0, 5).map((m: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden border border-white/20 shrink-0 relative">
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80'} />
                      <div className="w-2 h-2 rounded-full bg-emerald-400 border border-black absolute bottom-0 right-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{m.name}</p>
                      <p className="text-[9px] text-white/40 truncate">{m.role}</p>
                    </div>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-[11px] text-white/30">No team members added yet.</p>
                )}
              </div>
            </div>

          </aside>

        </div>

      </main>

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
              className="p-8 sm:p-10 rounded-3xl bg-[#0e131a] border border-white/15 max-w-md w-full text-center space-y-6 relative"
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{lastCreatedGallery.title}</h3>
                <p className="text-xs text-white/40">Gallery initialized & QR ready</p>
              </div>
              
              <div className="bg-white p-5 rounded-2xl flex items-center justify-center">
                <img 
                  src={lastCreatedGallery.qrCode.replace('BASE_URL_PLACEHOLDER', window.location.origin)} 
                  className="w-44 h-44" 
                  alt="QR" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={handleDownloadQR} 
                  className="py-2.5 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 flex items-center justify-center gap-2"
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
                  className="py-2.5 px-4 bg-white/5 border border-white/15 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> WhatsApp
                </button>
                <button 
                  onClick={() => { 
                    const baseUrl = window.location.origin;
                    navigator.clipboard.writeText(`${baseUrl}/onboarding/${lastCreatedGallery.slug}`); 
                    toast.success('Link copied to clipboard!'); 
                  }} 
                  className="sm:col-span-2 py-2.5 px-4 bg-white/5 border border-white/10 text-white/60 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-white flex items-center justify-center gap-2"
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
            className="fixed bottom-6 right-6 z-[1000] w-80 bg-[#0e131a] text-white p-5 rounded-2xl border border-white/20 shadow-2xl space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Uploading Media</h4>
              <span className="text-[9px] font-mono text-emerald-400">{uploadProgress.speed}</span>
            </div>
            
            <div className="space-y-1">
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
              className="p-8 rounded-3xl bg-[#0e131a] border border-white/15 max-w-lg w-full space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setEditingGallery(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white">Edit Gallery</h3>
              
              <form onSubmit={handleUpdateGallery} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Event Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
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
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs [color-scheme:dark]"
                      value={editingGallery.eventDate?.split('T')[0] || ''}
                      onChange={e => setEditingGallery({ ...editingGallery, eventDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      value={editingGallery.location}
                      onChange={e => setEditingGallery({ ...editingGallery, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Access Password</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      value={editingGallery.password}
                      onChange={e => setEditingGallery({ ...editingGallery, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Price (₹)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
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
                    className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL 5: CREATE GALLERY MODAL (IF isCreating IS ACTIVE) ── */}
      <AnimatePresence>
        {isCreating && (
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
              className="p-8 rounded-3xl bg-[#0e131a] border border-white/15 max-w-2xl w-full space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-xl font-bold text-white">Create New Event Gallery</h3>
                <p className="text-xs text-white/40">Set up event credentials, location, and initial photos.</p>
              </div>

              <form onSubmit={handleCreateGallery} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Event Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Wedding Gala"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      value={newGallery.title}
                      onChange={e => setNewGallery({...newGallery, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')})}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Event Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs [color-scheme:dark]"
                      value={newGallery.eventDate}
                      onChange={e => setNewGallery({...newGallery, eventDate: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Location</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Venue / City"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                        value={newGallery.location}
                        onChange={e => setNewGallery({...newGallery, location: e.target.value})}
                      />
                      <button type="button" onClick={detectLocation} className="p-2 bg-white/5 rounded-xl text-white/50 hover:text-white">
                        <Locate className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Access Password</label>
                    <input
                      type="text"
                      placeholder="e.g. RRE2026"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      value={newGallery.password}
                      onChange={e => setNewGallery({...newGallery, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Optional revenue"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      value={newGallery.revenue || ''}
                      onChange={e => setNewGallery({...newGallery, revenue: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="isNewPublic"
                      className="w-4 h-4 rounded border-white/20 bg-white/5"
                      checked={newGallery.isPublic}
                      onChange={e => setNewGallery({...newGallery, isPublic: e.target.checked})}
                    />
                    <label htmlFor="isNewPublic" className="text-[10px] font-bold uppercase tracking-widest text-white/50">Public Gallery</label>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/50 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-white/90"
                  >
                    {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Save & Generate QR'}
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
