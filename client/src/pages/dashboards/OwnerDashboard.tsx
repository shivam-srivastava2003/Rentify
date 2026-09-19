import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import type { PropertyData } from '../../components/PropertyCard';
import AddPropertyModal from '../../components/AddPropertyModal';
import EditPropertyModal from '../../components/EditPropertyModal';
import OwnerPropertyDetailModal from '../../components/OwnerPropertyDetailModal';
import { Building2, PlusCircle, MapPin, Mail, Sparkles, ArrowRight } from 'lucide-react';

const OwnerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/properties/my-properties');
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (err: any) {
      setError('Failed to fetch your listed properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleDeleteProperty = async (property: PropertyData) => {
    if (window.confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)) {
      try {
        const response = await axios.delete(`/properties/${property._id}`);
        if (response.data.success) {
          fetchMyProperties();
        }
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete property.');
      }
    }
  };

  const totalAvailableBeds = properties.reduce(
    (acc, item: any) => acc + (item.availableBeds || (item.isAvailable ? 1 : 0)),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold mb-3 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Property Owner & Landlord Control Panel
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {currentUser?.name}!</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your room listings, track tenant inquiries, and update existing property details.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300 bg-slate-800/80 p-4 rounded-2xl w-fit border border-slate-700">
              {currentUser?.businessName && (
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>{currentUser.businessName}</span>
                </div>
              )}
              {currentUser?.propertyLocation && (
                <div className="flex items-center gap-1.5 border-l border-slate-700 pl-4">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{currentUser.propertyLocation}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 border-l border-slate-700 pl-4">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser?.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs px-6 py-4 rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 w-fit"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ List New Property</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Properties Listed</span>
          <p className="text-3xl font-black text-slate-900 mt-2">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Rooms/Beds</span>
          <p className="text-3xl font-black text-emerald-600 mt-2">{totalAvailableBeds}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Locations</span>
          <p className="text-3xl font-black text-amber-500 mt-2">
            {new Set(properties.map((p) => p.city)).size || (currentUser?.city ? 1 : 0)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Tenant Enquiries</span>
          <p className="text-3xl font-black text-teal-600 mt-2">0</p>
        </div>
      </div>

      {/* MY PROPERTIES GRID */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Listed Properties</h2>
          <p className="text-xs text-slate-500">Manage listings or click Edit to update prices, photos, and availability</p>
        </div>

        <Link to="/owner/properties" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500 font-semibold">Loading your property portfolio...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center">
          <p className="text-xs font-bold">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-sm">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">No properties listed yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">Start getting direct tenant leads by posting your first property.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            + Post Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onSelect={(p) => setSelectedProperty(p)}
              onEdit={(p) => setEditingProperty(p)}
              onDelete={(p) => handleDeleteProperty(p)}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMyProperties}
      />

      <EditPropertyModal
        isOpen={!!editingProperty}
        property={editingProperty}
        onClose={() => setEditingProperty(null)}
        onSuccess={fetchMyProperties}
      />

      <OwnerPropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onEdit={(p) => setEditingProperty(p)}
        onDelete={(p) => handleDeleteProperty(p)}
      />
    </div>
  );
};

export default OwnerDashboard;
