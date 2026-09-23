import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { uploadToCloudinary } from '../config/cloudinary';
import asyncHandler from '../middleware/asyncHandler';
import ErrorResponse from '../utils/errorResponse';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    return next(new ErrorResponse('Please fill in all required fields', 400));
  }

  if (role === 'ADMIN') {
    return next(new ErrorResponse('Cannot register as ADMIN', 400));
  }

  if (!['USER', 'OWNER'].includes(role)) {
    return next(new ErrorResponse('Invalid role selection', 400));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorResponse('User with this email already exists', 400));
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
    return next(new ErrorResponse('Invalid user data provided', 400));
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = (await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } })) as any;

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
    return next(new ErrorResponse('Invalid email or password', 401));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.status(200).json({
      success: true,
      data: user,
    });
  } else {
    return next(new ErrorResponse('User not found', 404));
  }
});

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
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
});

// @desc    Change user password securely
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorResponse('Please provide both current and new password.', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorResponse('New password must be at least 6 characters long.', 400));
  }

  const user = (await User.findById(req.user._id)) as any;

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect current password. Please try again.', 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully! Please use your new password for future logins.',
  });
});

// @desc    Verify if email exists for password reset
// @route   POST /api/auth/verify-reset-email
// @access  Public
export const verifyResetEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide your email address.', 400));
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });

  if (!user) {
    return next(new ErrorResponse('No account found with this email address. Please check your email or register.', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Email address verified successfully!',
    email: cleanEmail,
    userName: user.name,
  });
});

// @desc    Reset password after email verification
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return next(new ErrorResponse('Please provide email and new password.', 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorResponse('New password must be at least 6 characters long.', 400));
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = (await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } })) as any;

  if (!user) {
    return next(new ErrorResponse('No account found with this email address.', 404));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully! You can now sign in with your new password.',
  });
});

// @desc    Update user email address securely
// @route   PUT /api/auth/update-email
// @access  Private
export const updateEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { newEmail, currentPassword } = req.body;

  if (!newEmail || !currentPassword) {
    return next(new ErrorResponse('Please provide new email address and current password for verification.', 400));
  }

  const cleanNewEmail = newEmail.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: { $regex: new RegExp(`^${cleanNewEmail}$`, 'i') },
    _id: { $ne: req.user._id },
  });

  if (existingUser) {
    return next(new ErrorResponse('An account with this email address already exists.', 400));
  }

  const user = (await User.findById(req.user._id)) as any;

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorResponse('Incorrect password. Verification failed.', 400));
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
});
