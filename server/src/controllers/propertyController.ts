import { Request, Response, NextFunction } from 'express';
import Property from '../models/Property';
import { uploadToCloudinary } from '../config/cloudinary';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';

const cleanAddressParts = (...parts: (string | undefined | null)[]): string => {
  const allSegments: string[] = [];
  for (const part of parts) {
    if (!part || typeof part !== 'string') continue;
    for (const sub of part.split(',')) {
      const trimmed = sub.trim();
      if (trimmed && trimmed.toLowerCase() !== 'n/a') {
        allSegments.push(trimmed);
      }
    }
  }
  const seen = new Set<string>();
  const uniqueSegments: string[] = [];
  for (const seg of allSegments) {
    const key = seg.toLowerCase().replace(/\s+/g, ' ');
    if (!seen.has(key)) {
      seen.add(key);
      uniqueSegments.push(seg);
    }
  }
  return uniqueSegments.join(', ');
};

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { city, type, isAvailable, minPrice, maxPrice, search } = req.query;

  const queryFilter: any = {};

  if (city && city !== 'All') {
    queryFilter.city = { $regex: new RegExp(`^${city}`, 'i') };
  }

  if (type && type !== 'All') {
    queryFilter.type = type;
  }

  if (isAvailable !== undefined && isAvailable !== 'All') {
    queryFilter.isAvailable = isAvailable === 'true';
  }

  if (minPrice || maxPrice) {
    queryFilter.price = {};
    if (minPrice) queryFilter.price.$gte = Number(minPrice);
    if (maxPrice) queryFilter.price.$lte = Number(maxPrice);
  }

  if (search) {
    queryFilter.$or = [
      { title: { $regex: search as string, $options: 'i' } },
      { area: { $regex: search as string, $options: 'i' } },
      { city: { $regex: search as string, $options: 'i' } },
      { sector: { $regex: search as string, $options: 'i' } },
    ];
  }

  const properties = await Property.find(queryFilter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Get properties listed by currently logged in owner
// @route   GET /api/properties/my-properties
// @access  Private (Owner/Admin)
export const getMyProperties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getPropertyById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const property = await Property.findById(req.params.id).populate(
    'owner',
    'name email phone whatsapp permanentAddress city businessName avatar propertyLocation unitCount'
  );

  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Create new property listing (Owner/Admin)
// @route   POST /api/properties
// @access  Private (Owner/Admin)
export const createProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    title,
    description,
    type,
    gender,
    city,
    sector,
    street,
    country,
    area,
    price,
    deposit,
    maintenance,
    totalBeds,
    availableBeds,
    occupiedBeds,
    images,
    amenities,
  } = req.body;

  if (!title || !type || !city || !price) {
    return next(new ErrorResponse('Please provide required property details', 400));
  }

  // Process images and upload to Cloudinary if available
  let cloudinaryImageUrls: string[] = [];
  if (images && Array.isArray(images) && images.length > 0) {
    cloudinaryImageUrls = await Promise.all(
      images.map((imgStr: string) => uploadToCloudinary(imgStr))
    );
  }

  const constructedArea = cleanAddressParts(sector, area, city);
  const constructedAddress = cleanAddressParts(street, sector, area, city, country || 'India');

  const property = await Property.create({
    title,
    description: description || `${type} listing in ${city}`,
    type,
    gender: gender || 'Any',
    city,
    sector: sector || '',
    street: street || '',
    country: country || 'India',
    area: constructedArea,
    address: constructedAddress,
    price: Number(price),
    deposit: Number(deposit || 0),
    maintenance: Number(maintenance || 0),
    totalBeds: Number(totalBeds ?? 1),
    availableBeds: Number(availableBeds !== undefined ? availableBeds : (totalBeds ?? 1)),
    occupiedBeds: Number(occupiedBeds ?? 0),
    images: cloudinaryImageUrls,
    amenities: amenities || ['WiFi', 'AC', 'Housekeeping', 'Power Backup'],
    owner: req.user._id,
    isAvailable: Number(availableBeds !== undefined ? availableBeds : (totalBeds ?? 1)) > 0,
  });

  res.status(201).json({
    success: true,
    message: 'Property posted successfully!',
    data: property,
  });
});

// @desc    Update property listing (Owner/Admin)
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
export const updateProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  // Check ownership authorization
  if (property.owner && property.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return next(new ErrorResponse('Not authorized to update this property', 403));
  }

  const {
    title,
    description,
    type,
    gender,
    city,
    sector,
    street,
    country,
    area,
    price,
    deposit,
    maintenance,
    totalBeds,
    availableBeds,
    occupiedBeds,
    images,
    amenities,
  } = req.body;

  // Process images with Cloudinary if new image strings provided
  let updatedImages = property.images;
  if (images && Array.isArray(images) && images.length > 0) {
    updatedImages = await Promise.all(
      images.map((imgStr: string) => {
        // If image is already a hosted Cloudinary/HTTP URL, keep as is; otherwise upload
        if (imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
          return Promise.resolve(imgStr);
        }
        return uploadToCloudinary(imgStr);
      })
    );
  }

  const constructedArea = cleanAddressParts(sector, area || property.area, city || property.city);
  const constructedAddress = cleanAddressParts(
    street !== undefined ? street : property.street,
    sector !== undefined ? sector : property.sector,
    area || property.area,
    city || property.city,
    country || property.country || 'India'
  );

  property.title = title || property.title;
  property.description = description !== undefined ? description : property.description;
  property.type = type || property.type;
  property.gender = gender || property.gender;
  property.city = city || property.city;
  property.sector = sector !== undefined ? sector : property.sector;
  property.street = street !== undefined ? street : property.street;
  property.country = country || property.country;
  property.area = constructedArea;
  property.address = constructedAddress;
  property.price = price !== undefined ? Number(price) : property.price;
  property.deposit = deposit !== undefined ? Number(deposit) : property.deposit;
  property.maintenance = maintenance !== undefined ? Number(maintenance) : property.maintenance;
  property.totalBeds = totalBeds !== undefined ? Number(totalBeds) : property.totalBeds;
  property.availableBeds = availableBeds !== undefined ? Number(availableBeds) : property.availableBeds;
  property.occupiedBeds = occupiedBeds !== undefined ? Number(occupiedBeds) : property.occupiedBeds;
  property.images = updatedImages;
  property.amenities = amenities || property.amenities;
  property.isAvailable = (property.availableBeds || 0) > 0;

  const updatedProperty = await property.save();

  res.status(200).json({
    success: true,
    message: 'Property updated successfully!',
    data: updatedProperty,
  });
});

// @desc    Delete property listing (Owner/Admin)
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
export const deleteProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new ErrorResponse('Property not found', 404));
  }

  // Check ownership authorization
  if (property.owner && property.owner.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return next(new ErrorResponse('Not authorized to delete this property', 403));
  }

  await Property.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Property listing deleted successfully',
  });
});

// @desc    Add or update a property review & rating
// @route   POST /api/properties/:id/reviews
// @access  Private (Renter / Logged in User)
export const addPropertyReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { rating, comment } = req.body;
  const propertyId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return next(new ErrorResponse('Please select a star rating between 1 and 5.', 400));
  }

  if (!comment || !comment.trim()) {
    return next(new ErrorResponse('Please write a review comment.', 400));
  }

  const property = await Property.findById(propertyId);
  if (!property) {
    return next(new ErrorResponse('Property not found.', 404));
  }

  // Property owners cannot review their own property
  if (property.owner && property.owner.toString() === req.user._id.toString()) {
    return next(new ErrorResponse('Property owners cannot review their own property listings.', 403));
  }

  const existingReviewIndex = (property.reviews as any[]).findIndex(
    (r: any) => r.user && r.user.toString() === req.user._id.toString()
  );

  if (existingReviewIndex !== -1) {
    // Update existing review
    property.reviews[existingReviewIndex].rating = Number(rating);
    property.reviews[existingReviewIndex].comment = comment.trim();
    property.reviews[existingReviewIndex].userName = req.user.name || 'Renter';
    property.reviews[existingReviewIndex].userAvatar = req.user.avatar || '';
  } else {
    // Add new review
    const newReview = {
      user: req.user._id,
      userName: req.user.name || 'Renter',
      userAvatar: req.user.avatar || '',
      userRole: req.user.role || 'RENTER',
      rating: Number(rating),
      comment: comment.trim(),
    };
    property.reviews.push(newReview as any);
  }

  // Recalculate rating and reviewCount
  property.reviewCount = property.reviews.length;
  const sumRatings = property.reviews.reduce((acc: number, item: any) => acc + item.rating, 0);
  property.rating = Number((sumRatings / property.reviews.length).toFixed(1));

  await property.save();

  const updatedProperty = await Property.findById(propertyId).populate(
    'owner',
    'name email phone whatsapp permanentAddress city businessName avatar propertyLocation unitCount'
  );

  res.status(201).json({
    success: true,
    message: existingReviewIndex !== -1 ? 'Your review has been updated!' : 'Thank you! Your review has been published.',
    data: updatedProperty,
  });
});
