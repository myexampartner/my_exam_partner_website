import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SubscribeEmail from '@/models/SubscribeEmail';

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

    // Build query
    let query = {};
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query.subscribedAt = {};
      if (dateFrom) {
        query.subscribedAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.subscribedAt.$lte = new Date(dateTo + 'T23:59:59.999Z');
      }
    }

    // Get total count
    const totalItems = await SubscribeEmail.countDocuments(query);
    
    // Get paginated data
    const skip = (page - 1) * limit;
    const emails = await SubscribeEmail.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get stats
    const stats = {
      total: await SubscribeEmail.countDocuments(),
      active: await SubscribeEmail.countDocuments({ status: 'active' }),
      unsubscribed: await SubscribeEmail.countDocuments({ status: 'unsubscribed' }),
    };

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
    };

    return NextResponse.json({
      success: true,
      data: emails,
      pagination,
      stats,
    });

  } catch (error) {
    console.error('Error fetching subscribe emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscribe emails' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, source = 'website' } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await SubscribeEmail.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already subscribed' },
        { status: 400 }
      );
    }

    // Create new subscription
    const newSubscription = new SubscribeEmail({
      email,
      source,
      status: 'active',
      subscribedAt: new Date(),
    });

    await newSubscription.save();

    return NextResponse.json({
      success: true,
      message: 'Email subscribed successfully',
      data: newSubscription,
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
