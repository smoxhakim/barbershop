"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Calendar, CalendarOff, AlertCircle } from "lucide-react"
import { blockDay, unblockDay, isDayBlocked } from "@/lib/bookingUtils"
import { useToast } from "@/hooks/use-toast"
import DatePicker from "@/components/booking/DatePicker"

interface DayManagerProps {
  onUpdate: () => void;
}

const DayManager: React.FC<DayManagerProps> = ({ onUpdate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  const handleBlockDay = async (date: Date) => {
    try {
      // Check if the day is already blocked
      const isBlocked = await isDayBlocked(date)
      
      if (isBlocked) {
        // If the day is already blocked, unblock it
        await unblockDay(date)
        toast({
          title: "Day Unblocked",
          description: `${format(date, 'MMMM d, yyyy')} is now available for bookings.`,
        })
      } else {
        // Otherwise, block it
        await blockDay(date)
        toast({
          title: "Day Blocked",
          description: `${format(date, 'MMMM d, yyyy')} has been marked as unavailable.`,
        })
      }
      
      // Trigger the update callback
      onUpdate()
    } catch (error) {
      console.error('Error managing day availability:', error)
      toast({
        title: "Error",
        description: "There was a problem updating the day's availability.",
        variant: "destructive"
      })
    }
  }

  return (
    <motion.div
      className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="font-medium text-center mb-4">Manage Blocked Days</h3>
      
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Block Entire Days</p>
            <p className="mt-1">
              Use this calendar to block entire days (holidays, days off, etc.). 
              Click on a date to toggle its availability.
            </p>
          </div>
        </div>
      </div>
      
      <DatePicker 
        date={selectedDate} 
        setDate={setSelectedDate} 
        isAdmin={true}
        onBlockDay={handleBlockDay}
      />
      
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2 text-sm">
          <CalendarOff className="h-4 w-4 text-destructive" />
          <span>Blocked days will be unavailable for booking</span>
        </div>
      </div>
    </motion.div>
  )
}

export default DayManager 