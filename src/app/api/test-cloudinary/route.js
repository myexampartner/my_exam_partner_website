import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Test Cloudinary connection
export async function GET() {
  try {
    // Test Cloudinary configuration
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
    };

    // Try to get account info to test connection
    const accountInfo = await cloudinary.api.ping();
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary connection successful',
      config: config,
      accountInfo: accountInfo
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message,
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
      }
    }, { status: 500 });
  }
}
