import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Activity
} from 'lucide-react';

const AdminNavbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* LEFT: LOGO & ADMIN BADGE (BADGE HIDDEN ON SMARTPHONE) */}
          <div className="flex items-center gap-3">
            <Link to="/shisri1207/admin/dashboard" className="flex items-center">
              <Logo light={true} size="md" />
            </Link>

            {/* HIDDEN ON SMARTPHONE / SMALL DEVICES */}
            <span className="hidden md:inline-flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Admin Portal
            </span>
          </div>


          {/* RIGHT: LIVE METRICS & ADMIN PROFILE PILL (HIDDEN ON SMARTPHONE) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* LIVE DB BADGE (HIDDEN ON SMALL DEVICES / SMARTPHONE) */}
            <div className="hidden xl:flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-extrabold px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Live DB Connected
            </div>

            {/* ADMIN PROFILE PILL */}
            
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block leading-none">
                  Admin
                </span>
                <span className="text-xs font-bold text-white max-w-[120px] truncate block mt-0.5">
                  {currentUser?.name || 'Administrator'}
                </span>
              </div>
            
          </div>

          {/* MOBILE MENU BUTTON (ONLY SINGLE TOP BAR MENU ON SMARTPHONE) */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-white"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-slate-400 block text-[10px] uppercase">Logged in Administrator</span>
              <strong className="text-white text-xs truncate block">{currentUser?.email}</strong>
            </div>
          </div>

          {/* <Link
            to="/shisri1207/admin/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2.5 px-3 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <LayoutDashboard className="w-4 h-4 text-teal-400" />
            Admin Dashboard
          </Link>

          <Link
            to="/shisri1207/admin/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 py-2.5 px-3 text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl"
          >
            <UserCog className="w-4 h-4 text-amber-400" />
            Admin Profile & Settings
          </Link> */}

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-rose-400 font-bold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs"
            >
              <LogOut className="w-4 h-4" />
              Logout Administrator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
