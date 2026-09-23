import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['USER', 'OWNER']),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  businessName: z.string().optional(),
  propertyLocation: z.string().optional(),
  unitCount: z.string().optional(),
  gender: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  permanentAddress: z.string().optional(),
  city: z.string().optional(),
  businessName: z.string().optional(),
  propertyLocation: z.string().optional(),
  unitCount: z.string().optional(),
  gender: z.string().optional(),
  avatar: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});

export const updateEmailSchema = z.object({
  newEmail: z.string().email('Please enter a valid new email address'),
  currentPassword: z.string().min(1, 'Current password is required for verification'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});

export const propertySchema = z.object({
  title: z.string().min(3, 'Property title must be at least 3 characters'),
  type: z.enum(['PG', 'Single Room', 'Shared Room', '1BHK Flat', 'Studio']),
  gender: z.enum(['Boys PG', 'Girls PG', 'Unisex / Co-living', 'Any']).optional().default('Any'),
  city: z.string().min(1, 'City location is required'),
  sector: z.string().optional(),
  street: z.string().optional(),
  country: z.string().optional().default('India'),
  area: z.string().optional(),
  address: z.string().optional(),
  price: z.coerce.number().positive('Price per month must be a positive number'),
  deposit: z.coerce.number().nonnegative('Security deposit cannot be negative').optional().default(0),
  maintenance: z.coerce.number().nonnegative('Maintenance charges cannot be negative').optional().default(0),
  totalBeds: z.coerce.number().int().positive('Total unit capacity must be at least 1').optional().default(1),
  availableBeds: z.coerce.number().int().nonnegative('Available beds cannot be negative').optional(),
  occupiedBeds: z.coerce.number().int().nonnegative('Occupied beds cannot be negative').optional().default(0),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const addReviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  comment: z.string().min(2, 'Please enter a valid review comment'),
});

export const adminDeleteSchema = z.object({
  targetType: z.enum(['PROPERTY', 'OWNER', 'RENTER']),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string().min(3, 'A valid deletion reason of at least 3 characters is required'),
});
