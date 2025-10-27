import { NextResponse } from 'next/server';

// GET - Debug environment variables
export async function GET() {
  try {
    const envCheck = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not Set'
    };

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      environment: envCheck,
      nodeEnv: process.env.NODE_ENV
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error checking environment variables',
      error: error.message
    }, { status: 500 });
  }
}
