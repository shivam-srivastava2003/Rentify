import { z } from 'zod';

export const clientLoginSchema = z.object({
  email: z.string().trim().min(1, 'Email address is required').email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const clientRegisterSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email address is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['USER', 'OWNER']),
  phone: z.string().optional(),
  city: z.string().optional(),
  permanentAddress: z.string().optional(),
  businessName: z.string().optional(),
  propertyLocation: z.string().optional(),
  unitCount: z.string().optional(),
  gender: z.string().optional(),
});

export const clientPropertySchema = z.object({
  title: z.string().trim().min(3, 'Property title must be at least 3 characters long'),
  type: z.enum(['PG', 'Single Room', 'Shared Room', '1BHK Flat', 'Studio']),
  gender: z.enum(['Boys PG', 'Girls PG', 'Unisex / Co-living', 'Any']).optional().default('Any'),
  city: z.string().trim().min(1, 'City name is required'),
  price: z.coerce.number().positive('Monthly rent price must be a positive number'),
  deposit: z.coerce.number().nonnegative('Security deposit cannot be negative').optional(),
  maintenance: z.coerce.number().nonnegative('Maintenance charges cannot be negative').optional(),
  totalBeds: z.coerce.number().positive('Total capacity must be at least 1 unit').optional(),
  availableBeds: z.coerce.number().nonnegative('Available capacity cannot be negative').optional(),
  occupiedBeds: z.coerce.number().nonnegative('Occupied capacity cannot be negative').optional(),
});

export const clientAdminDeleteSchema = z.object({
  targetType: z.enum(['PROPERTY', 'OWNER', 'RENTER']),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.string().trim().min(3, 'Please provide a deletion reason of at least 3 characters'),
});

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errorMessage = result.error.issues.map((e: any) => e.message).join(' | ');
  return { success: false, error: errorMessage };
};
