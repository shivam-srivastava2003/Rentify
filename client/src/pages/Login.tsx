import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import authImg from '../assets/auth.jpg';
import { Lock, Mail, ArrowRight, User, Building, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [roleHint, setRoleHint] = useState<'USER' | 'OWNER'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.success) {
        const user = response.data.data;
        login(user, response.data.token);

        setFlash({ type: 'success', message: response.data.message || 'Login successful!' });

        setTimeout(() => {
          if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else if (user.role === 'OWNER') {
            navigate('/owner/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 500);
      }
    } catch (err: any) {
      setFlash({
        type: 'error',
        message: err.response?.data?.message || 'Invalid email or password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        {/* Left Side: Form Container */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            <Logo className="mb-6" size="md" />
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back to Rentify
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 mb-6">
              Sign in to access your tenant profile or manage your property listings.
            </p>

            {/* Role Segment Switcher */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-6">
              <button
                type="button"
                onClick={() => setRoleHint('USER')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  roleHint === 'USER' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Tenant Portal
              </button>

              <button
                type="button"
                onClick={() => setRoleHint('OWNER')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  roleHint === 'OWNER' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                Owner Portal
              </button>
            </div>

            {/* Flash Alert */}
            {flash && (
              <FlashMessage
                type={flash.type}
                message={flash.message}
                onClose={() => setFlash(null)}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder={roleHint === 'OWNER' ? 'owner@pgstays.com' : 'tenant@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In as {roleHint === 'OWNER' ? 'Owner' : 'Tenant'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-4">
            <p className="text-xs text-slate-600">
              Don't have a Rentify account yet?{' '}
              <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700">
                Register now
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image Banner */}
        <div className="hidden md:block w-1/2 relative bg-slate-900 overflow-hidden">
          <img
            src={authImg}
            alt="Rentify Community"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-10 flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /> 100% Verified Community
            </div>
            <h3 className="text-2xl font-extrabold mb-2 leading-snug">
              Discover Verified Rooms & PGs Near Your Workspace
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join thousands of tenants and property managers using Rentify for transparent room discovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
