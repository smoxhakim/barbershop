"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "@/components/Layout"
import DatePicker from "@/components/booking/DatePicker"
import { Clock, Plus, X, User, Phone, Mail, Calendar, CalendarOff } from "lucide-react"
import { 
  getAllTimeSlots, 
  getBlockedTimeSlots, 
  blockTimeSlot, 
  unblockTimeSlot,
  getAllAppointments,
  getAppointmentsForDate,
  Customer,
  Appointment,
  isDayBlocked
} from "@/lib/bookingUtils"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import AppointmentManager from "@/components/admin/AppointmentManager"
import DayManager from "@/components/admin/DayManager"

interface AppointmentWithCustomer extends Appointment {
  customer: Customer;
}

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [appointments, setAppointments] = useState<AppointmentWithCustomer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'appointments' | 'timeSlots' | 'blockedDays'>('appointments')
  const { toast } = useToast()

  // Force re-render when slots are updated
  const [refreshKey, setRefreshKey] = useState(0)

  const allTimeSlots = getAllTimeSlots()
  const blockedSlots = selectedDate ? getBlockedTimeSlots(selectedDate) : []

  // Fetch appointments when the component mounts or when refreshKey changes
  useEffect(() => {
    fetchAppointments()
  }, [refreshKey])

  // Fetch appointments
  const fetchAppointments = () => {
    setIsLoading(true)
    try {
      // Get all appointments with customer data
      const allAppointments = getAllAppointments()
      setAppointments(allAppointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch appointments",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockSlot = (slot: string) => {
    if (!selectedDate) return

    blockTimeSlot(selectedDate, slot)
    toast({
      title: "Time Slot Blocked",
      description: `${slot} on ${selectedDate.toLocaleDateString()} has been blocked.`,
    })
    setRefreshKey((prev) => prev + 1)
  }

  const handleUnblockSlot = (slot: string) => {
    if (!selectedDate) return

    unblockTimeSlot(selectedDate, slot)
    toast({
      title: "Time Slot Unblocked",
      description: `${slot} on ${selectedDate.toLocaleDateString()} is now available.`,
    })
    setRefreshKey((prev) => prev + 1)
  }

  // Filter appointments by selected date
  const filteredAppointments = selectedDate 
    ? appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        const selectedDateStr = selectedDate.toISOString().split('T')[0]
        return appointmentDate.toISOString().split('T')[0] === selectedDateStr
      })
    : appointments

  // Handle appointment update
  const handleAppointmentUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <Layout>
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage appointments, time slots, and blocked days</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 p-1 bg-secondary/30 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'appointments' 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'timeSlots' 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
              onClick={() => setActiveTab('timeSlots')}
            >
              Time Slots
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'blockedDays' 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-background/50'
              }`}
              onClick={() => setActiveTab('blockedDays')}
            >
              Blocked Days
            </button>
          </div>
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>

            <div className="md:col-span-2">
              <motion.div
                className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="font-medium text-center mb-4">
                  {selectedDate 
                    ? `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}${
                        isDayBlocked(selectedDate) ? ' (Blocked Day)' : ''
                      }` 
                    : "All Appointments"}
                </h3>

                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading appointments...</p>
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentManager
                        key={appointment.id}
                        appointment={appointment}
                        onUpdate={handleAppointmentUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {selectedDate 
                        ? `No appointments for ${format(selectedDate, 'MMMM d, yyyy')}` 
                        : "No appointments found"}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Time Slots Tab */}
        {activeTab === 'timeSlots' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <DatePicker date={selectedDate} setDate={setSelectedDate} />
            </div>

            <div className="md:col-span-2">
              <motion.div
                className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                key={refreshKey} // Force re-render when slots change
              >
                <h3 className="font-medium text-center mb-4">
                  {selectedDate ? "Manage Time Slots" : "Select a Date First"}
                </h3>

                {selectedDate && (
                  <div className="space-y-4">
                    {isDayBlocked(selectedDate) ? (
                      <div className="p-4 bg-destructive/10 rounded-md text-center">
                        <CalendarOff className="h-5 w-5 mx-auto mb-2 text-destructive" />
                        <p className="text-sm font-medium text-destructive">
                          This day is blocked
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unblock this day in the "Blocked Days" tab to manage time slots
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-secondary/50 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Available Time Slots</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {allTimeSlots
                              .filter((slot) => !blockedSlots.includes(slot))
                              .map((slot) => (
                                <button
                                  key={slot}
                                  className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                                  onClick={() => handleBlockSlot(slot)}
                                >
                                  <span className="flex items-center">
                                    <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
                                    {slot}
                                  </span>
                                  <Plus className="h-4 w-4" />
                                </button>
                              ))}
                          </div>
                          {allTimeSlots.filter((slot) => !blockedSlots.includes(slot)).length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              All time slots are blocked for this date.
                            </p>
                          )}
                        </div>

                        <div className="p-3 bg-destructive/10 rounded-md">
                          <h4 className="text-sm font-medium mb-2">Blocked Time Slots</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {blockedSlots.map((slot) => (
                              <button
                                key={slot}
                                className="flex items-center justify-between py-2 px-3 rounded-md bg-destructive/20 hover:bg-destructive/30 text-sm transition-colors"
                                onClick={() => handleUnblockSlot(slot)}
                              >
                                <span className="flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-2 text-destructive" />
                                  {slot}
                                </span>
                                <X className="h-4 w-4" />
                              </button>
                            ))}
                          </div>
                          {blockedSlots.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                              No time slots are blocked for this date.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Blocked Days Tab */}
        {activeTab === 'blockedDays' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <DayManager onUpdate={() => setRefreshKey((prev) => prev + 1)} />
            </div>

            <div className="md:col-span-1">
              <motion.div
                className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className="font-medium text-center mb-4">About Blocked Days</h3>
                
                <div className="space-y-4 text-sm">
                  <p>
                    Blocked days are completely unavailable for booking. Use this feature for:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Holidays when the barbershop is closed</li>
                    <li>Staff training days</li>
                    <li>Maintenance or renovation periods</li>
                    <li>Personal days off</li>
                  </ul>
                  
                  <p className="pt-2">
                    <strong>Note:</strong> Blocking a day will make all time slots unavailable, 
                    even if they were previously available. Any existing appointments on blocked 
                    days will still be visible, but no new appointments can be booked.
                  </p>
                  
                  <div className="p-3 bg-primary/10 rounded-md mt-4">
                    <p className="font-medium text-primary">Pro Tip</p>
                    <p className="mt-1">
                      For temporary unavailability during a day (like lunch breaks), 
                      use the Time Slots tab instead to block specific hours.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  )
}

