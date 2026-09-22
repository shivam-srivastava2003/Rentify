import React, { useState } from 'react';
import type { PropertyData } from './PropertyCard';
import { X, MapPin, CheckCircle2, XCircle, Star, Layers, ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';

interface OwnerPropertyDetailModalProps {
  property: PropertyData | null;
  onClose: () => void;
  onEdit?: (property: PropertyData) => void;
  onDelete?: (property: PropertyData) => void;
}

const OwnerPropertyDetailModal: React.FC<OwnerPropertyDetailModalProps> = ({ property, onClose, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
  ];

  const handleNextImage = () => {
    setActiveImageIndex((prev: number) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  const formattedRent = property.price.toLocaleString('en-IN');
  const formattedDeposit = (property as any).deposit ? (property as any).deposit.toLocaleString('en-IN') : '0';
  const formattedMaintenance = (property as any).maintenance ? (property as any).maintenance.toLocaleString('en-IN') : '0';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {property.type}
            </span>
            <span className="text-xs text-teal-300 font-semibold">{property.gender}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(property);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
            
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(property);
                }}
                className="bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* IMAGE CAROUSEL / GALLERY */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={`${property.title} View ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-3 inset-x-3 flex justify-center gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activeImageIndex ? 'border-teal-400 scale-105 shadow-md' : 'border-white/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PROPERTY TITLE & RATING */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{property.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="font-semibold text-slate-700">{property.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 w-fit">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-extrabold text-amber-900 text-sm">{property.rating}</span>
              <span className="text-xs text-slate-500 font-medium">({property.reviewCount} Reviews)</span>
            </div>
          </div>

          {/* FINANCIAL BREAKDOWN IN RUPEES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900">₹{formattedRent}</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Security Deposit</span>
              <div className="text-lg font-bold text-slate-800 mt-1">₹{formattedDeposit}</div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Maintenance Charges</span>
              <div className="text-lg font-bold text-slate-800 mt-1">₹{formattedMaintenance} / mo</div>
            </div>
          </div>

          {/* OCCUPANCY BREAKDOWN & AVAILABILITY STATUS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-teal-600" /> Occupancy & Capacity Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 font-medium">Total Capacity</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{(property as any).totalBeds || 10} Beds</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Available Beds
                </span>
                <p className="text-2xl font-black text-emerald-800 mt-1">{(property as any).availableBeds || 6} Free</p>
              </div>

              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-center">
                <span className="text-xs text-rose-700 font-bold flex items-center justify-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Occupied / Filled
                </span>
                <p className="text-2xl font-black text-rose-800 mt-1">{(property as any).occupiedBeds || 4} Beds</p>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Included Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, idx) => (
                <span key={idx} className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerPropertyDetailModal;
