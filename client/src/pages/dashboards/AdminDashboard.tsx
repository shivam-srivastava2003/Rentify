import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import type { PropertyData } from '../../components/PropertyCard';
import {
  Users,
  Building,
  Activity,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Search,
  LayoutDashboard,
  ChevronRight,
  X,
  Trash2,
  History,
  AlertTriangle,
  FileText,
  Clock,
  UserX,
  UserCog,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';

interface StatsData {
  totalTenants: number;
  totalOwners: number;
  totalProperties: number;
  availableProperties: number;
  fullyBookedProperties: number;
  recentProperties: any[];
}

interface OwnerUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  permanentAddress?: string;
  city?: string;
  businessName?: string;
  propertyLocation?: string;
  unitCount?: string;
  propertyCount?: number;
  createdAt?: string;
}

interface RenterUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  permanentAddress?: string;
  city?: string;
  gender?: string;
  avatar?: string;
  createdAt?: string;
}

interface DeletionHistoryLog {
  _id: string;
  targetType: 'PROPERTY' | 'OWNER' | 'RENTER';
  targetId: string;
  targetTitle: string;
  targetEmail?: string;
  targetDetails?: string;
  reason: string;
  deletedBy: string;
  createdAt: string;
}

interface DeleteTarget {
  type: 'PROPERTY' | 'OWNER' | 'RENTER';
  id: string;
  title: string;
  email?: string;
  details?: string;
}

interface AdminDashboardProps {
  initialTab?: 'dashboard' | 'owners' | 'renters' | 'history' | 'profile';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'owners' | 'renters' | 'history' | 'profile'>(initialTab);

  const handleAdminLogout = async () => {
    await logout();
    navigate('/');
  };

  // Stats state
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Owners state
  const [owners, setOwners] = useState<OwnerUser[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [ownerSearch, setOwnerSearch] = useState('');
  const [selectedOwnerData, setSelectedOwnerData] = useState<{ owner: OwnerUser; properties: PropertyData[] } | null>(null);
  const [loadingOwnerModal, setLoadingOwnerModal] = useState(false);

  // Renters state
  const [renters, setRenters] = useState<RenterUser[]>([]);
  const [loadingRenters, setLoadingRenters] = useState(false);
  const [renterSearch, setRenterSearch] = useState('');
  const [selectedRenter, setSelectedRenter] = useState<RenterUser | null>(null);

  // Deletion History State
  const [historyLogs, setHistoryLogs] = useState<DeletionHistoryLog[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState('');

  // Delete Reason Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Admin Profile & Security Form States
  const [adminName, setAdminName] = useState(currentUser?.name || 'Admin');
  const [adminPhone, setAdminPhone] = useState(currentUser?.phone || '');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');

  const [passCurrentPassword, setPassCurrentPassword] = useState('');
  const [passNewPassword, setPassNewPassword] = useState('');
  const [passConfirmPassword, setPassConfirmPassword] = useState('');
  const [showPassCurrent, setShowPassCurrent] = useState(false);
  const [showPassNew, setShowPassNew] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAdminName(currentUser.name || 'Admin');
      setAdminPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const response = await axios.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchOwners = async () => {
    setLoadingOwners(true);
    try {
      const response = await axios.get('/admin/owners');
      if (response.data.success) {
        setOwners(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch owners', err);
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchRenters = async () => {
    setLoadingRenters(true);
    try {
      const response = await axios.get('/admin/renters');
      if (response.data.success) {
        setRenters(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch renters', err);
    } finally {
      setLoadingRenters(false);
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get('/admin/history');
      if (response.data.success) {
        setHistoryLogs(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch deletion history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (activeTab === 'owners' && owners.length === 0) {
      fetchOwners();
    } else if (activeTab === 'renters' && renters.length === 0) {
      fetchRenters();
    } else if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleOpenOwnerModal = async (ownerId: string) => {
    setLoadingOwnerModal(true);
    setSelectedOwnerData(null);
    try {
      const response = await axios.get(`/admin/owners/${ownerId}`);
      if (response.data.success) {
        setSelectedOwnerData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch owner details', err);
    } finally {
      setLoadingOwnerModal(false);
    }
  };

  // Open Delete Confirmation Dialog with Reason Input
  const initiateDelete = (type: 'PROPERTY' | 'OWNER' | 'RENTER', id: string, title: string, email?: string, details?: string) => {
    setDeleteError(null);
    setDeleteReason('');
    setDeleteTarget({ type, id, title, email, details });
  };

  // Execute Deletion Request with Mandatory Reason
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteTarget) return;

    if (!deleteReason.trim()) {
      setDeleteError('Please enter a valid reason for deleting this item.');
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await axios.post('/admin/delete-item', {
        targetType: deleteTarget.type,
        targetId: deleteTarget.id,
        reason: deleteReason.trim(),
      });

      if (response.data.success) {
        setFlashMessage({ type: 'success', message: response.data.message });

        // Refresh UI state
        if (deleteTarget.type === 'OWNER') {
          setOwners((prev) => prev.filter((o) => o._id !== deleteTarget.id));
          if (selectedOwnerData?.owner._id === deleteTarget.id) {
            setSelectedOwnerData(null);
          }
        } else if (deleteTarget.type === 'RENTER') {
          setRenters((prev) => prev.filter((r) => r._id !== deleteTarget.id));
          if (selectedRenter?._id === deleteTarget.id) {
            setSelectedRenter(null);
          }
        } else if (deleteTarget.type === 'PROPERTY') {
          if (selectedOwnerData) {
            setSelectedOwnerData({
              ...selectedOwnerData,
              properties: selectedOwnerData.properties.filter((p) => p._id !== deleteTarget.id),
            });
          }
        }

        // Refresh global metrics & deletion history
        fetchStats();
        fetchHistory();

        // Close modal
        setDeleteTarget(null);
        setDeleteReason('');
      }
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || 'Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Individual History Log
  const handleDeleteHistoryLog = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this log entry from Deletion History?')) return;

    try {
      const response = await axios.delete(`/admin/history/${id}`);
      if (response.data.success) {
        setHistoryLogs((prev) => prev.filter((log) => log._id !== id));
        setFlashMessage({ type: 'success', message: 'History record removed successfully.' });
      }
    } catch (err: any) {
      setFlashMessage({ type: 'error', message: 'Failed to delete history log entry.' });
    }
  };

  // Clear All History Logs
  const handleClearAllHistory = async () => {
    if (!window.confirm('CAUTION: Are you sure you want to permanently clear ALL deletion history records?')) return;

    try {
      const response = await axios.delete('/admin/history');
      if (response.data.success) {
        setHistoryLogs([]);
        setFlashMessage({ type: 'success', message: 'All deletion history logs cleared successfully.' });
      }
    } catch (err: any) {
      setFlashMessage({ type: 'error', message: 'Failed to clear deletion history.' });
    }
  };

  // 1. Handle Admin Basic Profile Update
  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setFlashMessage(null);

    try {
      const response = await axios.put('/auth/profile', {
        name: adminName,
        phone: adminPhone,
      });

      if (response.data.success) {
        updateUser(response.data.data);
        setFlashMessage({
          type: 'success',
          message: 'Admin profile information updated successfully!',
        });
      }
    } catch (err: any) {
      setFlashMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update admin profile details.',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  // 2. Handle Admin Email Address Update
  const handleUpdateAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlashMessage(null);

    if (!newAdminEmail || !emailCurrentPassword) {
      setFlashMessage({ type: 'error', message: 'Please provide both new email address and current password.' });
      return;
    }

    setEmailLoading(true);

    try {
      const response = await axios.put('/auth/update-email', {
        newEmail: newAdminEmail,
        currentPassword: emailCurrentPassword,
      });

      if (response.data.success) {
        updateUser(response.data.data);
        setFlashMessage({
          type: 'success',
          message: `Admin email updated to ${response.data.data.email}! Use this new email address for future admin logins.`,
        });
        setNewAdminEmail('');
        setEmailCurrentPassword('');
      }
    } catch (err: any) {
      setFlashMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update admin email address.',
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // 3. Handle Admin Password Update
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlashMessage(null);

    if (!passCurrentPassword || !passNewPassword) {
      setFlashMessage({ type: 'error', message: 'Please enter current and new passwords.' });
      return;
    }

    if (passNewPassword.length < 6) {
      setFlashMessage({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (passNewPassword !== passConfirmPassword) {
      setFlashMessage({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setPassLoading(true);

    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword: passCurrentPassword,
        newPassword: passNewPassword,
      });

      if (response.data.success) {
        setFlashMessage({
          type: 'success',
          message: 'Admin password updated successfully! Please use your new password for all future admin logins.',
        });
        setPassCurrentPassword('');
        setPassNewPassword('');
        setPassConfirmPassword('');
      }
    } catch (err: any) {
      setFlashMessage({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update admin password. Check current password.',
      });
    } finally {
      setPassLoading(false);
    }
  };

  // Password Strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', color: '', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (pass.length < 10 || !/\d/.test(pass))
      return { label: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const filteredOwners = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      (o.city && o.city.toLowerCase().includes(ownerSearch.toLowerCase())) ||
      (o.businessName && o.businessName.toLowerCase().includes(ownerSearch.toLowerCase()))
  );

  const filteredRenters = renters.filter(
    (r) =>
      r.name.toLowerCase().includes(renterSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(renterSearch.toLowerCase()) ||
      (r.city && r.city.toLowerCase().includes(renterSearch.toLowerCase()))
  );

  const filteredHistory = historyLogs.filter(
    (h) =>
      h.targetTitle.toLowerCase().includes(historySearch.toLowerCase()) ||
      (h.targetEmail && h.targetEmail.toLowerCase().includes(historySearch.toLowerCase())) ||
      h.reason.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.deletedBy.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.targetType.toLowerCase().includes(historySearch.toLowerCase())
  );

  const passwordStrength = getPasswordStrength(passNewPassword);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col md:flex-row font-sans">
      {/* ADMIN SIDEBAR NAVIGATION */}
      <aside
        className={`w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Header Badge */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
              <ShieldAlert className="w-4 h-4" /> Admin Controls
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight">Rentify Admin</h2>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.email}</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>System Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('owners');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'owners'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4" />
                <span>Owner Directory</span>
              </div>
              <span className="bg-slate-950 px-2 py-0.5 rounded-md text-[10px] text-amber-400 font-extrabold">
                {stats?.totalOwners ?? 0}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('renters');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'renters'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Renter Directory</span>
              </div>
              <span className="bg-slate-950 px-2 py-0.5 rounded-md text-[10px] text-teal-300 font-extrabold">
                {stats?.totalTenants ?? 0}
              </span>
            </button>

            {/* DELETION HISTORY TAB */}
            <button
              onClick={() => {
                setActiveTab('history');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-rose-400" />
                <span>Deletion History</span>
              </div>
              <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded-md text-[10px] font-extrabold border border-rose-800/50">
                {historyLogs.length}
              </span>
            </button>

            {/* ADMIN PROFILE & SETTINGS TAB */}
            <button
              onClick={() => {
                setActiveTab('profile');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCog className="w-4 h-4 text-amber-400" />
              <span>Admin Profile & Settings</span>
            </button>
          </div>
        </div>

        {/* SIDEBAR LOGOUT BUTTON & FOOTER */}
        <div className="pt-4 border-t border-slate-800 mt-4 space-y-3">
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Admin Session</span>
          </button>

          <div className="text-[10px] text-slate-500 text-center">
            Rentify Management System v2.0
          </div>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* MOBILE SMARTPHONE TAB SWITCHER BAR (ENSURES ONLY 1 TOP BAR ARCHITECTURE) */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 text-xs font-bold no-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'dashboard' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('owners')}
            className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'owners' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" /> Owners ({stats?.totalOwners ?? 0})
          </button>

          <button
            onClick={() => setActiveTab('renters')}
            className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'renters' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Renters ({stats?.totalTenants ?? 0})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'history' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-rose-400" /> History ({historyLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all ${
              activeTab === 'profile' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            <UserCog className="w-3.5 h-3.5 text-amber-400" /> Profile
          </button>
        </div>
        {/* GLOBAL FLASH ALERTS */}
        {flashMessage && (
          <div
            className={`p-4 rounded-2xl mb-6 border flex items-center justify-between text-xs font-bold ${
              flashMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border-rose-800 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {flashMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
              <span>{flashMessage.message}</span>
            </div>
            <button onClick={() => setFlashMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: SYSTEM DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">System Dashboard</h1>
                <p className="text-slate-400 text-xs mt-1">Real-time stats and property registry overview</p>
              </div>

              <button
                onClick={fetchStats}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-800 transition-all w-fit"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} /> Refresh Metrics
              </button>
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div
                onClick={() => setActiveTab('renters')}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md cursor-pointer hover:border-teal-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Registered Renters</p>
                    <p className="text-3xl font-black text-white mt-1">{loadingStats ? '...' : stats?.totalTenants ?? 0}</p>
                  </div>
                  <div className="p-3 bg-teal-500/10 text-teal-400 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[11px] text-teal-400 font-bold flex items-center gap-1 mt-3">
                  View Renters Directory <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div
                onClick={() => setActiveTab('owners')}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md cursor-pointer hover:border-amber-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Property Owners</p>
                    <p className="text-3xl font-black text-white mt-1">{loadingStats ? '...' : stats?.totalOwners ?? 0}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Building className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1 mt-3">
                  View Owners Directory <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Listings</p>
                    <p className="text-3xl font-black text-white mt-1">{loadingStats ? '...' : stats?.totalProperties ?? 0}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[11px] text-purple-400 font-bold block mt-3">
                  Across all cities
                </span>
              </div>

              <div
                onClick={() => setActiveTab('history')}
                className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md cursor-pointer hover:border-rose-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Deletion Records</p>
                    <p className="text-3xl font-black text-rose-400 mt-1">{historyLogs.length}</p>
                  </div>
                  <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <History className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1 mt-3">
                  Audit History Logs <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* RECENT PROPERTIES TABLE WITH DELETE ACTION */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4">Recent Property Registrations</h2>
              {loadingStats ? (
                <p className="text-slate-500 text-xs py-4">Loading stats...</p>
              ) : stats?.recentProperties.length === 0 ? (
                <p className="text-slate-500 text-xs py-4">No listings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Property Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Monthly Rent</th>
                        <th className="p-3">Owner Contact</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {stats?.recentProperties.map((prop: any) => (
                        <tr key={prop._id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-3 font-bold text-white">{prop.title}</td>
                          <td className="p-3 text-slate-400">{prop.type}</td>
                          <td className="p-3 text-slate-400">{prop.area}, {prop.city}</td>
                          <td className="p-3 font-semibold text-teal-400">₹{prop.price.toLocaleString('en-IN')}/mo</td>
                          <td className="p-3 text-slate-300">
                            {typeof prop.owner === 'object' ? prop.owner?.name : 'N/A'}
                          </td>
                          <td className="p-3">
                            {prop.isAvailable ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Available 🟢
                              </span>
                            ) : (
                              <span className="text-rose-400 font-bold">Booked 🔴</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => initiateDelete('PROPERTY', prop._id, prop.title, '', `${prop.type} in ${prop.city}`)}
                              className="inline-flex items-center gap-1 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-rose-500/30 transition-all"
                              title="Delete this property listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OWNERS DIRECTORY */}
        {activeTab === 'owners' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                  <Building className="w-7 h-7 text-amber-500" /> Landlord & Owner Directory
                </h1>
                <p className="text-slate-400 text-xs mt-1">Manage registered property owners and view their listings</p>
              </div>

              {/* SEARCH FILTER */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, city..."
                  value={ownerSearch}
                  onChange={(e) => setOwnerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {loadingOwners ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 text-xs font-bold">Loading property owners...</p>
              </div>
            ) : filteredOwners.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center py-16">
                <Building className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No Owners Found</h3>
                <p className="text-slate-500 text-xs mt-1">No property owners match your search filter.</p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-4">Owner Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone / WhatsApp</th>
                        <th className="p-4">City / Location</th>
                        <th className="p-4">Business / PG Name</th>
                        <th className="p-4">Listings</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredOwners.map((owner) => (
                        <tr key={owner._id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-4 font-bold text-white flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                              {owner.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{owner.name}</span>
                          </td>
                          <td className="p-4 text-slate-300">{owner.email}</td>
                          <td className="p-4 text-slate-400">{owner.phone || owner.whatsapp || 'N/A'}</td>
                          <td className="p-4 text-slate-400">📍 {owner.city || 'N/A'}</td>
                          <td className="p-4 text-slate-300">{owner.businessName || 'Independent Owner'}</td>
                          <td className="p-4">
                            <span className="bg-teal-500/20 text-teal-300 font-extrabold px-2.5 py-1 rounded-lg text-xs">
                              {owner.propertyCount || 0} Listed
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenOwnerModal(owner._id)}
                              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-xs"
                            >
                              View Info & Listings
                            </button>
                            <button
                              onClick={() => initiateDelete('OWNER', owner._id, owner.name, owner.email, `Owner (${owner.propertyCount || 0} properties listed)`)}
                              className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-[11px] px-3 py-2 rounded-xl border border-rose-500/30 transition-all"
                              title="Delete Owner Account & Listings"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete Account
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RENTERS DIRECTORY */}
        {activeTab === 'renters' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                  <Users className="w-7 h-7 text-teal-400" /> Renter & Tenant Directory
                </h1>
                <p className="text-slate-400 text-xs mt-1">Manage registered renters and view personal tenant details</p>
              </div>

              {/* SEARCH FILTER */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, email, city..."
                  value={renterSearch}
                  onChange={(e) => setRenterSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {loadingRenters ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 text-xs font-bold">Loading renters...</p>
              </div>
            ) : filteredRenters.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center py-16">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No Renters Found</h3>
                <p className="text-slate-500 text-xs mt-1">No renters match your search filter.</p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-4">Tenant Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Gender</th>
                        <th className="p-4">Preferred City</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredRenters.map((renter) => (
                        <tr key={renter._id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-4 font-bold text-white flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700 font-bold text-xs text-teal-400 shrink-0">
                              {renter.avatar ? (
                                <img src={renter.avatar} alt={renter.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{renter.name.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <span>{renter.name}</span>
                          </td>
                          <td className="p-4 text-slate-300">{renter.email}</td>
                          <td className="p-4 text-slate-400">{renter.phone || renter.whatsapp || 'N/A'}</td>
                          <td className="p-4 text-slate-400">{renter.gender || 'Not specified'}</td>
                          <td className="p-4 text-slate-400">📍 {renter.city || 'Bengaluru'}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedRenter(renter)}
                              className="bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all border border-slate-700"
                            >
                              View Renter Details
                            </button>
                            <button
                              onClick={() => initiateDelete('RENTER', renter._id, renter.name, renter.email, `Tenant Account (${renter.city || 'N/A'})`)}
                              className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-[11px] px-3 py-2 rounded-xl border border-rose-500/30 transition-all"
                              title="Delete Renter Account"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DELETION HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                  <History className="w-7 h-7 text-rose-500" /> Deletion History & Audit Log
                </h1>
                <p className="text-slate-400 text-xs mt-1">Complete historical record of deleted properties and user accounts with reason logs</p>
              </div>

              <div className="flex items-center gap-3">
                {/* SEARCH FILTER */}
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by title, email, reason..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {historyLogs.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-rose-500/30 transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear History Log
                  </button>
                )}
              </div>
            </div>

            {loadingHistory ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 text-xs font-bold">Loading deletion history records...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center py-16">
                <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No Deletion History Recorded</h3>
                <p className="text-slate-500 text-xs mt-1">When property listings or user accounts are deleted by admin, reason logs will appear here.</p>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-4">Category</th>
                        <th className="p-4">Deleted Item / User</th>
                        <th className="p-4">Deletion Reason (Admin Log)</th>
                        <th className="p-4">Deleted By</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredHistory.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                                log.targetType === 'PROPERTY'
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : log.targetType === 'OWNER'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-teal-950 text-teal-300 border border-teal-800'
                              }`}
                            >
                              {log.targetType === 'PROPERTY' ? (
                                <Building className="w-3 h-3" />
                              ) : (
                                <UserX className="w-3 h-3" />
                              )}
                              {log.targetType}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{log.targetTitle}</span>
                            {log.targetEmail && <span className="text-slate-400 text-[11px] block">{log.targetEmail}</span>}
                            {log.targetDetails && <span className="text-slate-500 text-[10px] block mt-0.5">{log.targetDetails}</span>}
                          </td>
                          <td className="p-4 max-w-xs">
                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed font-mono">
                              <span className="text-rose-400 font-bold block text-[10px] uppercase mb-0.5 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Deletion Reason:
                              </span>
                              "{log.reason}"
                            </div>
                          </td>
                          <td className="p-4 text-slate-300 font-semibold">{log.deletedBy}</td>
                          <td className="p-4 text-slate-400 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {new Date(log.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteHistoryLog(log._id)}
                              className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                              title="Delete log entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ADMIN PROFILE & SECURITY SETTINGS TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                <UserCog className="w-7 h-7 text-amber-500" /> Admin Profile & Credentials Settings
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Update administrator account details, change login email address, or set a new password. All changes update database records directly.
              </p>
            </div>

            {/* ADMIN ACCOUNT OVERVIEW CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-6 rounded-3xl border border-slate-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg border border-amber-400/40">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white">{currentUser?.name || 'Administrator'}</h2>
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      System Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-teal-400" /> {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 text-center sm:text-right">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Admin Route Path</span>
                <span className="text-xs font-mono font-bold text-teal-400">/shisri1207/admin</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SECTION 1: UPDATE BASIC PROFILE */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 text-amber-400 text-sm font-bold mb-4 pb-3 border-b border-slate-800">
                  <User className="w-4 h-4" /> Personal Information
                </div>

                <form onSubmit={handleUpdateAdminProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Admin Display Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="Administrator Name"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Contact Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-teal-600/30 flex items-center justify-center gap-2 mt-2"
                  >
                    {profileLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SECTION 2: UPDATE LOGIN EMAIL */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 text-teal-400 text-sm font-bold mb-4 pb-3 border-b border-slate-800">
                  <Mail className="w-4 h-4" /> Change Admin Login Email
                </div>

                <form onSubmit={handleUpdateAdminEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      New Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="newadmin@example.com"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Current Password (for Verification) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassCurrent ? 'text' : 'password'}
                        required
                        value={emailCurrentPassword}
                        onChange={(e) => setEmailCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassCurrent(!showPassCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        {showPassCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                  >
                    {emailLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Update Admin Email Address</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SECTION 3: UPDATE ADMIN PASSWORD (FULL WIDTH ON LG) */}
              <div className="lg:col-span-2 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg">
                <div className="flex items-center gap-2 text-rose-400 text-sm font-bold mb-4 pb-3 border-b border-slate-800">
                  <KeyRound className="w-4 h-4" /> Change Admin Password
                </div>

                <form onSubmit={handleUpdateAdminPassword} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassCurrent ? 'text' : 'password'}
                          required
                          value={passCurrentPassword}
                          onChange={(e) => setPassCurrentPassword(e.target.value)}
                          placeholder="Current password"
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassCurrent(!showPassCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassNew ? 'text' : 'password'}
                          required
                          value={passNewPassword}
                          onChange={(e) => setPassNewPassword(e.target.value)}
                          placeholder="Min. 6 characters"
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassNew(!showPassNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength bar */}
                      {passNewPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-[10px] mb-1">
                            <span className="text-slate-400">Strength:</span>
                            <span className="font-bold text-white">{passwordStrength.label}</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.width }}></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassConfirm ? 'text' : 'password'}
                          required
                          value={passConfirmPassword}
                          onChange={(e) => setPassConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassConfirm(!showPassConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          {showPassConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Updating credentials here will save directly to MongoDB. Next time you log in at <strong>/shisri1207/admin</strong>, use your new credentials.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={passLoading}
                    className="w-full sm:w-auto px-8 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2"
                  >
                    {passLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Update Admin Password</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MANDATORY DELETION REASON MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">Confirm Item Deletion</h3>
                <p className="text-[11px] text-rose-400 font-bold uppercase tracking-wider">
                  Action requires mandatory deletion reason
                </p>
              </div>
            </div>

            {/* TARGET SUMMARY BOX */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                Target {deleteTarget.type}:
              </span>
              <p className="text-sm font-bold text-white">{deleteTarget.title}</p>
              {deleteTarget.email && <p className="text-xs text-slate-400">{deleteTarget.email}</p>}
              {deleteTarget.details && <p className="text-[11px] text-slate-500 mt-1">{deleteTarget.details}</p>}
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDelete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reason for Deletion * (Saved in Database History)
                </label>
                <textarea
                  required
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Specify reason (e.g. Fake listing, Invalid details, Spam account, Violation of Terms of Service)..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                ></textarea>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                ⚠️ <strong>Note:</strong> Deleting will remove this record from active database and save this reason to the admin <strong>Deletion History</strong> page for future reference.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isDeleting || !deleteReason.trim()}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Confirm & Record Deletion</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OWNER DETAILS & LISTINGS MODAL */}
      {(loadingOwnerModal || selectedOwnerData) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
            <button
              onClick={() => setSelectedOwnerData(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingOwnerModal ? (
              <div className="py-20 text-center">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-400 text-xs font-bold">Fetching owner details & properties...</p>
              </div>
            ) : selectedOwnerData && (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold border border-amber-500/30">
                      {selectedOwnerData.owner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-white">{selectedOwnerData.owner.name}</h2>
                      <p className="text-xs text-amber-400 font-semibold">
                        Registered Landlord / Owner • {selectedOwnerData.properties.length} Active Listings
                      </p>
                    </div>
                  </div>

                  {/* ADMIN DELETE OWNER BUTTON */}
                  <button
                    onClick={() => initiateDelete('OWNER', selectedOwnerData.owner._id, selectedOwnerData.owner.name, selectedOwnerData.owner.email, `Owner (${selectedOwnerData.properties.length} active listings)`)}
                    className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Owner Account
                  </button>
                </div>

                {/* OWNER DETAILS GRID */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">Email:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">Phone:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">WhatsApp:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.whatsapp || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">City / Location:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">Business / PG Name:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.businessName || 'Independent'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5 font-semibold">Permanent Address:</span>
                    <span className="font-bold text-slate-200">{selectedOwnerData.owner.permanentAddress || 'N/A'}</span>
                  </div>
                </div>

                {/* OWNER PROPERTIES LIST */}
                <h3 className="text-base font-bold text-white mb-4">
                  Properties Listed by {selectedOwnerData.owner.name} ({selectedOwnerData.properties.length})
                </h3>

                {selectedOwnerData.properties.length === 0 ? (
                  <div className="bg-slate-950 p-6 rounded-2xl text-center text-xs text-slate-500">
                    This owner has not added any property listings yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedOwnerData.properties.map((prop) => (
                      <PropertyCard
                        key={prop._id}
                        property={prop}
                        onDelete={(propertyData) =>
                          initiateDelete('PROPERTY', propertyData._id, propertyData.title, '', `${propertyData.type} in ${propertyData.city}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

        {/* RENTER DETAILS MODAL */}
        {selectedRenter && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-slate-100">
              <button
                onClick={() => setSelectedRenter(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-teal-500 overflow-hidden flex items-center justify-center text-2xl font-bold text-teal-400">
                    {selectedRenter.avatar ? (
                      <img src={selectedRenter.avatar} alt={selectedRenter.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{selectedRenter.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{selectedRenter.name}</h2>
                    <span className="inline-block bg-teal-500/20 text-teal-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full mt-1">
                      Tenant / Renter Profile
                    </span>
                  </div>
                </div>

                {/* ADMIN DELETE RENTER BUTTON */}
                <button
                  onClick={() => initiateDelete('RENTER', selectedRenter._id, selectedRenter.name, selectedRenter.email, `Tenant Account (${selectedRenter.city || 'N/A'})`)}
                  className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Email:</span>
                  <span className="font-bold text-slate-200">{selectedRenter.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="font-bold text-slate-200">{selectedRenter.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">WhatsApp:</span>
                  <span className="font-bold text-slate-200">{selectedRenter.whatsapp || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Gender:</span>
                  <span className="font-bold text-teal-400">{selectedRenter.gender || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Preferred City:</span>
                  <span className="font-bold text-slate-200">📍 {selectedRenter.city || 'Bengaluru'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Permanent Address:</span>
                  <span className="font-bold text-slate-200">{selectedRenter.permanentAddress || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
