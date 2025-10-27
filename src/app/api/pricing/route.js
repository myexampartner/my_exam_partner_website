import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PricingPlan from '@/models/PricingPlan';

// GET - Fetch all pricing plans
export async function GET(request) {
  try {
    await connectDB();
    
    // Check if this is an admin request
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';
    
    // For admin, fetch all plans; for public, only active plans
    const query = isAdmin ? {} : { isActive: true };
    
    const pricingPlans = await PricingPlan.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: pricingPlans,
    });
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing plans' },
      { status: 500 }
    );
  }
}

// POST - Create new pricing plan
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, price, features } = body;

    // Basic validation
    if (!title || !price || !features || !Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title, price, and at least one feature are required' },
        { status: 400 }
      );
    }

    const pricingPlan = new PricingPlan({
      title: title.trim(),
      price: price.trim(),
      features: features.map(feature => feature.trim()),
      gradient: "linear-gradient(135deg, #1a1a1a, #000000)",
      textColor: "white",
      tagBg: "rgba(255, 255, 255, 0.2)",
      tagColor: "#fff",
    });

    await pricingPlan.save();

    return NextResponse.json({
      success: true,
      message: 'Pricing plan created successfully',
      data: pricingPlan,
    });
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create pricing plan' },
      { status: 500 }
    );
  }
}
