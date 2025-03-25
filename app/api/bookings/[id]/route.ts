// app/api/bookings/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Customer from '@/lib/models/Customer';
import Appointment from '@/lib/models/Appointment';

// Get a specific appointment by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const appointment = await Appointment.findById(id).populate({
      path: 'customerId',
      model: Customer,
      select: 'name email phone'
    });
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// Update an appointment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { date, time, status, notes } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Find the appointment
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    // Check if the time slot is available if changing date or time
    if (date && time && (date !== appointment.date.toISOString().split('T')[0] || time !== appointment.time)) {
      // Check if there's already a booking for this time slot
      const existingBooking = await Appointment.findOne({
        _id: { $ne: id }, // Exclude the current appointment
        date: new Date(date),
        time,
        status: 'booked'
      });
      
      if (existingBooking) {
        return NextResponse.json(
          { error: 'Selected time slot is not available' },
          { status: 400 }
        );
      }
    }
    
    // Update appointment fields
    if (date) appointment.date = new Date(date);
    if (time) appointment.time = time;
    if (status) appointment.status = status;
    if (body.service) appointment.service = body.service;
    if (notes !== undefined) appointment.notes = notes;
    
    await appointment.save();
    
    // Get the updated appointment with customer details
    const updatedAppointment = await Appointment.findById(id).populate({
      path: 'customerId',
      model: Customer,
      select: 'name email phone'
    });
    
    return NextResponse.json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// Delete an appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const result = await Appointment.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
