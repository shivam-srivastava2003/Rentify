import { Request, Response } from 'express';
import User from '../models/User';
import Property from '../models/Property';

// @desc    Get administrative dashboard system statistics
// @route   GET /api/admin/stats
// @access  Private (ADMIN)
export const getAdminStats = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all registered property owners with property count
// @route   GET /api/admin/owners
// @access  Private (ADMIN)
export const getAdminOwners = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get owner details and all listed properties by owner ID
// @route   GET /api/admin/owners/:id
// @access  Private (ADMIN)
export const getOwnerDetailsWithProperties = async (req: Request, res: Response) => {
  try {
    const owner = await User.findById(req.params.id).select('-password');

    if (!owner) {
      res.status(404).json({ success: false, message: 'Owner not found' });
      return;
    }

    const properties = await Property.find({ owner: owner._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        owner,
        properties,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all registered renters / tenants
// @route   GET /api/admin/renters
// @access  Private (ADMIN)
export const getAdminRenters = async (req: Request, res: Response) => {
  try {
    const renters = await User.find({ role: 'USER' }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: renters.length,
      data: renters,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
