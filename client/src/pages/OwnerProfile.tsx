import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import { User, Phone, MessageSquare, Mail, MapPin, Building2, Save, Edit3, ShieldCheck, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';

const OwnerProfile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    whatsapp: currentUser?.whatsapp || currentUser?.phone || '',
    permanentAddress: currentUser?.permanentAddress || '',
    city: currentUser?.city || '',
    businessName: currentUser?.businessName || '',
    propertyLocation: currentUser?.propertyLocation || '',
    unitCount: currentUser?.unitCount || '1-5 Units',
  });

  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);
    setLoading(true);

    try {
      const response = await axios.put('/auth/profile', formData);

      if (response.data.success) {
        updateUser(response.data.data);
        setFlash({ type: 'success', message: 'Owner profile details updated successfully!' });
        setIsEditing(false);
      }
    } catch (err: any) {
      setFlash({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile details.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Owner Account Profile
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Property Owner Profile</h1>
            <p className="text-slate-600 text-sm mt-1">
              View and manage your personal details, WhatsApp contact, and permanent address.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/owner/settings"
              className="inline-flex items-center gap-2 font-bold text-xs px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition-all"
            >
              <SettingsIcon className="w-4 h-4 text-teal-600" />
              <span>Settings & Password</span>
            </Link>

            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setFlash(null);
              }}
              className={`inline-flex items-center gap-2 font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all ${
                isEditing
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile Details'}</span>
            </button>
          </div>
        </div>

        {/* Flash Alert Notification */}
        {flash && (
          <FlashMessage
            type={flash.type}
            message={flash.message}
            onClose={() => setFlash(null)}
          />
        )}

        {/* MAIN PROFILE CARD (NO IMAGE) */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Card Top Banner (Gradient Color Badge, No Profile Image) */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-8 text-white relative">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md">
                  Verified Property Owner
                </span>
                <h2 className="text-2xl font-black mt-2">{currentUser?.name}</h2>
                <p className="text-xs text-teal-200 mt-0.5">{currentUser?.businessName || 'Rentify Property Manager'}</p>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-400 block">Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs mt-0.5">
                  <CheckCircle2 className="w-4 h-4" /> Active & Verified
                </span>
              </div>
            </div>
          </div>

          {/* VIEW OR EDIT FORM */}
          {isEditing ? (
            /* EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-teal-600" /> Update Personal & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Read Only)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      readOnly
                      value={formData.email}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-sm cursor-not-allowed font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="whatsapp"
                      placeholder="+91 98765 43210"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* PERMANENT ADDRESS */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Home Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    name="permanentAddress"
                    rows={3}
                    placeholder="Enter street, house number, area, city, pincode, state..."
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  ></textarea>
                </div>
              </div>

              {/* BUSINESS DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business / PG Brand Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="businessName"
                      placeholder="e.g. Sunrise Executive PG"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Property City</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                  </select>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* READ ONLY VIEW MODE */
            <div className="p-8 space-y-8">
              {/* Personal Contact Details Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Personal Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs border border-slate-100">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentUser?.name}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs border border-slate-100">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{currentUser?.email}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs border border-slate-100">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {currentUser?.phone || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-emerald-600 shadow-xs border border-emerald-100">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider block">WhatsApp Number</span>
                      <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                        {currentUser?.whatsapp || currentUser?.phone || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permanent Address Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Permanent Address
                </h3>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="p-2.5 bg-white rounded-xl text-amber-600 shadow-xs border border-slate-100">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Permanent Residence</span>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                      {currentUser?.permanentAddress || 'No permanent address recorded yet. Click "Edit Profile Details" to add your address.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Portfolio Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Business & Property Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs border border-slate-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Business / PG Brand Name</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {currentUser?.businessName || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                    <div className="p-2.5 bg-white rounded-xl text-teal-600 shadow-xs border border-slate-100">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Primary Operating City</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {currentUser?.city || 'Bengaluru'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
