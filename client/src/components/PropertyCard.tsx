import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, CheckCircle2, XCircle, ArrowRight, Edit3, Trash2 } from 'lucide-react';
import { formatCleanAddress } from '../utils/formatAddress';

export interface OwnerInfo {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  permanentAddress?: string;
  city?: string;
  businessName?: string;
  avatar?: string;
  propertyLocation?: string;
  unitCount?: string;
}

export interface ReviewItem {
  _id?: string;
  user?: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface PropertyData {
  _id: string;
  title: string;
  type: string;
  gender: string;
  city: string;
  sector?: string;
  street?: string;
  country?: string;
  area: string;
  address: string;
  description?: string;
  price: number;
  deposit?: number;
  maintenance?: number;
  totalBeds?: number;
  availableBeds?: number;
  occupiedBeds?: number;
  rating: number;
  reviewCount: number;
  reviews?: ReviewItem[];
  isAvailable: boolean;
  images: string[];
  amenities: string[];
  owner?: OwnerInfo | string;
}

interface PropertyCardProps {
  property: PropertyData;
  onSelect?: (property: PropertyData) => void;
  onEdit?: (property: PropertyData) => void;
  onDelete?: (property: PropertyData) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const fallbackImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
  const coverImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  // Format price in Indian Rupees (₹) format
  const formattedPrice = property.price.toLocaleString('en-IN');

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(property);
    } else {
      navigate(`/properties/${property._id}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-teal-200 transition-all duration-300 flex flex-col group">
      {/* Image Container with Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={handleCardClick}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Property Category Badge */}
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {property.type}
          </span>

          {/* AVAILABILITY STATUS BADGE */}
          {property.isAvailable ? (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Available Now</span>
            </span>
          ) : (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <XCircle className="w-3.5 h-3.5" />
              <span>Fully Booked</span>
            </span>
          )}
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>{formatCleanAddress(property.area, property.city)}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Gender & Rating Header */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              {property.gender}
            </span>

            {/* RATING DISPLAY */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-900 font-bold border border-amber-200/60">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{property.rating > 0 ? property.rating : '0'}</span>
              <span className="text-[10px] text-slate-400 font-normal">({property.reviewCount || 0})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors line-clamp-1 mb-2 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Amenities Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium px-1 py-0.5">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price in Rupees & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rent</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-slate-900">₹{formattedPrice}</span>
              <span className="text-xs text-slate-500 font-medium">/ mo</span>
            </div>
          </div>

          {/* Action Buttons (Edit / Delete / Details) */}
          <div className="flex items-center gap-1.5">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property);
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl transition-all shadow-xs"
                title="Edit Property Details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2.5 rounded-xl transition-all border border-rose-200"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleCardClick}
              className="bg-slate-900 hover:bg-teal-600 text-white p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center group-hover:translate-x-0.5"
              title="View Details"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
