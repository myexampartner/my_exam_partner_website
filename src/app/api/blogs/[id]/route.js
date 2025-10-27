import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { deleteImage } from '@/lib/cloudinary';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET - Fetch single blog
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Check if id is a valid ObjectId format (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID format' },
        { status: 400 }
      );
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog', error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update blog
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Check if id is a valid ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Check if title is being changed and if it already exists
    if (body.title && body.title !== blog.title) {
      const existingBlog = await Blog.findOne({ 
        title: { $regex: new RegExp(`^${body.title}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingBlog) {
        return NextResponse.json(
          { success: false, message: 'Blog with this title already exists' },
          { status: 400 }
        );
      }
    }

    // Handle image update
    if (body.image && body.image !== blog.image?.url) {
      // Delete old image from Cloudinary if it exists and is not default
      if (blog.image?.public_id && blog.image.public_id !== 'placeholder' && blog.image.public_id !== body.imagePublicId) {
        try {
          await deleteImage(blog.image.public_id);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      // Update image data
      body.image = {
        public_id: body.imagePublicId || 'placeholder',
        url: body.image
      };
    } else if (body.image === blog.image?.url) {
      // Keep existing image if it's the same URL
      body.image = blog.image;
    }

    // Update slug if title is changed
    if (body.title && body.title !== blog.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim() + '-' + Date.now();
    }

    // Calculate read time if content is updated
    if (body.content) {
      const wordsPerMinute = 200;
      const words = body.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      body.readTime = `${minutes} min read`;
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...body, lastModified: new Date() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Blog with this title already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to update blog', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Check if id is a valid ObjectId format
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (!isValidObjectId) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID format' },
        { status: 400 }
      );
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (blog.image?.public_id && blog.image.public_id !== 'placeholder') {
      try {
        await deleteImage(blog.image.public_id);
      } catch (imageError) {
        console.error('Image deletion error:', imageError);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete blog
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog', error: error.message },
      { status: 500 }
    );
  }
}

