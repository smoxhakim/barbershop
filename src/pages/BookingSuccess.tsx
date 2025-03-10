"use client"

import type React from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { CheckCircle, Calendar, Clock } from "lucide-react"
import Layout from "@/components/Layout"
import MotionCard from "@/components/ui/MotionCard"

interface BookingState {
  name: string
  date: Date
  time: string
}

const BookingSuccess: React.FC = () => {
  const location = useLocation()
  const bookingDetails = location.state as BookingState

  // Redirect to booking page if no booking details
  if (!bookingDetails) {
    return <Navigate to="/booking" replace />
  }

  const { name, date, time } = bookingDetails

  // Format the date for display
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Layout>
      <motion.div
        className="max-w-2xl mx-auto py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground max-w-md">
            Your appointment has been successfully booked. We look forward to seeing you soon!
          </p>
        </motion.div>

        <MotionCard
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-xl font-medium mb-4">Booking Details</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 mt-0.5 flex-shrink-0">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 mt-0.5 flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">{time}</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your email address. Please arrive 10 minutes before your
                appointment time.
              </p>
            </div>
          </div>
        </MotionCard>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            to="/"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </Layout>
  )
}

export default BookingSuccess

