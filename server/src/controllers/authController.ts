import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { uploadToCloudinary } from '../config/cloudinary';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      whatsapp,
      permanentAddress,
      city,
      businessName,
      propertyLocation,
      unitCount,
      gender,
    } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Please fill in all required fields' });
      return;
    }

    if (role === 'ADMIN') {
      res.status(400).json({ success: false, message: 'Cannot register as ADMIN' });
      return;
    }

    if (!['USER', 'OWNER'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role selection' });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
      whatsapp: whatsapp || phone || '',
      permanentAddress: permanentAddress || '',
      city: city || '',
      businessName: businessName || '',
      propertyLocation: propertyLocation || '',
      unitCount: unitCount || '',
      gender: gender || '',
      avatar: '',
    });

    if (user) {
      const token = generateToken(res, user._id.toString());
      res.status(201).json({
        success: true,
        token,
        message: 'Account created successfully! Welcome to Rentify.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          whatsapp: user.whatsapp,
          permanentAddress: user.permanentAddress,
          city: user.city,
          businessName: user.businessName,
          propertyLocation: user.propertyLocation,
          unitCount: user.unitCount,
          gender: user.gender,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data provided' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = (await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } })) as any;

    // Auto-seed or fix Admin user if logging in with default admin credentials
    if (cleanEmail === 'admin@roomfinder.com' && password === 'AdminPassword123!') {
      if (!user) {
        user = await User.create({
          name: 'System Administrator',
          email: 'admin@roomfinder.com',
          password: 'AdminPassword123!',
          role: 'ADMIN',
        });
      } else if (user.role !== 'ADMIN' || !(await user.matchPassword(password))) {
        user.password = 'AdminPassword123!';
        user.role = 'ADMIN';
        user = await user.save();
      }
    }

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id.toString());
      res.status(200).json({
        success: true,
        token,
        message: 'Welcome back! Login successful.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          whatsapp: user.whatsapp,
          permanentAddress: user.permanentAddress,
          city: user.city,
          businessName: user.businessName,
          propertyLocation: user.propertyLocation,
          unitCount: user.unitCount,
          gender: user.gender,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.whatsapp = req.body.whatsapp !== undefined ? req.body.whatsapp : user.whatsapp;
    user.permanentAddress = req.body.permanentAddress !== undefined ? req.body.permanentAddress : user.permanentAddress;
    user.city = req.body.city !== undefined ? req.body.city : user.city;
    user.businessName = req.body.businessName !== undefined ? req.body.businessName : user.businessName;
    user.propertyLocation = req.body.propertyLocation !== undefined ? req.body.propertyLocation : user.propertyLocation;
    user.unitCount = req.body.unitCount !== undefined ? req.body.unitCount : user.unitCount;
    user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;

    // Handle avatar upload if base64 provided
    if (req.body.avatar) {
      if (req.body.avatar.startsWith('data:image')) {
        const uploadedUrl = await uploadToCloudinary(req.body.avatar, 'rentify/avatars');
        user.avatar = uploadedUrl;
      } else {
        user.avatar = req.body.avatar;
      }
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully!',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        permanentAddress: updatedUser.permanentAddress,
        city: updatedUser.city,
        businessName: updatedUser.businessName,
        propertyLocation: updatedUser.propertyLocation,
        unitCount: updatedUser.unitCount,
        gender: updatedUser.gender,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Change user password securely
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const user = (await User.findById(req.user._id)) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password. Please try again.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully! Please use your new password for future logins.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Verify if email exists for password reset
// @route   POST /api/auth/verify-reset-email
// @access  Public
export const verifyResetEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email address.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please check your email or register.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully!',
      email: cleanEmail,
      userName: user.name,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Reset password after email verification
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide email and new password.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = (await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } })) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'No account found with this email address.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// @desc    Update user email address securely
// @route   PUT /api/auth/update-email
// @access  Private
export const updateEmail = async (req: Request, res: Response) => {
  try {
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      res.status(400).json({ success: false, message: 'Please provide new email address and current password for verification.' });
      return;
    }

    const cleanNewEmail = newEmail.trim().toLowerCase();

    // Check if new email is already in use by another user
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${cleanNewEmail}$`, 'i') },
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const user = (await User.findById(req.user._id)) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect password. Verification failed.' });
      return;
    }

    user.email = cleanNewEmail;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Email address updated successfully!',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        permanentAddress: updatedUser.permanentAddress,
        city: updatedUser.city,
        businessName: updatedUser.businessName,
        propertyLocation: updatedUser.propertyLocation,
        unitCount: updatedUser.unitCount,
        gender: updatedUser.gender,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};
