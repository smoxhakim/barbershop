// app/api/bookings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Customer from '@/lib/models/Customer';
import Appointment from '@/lib/models/Appointment';
import { formatDateKey } from '@/lib/bookingUtils';

// Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, date, time, service, status, notes } = body;

    // Validate required fields
    if (!customerId || !date || !time || !service) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the time slot is available
    const bookingDate = new Date(date);
    
    // Check if there's already a booking for this time slot
    const existingBooking = await Appointment.findOne({
      date: bookingDate,
      time,
      status: 'booked'
    });
    
    if (existingBooking) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 400 }
      );
    }

    // Verify that the customer exists
    const customer = await Customer.findById(customerId);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Create appointment
    const appointment = await Appointment.create({
      customerId,
      date: bookingDate,
      time,
      service,
      status: status || 'booked',
      notes
    });
    
    // Update customer with the new appointment
    if (!customer.appointments) {
      customer.appointments = [];
    }
    customer.appointments.push(appointment._id);
    await customer.save();

    return NextResponse.json({
      success: true,
      data: {
        appointment,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json(
      { error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

// Get all appointments or filter by date
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
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

    // Get appointments with customer details
    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .populate({
        path: 'customerId',
        model: Customer,
        select: 'name email phone'
      });

    return NextResponse.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}