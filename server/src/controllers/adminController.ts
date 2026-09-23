import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Property from '../models/Property';
import DeletionHistory from '../models/DeletionHistory';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';

// @desc    Get administrative dashboard system statistics
// @route   GET /api/admin/stats
// @access  Private (ADMIN)
export const getAdminStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const totalTenants = await User.countDocuments({ role: 'USER' });
  const totalOwners = await User.countDocuments({ role: 'OWNER' });
  const totalProperties = await Property.countDocuments();
  const availableProperties = await Property.countDocuments({ isAvailable: true });
  const fullyBookedProperties = await Property.countDocuments({ isAvailable: false });

  // Recent properties for admin audit
  const recentProperties = await Property.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('owner', 'name email phone city');

  res.status(200).json({
    success: true,
    data: {
      totalTenants,
      totalOwners,
      totalProperties,
      availableProperties,
      fullyBookedProperties,
      recentProperties,
    },
  });
});

// @desc    Get all registered property owners with property count
// @route   GET /api/admin/owners
// @access  Private (ADMIN)
export const getAdminOwners = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const owners = await User.find({ role: 'OWNER' }).select('-password').sort({ createdAt: -1 });

  const ownersWithStats = await Promise.all(
    owners.map(async (owner) => {
      const propertyCount = await Property.countDocuments({ owner: owner._id });
      return {
        ...owner.toObject(),
        propertyCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    count: ownersWithStats.length,
    data: ownersWithStats,
  });
});

// @desc    Get owner details and all listed properties by owner ID
// @route   GET /api/admin/owners/:id
// @access  Private (ADMIN)
export const getOwnerDetailsWithProperties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const owner = await User.findById(req.params.id).select('-password');

  if (!owner) {
    return next(new ErrorResponse('Owner not found', 404));
  }

  const properties = await Property.find({ owner: owner._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      owner,
      properties,
    },
  });
});

// @desc    Get all registered renters / tenants
// @route   GET /api/admin/renters
// @access  Private (ADMIN)
export const getAdminRenters = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const renters = await User.find({ role: 'USER' }).select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: renters.length,
    data: renters,
  });
});

// @desc    Delete item (Property / Owner / Renter) with mandatory reason logged to history
// @route   POST /api/admin/delete-item
// @access  Private (ADMIN)
export const deleteItemByAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { targetType, targetId, reason } = req.body;

  if (!targetType || !targetId || !reason || !reason.trim()) {
    return next(
      new ErrorResponse('Target type, item ID, and a valid deletion reason are required.', 400)
    );
  }

  const adminEmail = req.user?.email || 'System Admin';

  if (targetType === 'PROPERTY') {
    const property = await Property.findById(targetId).populate('owner', 'name email phone');
    if (!property) {
      return next(new ErrorResponse('Property not found or already deleted.', 404));
    }

    const ownerObj: any = property.owner;
    const ownerName = ownerObj?.name || 'Unknown Owner';
    const ownerEmail = ownerObj?.email || '';

    // Detailed property audit string (strictly excluding image URLs)
    const propertyAuditDetails = [
      `Owner: ${ownerName}`,
      ownerEmail ? `Owner Email: ${ownerEmail}` : '',
      `Type: ${property.type || 'Listing'}`,
      `City: ${property.city || 'N/A'}`,
      `Area: ${property.area || 'N/A'}`,
      `Address: ${property.address || 'N/A'}`,
      `Rent: ₹${property.price || 0}/mo`,
      `Deposit: ₹${property.deposit || 0}`,
      `Maintenance: ₹${property.maintenance || 0}`,
      `Beds (Total/Available/Occupied): ${property.totalBeds ?? 1}/${property.availableBeds ?? 0}/${property.occupiedBeds ?? 0}`,
      property.amenities && property.amenities.length > 0 ? `Amenities: ${property.amenities.join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    // Record deletion log in DeletionHistory (No property images stored)
    await DeletionHistory.create({
      targetType: 'PROPERTY',
      targetId: property._id.toString(),
      targetTitle: property.title || 'Property Listing',
      targetEmail: ownerEmail,
      targetDetails: propertyAuditDetails,
      reason: reason.trim(),
      deletedBy: adminEmail,
    });

    // Remove property from database
    await Property.findByIdAndDelete(targetId);

    res.status(200).json({
      success: true,
      message: `Property "${property.title}" has been deleted and recorded in Deletion History.`,
    });
    return;
  }

  if (targetType === 'OWNER') {
    const owner = await User.findById(targetId);
    if (!owner) {
      return next(new ErrorResponse('Owner account not found or already deleted.', 404));
    }

    if (owner.role === 'ADMIN') {
      return next(new ErrorResponse('System Administrator accounts cannot be deleted.', 403));
    }

    // Count owned properties and collect titles for audit history (no image URLs saved)
    const ownedProperties = await Property.find({ owner: owner._id }).select('title type city price');
    const propertyCount = ownedProperties.length;
    const propertyTitles = ownedProperties.map((p) => `"${p.title}" (${p.type} in ${p.city})`).join(', ');

    const ownerAuditDetails = [
      `Owner Name: ${owner.name}`,
      `Email: ${owner.email}`,
      `Phone: ${owner.phone || 'N/A'}`,
      `Business: ${owner.businessName || 'N/A'}`,
      `City: ${owner.city || 'N/A'}`,
      `Permanent Address: ${owner.permanentAddress || 'N/A'}`,
      `Property Location: ${owner.propertyLocation || 'N/A'}`,
      `Unit Count: ${owner.unitCount || 'N/A'}`,
      `Listings Created (${propertyCount}): ${propertyTitles || 'None'}`,
    ]
      .filter(Boolean)
      .join(' | ');

    await DeletionHistory.create({
      targetType: 'OWNER',
      targetId: owner._id.toString(),
      targetTitle: owner.name || 'Property Owner',
      targetEmail: owner.email || '',
      targetDetails: ownerAuditDetails,
      reason: reason.trim(),
      deletedBy: adminEmail,
    });

    // Delete all reviews submitted by this owner on other properties (recalculating ratings)
    const propertiesWithUserReviews = await Property.find({ 'reviews.user': owner._id });
    for (const prop of propertiesWithUserReviews) {
      (prop.reviews as any) = (prop.reviews as any[]).filter(
        (r: any) => r.user && r.user.toString() !== owner._id.toString()
      );
      prop.reviewCount = prop.reviews.length;
      if (prop.reviews.length > 0) {
        const sumRatings = prop.reviews.reduce((acc: number, item: any) => acc + item.rating, 0);
        prop.rating = Number((sumRatings / prop.reviews.length).toFixed(1));
      } else {
        prop.rating = 0;
      }
      await prop.save();
    }

    // Delete all properties owned by this owner
    await Property.deleteMany({ owner: owner._id });

    // Delete the owner user record
    await User.findByIdAndDelete(targetId);

    res.status(200).json({
      success: true,
      message: `Owner account "${owner.name}" and all associated listings were deleted and recorded in Deletion History.`,
    });
    return;
  }

  if (targetType === 'RENTER') {
    const renter = await User.findById(targetId);
    if (!renter) {
      return next(new ErrorResponse('Renter account not found or already deleted.', 404));
    }

    if (renter.role === 'ADMIN') {
      return next(new ErrorResponse('System Administrator accounts cannot be deleted.', 403));
    }

    const renterAuditDetails = [
      `Renter Name: ${renter.name}`,
      `Email: ${renter.email}`,
      `Phone: ${renter.phone || 'N/A'}`,
      `Gender: ${renter.gender || 'N/A'}`,
      `City: ${renter.city || 'N/A'}`,
      `Permanent Address: ${renter.permanentAddress || 'N/A'}`,
    ]
      .filter(Boolean)
      .join(' | ');

    await DeletionHistory.create({
      targetType: 'RENTER',
      targetId: renter._id.toString(),
      targetTitle: renter.name || 'Tenant Account',
      targetEmail: renter.email || '',
      targetDetails: renterAuditDetails,
      reason: reason.trim(),
      deletedBy: adminEmail,
    });

    // Purge all reviews, ratings, and comments submitted by this renter from ALL properties in database
    const propertiesWithUserReviews = await Property.find({ 'reviews.user': renter._id });
    for (const prop of propertiesWithUserReviews) {
      (prop.reviews as any) = (prop.reviews as any[]).filter(
        (r: any) => r.user && r.user.toString() !== renter._id.toString()
      );
      prop.reviewCount = prop.reviews.length;
      if (prop.reviews.length > 0) {
        const sumRatings = prop.reviews.reduce((acc: number, item: any) => acc + item.rating, 0);
        prop.rating = Number((sumRatings / prop.reviews.length).toFixed(1));
      } else {
        prop.rating = 0;
      }
      await prop.save();
    }

    // Delete the renter user record
    await User.findByIdAndDelete(targetId);

    res.status(200).json({
      success: true,
      message: `Renter account "${renter.name}" and all associated ratings/comments were permanently deleted and recorded in Deletion History.`,
    });
    return;
  }

  return next(new ErrorResponse('Invalid target type specified.', 400));
});

// @desc    Get all deletion history logs
// @route   GET /api/admin/history
// @access  Private (ADMIN)
export const getAdminDeletionHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const history = await DeletionHistory.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

// @desc    Delete a specific history log entry
// @route   DELETE /api/admin/history/:id
// @access  Private (ADMIN)
export const deleteHistoryItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const historyLog = await DeletionHistory.findByIdAndDelete(req.params.id);

  if (!historyLog) {
    return next(new ErrorResponse('History record not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Deletion log entry removed successfully.',
  });
});

// @desc    Clear all deletion history logs
// @route   DELETE /api/admin/history
// @access  Private (ADMIN)
export const clearAllDeletionHistory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await DeletionHistory.deleteMany({});

  res.status(200).json({
    success: true,
    message: 'All deletion history logs cleared successfully.',
  });
});
