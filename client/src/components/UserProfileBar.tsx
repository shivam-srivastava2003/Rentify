import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Mail } from 'lucide-react';

const UserProfileBar: React.FC = () => {
  const { isAuthenticated, currentUser, role } = useAuth();

  if (!isAuthenticated || !currentUser) return null;

  const roleLabels = {
    USER: 'Tenant Account',
    OWNER: 'Property Owner',
    ADMIN: 'System Admin',
  };

  const roleColors = {
    USER: 'bg-teal-500 text-white',
    OWNER: 'bg-amber-500 text-slate-950 font-bold',
    ADMIN: 'bg-purple-600 text-white',
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-b border-slate-800 py-2.5 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left Side: Greeting & Role */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Welcome, <strong className="text-teal-300">{currentUser.name}</strong></span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow-xs ${roleColors[role || 'USER']}`}>
            {roleLabels[role || 'USER']}
          </span>
        </div>

        {/* Right Side: Details Tags */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          {/* Preferred Location Badge */}
          <div className="flex items-center gap-1.5 bg-teal-900/60 border border-teal-700/60 px-3 py-1 rounded-full text-teal-200">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Preferred Location: <strong className="text-white">{currentUser.city || 'Bengaluru'}</strong></span>
          </div>

          {/* Email Tag */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span>{currentUser.email}</span>
          </div>

          {/* Phone Tag */}
          {currentUser.phone && (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>{currentUser.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileBar;
