import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Submission from '@/models/Submission';

// GET - Fetch all submissions
export async function GET() {
  try {
    await connectDB();
    
    const submissions = await Submission.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST - Create new submission
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, phone, email, curriculum, grade } = body;

    // Basic validation
    if (!name || !phone || !email || !curriculum || !grade) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const submission = new Submission({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      curriculum,
      grade,
    });

    await submission.save();

    return NextResponse.json({
      success: true,
      message: 'Submission created successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}
