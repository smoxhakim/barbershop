// lib/bookingUtils.ts

// Server-compatible blocked time slots storage
let blockedTimeSlots: Record<string, string[]> = {
  // Format: 'YYYY-MM-DD': ['HH:MM AM/PM', ...]
  "2024-05-15": ["09:00 AM", "10:00 AM", "11:00 AM"],
  "2024-05-16": ["12:00 PM", "01:00 PM"],
  "2024-05-20": ["02:00 PM", "03:00 PM", "04:00 PM"],
};

// Server-compatible blocked days storage
let blockedDays: string[] = [
  // Format: 'YYYY-MM-DD'
  "2024-05-25",
  "2024-05-26",
  "2024-07-04",
];

// Customer interface
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Appointment interface
export interface Appointment {
  id: string;
  customerId: string;
  date: string;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

// Mock data for customers
const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543'
  }
];

// Mock data for appointments
const appointments: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    date: '2024-05-17',
    time: '09:00 AM',
    status: 'booked',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    customerId: '1',
    date: '2024-05-18',
    time: '02:00 PM',
    status: 'booked',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    customerId: '2',
    date: '2024-05-19',
    time: '11:00 AM',
    status: 'booked',
    createdAt: new Date().toISOString()
  }
];

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

// Check if a day is blocked
export const isDayBlocked = (date: Date): boolean => {
  const blockedDaysList = getBlockedDays()
  const dateString = date.toISOString().split('T')[0]
  return blockedDaysList.includes(dateString)
}

// Get all blocked days
export const getBlockedDays = (): string[] => {
  return blockedDays;
}

// Block an entire day
export const blockDay = (date: Date): void => {
  const dateString = date.toISOString().split('T')[0]
  
  if (!blockedDays.includes(dateString)) {
    blockedDays.push(dateString)
  }
}

// Unblock a day
export const unblockDay = (date: Date): void => {
  const dateString = date.toISOString().split('T')[0]
  const index = blockedDays.indexOf(dateString)
  
  if (index > -1) {
    blockedDays.splice(index, 1)
  }
}

// Get available time slots for a given date
export const getAvailableTimeSlots = (date: Date): string[] => {
  const dateKey = formatDateKey(date)
  
  // If the day is blocked, no slots are available
  if (isDayBlocked(date)) {
    return []
  }
  
  const allSlots = getAllTimeSlots()

  // Get blocked slots for the date
  const blockedSlots = blockedTimeSlots[dateKey] || []

  // Get booked slots for the date
  const bookedSlots = appointments
    .filter(appointment => appointment.date === dateKey && appointment.status === 'booked')
    .map(appointment => appointment.time)

  // Filter out blocked and booked slots
  return allSlots.filter((slot) => !blockedSlots.includes(slot) && !bookedSlots.includes(slot))
}

// Block a time slot
export const blockTimeSlot = (date: Date, timeSlot: string): void => {
  const dateKey = formatDateKey(date)

  if (!blockedTimeSlots[dateKey]) {
    blockedTimeSlots[dateKey] = []
  }

  if (!blockedTimeSlots[dateKey].includes(timeSlot)) {
    blockedTimeSlots[dateKey].push(timeSlot)
  }
}

// Unblock a time slot
export const unblockTimeSlot = (date: Date, timeSlot: string): void => {
  const dateKey = formatDateKey(date)

  if (blockedTimeSlots[dateKey]) {
    blockedTimeSlots[dateKey] = blockedTimeSlots[dateKey].filter((slot) => slot !== timeSlot)

    if (blockedTimeSlots[dateKey].length === 0) {
      delete blockedTimeSlots[dateKey]
    }
  }
}

// Get all blocked time slots
export const getBlockedTimeSlots = (date: Date): string[] => {
  const dateKey = formatDateKey(date)
  return blockedTimeSlots[dateKey] || []
}

// Book an appointment
export const bookAppointment = (
  date: Date,
  timeSlot: string,
  name: string,
  email: string,
  phone: string,
  notes?: string
): { success: boolean; appointmentId?: string; customerId?: string } => {
  const dateKey = formatDateKey(date)
  
  // Check if the day is blocked
  if (isDayBlocked(date)) {
    return { success: false }
  }
  
  const availableSlots = getAvailableTimeSlots(date)

  if (!availableSlots.includes(timeSlot)) {
    return { success: false }
  }

  // Find or create customer
  let customer = customers.find(c => c.email === email)
  
  if (!customer) {
    // Create new customer
    const newCustomer: Customer = {
      id: (customers.length + 1).toString(),
      name,
      email,
      phone
    }
    customers.push(newCustomer)
    customer = newCustomer
  } else {
    // Update customer information
    customer.name = name
    customer.phone = phone
  }

  // Create appointment
  const newAppointment: Appointment = {
    id: (appointments.length + 1).toString(),
    customerId: customer.id,
    date: dateKey,
    time: timeSlot,
    status: 'booked',
    createdAt: new Date().toISOString(),
    notes
  }
  
  appointments.push(newAppointment)

  return { 
    success: true, 
    appointmentId: newAppointment.id,
    customerId: customer.id
  }
}

// Update an appointment
export const updateAppointment = (
  appointmentId: string,
  updates: {
    date?: Date;
    time?: string;
    status?: 'booked' | 'completed' | 'cancelled';
    notes?: string;
  }
): { success: boolean; appointment?: Appointment } => {
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId)
  
  if (appointmentIndex === -1) {
    return { success: false }
  }
  
  const appointment = { ...appointments[appointmentIndex] }
  
  // If updating date or time, check availability
  if (updates.date || updates.time) {
    const newDate = updates.date ? formatDateKey(updates.date) : appointment.date
    const newTime = updates.time || appointment.time
    
    // Check if the day is blocked
    if (updates.date && isDayBlocked(updates.date)) {
      return { success: false }
    }
    
    // If date or time is different, check availability
    if (newDate !== appointment.date || newTime !== appointment.time) {
      // Get available slots for the new date
      const availableSlots = updates.date 
        ? getAvailableTimeSlots(updates.date)
        : getAvailableTimeSlots(new Date(appointment.date))
      
      // Add the current time slot to available slots (since we're moving this appointment)
      if (newDate === appointment.date && !availableSlots.includes(newTime)) {
        availableSlots.push(appointment.time)
      }
      
      // Check if the new time slot is available
      if (!availableSlots.includes(newTime)) {
        return { success: false }
      }
    }
    
    // Update the appointment
    if (updates.date) {
      appointment.date = formatDateKey(updates.date)
    }
    
    if (updates.time) {
      appointment.time = updates.time
    }
  }
  
  // Update status if provided
  if (updates.status) {
    appointment.status = updates.status
  }
  
  // Update notes if provided
  if (updates.notes !== undefined) {
    appointment.notes = updates.notes
  }
  
  // Update the appointment in the array
  appointments[appointmentIndex] = appointment
  
  return { 
    success: true,
    appointment
  }
}

// Cancel an appointment
export const cancelAppointment = (appointmentId: string): { success: boolean } => {
  const appointmentIndex = appointments.findIndex(a => a.id === appointmentId)
  
  if (appointmentIndex === -1) {
    return { success: false }
  }
  
  appointments[appointmentIndex].status = 'cancelled'
  
  return { success: true }
}

// Get all appointments
export const getAllAppointments = (): (Appointment & { customer: Customer })[] => {
  return appointments.map(appointment => {
    const customer = customers.find(c => c.id === appointment.customerId) || {
      id: 'unknown',
      name: 'Unknown Customer',
      email: 'unknown@example.com',
      phone: 'N/A'
    }
    
    return {
      ...appointment,
      customer
    }
  })
}

// Get appointments for a specific date
export const getAppointmentsForDate = (date: Date): (Appointment & { customer: Customer })[] => {
  const dateKey = formatDateKey(date)
  
  return getAllAppointments().filter(appointment => appointment.date === dateKey)
}

// Get customer by ID
export const getCustomerById = (id: string): Customer | undefined => {
  return customers.find(c => c.id === id)
}

// Get all customers
export const getAllCustomers = (): Customer[] => {
  return [...customers]
}