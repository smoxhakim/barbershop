"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Layout from "@/components/Layout"
import DatePicker from "@/components/booking/DatePicker"
import TimeSlots from "@/components/booking/TimeSlots"
import BookingForm from "@/components/booking/BookingForm"
import { fadeIn } from "@/lib/motionVariants"

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const timeSlotsRef = useRef<HTMLDivElement>(null)
  const bookingFormRef = useRef<HTMLDivElement>(null)

  // Effect for smooth scrolling to time slots after date selection
  useEffect(() => {
    if (selectedDate && timeSlotsRef.current) {
      timeSlotsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [selectedDate])

  // Effect for smooth scrolling to booking form after time selection
  useEffect(() => {
    if (selectedTime && bookingFormRef.current) {
      bookingFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [selectedTime])

  return (
    <Layout>
      <motion.div className="max-w-4xl mx-auto" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold mb-2">Book Your Appointment</h1>
          <p className="text-muted-foreground">Select a date and time that works for you</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DatePicker
              date={selectedDate}
              setDate={(date) => {
                setSelectedDate(date)
                setSelectedTime(null)
              }}
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div ref={timeSlotsRef}>
              <TimeSlots selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            </div>

            <div ref={bookingFormRef}>
              <BookingForm selectedDate={selectedDate} selectedTime={selectedTime} />
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default Booking

