import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Customer, Appointment } from '@/lib/models/Customer';
import { getAvailableTimeSlotsSync } from '@/lib/bookingUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if the time slot is available
    const bookingDate = new Date(date);
    
    // Use the sync version to avoid async issues
    const availableSlots = getAvailableTimeSlotsSync(bookingDate);
    
    if (!availableSlots.includes(time)) {
      return NextResponse.json(
        { error: 'Selected time slot is not available' },
        { status: 400 }
      );
    }

    // Find or create customer
    let customer = await Customer.findOne({ email });
    
    if (!customer) {
      customer = await Customer.create({
        name,
        email,
        phone
      });
    } else {
      // Update customer information if it exists
      customer.name = name;
      customer.phone = phone;
      await customer.save();
    }

    // Create appointment
    const appointment = await Appointment.create({
      customerId: customer._id,
      date: bookingDate,
      time,
      status: 'booked'
    });

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

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get all appointments with customer details
    const appointments = await Appointment.find()
      .sort({ date: 1, time: 1 })
      .populate({
        path: 'customerId',
        model: Customer,
        select: 'name email phone'
      });

    console.log('API - Fetched appointments:', appointments);

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