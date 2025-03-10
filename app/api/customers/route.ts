import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Customer } from '@/lib/models/Customer';

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get all customers
    const customers = await Customer.find().sort({ name: 1 });

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