import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import type { PropertyData } from '../../components/PropertyCard';
import { Search, Heart, Sparkles, Building2, ArrowRight } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userCity = currentUser?.city || 'Bengaluru';

  useEffect(() => {
    const fetchCityProperties = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/properties', {
          params: { city: userCity },
        });
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (err: any) {
        setError('Failed to fetch properties for your preferred location.');
      } finally {
        setLoading(false);
      }
    };

    fetchCityProperties();
  }, [userCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700/60 rounded-full text-xs font-semibold text-teal-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tenant Profile Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {currentUser?.name}!</h1>
            <p className="text-teal-200 text-sm mt-1">
              Showing verified rooms & PGs matching your preferred city: <strong className="text-white font-bold">{userCity}</strong>
            </p>
          </div>

          <Link
            to="/find-rooms"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-2xl transition-all shadow-md w-fit text-xs"
          >
            <span>Browse All Cities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
          <div className="bg-teal-50 p-3 rounded-xl text-teal-600">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Search Rooms</h3>
            <p className="text-xs text-slate-500 mt-1">Found {properties.length} listings in {userCity}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
          <div className="bg-rose-50 p-3 rounded-xl text-rose-600">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Saved Favorites</h3>
            <p className="text-xs text-slate-500 mt-1">0 Bookmarked properties</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-start gap-4">
          <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">My Preferred City</h3>
            <p className="text-xs text-slate-700 font-bold mt-1">📍 {userCity}</p>
          </div>
        </div>
      </div>

      {/* SECTION: LIVE LISTINGS FOR PREFERRED LOCATION */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rooms & PGs in {userCity}</h2>
          <p className="text-xs text-slate-500">Live listings updated for your preferred area</p>
        </div>

        <Link to="/find-rooms" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-xs text-slate-500 font-semibold">Fetching properties for {userCity}...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl text-center">
          <p className="text-xs font-bold">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-base">No listings in {userCity} yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try checking other cities in our property discovery page.</p>
          <Link to="/find-rooms" className="inline-block bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
            Explore All Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
