import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';

// GET - Fetch all contact submissions
export async function GET() {
  try {
    await connectDB();
    
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}

// POST - Create new contact submission
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, curriculum, message } = body;

    // Basic validation
    if (!name || !email || !curriculum || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, curriculum, and message are required' },
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

    // Phone validation (if provided)
    if (phone && !/^\d{11}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Phone number must be exactly 11 digits' },
        { status: 400 }
      );
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      curriculum: curriculum.trim(),
      message: message.trim(),
    });

    await contact.save();

    return NextResponse.json({
      success: true,
      message: 'Contact submission created successfully',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact submission:', error);
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create contact submission' },
      { status: 500 }
    );
  }
}
