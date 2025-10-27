import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch all blogs with pagination and filters
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const featured = searchParams.get('featured');
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }

    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    // Execute query with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalCount = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data: {
        blogs,
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
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new blog
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if blog with same title exists
    const existingBlog = await Blog.findOne({ 
      title: { $regex: new RegExp(`^${body.title}$`, 'i') }
    });
    
    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog with this title already exists' },
        { status: 400 }
      );
    }

    // Handle image data
    if (body.image) {
      body.image = {
        public_id: body.imagePublicId || 'placeholder',
        url: body.image
      };
    }

    // Generate slug from title if not provided
    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim() + '-' + Date.now();
    }

    // Calculate read time based on content length
    if (body.content) {
      const wordsPerMinute = 200;
      const words = body.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      body.readTime = `${minutes} min read`;
    }

    // Create blog
    const blog = await Blog.create(body);

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating blog:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Blog with this title already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create blog', error: error.message },
      { status: 500 }
    );
  }
}

