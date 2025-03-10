"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Layout from "@/components/Layout"
import DatePicker from "@/components/booking/DatePicker"
import { Clock, Plus, X } from "lucide-react"
import { getAllTimeSlots, getBlockedTimeSlots, blockTimeSlot, unblockTimeSlot } from "@/lib/bookingUtils"
import { useToast } from "@/hooks/use-toast"

const Admin: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  // Force re-render when slots are updated
  const [refreshKey, setRefreshKey] = useState(0)

  const allTimeSlots = getAllTimeSlots()
  const blockedSlots = selectedDate ? getBlockedTimeSlots(selectedDate) : []

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

  return (
    <Layout>
      <motion.div
        className="max-w-4xl mx-auto"
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
          <p className="text-muted-foreground">Manage availability and blocked time slots</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <DatePicker date={selectedDate} setDate={setSelectedDate} />
          </div>

          <div className="md:col-span-2">
            <motion.div
              className="rounded-lg bg-card/80 backdrop-blur-sm shadow-sm p-4"
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
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default Admin

