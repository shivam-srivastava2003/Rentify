import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import AddPropertyModal from './AddPropertyModal';
import { Menu, X, LogOut, LayoutDashboard, Search, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, role, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'OWNER') return '/owner/dashboard';
    return '/user/dashboard';
  };

  const getProfileLink = () => {
    if (role === 'OWNER') return '/owner/profile';
    return '/user/profile';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - HIDE Home & Why Rentify WHEN LOGGED IN */}
          <nav className="hidden md:flex items-center space-x-6">
            {!isAuthenticated && (
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-teal-600' : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                Home
              </Link>
            )}

            {!isAuthenticated && (
              /* GUEST PUBLIC NAVBAR ITEMS */
              <Link
                to="/find-rooms"
                className={`text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                  isActive('/find-rooms') ? 'text-teal-600 font-bold' : 'text-slate-600 hover:text-teal-600'
                }`}
              >
                <Search className="w-4 h-4 text-teal-600" />
                <span>Find Rooms</span>
              </Link>
            )}

          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* DASHBOARD LINK */}
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-600 bg-slate-50 hover:bg-teal-50 px-3.5 py-2.5 rounded-xl transition-all border border-slate-200"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                  <span>Dashboard</span>
                  <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-teal-600 text-white">
                    {role}
                  </span>
                </Link>

                {/* PROFILE ICON ONLY (SHIFTED TO DASHBOARD SIDE, CLICK REDIRECTS TO PROFILE PAGE) */}
                <Link
                  to={getProfileLink()}
                  title="View & Edit Profile"
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all overflow-hidden ${
                    isActive(getProfileLink())
                      ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 hover:bg-teal-50 border-slate-200 hover:border-teal-300'
                  }`}
                >
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-teal-600" />
                  )}
                </Link>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 px-3 py-2.5 rounded-xl hover:bg-rose-50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/20 hover:shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          {!isAuthenticated && (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
            >
              Home
            </Link>
          )}

          {role === 'OWNER' && isAuthenticated ? (
            <>
              <Link
                to="/owner/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
              >
                Owner Dashboard
              </Link>
              <Link
                to="/owner/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
              >
                Owner Profile
              </Link>
            </>
          ) : role === 'USER' && isAuthenticated ? (
            <>
              <Link
                to="/user/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
              >
                Tenant Dashboard
              </Link>
              <Link
                to="/user/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
              >
                My Profile
              </Link>
            </>
          ) : (
            <Link
              to="/find-rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-700 hover:text-teal-600"
            >
              Find Rooms & PGs
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-rose-600 font-semibold rounded-xl hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 text-slate-700 font-semibold rounded-xl border border-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2.5 bg-teal-600 text-white font-semibold rounded-xl shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      <AddPropertyModal
        isOpen={isAddPropertyOpen}
        onClose={() => setIsAddPropertyOpen(false)}
        onSuccess={() => {
          if (location.pathname === '/owner/properties' || location.pathname === '/owner/dashboard') {
            window.location.reload();
          } else {
            navigate('/owner/properties');
          }
        }}
      />
    </header>
  );
};

export default Navbar;
