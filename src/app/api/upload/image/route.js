import { NextResponse } from 'next/server';
import { cloudinaryInstance, uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary-config';

// POST - Upload image to Cloudinary
export async function POST(request) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary environment variables not set:', {
        cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
        api_key: !!process.env.CLOUDINARY_API_KEY,
        api_secret: !!process.env.CLOUDINARY_API_SECRET
      });
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cloudinary not configured. Please check environment variables.',
          error: 'Missing Cloudinary credentials',
          debug: {
            hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
            hasApiKey: !!process.env.CLOUDINARY_API_KEY,
            hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
          }
        },
        { status: 500 }
      );
    }

    // Check if Cloudinary is available
    if (!cloudinaryInstance) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cloudinary not configured. Please check environment variables.',
          error: 'Cloudinary instance not available'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image');
    const folder = formData.get('folder') || 'exam-partner';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    console.log('Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      folder: folder
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using optimized function
    let result;
    try {
      result = await uploadToCloudinary(buffer, {
        folder: folder,
        public_id: `blog_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      });
    } catch (uploadError) {
      console.error('Cloudinary upload failed:', uploadError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cloudinary upload failed',
          error: uploadError.message,
          details: uploadError.toString()
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Image upload failed',
        error: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete image from Cloudinary
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'No public_id provided' },
        { status: 400 }
      );
    }

    // Check if Cloudinary is available
    if (!cloudinaryInstance) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cloudinary not configured',
          error: 'Cloudinary instance not available'
        },
        { status: 500 }
      );
    }

    const result = await deleteFromCloudinary(publicId);

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to delete image' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image deletion error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Image deletion failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
