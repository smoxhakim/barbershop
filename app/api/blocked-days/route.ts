// app/api/blocked-days/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { BlockedDay } from '@/lib/models/BlockedDay';

// Get all blocked days
export async function GET() {
  try {
    await connectToDatabase();
    
    const blockedDays = await BlockedDay.find().sort({ date: 1 });
    
    return NextResponse.json({
      success: true,
      data: blockedDays
    });
  } catch (error) {
    console.error('Error fetching blocked days:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked days' },
      { status: 500 }
    );
  }
}

// Add a new blocked day
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, reason } = body;
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if day is already blocked
    const existingBlockedDay = await BlockedDay.findOne({
      date: new Date(date)
    });
    
    if (existingBlockedDay) {
      return NextResponse.json(
        { error: 'This day is already blocked' },
        { status: 400 }
      );
    }
    
    // Create new blocked day
    const blockedDay = await BlockedDay.create({
      date: new Date(date),
      reason: reason || 'Not available'
    });
    
    return NextResponse.json({
      success: true,
      data: blockedDay
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding blocked day:', error);
    return NextResponse.json(
      { error: 'Failed to add blocked day' },
      { status: 500 }
    );
  }
}

// Delete a blocked day
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
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
      message: 'Blocked day removed successfully'
    });
  } catch (error) {
    console.error('Error removing blocked day:', error);
    return NextResponse.json(
      { error: 'Failed to remove blocked day' },
      { status: 500 }
    );
  }
}
