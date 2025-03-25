// app/api/blocked-slots/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import BlockedTimeSlot from '@/lib/models/BlockedTimeSlot';

// Get a specific blocked time slot by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked time slot ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const blockedTimeSlot = await BlockedTimeSlot.findById(id);
    
    if (!blockedTimeSlot) {
      return NextResponse.json(
        { error: 'Blocked time slot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blockedTimeSlot
    });
  } catch (error) {
    console.error('Error fetching blocked time slot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked time slot' },
      { status: 500 }
    );
  }
}

// Update a blocked time slot
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { day, time, reason } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked time slot ID is required' },
        { status: 400 }
      );
    }
    
    if (!day || !time) {
      return NextResponse.json(
        { error: 'Day and time are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find and update the blocked time slot
    const blockedTimeSlot = await BlockedTimeSlot.findByIdAndUpdate(
      id,
      { day, time, reason },
      { new: true, runValidators: true }
    );
    
    if (!blockedTimeSlot) {
      return NextResponse.json(
        { error: 'Blocked time slot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blockedTimeSlot
    });
  } catch (error) {
    console.error('Error updating blocked time slot:', error);
    return NextResponse.json(
      { error: 'Failed to update blocked time slot' },
      { status: 500 }
    );
  }
}

// Delete a blocked time slot
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blocked time slot ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const result = await BlockedTimeSlot.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Blocked time slot not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blocked time slot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blocked time slot:', error);
    return NextResponse.json(
      { error: 'Failed to delete blocked time slot' },
      { status: 500 }
    );
  }
}
