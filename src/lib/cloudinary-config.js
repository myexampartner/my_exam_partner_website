import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration with error handling
export const configureCloudinary = () => {
  try {
    // Check if environment variables are available
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary environment variables not set');
      return null;
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true, // Always use HTTPS
    });

    console.log('Cloudinary configured successfully');
    return cloudinary;
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    return null;
  }
};

// Pre-configured Cloudinary instance
export const cloudinaryInstance = configureCloudinary();

// Utility functions
export const uploadToCloudinary = async (file, options = {}) => {
  if (!cloudinaryInstance) {
    throw new Error('Cloudinary not configured');
  }

  const defaultOptions = {
    folder: 'exam-partner',
    transformation: [
      { width: 800, height: 600, crop: 'limit', quality: 'auto' },
      { format: 'auto' }
    ],
    ...options
  };

  return new Promise((resolve, reject) => {
    cloudinaryInstance.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('Cloudinary upload success:', result);
          resolve(result);
        }
      }
    ).end(file);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!cloudinaryInstance) {
    throw new Error('Cloudinary not configured');
  }

  try {
    const result = await cloudinaryInstance.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinaryInstance;
