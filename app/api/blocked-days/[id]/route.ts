// app/api/blocked-days/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlockedDay from '@/lib/models/BlockedDay';

// Get a specific blocked day by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked day ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const blockedDay = await BlockedDay.findById(id);
    
    if (!blockedDay) {
      return NextResponse.json(
        { error: 'Blocked day not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blockedDay
    });
  } catch (error) {
    console.error('Error fetching blocked day:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked day' },
      { status: 500 }
    );
  }
}

// Update a blocked day
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { date, reason } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked day ID is required' },
        { status: 400 }
      );
    }
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find and update the blocked day
    const blockedDay = await BlockedDay.findByIdAndUpdate(
      id,
      { date: new Date(date), reason },
      { new: true, runValidators: true }
    );
    
    if (!blockedDay) {
      return NextResponse.json(
        { error: 'Blocked day not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blockedDay
    });
  } catch (error) {
    console.error('Error updating blocked day:', error);
    return NextResponse.json(
      { error: 'Failed to update blocked day' },
      { status: 500 }
    );
  }
}

// Delete a blocked day
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked day ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const result = await BlockedDay.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Blocked day not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blocked day deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blocked day:', error);
    return NextResponse.json(
      { error: 'Failed to delete blocked day' },
      { status: 500 }
    );
  }
}
