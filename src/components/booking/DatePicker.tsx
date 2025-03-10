"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { CalendarCheck } from "lucide-react"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  // Get available days (excluding past days)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Define days for next 30 days availability
  const thirtyDaysLater = new Date()
  thirtyDaysLater.setDate(today.getDate() + 30)

  // Custom footer for the calendar
  const footer = (
    <div className="pt-4 text-sm text-muted-foreground flex items-center justify-center">
      <CalendarCheck className="h-4 w-4 mr-2" />
      <span>Book up to 30 days in advance</span>
    </div>
  )

  return (
    <motion.div
      className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-medium text-center mb-4">Select a Date</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) => {
          // Disable past dates, Sundays (day 0), and dates beyond 30 days from today
          return date < today || date.getDay() === 0 || date > thirtyDaysLater
        }}
        className="mx-auto"
        footer={footer}
      />
    </motion.div>
  )
}

export default DatePicker

