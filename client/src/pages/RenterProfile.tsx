import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Upload, Camera, Save, RefreshCw, Sparkles, Settings as SettingsIcon } from 'lucide-react';

const RenterProfile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState('');

  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flash, setFlash] = useState<{ message: string; type: FlashType } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setWhatsapp(currentUser.whatsapp || currentUser.phone || '');
      setPermanentAddress(currentUser.permanentAddress || '');
      setCity(currentUser.city || 'Bengaluru');
      setGender(currentUser.gender || 'Prefer not to say');
      setAvatar(currentUser.avatar || '');
      setAvatarPreview(currentUser.avatar || '');
    }
  }, [currentUser]);

  // Handle avatar file selection with 2MB validation
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setFlash({ message: 'Please select a valid JPG or PNG image file.', type: 'error' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFlash({ message: 'Avatar image file size must be less than 2 MB.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      setAvatarPreview(base64String);
      setFlash({ message: 'New avatar selected! Click "Save Changes" to update your profile.', type: 'success' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFlash(null);

    try {
      const response = await axios.put('/auth/profile', {
        name,
        phone,
        whatsapp,
        permanentAddress,
        city,
        gender,
        avatar,
      });

      if (response.data.success) {
        updateUser(response.data.data);
        setFlash({ message: 'Your personal profile details have been updated successfully!', type: 'success' });
      }
    } catch (err: any) {
      setFlash({
        message: err.response?.data?.message || 'Failed to update profile details. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flash Notifications */}
        {flash && (
          <FlashMessage
            message={flash.message}
            type={flash.type}
            onClose={() => setFlash(null)}
          />
        )}

        {/* PROFILE HEADER CARD */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Container with Upload overlay */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white/20 bg-teal-700 overflow-hidden flex items-center justify-center text-3xl font-extrabold shadow-lg">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Change</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-700/60 rounded-full text-xs font-semibold text-teal-200 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tenant Account Verified
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{name || 'Renter Profile'}</h1>
                <p className="text-teal-200 text-xs mt-1 flex items-center justify-center sm:justify-start gap-3">
                  <span>📧 {email}</span>
                  <span>•</span>
                  <span>Role: Renter / Tenant</span>
                </p>
              </div>

              <Link
                to="/user/settings"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-md transition-all shadow-md shrink-0"
              >
                <SettingsIcon className="w-4 h-4 text-amber-300" />
                <span>Account Settings & Password</span>
              </Link>
            </div>
          </div>
        </div>

        {/* PROFILE EDIT FORM */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" /> Personal Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">Keep your contact information updated to connect with landlords seamlessly.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AVATAR IMAGE SECTION */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">Profile Image / Photo</span>
                  <span className="text-xs text-slate-500">Supports JPG, PNG (Max size: 2MB)</span>
                </div>
              </div>

              <label
                htmlFor="avatar-upload-btn"
                className="cursor-pointer inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition-all shadow-2xs"
              >
                <Upload className="w-4 h-4 text-teal-600" /> Upload Profile Image
              </label>
              <input
                id="avatar-upload-btn"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* NAME & EMAIL GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address (Read-only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* PHONE & WHATSAPP GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </div>

            {/* GENDER & PREFERRED CITY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* GENDER SECTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* PREFERRED CITY */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred City / Current City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-teal-600 absolute left-3.5 top-3" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Gurugram">Gurugram</option>
                    <option value="Noida">Noida</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PERMANENT ADDRESS */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Permanent Address / Current Residential Address
              </label>
              <textarea
                rows={3}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter house no, street, locality, district..."
              />
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-md shadow-teal-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RenterProfile;
