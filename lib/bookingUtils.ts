// lib/bookingUtils.ts
// This file contains server-side utility functions for the booking system
// Client-side functions have been moved to clientBookingUtils.ts

// Only import server-side modules if we're running on the server
let connectToDatabase: any = null;
let Customer: any = null;
let Appointment: any = null;
let BlockedDay: any = null;
let BlockedTimeSlot: any = null;

// We need to check if we're on the client side to avoid errors
if (typeof window === 'undefined') {
  // Server-side only imports
  const dbModule = require('./db');
  const CustomerModule = require('./models/Customer');
  const AppointmentModule = require('./models/Appointment');
  const BlockedDayModule = require('./models/BlockedDay');
  const BlockedTimeSlotModule = require('./models/BlockedTimeSlot');
  
  connectToDatabase = dbModule.default || dbModule;
  Customer = CustomerModule.default || CustomerModule;
  Appointment = AppointmentModule.default || AppointmentModule;
  BlockedDay = BlockedDayModule.default || BlockedDayModule;
  BlockedTimeSlot = BlockedTimeSlotModule.default || BlockedTimeSlotModule;
}

// Type definitions for client-side usage
export interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AppointmentType {
  id: string;
  customerId: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Export type aliases for backward compatibility
export type Customer = CustomerType;
export type Appointment = AppointmentType;

export interface BlockedDayType {
  id: string;
  date: string;
  reason: string;
}

export interface BlockedTimeSlotType {
  id: string;
  date: string;
  time: string;
  reason: string;
}

// Format date as YYYY-MM-DD
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

// Generate all available time slots (9:00 AM to 8:00 PM)
export const getAllTimeSlots = (): string[] => {
  const slots = []

  for (let hour = 9; hour <= 20; hour++) {
    const hourFormatted = hour === 12 ? 12 : hour % 12
    const period = hour < 12 ? "AM" : "PM"
    slots.push(`${hourFormatted.toString().padStart(2, "0")}:00 ${period}`)
  }

  return slots
}

// Check if a day is blocked (server-side version with database access)
export const isDayBlocked = async (date: Date): Promise<boolean> => {
  // If we're on the client side, this function shouldn't be called
  if (typeof window !== 'undefined' || !connectToDatabase || !BlockedDay) {
    console.error('isDayBlocked should only be called on the server');
    return false;
  }
  
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Check if the day exists in the blocked days collection
    const blockedDay = await BlockedDay.findOne({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      }
    });
    
    return !!blockedDay;
  } catch (error) {
    console.error('Error checking if day is blocked:', error);
    return false;
  }
}

// Client-side version of isDayBlocked for use in client components
// This doesn't make database calls and returns mock data for development
export const isDayBlockedClient = (date: Date): boolean => {
  // For development/client-side, block Sundays and some specific dates
  // In production, this would be replaced with an API call
  
  // Block all Sundays
  if (date.getDay() === 0) {
    return true
  }
  
  // Block some specific dates (e.g., holidays)
  const dateStr = formatDateKey(date)
  const blockedDates = [
    '2025-04-01', // Example holiday
    '2025-04-15', // Example holiday
    '2025-05-01'  // Example holiday
  ]
  
  return blockedDates.includes(dateStr)
}

// Get all blocked days
export const getBlockedDays = async (): Promise<string[]> => {
  // If we're on the client side, this function shouldn't be called
  if (typeof window !== 'undefined' || !connectToDatabase || !BlockedDay) {
    console.error('getBlockedDays should only be called on the server');
    return [];
  }
  
  try {
    await connectToDatabase();
    
    // Get all blocked days from the database
    const blockedDays = await BlockedDay.find().sort({ date: 1 });
    
    // Format dates as strings (YYYY-MM-DD)
    return blockedDays.map((day: any) => formatDateKey(day.date));
  } catch (error) {
    console.error('Error fetching blocked days:', error);
    return [];
  }
}

// Block an entire day
export const blockDay = async (date: Date, reason: string = 'Not available'): Promise<boolean> => {
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Check if day is already blocked
    const existingBlockedDay = await BlockedDay.findOne({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      }
    });
    
    if (existingBlockedDay) {
      return false; // Day already blocked
    }
    
    // Create new blocked day
    await BlockedDay.create({
      date: new Date(date.toISOString().split('T')[0]),
      reason
    });
    
    return true;
  } catch (error) {
    console.error('Error blocking day:', error);
    return false;
  }
}

// Unblock a day
export const unblockDay = async (date: Date): Promise<boolean> => {
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Find and delete the blocked day
    const result = await BlockedDay.findOneAndDelete({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      }
    });
    
    return !!result;
  } catch (error) {
    console.error('Error unblocking day:', error);
    return false;
  }
}

// Get available time slots for a given date (server-side version with database access)
export const getAvailableTimeSlots = async (date: Date): Promise<string[]> => {
  // If we're on the client side, this function shouldn't be called
  if (typeof window !== 'undefined' || !connectToDatabase || !Appointment) {
    console.error('getAvailableTimeSlots should only be called on the server');
    return [];
  }
  
  const dateKey = formatDateKey(date)
  
  // If the day is blocked, no slots are available
  if (await isDayBlocked(date)) {
    return []
  }
  
  const allSlots = getAllTimeSlots()

  try {
    await connectToDatabase();
    
    // Get blocked slots for the date from the database
    const blockedTimeSlots = await getBlockedTimeSlots(date);
    
    // Get booked slots for the date from the database
    const bookedAppointments = await Appointment.find({
      date: {
        $gte: new Date(new Date(dateKey).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(dateKey).setHours(23, 59, 59, 999))
      },
      status: 'booked'
    });
    
    const bookedSlots = bookedAppointments.map((appointment: any) => appointment.time);

    // Filter out blocked and booked slots
    return allSlots.filter((slot: string) => !blockedTimeSlots.includes(slot) && !bookedSlots.includes(slot));
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
}

// Client-side version of getAvailableTimeSlots for use in client components
// This doesn't make database calls and returns mock data for development
export const getAvailableTimeSlotsClient = (date: Date): string[] => {
  const dateKey = formatDateKey(date)
  const allSlots = getAllTimeSlots()
  
  // For development/client-side, return all slots except a few random ones
  // In production, this would be replaced with an API call
  const mockBookedSlots = ["10:00 AM", "2:00 PM", "5:00 PM"]
  
  // If it's a weekend, block more slots to simulate higher demand
  const dayOfWeek = new Date(dateKey).getDay()
  if (dayOfWeek === 0 || dayOfWeek === 6) { // Saturday or Sunday
    mockBookedSlots.push("11:00 AM", "3:00 PM", "4:00 PM")
  }
  
  return allSlots.filter(slot => !mockBookedSlots.includes(slot))
}

// Block a time slot
export const blockTimeSlot = async (date: Date, timeSlot: string, reason: string = 'Not available'): Promise<boolean> => {
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Check if time slot is already blocked
    const existingBlockedSlot = await BlockedTimeSlot.findOne({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      },
      time: timeSlot
    });
    
    if (existingBlockedSlot) {
      return false; // Time slot already blocked
    }
    
    // Create new blocked time slot
    await BlockedTimeSlot.create({
      date: new Date(date.toISOString().split('T')[0]),
      time: timeSlot,
      reason
    });
    
    return true;
  } catch (error) {
    console.error('Error blocking time slot:', error);
    return false;
  }
}

// Unblock a time slot
export const unblockTimeSlot = async (date: Date, timeSlot: string): Promise<boolean> => {
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Find and delete the blocked time slot
    const result = await BlockedTimeSlot.findOneAndDelete({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      },
      time: timeSlot
    });
    
    return !!result;
  } catch (error) {
    console.error('Error unblocking time slot:', error);
    return false;
  }
}

// Get all blocked time slots for a specific date
export const getBlockedTimeSlots = async (date: Date): Promise<string[]> => {
  // If we're on the client side, this function shouldn't be called
  if (typeof window !== 'undefined' || !connectToDatabase || !BlockedTimeSlot) {
    console.error('getBlockedTimeSlots should only be called on the server');
    return [];
  }
  
  try {
    await connectToDatabase();
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    
    // Get blocked time slots from the database
    const blockedSlots = await BlockedTimeSlot.find({
      date: {
        $gte: new Date(formattedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(formattedDate.setHours(23, 59, 59, 999))
      }
    });
    
    return blockedSlots.map((slot: any) => slot.time);
  } catch (error) {
    console.error('Error fetching blocked time slots:', error);
    return [];
  }
}

// Book an appointment - client-side helper function
export const bookAppointment = async (
  date: Date,
  timeSlot: string,
  name: string,
  email: string,
  phone: string,
  notes?: string
): Promise<{ success: boolean; appointmentId?: string; customerId?: string; error?: string }> => {
  const dateKey = formatDateKey(date)
  
  // Check if the day is blocked
  if (await isDayBlocked(date)) {
    return { success: false, error: 'This day is not available for booking' }
  }
  
  const availableSlots = await getAvailableTimeSlots(date)

  if (!availableSlots.includes(timeSlot)) {
    return { success: false, error: 'This time slot is not available' }
  }

  try {
    // Make API call to book appointment
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        date: dateKey,
        time: timeSlot,
        notes
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to book appointment');
    }

    return { 
      success: true, 
      appointmentId: data.data.appointment._id,
      customerId: data.data.customer.id
    };
  } catch (error: any) {
    console.error('Error booking appointment:', error);
    return { success: false, error: error.message || 'Failed to book appointment' };
  }
}

// Client-side version of bookAppointment for use in client components
// This doesn't make database calls and simulates a successful booking for development
export const bookAppointmentClient = (
  date: Date,
  timeSlot: string,
  name: string,
  email: string,
  phone: string,
  notes?: string
): { success: boolean; appointmentId?: string; customerId?: string; error?: string } => {
  const dateKey = formatDateKey(date)
  
  // Check if the day is blocked using the client-side function
  if (isDayBlockedClient(date)) {
    return { success: false, error: 'This day is not available for booking' }
  }
  
  // Get available slots using the client-side function
  const availableSlots = getAvailableTimeSlotsClient(date)
  
  if (!availableSlots.includes(timeSlot)) {
    return { success: false, error: 'This time slot is not available' }
  }
  
  // For development, simulate a successful booking
  return { 
    success: true, 
    appointmentId: 'dev-appointment-' + Date.now(),
    customerId: 'dev-customer-' + Date.now()
  }
}

// Update an appointment - client-side helper function
export const updateAppointment = async (
  appointmentId: string,
  updates: {
    date?: Date;
    time?: string;
    status?: 'booked' | 'completed' | 'cancelled';
    notes?: string;
  }
): Promise<{ success: boolean; appointment?: AppointmentType; error?: string }> => {
  try {
    // If updating date or time, check availability
    if (updates.date) {
      // Check if the day is blocked
      if (await isDayBlocked(updates.date)) {
        return { success: false, error: 'This day is not available for booking' }
      }
      
      // Check if the new time slot is available
      if (updates.time) {
        // Get the current appointment to exclude it from availability check
        const currentResponse = await fetch(`/api/bookings/${appointmentId}`);
        if (!currentResponse.ok) {
          throw new Error('Failed to fetch current appointment details');
        }
        const currentData = await currentResponse.json();
        const currentAppointment = currentData.data;
        
        // Only check availability if date or time is changing
        const isChangingDateTime = 
          formatDateKey(updates.date) !== formatDateKey(new Date(currentAppointment.date)) || 
          updates.time !== currentAppointment.time;
        
        if (isChangingDateTime) {
          const availableSlots = await getAvailableTimeSlots(updates.date);
          if (!availableSlots.includes(updates.time)) {
            return { success: false, error: 'The selected time slot is not available' };
          }
        }
      }
    }
    
    // Prepare the update data
    const updateData: any = {};
    if (updates.date) updateData.date = formatDateKey(updates.date);
    if (updates.time) updateData.time = updates.time;
    if (updates.status) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;
    
    // Make API call to update appointment
    const response = await fetch(`/api/bookings/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update appointment');
    }

    // Map the response to AppointmentType
    const appointment: AppointmentType = {
      id: data.data._id,
      customerId: data.data.customerId,
      date: new Date(data.data.date).toISOString(),
      time: data.data.time,
      status: data.data.status,
      createdAt: new Date(data.data.createdAt).toISOString(),
      notes: data.data.notes
    };

    return { 
      success: true,
      appointment
    };
  } catch (error: any) {
    console.error('Error updating appointment:', error);
    return { success: false, error: error.message || 'Failed to update appointment' };
  }
}

// Cancel an appointment - client-side helper function
export const cancelAppointment = async (appointmentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Make API call to cancel appointment
    const response = await fetch(`/api/bookings/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'cancelled' }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to cancel appointment');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error cancelling appointment:', error);
    return { success: false, error: error.message || 'Failed to cancel appointment' };
  }
}

// Get all appointments - client-side helper function
export const getAllAppointments = async (): Promise<AppointmentType[]> => {
  try {
    const response = await fetch('/api/bookings');
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    const data = await response.json();
    
    // Map the data to the AppointmentType interface
    return data.data.map((appointment: any) => ({
      id: appointment._id,
      customerId: appointment.customerId._id,
      date: new Date(appointment.date).toISOString(),
      time: appointment.time,
      status: appointment.status,
      createdAt: new Date(appointment.createdAt).toISOString(),
      notes: appointment.notes
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

// Get appointments for a specific date - client-side helper function
export const getAppointmentsForDate = async (date: Date): Promise<AppointmentType[]> => {
  try {
    const dateString = formatDateKey(date);
    const response = await fetch(`/api/bookings?date=${dateString}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments for date');
    }
    
    const data = await response.json();
    
    // Map the data to the AppointmentType interface
    return data.data.map((appointment: any) => ({
      id: appointment._id,
      customerId: appointment.customerId._id,
      date: new Date(appointment.date).toISOString(),
      time: appointment.time,
      status: appointment.status,
      createdAt: new Date(appointment.createdAt).toISOString(),
      notes: appointment.notes
    }));
  } catch (error) {
    console.error('Error fetching appointments for date:', error);
    return [];
  }
}

// Get customer by ID - client-side helper function
export const getCustomerById = async (id: string): Promise<any | undefined> => {
  try {
    const response = await fetch(`/api/customers/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch customer');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return undefined;
  }
}

// Get all customers - client-side helper function
export const getAllCustomers = async (): Promise<CustomerType[]> => {
  try {
    const response = await fetch('/api/customers');
    
    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }
    
    const data = await response.json();
    
    // Map the data to the CustomerType interface
    return data.data.map((customer: any) => ({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}