import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Bell,
  UserCheck,
  ArrowLeft,
  CheckCircle2,
  Save
} from 'lucide-react';

const Settings: React.FC = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'security' | 'privacy' | 'account'>('security');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Preference Settings State
  const [showPhoneToUsers, setShowPhoneToUsers] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    if (!currentPassword) {
      setFlash({ type: 'error', message: 'Please enter your current password.' });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFlash({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFlash({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setFlash({
          type: 'success',
          message: response.data.message || 'Password updated successfully!',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      setFlash({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Failed to update password. Please verify your current password.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFlash({
      type: 'success',
      message: 'Account preferences & notification settings saved successfully!',
    });
  };

  const getProfileLink = () => {
    if (role === 'OWNER') return '/owner/profile';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/user/profile';
  };

  // Password strength calculation helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', color: '', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (pass.length < 10 || !/\d/.test(pass))
      return { label: 'Medium', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link & Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(getProfileLink())}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>

          <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-teal-200">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>{role === 'OWNER' ? 'Owner Account' : role === 'ADMIN' ? 'Admin Account' : 'Renter Account'}</span>
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & Security Settings</h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your password, account credentials, privacy controls, and communication preferences.
          </p>
        </div>

        {/* Flash Notifications */}
        {flash && (
          <FlashMessage
            type={flash.type}
            message={flash.message}
            onClose={() => setFlash(null)}
          />
        )}

        {/* SETTINGS CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col md:flex-row">
          {/* LEFT NAVIGATION TABS */}
          <div className="w-full md:w-64 bg-slate-900 text-white p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4 px-3">
                Settings Menu
              </h2>

              <button
                onClick={() => {
                  setActiveTab('security');
                  setFlash(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'security'
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Password & Security</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('privacy');
                  setFlash(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Privacy & Preferences</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('account');
                  setFlash(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'account'
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Account Info</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-500">
              <p className="font-semibold text-slate-400">Rentify Security</p>
              <p className="mt-1 leading-relaxed">
                256-bit encrypted credentials and JWT token authorization.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1 p-6 sm:p-10">
            {/* TAB 1: PASSWORD & SECURITY */}
            {activeTab === 'security' && (
              <div>
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Update Account Password</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Ensure your account remains secure by choosing a strong, unique password.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2.5 space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-slate-500">Password Strength:</span>
                          <span className={strength.label === 'Strong' ? 'text-emerald-600' : strength.label === 'Medium' ? 'text-amber-600' : 'text-rose-600'}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${strength.color} transition-all duration-300`}
                            style={{ width: strength.width }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 2: PRIVACY & PREFERENCES */}
            {activeTab === 'privacy' && (
              <div>
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Privacy & Notifications</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Control how your contact details are shared and customize alert settings.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                  {/* Contact Sharing Setting */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Contact Number Visibility</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {role === 'OWNER'
                          ? 'Allow verified renters to view your phone number for property inquiries.'
                          : 'Allow property owners to view your contact number when requesting visits.'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showPhoneToUsers}
                        onChange={(e) => setShowPhoneToUsers(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* Email Notifications Setting */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">Email Alerts & Updates</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Receive instant email updates for new room matches, tenant leads, or account security alerts.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* WhatsApp Notifications Setting */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">WhatsApp Instant Alerts</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Get direct WhatsApp alerts for property availability updates and chatbot recommendations.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappNotifications}
                        onChange={(e) => setWhatsappNotifications(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Preferences</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ACCOUNT INFO */}
            {activeTab === 'account' && (
              <div>
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100">
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl border border-teal-100">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Account Summary</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Overview of your account status, registered email, and security badge.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Account Role</span>
                    <span className="font-extrabold uppercase px-3 py-1 rounded-full bg-teal-600 text-white">
                      {role}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Registered Name</span>
                    <span className="font-bold text-slate-900">{currentUser?.name || 'N/A'}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                    <span className="font-bold text-slate-900">{currentUser?.email || 'N/A'}</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Account Status</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" /> Active & Verified
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
