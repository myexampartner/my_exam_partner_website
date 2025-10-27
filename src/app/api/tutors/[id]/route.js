import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tutor from '@/models/Tutor';
import { deleteImage } from '@/lib/cloudinary';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch single tutor
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const tutor = await Tutor.findById(id);
    
    if (!tutor) {
      return NextResponse.json(
        { success: false, message: 'Tutor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tutor
    });

  } catch (error) {
    console.error('Error fetching tutor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tutor', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update tutor
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const tutor = await Tutor.findById(id);
    
    if (!tutor) {
      return NextResponse.json(
        { success: false, message: 'Tutor not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== tutor.email) {
      const existingTutor = await Tutor.findOne({ email: body.email });
      if (existingTutor) {
        return NextResponse.json(
          { success: false, message: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Handle image update
    if (body.image && body.image !== tutor.image.url) {
      try {
        // Delete old image from Cloudinary if it exists and is not default
        if (tutor.image.public_id && tutor.image.public_id !== 'placeholder') {
          await deleteImage(tutor.image.public_id);
        }

        // Upload new image
        if (body.image.startsWith('data:image/')) {
          const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              {
                folder: 'exam-partner/tutors',
                transformation: [
                  { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                  { quality: 'auto' }
                ]
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(buffer);
          });
          
          body.image = {
            public_id: result.public_id,
            url: result.secure_url
          };
        } else if (typeof body.image === 'string') {
          body.image = {
            public_id: 'placeholder',
            url: body.image
          };
        }
      } catch (imageError) {
        console.error('Image update error:', imageError);
        // Keep existing image if update fails
        delete body.image;
      }
    }

    // Update tutor
    const updatedTutor = await Tutor.findByIdAndUpdate(
      id,
      { ...body, lastActive: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Tutor updated successfully',
      data: updatedTutor
    });

  } catch (error) {
    console.error('Error updating tutor:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update tutor', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete tutor
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const tutor = await Tutor.findById(id);
    
    if (!tutor) {
      return NextResponse.json(
        { success: false, message: 'Tutor not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (tutor.image.public_id && tutor.image.public_id !== 'placeholder') {
      try {
        await deleteImage(tutor.image.public_id);
      } catch (imageError) {
        console.error('Image deletion error:', imageError);
        // Continue with tutor deletion even if image deletion fails
      }
    }

    // Delete tutor
    await Tutor.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Tutor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tutor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete tutor', error: error.message },
      { status: 500 }
    );
  }
}
