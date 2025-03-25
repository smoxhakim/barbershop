import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Customer from '@/lib/models/Customer';

// Get all customers
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search');
    
    // Build query
    let query: any = {};
    if (searchQuery) {
      query = {
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { phone: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }

    // Get customers with optional filtering
    const customers = await Customer.find(query).sort({ name: 1 });

    return NextResponse.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Check if customer with this email already exists
    const existingCustomer = await Customer.findOne({ email });
    
    if (existingCustomer) {
      // Update existing customer
      existingCustomer.name = name;
      existingCustomer.phone = phone;
      await existingCustomer.save();
      
      return NextResponse.json({
        success: true,
        data: existingCustomer,
        message: 'Customer updated successfully'
      });
    }

    // Create new customer
    const customer = await Customer.create({
      name,
      email,
      phone
    });

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}