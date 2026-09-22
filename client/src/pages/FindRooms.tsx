import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import type { PropertyData } from '../components/PropertyCard';
import { Search, MapPin, Building2, RefreshCw } from 'lucide-react';

const FindRooms: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Default filter to user's preferred city or 'Bengaluru'
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || 'Gurugram');
  const [selectedType, setSelectedType] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (selectedCity && selectedCity !== 'All') params.city = selectedCity;
      if (selectedType && selectedType !== 'All') params.type = selectedType;
      if (availabilityFilter !== 'All') params.isAvailable = availabilityFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await axios.get('/properties', { params });
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedCity, selectedType, availabilityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Verified Rooms & PGs
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Discover verified rooms in <strong className="text-teal-700">{selectedCity}</strong> and surrounding tech hubs with direct landlord contact.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-200 mb-10">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative col-span-1 lg:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search area (e.g. Koramangala, Indiranagar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {/* City Selector */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-teal-600">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="All">All Cities</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Noida">Noida</option>
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="All">All Property Types</option>
                <option value="PG">Boys/Girls PG</option>
                <option value="Single Room">Single Private Room</option>
                <option value="1BHK Flat">1BHK Apartment</option>
                <option value="Studio">Studio Apartment</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="All">All Statuses</option>
                <option value="true">Available Now 🟢</option>
                <option value="false">Fully Booked 🔴</option>
              </select>
            </div>
          </form>
        </div>

        {/* LISTINGS RESULTS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-semibold text-sm">Fetching verified listings for {selectedCity}...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center max-w-lg mx-auto">
            <p className="font-bold text-sm mb-2">{error}</p>
            <button
              onClick={fetchProperties}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Loading
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Found</h3>
            <p className="text-slate-500 text-sm mb-6">
              We couldn't find any rooms matching your current filters in <strong>{selectedCity}</strong>.
            </p>
            <button
              onClick={() => {
                setSelectedCity('All');
                setSelectedType('All');
                setAvailabilityFilter('All');
                setSearchQuery('');
              }}
              className="bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Showing {properties.length} Verified Properties in {selectedCity === 'All' ? 'All Locations' : selectedCity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindRooms;
