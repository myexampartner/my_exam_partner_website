import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PricingPlan from '@/models/PricingPlan';

// GET - Fetch single pricing plan
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const pricingPlan = await PricingPlan.findById(id).lean();

    if (!pricingPlan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pricingPlan,
    });
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing plan' },
      { status: 500 }
    );
  }
}

// PUT - Update pricing plan
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    const { title, price, features, isActive } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (price !== undefined) updateData.price = price.trim();
    if (features !== undefined && Array.isArray(features)) {
      updateData.features = features.map(feature => feature.trim());
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    const pricingPlan = await PricingPlan.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!pricingPlan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing plan updated successfully',
      data: pricingPlan,
    });
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update pricing plan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete pricing plan
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const pricingPlan = await PricingPlan.findByIdAndDelete(id);

    if (!pricingPlan) {
      return NextResponse.json(
        { success: false, error: 'Pricing plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pricing plan deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete pricing plan' },
      { status: 500 }
    );
  }
}
