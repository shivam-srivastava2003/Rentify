import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import type { PropertyData } from '../components/PropertyCard';
import AddPropertyModal from '../components/AddPropertyModal';
import EditPropertyModal from '../components/EditPropertyModal';
import OwnerPropertyDetailModal from '../components/OwnerPropertyDetailModal';
import { PlusCircle, Building2, RefreshCw } from 'lucide-react';

const OwnerProperties: React.FC = () => {
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
      setError(err.response?.data?.message || 'Failed to load your properties.');
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

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-2">
              <Building2 className="w-3.5 h-3.5 text-amber-600" /> Owner Portfolio Management
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Property Listings</h1>
            <p className="text-slate-600 text-sm mt-1">
              View, edit, or update all your listed properties and monitor availability.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ List New Property</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-semibold text-sm">Fetching your listed properties...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center max-w-lg mx-auto">
            <p className="font-bold text-sm mb-3">{error}</p>
            <button
              onClick={fetchMyProperties}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Posted Yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              You haven't listed any property or PG unit. Post your first property to receive direct tenant leads!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md"
            >
              + Post Your First Property
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Listed Properties: {properties.length}
              </span>
              <span className="text-xs text-slate-400">💡 Click Edit to update pricing or photos</span>
            </div>

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
    </div>
  );
};

export default OwnerProperties;
