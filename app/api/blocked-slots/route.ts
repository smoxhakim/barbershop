// app/api/blocked-slots/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { BlockedTimeSlot } from '@/lib/models/BlockedTimeSlot';

// Get all blocked time slots or filter by date
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    // Build query
    const query: any = {};
    if (dateParam) {
      const filterDate = new Date(dateParam);
      query.date = {
        $gte: new Date(filterDate.setHours(0, 0, 0, 0)),
        $lt: new Date(filterDate.setHours(23, 59, 59, 999))
      };
    }
    
    const blockedSlots = await BlockedTimeSlot.find(query).sort({ date: 1, time: 1 });
    
    return NextResponse.json({
      success: true,
      data: blockedSlots
    });
  } catch (error) {
    console.error('Error fetching blocked time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked time slots' },
      { status: 500 }
    );
  }
}

// Add a new blocked time slot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, time, reason } = body;
    
    if (!date || !time) {
      return NextResponse.json(
        { error: 'Date and time are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if time slot is already blocked
    const existingBlockedSlot = await BlockedTimeSlot.findOne({
      date: new Date(date),
      time
    });
    
    if (existingBlockedSlot) {
      return NextResponse.json(
        { error: 'This time slot is already blocked' },
        { status: 400 }
      );
    }
    
    // Create new blocked time slot
    const blockedSlot = await BlockedTimeSlot.create({
      date: new Date(date),
      time,
      reason: reason || 'Not available'
    });
    
    return NextResponse.json({
      success: true,
      data: blockedSlot
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding blocked time slot:', error);
    return NextResponse.json(
      { error: 'Failed to add blocked time slot' },
      { status: 500 }
    );
  }
}

// Delete a blocked time slot
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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
      message: 'Blocked time slot removed successfully'
    });
  } catch (error) {
    console.error('Error removing blocked time slot:', error);
    return NextResponse.json(
      { error: 'Failed to remove blocked time slot' },
      { status: 500 }
    );
  }
}
