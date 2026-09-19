import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import heroImg from '../assets/hero.jpg';
import { User, Building, Lock, Mail, Phone, Building2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [role, setRole] = useState<'USER' | 'OWNER'>('USER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: 'Bengaluru',
    businessName: '',
    propertyLocation: '',
    unitCount: '1-5 Units',
  });

  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    if (formData.password !== formData.confirmPassword) {
      setFlash({ type: 'error', message: 'Passwords do not match. Please try again.' });
      return;
    }

    if (formData.password.length < 6) {
      setFlash({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        ...(role === 'USER' ? { city: formData.city } : {}),
        ...(role === 'OWNER'
          ? {
              businessName: formData.businessName,
              propertyLocation: formData.propertyLocation,
              unitCount: formData.unitCount,
            }
          : {}),
      };

      const response = await axios.post('/auth/register', payload);

      if (response.data.success) {
        const user = response.data.data;
        login(user);
        setFlash({ type: 'success', message: response.data.message || 'Account created successfully!' });

        setTimeout(() => {
          if (user.role === 'OWNER') {
            navigate('/owner/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 800);
      }
    } catch (err: any) {
      setFlash({
        type: 'error',
        message: err.response?.data?.message || 'Registration failed. Please check your details.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        {/* Left Side Image Banner */}
        <div className="hidden md:block w-5/12 relative bg-slate-950 overflow-hidden">
          <img
            src={heroImg}
            alt="Rentify Modern Property"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-10 flex flex-col justify-between text-white">
            <Logo light size="md" />
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" /> Zero Commission Platform
              </div>
              <h3 className="text-2xl font-extrabold mb-2 leading-snug">
                {role === 'USER'
                  ? 'Find Your Dream Room or PG in Top Cities'
                  : 'List Your PG Property & Receive Direct Leads'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {role === 'USER'
                  ? 'Get early access to thousands of verified rental rooms and flatmates across India.'
                  : 'Join 5,000+ PG owners managing their listings and connecting directly with renters.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side Registration Form */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <div className="md:hidden mb-4">
              <Logo size="md" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              Create Your Rentify Account
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Join thousands of tenants and property managers on India's premier room finding network.
            </p>

            {/* Flash Alert Banner */}
            {flash && (
              <FlashMessage
                type={flash.type}
                message={flash.message}
                onClose={() => setFlash(null)}
              />
            )}

            {/* STEP 1: VISUAL ROLE SELECTION */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* User Option */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('USER');
                    setFlash(null);
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-28 ${
                    role === 'USER'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {role === 'USER' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 absolute top-3 right-3" />
                  )}
                  <div className={`p-2 rounded-xl w-fit ${role === 'USER' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">Tenant / Room Seeker</h3>
                  </div>
                </button>

                {/* Owner Option */}
                <button
                  type="button"
                  onClick={() => {
                    setRole('OWNER');
                    setFlash(null);
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between h-28 ${
                    role === 'OWNER'
                      ? 'border-teal-600 bg-teal-50/50 shadow-sm ring-2 ring-teal-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {role === 'OWNER' && (
                    <CheckCircle2 className="w-4 h-4 text-teal-600 absolute top-3 right-3" />
                  )}
                  <div className={`p-2 rounded-xl w-fit ${role === 'OWNER' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">Property Owner</h3>
                  </div>
                </button>
              </div>
            </div>

            {/* DYNAMIC REGISTRATION FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ROLE SPECIFIC EXTRA FIELDS */}
              {role === 'USER' ? (
                <div className="p-3.5 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred City to Rent</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
              ) : (
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property or PG Brand Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="businessName"
                        required
                        placeholder="e.g. GreenStays PG for Men"
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Property City / Area</label>
                      <input
                        type="text"
                        name="propertyLocation"
                        required
                        placeholder="e.g. Indiranagar, Bengaluru"
                        value={formData.propertyLocation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Total Capacity</label>
                      <select
                        name="unitCount"
                        value={formData.unitCount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="1-5 Units">1 - 5 Rooms / Beds</option>
                        <option value="6-20 Units">6 - 20 Rooms / Beds</option>
                        <option value="20+ Units">20+ Large PG / Complex</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create {role === 'OWNER' ? 'Owner' : 'Tenant'} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-600">
              Already registered on Rentify?{' '}
              <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
