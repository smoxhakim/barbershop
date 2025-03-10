"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAvailableTimeSlots } from "@/lib/bookingUtils"

interface TimeSlotsProps {
  selectedDate: Date | undefined
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ selectedDate, selectedTime, setSelectedTime }) => {
  // Get available time slots for the selected date
  const availableSlots = selectedDate ? getAvailableTimeSlots(selectedDate) : []

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  if (!selectedDate) {
    return (
      <div className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4 text-center">
        <p className="text-muted-foreground">Please select a date first</p>
      </div>
    )
  }

  return (
    <motion.div
      className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="font-medium text-center mb-4">Select a Time</h3>

      {availableSlots.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-muted-foreground">No available slots for this date</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {availableSlots.map((slot) => (
            <motion.button
              key={slot}
              className={cn(
                "flex items-center justify-center py-3 px-4 rounded-md transition-all",
                "border hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                selectedTime === slot
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/50 text-foreground hover:bg-secondary",
              )}
              onClick={() => setSelectedTime(slot)}
              variants={itemVariants}
            >
              <Clock
                className={cn("h-4 w-4 mr-2", selectedTime === slot ? "text-primary-foreground" : "text-primary")}
              />
              {slot}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default TimeSlots

