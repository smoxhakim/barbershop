"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { CalendarCheck, CalendarX } from "lucide-react"
import { isDayBlockedClient } from "@/lib/clientBookingUtils"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  isAdmin?: boolean
  onBlockDay?: (date: Date) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  date, 
  setDate, 
  isAdmin = false,
  onBlockDay
}) => {
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

  // Handle day click for admin mode
  const handleDayClick = (day: Date | undefined) => {
    if (isAdmin && onBlockDay && day) {
      // If in admin mode and the onBlockDay function is provided, call it
      onBlockDay(day)
    } else {
      // Otherwise, just set the date
      setDate(day)
    }
  }

  return (
    <motion.div
      className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="font-medium text-center mb-4">
        {isAdmin ? "Manage Calendar" : "Select a Date"}
      </h3>
      
      {isAdmin && (
        <div className="mb-4 text-sm text-center">
          <p className="text-muted-foreground mb-2">
            {isAdmin ? "Click on a date to block/unblock it" : "Select an available date"}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
              <span>Blocked</span>
            </div>
          </div>
        </div>
      )}
      
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDayClick}
        disabled={(date) => {
          // In admin mode, don't disable any future dates
          if (isAdmin) {
            return date < today
          }
          
          // For regular users, disable past dates, Sundays, blocked days, and dates beyond 30 days
          return (
            date < today || 
            date.getDay() === 0 || 
            date > thirtyDaysLater || 
            isDayBlockedClient(date)
          )
        }}
        modifiers={{
          blocked: (date) => isDayBlockedClient(date),
        }}
        modifiersClassNames={{
          blocked: "bg-destructive/20 text-destructive hover:bg-destructive/30",
        }}
        className="mx-auto"
        footer={footer}
      />
    </motion.div>
  )
}

export default DatePicker

