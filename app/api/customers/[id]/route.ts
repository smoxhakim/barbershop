// app/api/customers/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Customer, Appointment } from '@/lib/models/Customer';

// Get a specific customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, phone } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if email is already in use by another customer
    const existingCustomer = await Customer.findOne({
      email,
      _id: { $ne: id } // Exclude the current customer
    });
    
    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Email is already in use by another customer' },
        { status: 400 }
      );
    }
    
    // Find and update the customer
    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// Delete a customer and their appointments
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Check if customer has appointments
    const appointments = await Appointment.find({ customerId: id });
    
    if (appointments.length > 0) {
      // Option 1: Prevent deletion if customer has appointments
      return NextResponse.json(
        { error: 'Cannot delete customer with existing appointments' },
        { status: 400 }
      );
      
      // Option 2: Delete customer and all their appointments
      // await Appointment.deleteMany({ customerId: id });
    }
    
    const result = await Customer.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
