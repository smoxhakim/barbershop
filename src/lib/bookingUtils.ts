// Mock data for blocked time slots
const blockedTimeSlots: Record<string, string[]> = {
  // Format: 'YYYY-MM-DD': ['HH:MM AM/PM', ...]
  "2024-05-15": ["09:00 AM", "10:00 AM", "11:00 AM"],
  "2024-05-16": ["12:00 PM", "01:00 PM"],
  "2024-05-20": ["02:00 PM", "03:00 PM", "04:00 PM"],
}

// Mock data for booked appointments
const bookedAppointments: Record<string, string[]> = {
  // Format: 'YYYY-MM-DD': ['HH:MM AM/PM', ...]
  "2024-05-17": ["09:00 AM", "10:00 AM"],
  "2024-05-18": ["02:00 PM", "03:00 PM"],
  "2024-05-19": ["11:00 AM"],
}

// Format date as YYYY-MM-DD
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

// Generate all available time slots (9:00 AM to 12:00 PM)
export const getAllTimeSlots = (): string[] => {
  const slots = []

  for (let hour = 9; hour <= 20; hour++) {
    const hourFormatted = hour === 12 ? 12 : hour % 12
    const period = hour < 12 ? "AM" : "PM"
    slots.push(`${hourFormatted.toString().padStart(2, "0")}:00 ${period}`)
  }

  return slots
}

// Get available time slots for a given date
export const getAvailableTimeSlots = (date: Date): string[] => {
  const dateKey = formatDateKey(date)
  const allSlots = getAllTimeSlots()

  // Get blocked slots for the date
  const blockedSlots = blockedTimeSlots[dateKey] || []

  // Get booked slots for the date
  const bookedSlots = bookedAppointments[dateKey] || []

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
  clientName: string,
  clientEmail: string,
  clientPhone: string,
): boolean => {
  const dateKey = formatDateKey(date)
  const availableSlots = getAvailableTimeSlots(date)

  if (!availableSlots.includes(timeSlot)) {
    return false
  }

  if (!bookedAppointments[dateKey]) {
    bookedAppointments[dateKey] = []
  }

  bookedAppointments[dateKey].push(timeSlot)

  // In a real app, we would store client details with the booking
  console.log(`Booked for ${clientName} on ${dateKey} at ${timeSlot}`)

  return true
}

// Get booked appointments for a date
export const getBookedAppointments = (date: Date): string[] => {
  const dateKey = formatDateKey(date)
  return bookedAppointments[dateKey] || []
}

