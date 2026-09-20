import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import { ShieldAlert, Lock, Mail, ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handlePrefillDemo = () => {
    setEmail('admin@roomfinder.com');
    setPassword('AdminPassword123!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.success) {
        const user = response.data.data;

        if (user.role !== 'ADMIN') {
          await axios.post('/auth/logout');
          setFlash({ type: 'error', message: 'Unauthorized access. Only Administrator accounts can login here.' });
          setLoading(false);
          return;
        }

        login(user, response.data.token);
        setFlash({ type: 'success', message: 'Admin authentication successful.' });
        setTimeout(() => navigate('/admin/dashboard'), 500);
      }
    } catch (err: any) {
      setFlash({
        type: 'error',
        message: err.response?.data?.message || 'Invalid admin credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Logo light className="justify-center mb-4" size="lg" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-xs font-bold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" /> Restricted Admin Portal
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Rentify System Administration
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Quick Credentials Helper Box */}
        <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-400 mb-1">
            <KeyRound className="w-3.5 h-3.5" /> Seeded Admin Account
          </div>
          <p className="text-[11px] text-slate-400 mb-2">Email: <strong className="text-white">admin@roomfinder.com</strong> | Password: <strong className="text-white">AdminPassword123!</strong></p>
          <button
            type="button"
            onClick={handlePrefillDemo}
            className="text-[11px] font-bold text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500/30 px-3 py-1.5 rounded-lg border border-teal-500/40 transition-all"
          >
            Auto-fill Admin Credentials
          </button>
        </div>

        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10">
          {flash && (
            <FlashMessage
              type={flash.type}
              message={flash.message}
              onClose={() => setFlash(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@roomfinder.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Authenticate Admin Session</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              ← Return to Standard User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
