import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tutor from '@/models/Tutor';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all tutors
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const subject = searchParams.get('subject');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    let query = {};
    
    if (subject) {
      query.subject = subject;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { qualification: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [tutors, totalCount] = await Promise.all([
      Tutor.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tutor.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        tutors,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tutors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch tutors', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new tutor
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'subject', 'qualification', 'experience'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingTutor = await Tutor.findOne({ email: body.email });
    if (existingTutor) {
      return NextResponse.json(
        { success: false, message: 'Tutor with this email already exists' },
        { status: 400 }
      );
    }

    // Create tutor data
    const tutorData = {
      ...body,
      // Set default values if not provided
      rating: body.rating || 4.5,
      status: body.status || 'active',
      studentCount: body.studentCount || 0,
      successRate: body.successRate || 0,
      isVerified: body.isVerified || false,
      languages: body.languages || ['English'],
      certifications: body.certifications || [],
      teachingMethods: body.teachingMethods || [],
      specialization: body.specialization || []
    };

    // If image is provided as base64 or file, upload to Cloudinary
    if (body.image) {
      try {
        // Handle base64 image
        if (body.image.startsWith('data:image/')) {
          const base64Data = body.image.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Upload to Cloudinary using upload_stream
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
          
          tutorData.image = {
            public_id: result.public_id,
            url: result.secure_url
          };
        } else if (typeof body.image === 'string') {
          // Handle URL
          tutorData.image = {
            public_id: 'placeholder',
            url: body.image
          };
        }
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        // Continue without image if upload fails
        tutorData.image = {
          public_id: 'placeholder',
          url: '/images/tutor1.png'
        };
      }
    } else {
      // Default image
      tutorData.image = {
        public_id: 'placeholder',
        url: '/images/tutor1.png'
      };
    }

    const tutor = new Tutor(tutorData);
    await tutor.save();

    return NextResponse.json({
      success: true,
      message: 'Tutor created successfully',
      data: tutor
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tutor:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create tutor', error: error.message },
      { status: 500 }
    );
  }
}
