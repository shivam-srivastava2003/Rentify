"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, city, businessName, propertyLocation, unitCount } = req.body;
        if (!name || !email || !password || !role) {
            res.status(400).json({ success: false, message: 'Please fill in all required fields' });
            return;
        }
        // Validate role
        if (role === 'ADMIN') {
            res.status(400).json({ success: false, message: 'Cannot register as ADMIN' });
            return;
        }
        if (!['USER', 'OWNER'].includes(role)) {
            res.status(400).json({ success: false, message: 'Invalid role selection' });
            return;
        }
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ success: false, message: 'User with this email already exists' });
            return;
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role,
            phone: phone || '',
            city: city || '',
            businessName: businessName || '',
            propertyLocation: propertyLocation || '',
            unitCount: unitCount || '',
        });
        if (user) {
            (0, generateToken_1.default)(res, user._id.toString());
            res.status(201).json({
                success: true,
                message: 'Account created successfully! Welcome to Rentify.',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    city: user.city,
                    businessName: user.businessName,
                    propertyLocation: user.propertyLocation,
                    unitCount: user.unitCount,
                },
            });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid user data provided' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide email and password' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            (0, generateToken_1.default)(res, user._id.toString());
            res.status(200).json({
                success: true,
                message: 'Welcome back! Login successful.',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    city: user.city,
                    businessName: user.businessName,
                    propertyLocation: user.propertyLocation,
                    unitCount: user.unitCount,
                },
            });
        }
        else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
exports.loginUser = loginUser;
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
exports.logoutUser = logoutUser;
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id).select('-password');
        if (user) {
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=authController.js.map