import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 or URL image to Cloudinary and returns the secure HTTP URL.
 * If Cloudinary is not configured or fails, gracefully falls back to the original string.
 */
export const uploadToCloudinary = async (imageStr: string, folder: string = 'rentify/properties'): Promise<string> => {
  // Check if Cloudinary environment variables are configured
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.log('Cloudinary keys not set, skipping Cloudinary upload.');
    return imageStr;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageStr, {
      folder,
      resource_type: 'auto',
    });
    console.log(`Cloudinary Upload Success: ${uploadResponse.secure_url}`);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback to original image string if Cloudinary upload fails
    return imageStr;
  }
};

export default cloudinary;
