import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import authImg from '../assets/auth.jpg';
import { clientLoginSchema, validateForm } from '../utils/validation';
import {
  Lock,
  Mail,
  ArrowRight,
  User,
  Building,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  X
} from 'lucide-react';

const Login: React.FC = () => {
  const [roleHint, setRoleHint] = useState<'USER' | 'OWNER'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPass, setShowResetNewPass] = useState(false);
  const [showResetConfirmPass, setShowResetConfirmPass] = useState(false);
  const [forgotFlash, setForgotFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    // Client-side Zod Schema Validation
    const validation = validateForm(clientLoginSchema, { email, password });
    if (!validation.success) {
      setFlash({ type: 'error', message: validation.error });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });

      if (response.data.success) {
        const user = response.data.data;
        login(user, response.data.token);

        setFlash({ type: 'success', message: response.data.message || 'Login successful!' });

        const fromPath = typeof location.state?.from === 'string' ? location.state.from : location.state?.from?.pathname;

        setTimeout(() => {
          if (user.role === 'ADMIN') {
            navigate(fromPath && fromPath.startsWith('/shisri1207/admin') ? fromPath : '/shisri1207/admin/dashboard');
          } else if (user.role === 'OWNER') {
            navigate(fromPath && (fromPath.startsWith('/owner') || fromPath === '/settings') ? fromPath : '/owner/dashboard');
          } else {
            navigate(fromPath && (fromPath.startsWith('/user') || fromPath === '/settings' || fromPath === '/find-rooms') ? fromPath : '/user/dashboard');
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

  // Step 1: Verify Email for Forgot Password
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotFlash(null);
    setForgotLoading(true);

    try {
      const response = await axios.post('/auth/verify-reset-email', { email: forgotEmail });

      if (response.data.success) {
        setForgotFlash({
          type: 'success',
          message: 'Email verified! Enter your new password below.',
        });
        setForgotStep('reset');
      }
    } catch (err: any) {
      setForgotFlash({
        type: 'error',
        message: err.response?.data?.message || 'No account found with this email address.',
      });
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotFlash(null);

    if (resetNewPassword.length < 6) {
      setForgotFlash({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setForgotFlash({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setForgotLoading(true);

    try {
      const response = await axios.post('/auth/reset-password', {
        email: forgotEmail,
        newPassword: resetNewPassword,
      });

      if (response.data.success) {
        setFlash({
          type: 'success',
          message: 'Password reset successfully! Log in with your new password.',
        });
        setEmail(forgotEmail);
        setPassword(resetNewPassword);
        setIsForgotOpen(false);
        setForgotStep('email');
        setResetNewPassword('');
        setResetConfirmPassword('');
      }
    } catch (err: any) {
      setForgotFlash({
        type: 'error',
        message: err.response?.data?.message || 'Failed to reset password. Please try again.',
      });
    } finally {
      setForgotLoading(false);
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotOpen(true);
                      setForgotStep('email');
                      setForgotEmail(email);
                      setForgotFlash(null);
                    }}
                    className="text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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

      {/* FORGOT PASSWORD MODAL */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-teal-500/20 rounded-xl text-teal-400 border border-teal-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Reset Your Password</h3>
                  <p className="text-[11px] text-teal-200">
                    {forgotStep === 'email' ? 'Step 1 of 2: Verify registered email' : 'Step 2 of 2: Enter new password'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsForgotOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {forgotFlash && (
                <FlashMessage
                  type={forgotFlash.type}
                  message={forgotFlash.message}
                  onClose={() => setForgotFlash(null)}
                />
              )}

              {forgotStep === 'email' ? (
                /* STEP 1: VERIFY EMAIL FORM */
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Please enter your registered email address. We will verify your account email before resetting your password.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
                    >
                      {forgotLoading ? 'Verifying Email...' : 'Verify Email Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(false)}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: RESET NEW PASSWORD FORM */
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Email verified (<strong className="text-teal-700">{forgotEmail}</strong>). Enter and confirm your new password below:
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showResetNewPass ? 'text' : 'password'}
                        required
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 chars)"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetNewPass(!showResetNewPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showResetNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showResetConfirmPass ? 'text' : 'password'}
                        required
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetConfirmPass(!showResetConfirmPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showResetConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Reset Password Now'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForgotStep('email')}
                      className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
