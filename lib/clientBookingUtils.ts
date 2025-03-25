// lib/clientBookingUtils.ts
// Client-side only booking utilities for use in client components
// This file does NOT import any server-side models or database connections

// Helper function to format date for consistent keys
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate time slots from 9 AM to 5 PM, every 30 minutes
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  return slots;
};

// Client-side version of isDayBlocked
// This doesn't make database calls and returns mock data for development
export const isDayBlockedClient = (date: Date): boolean => {
  const dateKey = formatDateKey(date);
  
  // Mock data for blocked days (e.g., holidays or days off)
  const blockedDays = [
    '2025-04-01', // Example blocked day
    '2025-04-15', // Example blocked day
  ];
  
  return blockedDays.includes(dateKey);
};

// Client-side version of getAvailableTimeSlots
// This doesn't make database calls and returns mock data for development
export const getAvailableTimeSlotsClient = (date: Date): string[] => {
  const dateKey = formatDateKey(date);
  const allTimeSlots = generateTimeSlots();
  
  // Mock data for booked time slots
  const bookedTimeSlots: Record<string, string[]> = {
    '2025-03-23': ['10:00', '14:30'],
    '2025-03-24': ['11:00', '15:00'],
    '2025-03-25': ['9:30', '13:00', '16:30'],
  };
  
  // If the day is blocked, no slots are available
  if (isDayBlockedClient(date)) {
    return [];
  }
  
  // Filter out booked slots for the selected date
  const bookedSlotsForDate = bookedTimeSlots[dateKey] || [];
  
  // Current time
  const now = new Date();
  const today = formatDateKey(now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Filter available slots
  return allTimeSlots.filter(slot => {
    // If slot is booked, it's not available
    if (bookedSlotsForDate.includes(slot)) {
      return false;
    }
    
    // If it's today, filter out past time slots
    if (dateKey === today) {
      const [slotHour, slotMinute] = slot.split(':').map(Number);
      if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
        return false;
      }
    }
    
    return true;
  });
};

// Client-side version of bookAppointment
// This doesn't make database calls and simulates a successful booking for development
export const bookAppointmentClient = (
  date: Date,
  timeSlot: string,
  name: string,
  email: string,
  phone: string,
  notes?: string
): { success: boolean; appointmentId?: string; customerId?: string; error?: string } => {
  const dateKey = formatDateKey(date);
  
  // Check if the day is blocked using the client-side function
  if (isDayBlockedClient(date)) {
    return { success: false, error: 'This day is not available for booking' };
  }
  
  // Get available slots using the client-side function
  const availableSlots = getAvailableTimeSlotsClient(date);
  
  if (!availableSlots.includes(timeSlot)) {
    return { success: false, error: 'This time slot is not available' };
  }
  
  // For development, simulate a successful booking
  return { 
    success: true, 
    appointmentId: 'dev-appointment-' + Date.now(),
    customerId: 'dev-customer-' + Date.now()
  };
};
