"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  selectedDate: Date | undefined
  selectedTime: string | null
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, selectedTime }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, we would send this data to the server
      console.log({
        name,
        email,
        phone,
        date: selectedDate,
        time: selectedTime,
      })

      setIsSubmitting(false)

      // Navigate to success page
      navigate("/booking-success", {
        state: {
          name,
          date: selectedDate,
          time: selectedTime,
        },
      })
    }, 1500)
  }

  if (!selectedDate || !selectedTime) {
    return null
  }

  return (
    <motion.div
      className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="font-medium text-center mb-4">Your Information</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 bg-primary text-primary-foreground rounded-md transition-all
              ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"}`}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default BookingForm

