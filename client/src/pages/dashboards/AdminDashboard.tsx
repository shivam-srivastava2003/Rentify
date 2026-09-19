import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import type { PropertyData } from '../../components/PropertyCard';
import {
  Users,
  Building,
  ShieldCheck,
  Activity,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Search,
  LayoutDashboard,
  ChevronRight,
  X,
  Menu
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

const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'owners' | 'renters'>('dashboard');

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

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'owners' && owners.length === 0) {
      fetchOwners();
    } else if (activeTab === 'renters' && renters.length === 0) {
      fetchRenters();
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

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 flex flex-col md:flex-row">
      {/* MOBILE TOP BAR WITH TOGGLE */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span className="font-extrabold text-sm text-white">Rentify Admin Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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
              <span className="bg-slate-950 px-2 py-0.5 rounded-md text-[10px] text-teal-300 font-extrabold">
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
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
          Rentify Management System v2.0
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
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

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Available Rooms</p>
                    <p className="text-3xl font-black text-emerald-400 mt-1">{loadingStats ? '...' : stats?.availableProperties ?? 0}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold block mt-3">
                  {stats?.fullyBookedProperties ?? 0} Fully Booked
                </span>
              </div>
            </div>

            {/* RECENT PROPERTIES TABLE */}
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
                        <th className="p-4 text-right">Action</th>
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
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleOpenOwnerModal(owner._id)}
                              className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all shadow-xs"
                            >
                              View Info & Listings
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
                        <th className="p-4 text-right">Action</th>
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
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedRenter(renter)}
                              className="bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 font-bold text-[11px] px-3.5 py-2 rounded-xl transition-all border border-slate-700"
                            >
                              View Renter Details
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
      </main>

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
                <div className="flex items-center gap-3 mb-6">
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
                      <PropertyCard key={prop._id} property={prop} />
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

            <div className="flex items-center gap-4 mb-6">
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
