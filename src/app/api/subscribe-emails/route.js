import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubscribeEmail from '@/models/SubscribeEmail';

// GET - Fetch all subscribe emails with pagination
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    // Add date filtering for email send date
    if (dateFrom || dateTo) {
      query.lastEmailSentAt = {};
      if (dateFrom) {
        query.lastEmailSentAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        query.lastEmailSentAt.$lt = endDate;
      }
    }
    
    // Get total count
    const total = await SubscribeEmail.countDocuments(query);
    
    // Get emails with pagination
    const emails = await SubscribeEmail.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Get statistics
    const stats = await SubscribeEmail.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalActive = stats.find(s => s._id === 'active')?.count || 0;
    const totalUnsubscribed = stats.find(s => s._id === 'unsubscribed')?.count || 0;
    
    return NextResponse.json({
      success: true,
      data: emails,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      stats: {
        total,
        active: totalActive,
        unsubscribed: totalUnsubscribed
      }
    });
  } catch (error) {
    console.error('Error fetching subscribe emails:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscribe emails' },
      { status: 500 }
    );
  }
}

// POST - Add new subscribe email
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, source = 'website_footer', ipAddress } = body;
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingEmail = await SubscribeEmail.findOne({ email: email.toLowerCase() });
    
    if (existingEmail) {
      if (existingEmail.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'Email is already subscribed' },
          { status: 400 }
        );
      } else {
        // Reactivate unsubscribed email
        existingEmail.status = 'active';
        existingEmail.subscribedAt = new Date();
        existingEmail.unsubscribedAt = null;
        await existingEmail.save();
        
        return NextResponse.json({
          success: true,
          message: 'Email resubscribed successfully',
          data: existingEmail
        });
      }
    }
    
    // Create new subscription
    const subscribeEmail = new SubscribeEmail({
      email: email.toLowerCase(),
      source,
      ipAddress
    });
    
    await subscribeEmail.save();
    
    return NextResponse.json({
      success: true,
      message: 'Email subscribed successfully',
      data: subscribeEmail
    });
  } catch (error) {
    console.error('Error subscribing email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to subscribe email' },
      { status: 500 }
    );
  }
}
