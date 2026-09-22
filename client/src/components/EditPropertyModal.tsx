import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlashMessage from './FlashMessage';
import type { FlashType } from './FlashMessage';
import type { PropertyData } from './PropertyCard';
import { X, Upload, Save, Building2, MapPin, IndianRupee, Layers, CheckCircle2 } from 'lucide-react';

interface EditPropertyModalProps {
  isOpen: boolean;
  property: PropertyData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ isOpen, property, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'PG',
    gender: 'Boys PG',
    city: 'Bengaluru',
    sector: '',
    street: '',
    country: 'India',
    area: '',
    price: '',
    deposit: '',
    maintenance: '',
    totalBeds: '10',
    availableBeds: '6',
    occupiedBeds: '4',
    description: '',
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [flash, setFlash] = useState<{ type: FlashType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        type: property.type || 'PG',
        gender: property.gender || 'Boys PG',
        city: property.city || 'Bengaluru',
        sector: (property as any).sector || '',
        street: (property as any).street || '',
        country: (property as any).country || 'India',
        area: property.area || '',
        price: property.price ? String(property.price) : '',
        deposit: (property as any).deposit ? String((property as any).deposit) : '0',
        maintenance: (property as any).maintenance ? String((property as any).maintenance) : '0',
        totalBeds: (property as any).totalBeds ? String((property as any).totalBeds) : '10',
        availableBeds: (property as any).availableBeds ? String((property as any).availableBeds) : '6',
        occupiedBeds: (property as any).occupiedBeds ? String((property as any).occupiedBeds) : '4',
        description: (property as any).description || '',
      });

      setAmenities(property.amenities || ['WiFi', 'AC', 'Housekeeping']);
      setImages(property.images || []);
      setFlash(null);
    }
  }, [property]);

  if (!isOpen || !property) return null;

  const availableAmenitiesList = [
    'WiFi',
    'AC',
    '3-Time Food',
    'Power Backup',
    'Housekeeping',
    'CCTV Security',
    'Washing Machine',
    'Gym / Fitness',
    'Parking',
    'Biometric Lock',
  ];

  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  // Image Upload Handler with Validation (Max 4 images, JPG/PNG only, <= 2MB)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlash(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 4) {
      setFlash({
        type: 'error',
        message: 'Maximum limit exceeded! You can have a maximum of 4 property images only.',
      });
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2 MB

    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type.toLowerCase())) {
        setFlash({
          type: 'error',
          message: `Invalid format for "${file.name}". Only JPG, JPEG, and PNG images are allowed.`,
        });
        return;
      }

      if (file.size > maxSize) {
        setFlash({
          type: 'error',
          message: `File "${file.name}" exceeds the maximum allowed size of 2 MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlash(null);

    if (!formData.title || !formData.price || !formData.city) {
      setFlash({ type: 'error', message: 'Please fill in all required property details.' });
      return;
    }

    if (images.length === 0) {
      setFlash({ type: 'error', message: 'Please keep or upload at least 1 property photo (Max 4 images).' });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description || `${formData.type} available in ${formData.city}`,
        type: formData.type,
        gender: formData.gender,
        city: formData.city,
        sector: formData.sector,
        street: formData.street,
        country: formData.country || 'India',
        area: formData.sector || formData.city,
        price: Number(formData.price),
        deposit: Number(formData.deposit || 0),
        maintenance: Number(formData.maintenance || 0),
        totalBeds: Number(formData.totalBeds || 10),
        availableBeds: Number(formData.availableBeds || 6),
        occupiedBeds: Number(formData.occupiedBeds || 4),
        images: images,
        amenities: amenities,
      };

      const response = await axios.put(`/properties/${property._id}`, payload);

      if (response.data.success) {
        setFlash({ type: 'success', message: 'Property details updated successfully!' });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      setFlash({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to update property. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Edit Property Details</h2>
              <p className="text-xs text-slate-400">Update pricing, address, occupancy, or photos for this listing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {flash && (
            <FlashMessage
              type={flash.type}
              message={flash.message}
              onClose={() => setFlash(null)}
            />
          )}

          <form id="edit-property-form" onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: BASIC DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-teal-600" /> 1. Property Information
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Property Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunrise Executive PG for Men"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold"
                  >
                    <option value="PG">Boys/Girls PG</option>
                    <option value="Single Room">Single Private Room</option>
                    <option value="Shared Room">Shared Room</option>
                    <option value="1BHK Flat">1BHK Apartment</option>
                    <option value="Studio">Studio Apartment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender Preference</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 font-semibold"
                  >
                    <option value="Boys PG">Boys PG Only</option>
                    <option value="Girls PG">Girls PG Only</option>
                    <option value="Unisex / Co-living">Unisex / Co-living</option>
                    <option value="Any">Any / Open to All</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: IMAGES (MAX 4, 2MB LIMIT) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-teal-600" /> 2. Property Photos (Max 4 Images)
                </h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {images.length} / 4 Images
                </span>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
                <input
                  type="file"
                  id="edit-property-image-upload"
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  disabled={images.length >= 4}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="edit-property-image-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center py-3 ${
                    images.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                  }`}
                >
                  <Upload className="w-8 h-8 text-teal-600 mb-2" />
                  <span className="text-xs font-bold text-slate-900">
                    Click to Upload New Photos (JPG, PNG only)
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Maximum 4 images total • Maximum 2 MB per file
                  </span>
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-200">
                    {images.map((imgUrl, index) => (
                      <div key={index} className="relative group h-24 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                        <img src={imgUrl} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: PRICING & FINANCIALS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <IndianRupee className="w-4 h-4 text-teal-600" /> 3. Pricing & Charges (in ₹)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Monthly Rent (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 9500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maintenance (₹/mo)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.maintenance}
                    onChange={(e) => setFormData({ ...formData, maintenance: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: ADDRESS DETAILS */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <MapPin className="w-4 h-4 text-teal-600" /> 4. Detailed Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Pune">Pune</option>
                    <option value="Chennai">Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sector / Area / Locality</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Koramangala Sector 4"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="e.g. #12, 4th Main Road"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.country}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm cursor-not-allowed font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: OCCUPANCY & CAPACITY */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <Layers className="w-4 h-4 text-teal-600" /> 5. Occupancy & Unit Capacity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Rooms/Beds</label>
                  <input
                    type="number"
                    value={formData.totalBeds}
                    onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Beds 🟢</label>
                  <input
                    type="number"
                    value={formData.availableBeds}
                    onChange={(e) => setFormData({ ...formData, availableBeds: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Occupied Beds 🔴</label>
                  <input
                    type="number"
                    value={formData.occupiedBeds}
                    onChange={(e) => setFormData({ ...formData, occupiedBeds: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: AMENITIES */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> 6. Included Amenities
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableAmenitiesList.map((amenity) => {
                  const isChecked = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{amenity}</span>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-property-form"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Property Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;
