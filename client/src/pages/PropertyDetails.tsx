import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FlashMessage from '../components/FlashMessage';
import type { FlashType } from '../components/FlashMessage';
import type { PropertyData, OwnerInfo } from '../components/PropertyCard';
import { formatCleanAddress } from '../utils/formatAddress';
import {
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Phone,
  MessageSquare,
  Mail,
  ShieldCheck,
  Building2,
  Bed,
  Sparkles,
  Wifi,
  Tv,
  Utensils,
  Car,
  Wind,
  Droplets,
  Share2,
  Lock,
  UserCheck
} from 'lucide-react';

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review states
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFlash, setReviewFlash] = useState<{ type: FlashType; message: string } | null>(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/properties/${id}`);
        if (response.data.success) {
          setProperty(response.data.data);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fallbackImage =
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm">Fetching verified property details...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Property Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'The property listing you requested does not exist or has been removed.'}</p>
          <button
            onClick={() => navigate('/find-rooms')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-2xl transition-all"
          >
            Browse Verified Properties
          </button>
        </div>
      </div>
    );
  }

  // Parse Owner Information
  const owner = typeof property.owner === 'object' ? (property.owner as OwnerInfo) : null;

  // Check if logged in user is owner of this listing
  const ownerId = owner?._id || (typeof property.owner === 'string' ? property.owner : '');
  const isPropertyOwner = currentUser && (ownerId === currentUser._id || currentUser.role === 'OWNER');

  // Find user's existing review if any
  const userReview = property.reviews?.find(
    (r: any) => currentUser && (r.user === currentUser._id || r.user?._id === currentUser._id)
  );

  useEffect(() => {
    if (userReview) {
      setRatingInput(userReview.rating);
      setCommentInput(userReview.comment);
    }
  }, [userReview]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewFlash(null);
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      setReviewFlash({ type: 'error', message: 'Please select a rating between 1 and 5 stars.' });
      return;
    }
    if (!commentInput.trim()) {
      setReviewFlash({ type: 'error', message: 'Please write a review comment.' });
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await axios.post(`/properties/${id}/reviews`, {
        rating: ratingInput,
        comment: commentInput,
      });
      if (res.data.success) {
        setProperty(res.data.data);
        setReviewFlash({ type: 'success', message: res.data.message });
      }
    } catch (err: any) {
      setReviewFlash({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit review',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const imagesList = property.images && property.images.length > 0 ? property.images : [fallbackImage];
  const activeImage = imagesList[selectedImageIndex] || imagesList[0];

  const formattedPrice = property.price.toLocaleString('en-IN');
  const formattedDeposit = property.deposit ? property.deposit.toLocaleString('en-IN') : '0';
  const formattedMaintenance = property.maintenance ? property.maintenance.toLocaleString('en-IN') : '0';

  // Helper for Amenity Icon mapping
  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4 text-teal-600" />;
    if (lower.includes('ac')) return <Wind className="w-4 h-4 text-teal-600" />;
    if (lower.includes('food') || lower.includes('kitchen')) return <Utensils className="w-4 h-4 text-teal-600" />;
    if (lower.includes('park')) return <Car className="w-4 h-4 text-teal-600" />;
    if (lower.includes('water')) return <Droplets className="w-4 h-4 text-teal-600" />;
    if (lower.includes('tv')) return <Tv className="w-4 h-4 text-teal-600" />;
    return <CheckCircle2 className="w-4 h-4 text-teal-600" />;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // WhatsApp link format
  const rawPhone = owner?.whatsapp || owner?.phone || '';
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const whatsappUrl = cleanPhone
    ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
        `Hi ${owner?.name || 'Owner'}, I found your listing "${property.title}" on Rentify. I would like more details about availability!`
      )}`
    : '#';

  const callUrl = owner?.phone ? `tel:${owner.phone}` : '#';
  const mailUrl = owner?.email ? `mailto:${owner.email}?subject=Inquiry regarding Rentify listing: ${property.title}` : '#';

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-600 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-600" />
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* PROPERTY HEADER & BADGES */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-slate-900 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {property.type}
                </span>
                <span className="bg-teal-50 text-teal-700 font-bold text-xs px-3 py-1 rounded-full border border-teal-200">
                  {property.gender}
                </span>
                {property.isAvailable ? (
                  <span className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Available Now
                  </span>
                ) : (
                  <span className="bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Fully Booked
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{property.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <div className="flex items-center gap-1 text-slate-700 font-semibold">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    {isAuthenticated
                      ? formatCleanAddress(property.address, property.sector, property.area, property.city, property.country)
                      : formatCleanAddress(property.area, property.city)}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg text-amber-900 font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{property.rating > 0 ? property.rating : '0.0'}</span>
                  <span className="text-slate-400 font-normal">({property.reviewCount || 0} {property.reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
              </div>
            </div>

            {/* Price Banner */}
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 p-5 rounded-2xl flex flex-col items-start lg:items-end justify-center">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Monthly Rent</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-slate-900">₹{formattedPrice}</span>
                <span className="text-sm font-semibold text-slate-600">/ month</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 mt-1">
                <span>Deposit: <strong>₹{formattedDeposit}</strong></span>
                <span>•</span>
                <span>Maintenance: <strong>₹{formattedMaintenance}</strong></span>
              </div>
            </div>
          </div>

          {/* MAIN PHOTO GALLERY GRID */}
          <div className="mt-6">
            {/* Featured Image */}
            <div className="relative h-80 sm:h-96 md:h-[450px] w-full rounded-2xl overflow-hidden bg-slate-900 group shadow-inner">
              <img
                src={activeImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-4 left-4 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Photo {selectedImageIndex + 1} of {imagesList.length}
              </div>
            </div>

            {/* Thumbnails list */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-teal-600 scale-[1.02] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TWO COLUMN CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details, Occupancy & Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Availability & Occupancy Breakdown */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bed className="w-5 h-5 text-teal-600" /> Room & Occupancy Details
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Total Capacity</span>
                  <span className="text-2xl font-black text-slate-900">{property.totalBeds || 10}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Beds / Rooms</span>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200/60 text-center">
                  <span className="text-xs font-semibold text-emerald-700 block mb-1">Available Beds</span>
                  <span className="text-2xl font-black text-emerald-900">{property.availableBeds || 6}</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">Vacant Now</span>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/60 text-center">
                  <span className="text-xs font-semibold text-amber-800 block mb-1">Occupied Beds</span>
                  <span className="text-2xl font-black text-amber-900">{property.occupiedBeds || 4}</span>
                  <span className="text-[10px] text-amber-700 block mt-0.5">Currently Filled</span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>Occupancy Rate</span>
                  <span>
                    {Math.round(
                      ((property.occupiedBeds || 4) / (property.totalBeds || 10)) * 100
                    )}
                    % Occupied
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${Math.round(
                        ((property.occupiedBeds || 4) / (property.totalBeds || 10)) * 100
                      )}%`,
                    }}
                    className="bg-amber-500 h-full rounded-l-full"
                  ></div>
                  <div
                    style={{
                      width: `${100 - Math.round(
                        ((property.occupiedBeds || 4) / (property.totalBeds || 10)) * 100
                      )}%`,
                    }}
                    className="bg-emerald-500 h-full rounded-r-full"
                  ></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About Property</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {property.description ||
                  `This spacious ${property.type} is situated in prime ${property.area}, ${property.city}. Clean, peaceful environment with 24x7 water supply, power backup, high-speed WiFi internet, and weekly housekeeping services. Perfectly suited for working professionals and students.`}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" /> Included Amenities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-sm font-semibold text-slate-800"
                  >
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Address & Map Location (PROTECTED UNTIL LOGIN) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-600" /> Address & Location
              </h2>

              {isAuthenticated ? (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm space-y-1.5 text-slate-700">
                  <p><strong>Building / Street:</strong> {formatCleanAddress(property.street || property.address) || 'N/A'}</p>
                  {/* {property.sector && <p><strong>Sector / Phase:</strong> {formatCleanAddress(property.sector)}</p>} */}
                  <p><strong>Locality / Area:</strong> {formatCleanAddress(property.area)}</p>
                  <p><strong>City & Country:</strong> {formatCleanAddress(property.city, property.country || 'India')}</p>
                </div>
              ) : (
                <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                    <Lock className="w-4 h-4 text-amber-600" /> Exact Building Address Hidden
                  </div>
                  <p className="text-xs text-amber-800 mb-3">
                    Locality: Sign in or create a free Rentify account to reveal the exact street address.
                  </p>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      Sign In to View
                    </Link>
                    <Link
                      to="/register"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      Register Free
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RATINGS & REVIEWS SECTION */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Ratings & Tenant Reviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Real feedback and rating experience shared by verified tenants and visitors
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200 px-4 py-2.5 rounded-2xl w-fit">
                  <div className="text-3xl font-black text-amber-900">{property.rating > 0 ? property.rating : '0.0'}</div>
                  <div>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(property.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 block mt-0.5">
                      {property.reviewCount || 0} {property.reviewCount === 1 ? 'Review' : 'Reviews'}
                    </span>
                  </div>
                </div>
              </div>

              {/* REVIEW SUBMISSION FORM (ONLY LOGGED-IN NON-OWNER RENTERS CAN SUBMIT) */}
              {isAuthenticated ? (
                isPropertyOwner ? (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>You are the owner of this property. Tenant ratings and shared experiences are listed below.</span>
                  </div>
                ) : (
                  <div className="bg-slate-50/90 border border-teal-100 p-5 rounded-2xl mb-8">
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      {userReview ? 'Update Your Rating & Review' : 'Share Your Rating & Review'}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Rate your stay, location cleanliness, maintenance, and landlord cooperation.
                    </p>

                    {reviewFlash && (
                      <div className="mb-4">
                        <FlashMessage
                          type={reviewFlash.type}
                          message={reviewFlash.message}
                          onClose={() => setReviewFlash(null)}
                        />
                      </div>
                    )}

                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {/* STAR RATING PICKER */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Your Rating (1 to 5 Stars) *
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRatingInput(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 rounded-lg hover:bg-amber-50 transition-colors focus:outline-none"
                              title={`${star} Star${star > 1 ? 's' : ''}`}
                            >
                              <Star
                                className={`w-7 h-7 transition-all ${
                                  star <= (hoverRating || ratingInput)
                                    ? 'text-amber-500 fill-amber-500 scale-110'
                                    : 'text-slate-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-amber-900 ml-2 bg-amber-100 px-2.5 py-1 rounded-lg">
                            {hoverRating || ratingInput} / 5 Stars
                          </span>
                        </div>
                      </div>

                      {/* COMMENT TEXTAREA */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Review Comment *
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="e.g. Great PG, clean rooms with fast WiFi, good food, and supportive landlord."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 flex items-center gap-2"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>{submittingReview ? 'Submitting...' : userReview ? 'Update My Review' : 'Submit Review'}</span>
                      </button>
                    </form>
                  </div>
                )
              ) : (
                /* GUEST USER (UNAUTHENTICATED CAN ONLY SEE RATINGS & REVIEWS) */
                <div className="bg-amber-50/70 border border-amber-200/90 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-amber-950 text-sm flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-600" /> Log In to Leave a Review
                    </h3>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Guests can view reviews and ratings. Log in or create a free account to publish your review.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to="/login"
                      className="bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* REVIEWS FEEDBACK LIST */}
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Tenant Feedback & Reviews ({property.reviews?.length || 0})
                </h3>

                {property.reviews && property.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {property.reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-teal-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                              {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'R'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{rev.userName}</h4>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified Renter'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            <div className="flex items-center text-amber-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${star <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-extrabold text-amber-900 ml-1">{rev.rating}.0</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed pl-1 whitespace-pre-line">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">No reviews published yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Be the first tenant to share your rating and review for this property.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: LANDLORD CONTACT CARD (LOCKED UNTIL LOGIN) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-teal-200/90 shadow-lg sticky top-28">
              {isAuthenticated ? (
                /* REVEALED OWNER DETAILS FOR LOGGED IN USERS */
                <>
                  <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-200 mb-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Verified Property Owner
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-800 text-white flex items-center justify-center text-xl font-bold overflow-hidden shadow-md">
                      {owner?.avatar ? (
                        <img src={owner.avatar} alt={owner.name || 'Owner'} className="w-full h-full object-cover" />
                      ) : (
                        <span>{owner?.name ? owner.name.charAt(0).toUpperCase() : 'O'}</span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
                        {owner?.name || 'Property Owner'}
                      </h3>
                      {owner?.businessName && (
                        <p className="text-xs font-semibold text-teal-700 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> {owner.businessName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5">
                        📍 {owner?.city || property.city}
                      </p>
                    </div>
                  </div>

                  {/* CONTACT ACTION BUTTONS */}
                  <div className="space-y-3">
                    {/* WHATSAPP CTA */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    {/* CALL OWNER CTA */}
                    <a
                      href={callUrl}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-teal-700 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call {owner?.phone || 'Owner'}</span>
                    </a>

                    {/* EMAIL OWNER CTA */}
                    {owner?.email && (
                      <a
                        href={mailUrl}
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 px-4 rounded-2xl border border-slate-200 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-slate-500" />
                        <span>Send Email Inquiry</span>
                      </a>
                    )}
                  </div>

                  {/* LANDLORD DETAILS LIST */}
                  <div className="mt-6 pt-6 border-t border-slate-100 text-xs space-y-2.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">Phone:</span>
                      <span className="font-bold text-slate-900">{owner?.phone || 'Available on request'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-400">WhatsApp:</span>
                      <span className="font-bold text-slate-900">{owner?.whatsapp || owner?.phone || 'Available'}</span>
                    </div>
                    {owner?.permanentAddress && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-400">Owner Location:</span>
                        <span className="font-bold text-slate-900 line-clamp-1">{owner.permanentAddress}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* LOCKED OWNER DETAILS FOR GUESTS / VISITORS */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-xs">
                    <Lock className="w-8 h-8" />
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg mb-2">
                    Landlord Contact Locked
                  </h3>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                    To connect directly with the property owner via WhatsApp, Phone, or Email with <strong>Zero Brokerage</strong>, please log in or sign up.
                  </p>

                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md shadow-teal-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Log In to View Owner Info</span>
                    </Link>

                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3 px-4 rounded-2xl border border-slate-200 transition-colors"
                    >
                      <span>Create Free Account</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
