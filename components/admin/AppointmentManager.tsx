"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash, 
  Check, 
  X, 
  User, 
  Phone, 
  Mail,
  MessageSquare
} from "lucide-react"
import { 
  updateAppointment, 
  cancelAppointment, 
  Appointment, 
  Customer 
} from "@/lib/bookingUtils"
import { useToast } from "@/hooks/use-toast"

interface AppointmentWithCustomer extends Appointment {
  customer: Customer;
}

interface AppointmentManagerProps {
  appointment: AppointmentWithCustomer;
  onUpdate: () => void;
}

const AppointmentManager: React.FC<AppointmentManagerProps> = ({ 
  appointment, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [status, setStatus] = useState<'booked' | 'completed' | 'cancelled'>(appointment.status)
  const [notes, setNotes] = useState(appointment.notes || "")
  const { toast } = useToast()

  const handleStatusChange = async () => {
    try {
      const result = await updateAppointment(appointment.id, { status })
      
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Appointment status changed to ${status}`,
        })
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: "Failed to update appointment status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleNotesUpdate = async () => {
    try {
      const result = await updateAppointment(appointment.id, { notes })
      
      if (result.success) {
        toast({
          title: "Notes Updated",
          description: "Appointment notes have been updated",
        })
        setIsEditing(false)
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: "Failed to update appointment notes",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleCancelAppointment = async () => {
    try {
      const result = await cancelAppointment(appointment.id)
      
      if (result.success) {
        toast({
          title: "Appointment Cancelled",
          description: "The appointment has been cancelled",
        })
        setIsDeleting(false)
        onUpdate()
      } else {
        toast({
          title: "Error",
          description: "Failed to cancel appointment",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 border rounded-md hover:bg-secondary/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-medium flex items-center">
            <User className="h-4 w-4 mr-2" />
            {appointment.customer.name}
          </h4>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <Mail className="h-3.5 w-3.5 mr-2" />
            {appointment.customer.email}
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-1">
            <Phone className="h-3.5 w-3.5 mr-2" />
            {appointment.customer.phone}
          </p>
        </div>
        <div>
          <p className="text-sm flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            {format(new Date(appointment.date), 'MMMM d, yyyy')}
          </p>
          <p className="text-sm flex items-center mt-1">
            <Clock className="h-3.5 w-3.5 mr-2" />
            {appointment.time}
          </p>
          <div className="flex items-center mt-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'booked' | 'completed' | 'cancelled')}
              className="text-xs px-2 py-1 rounded-md border mr-2 bg-background"
            >
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              onClick={handleStatusChange}
              className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between mb-2">
          <h5 className="text-sm font-medium flex items-center">
            <MessageSquare className="h-3.5 w-3.5 mr-2" />
            Notes
          </h5>
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs p-1 rounded-md hover:bg-secondary"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleNotesUpdate}
                  className="text-xs p-1 rounded-md hover:bg-green-100 text-green-600"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs p-1 rounded-md hover:bg-red-100 text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            placeholder="Add notes about this appointment..."
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            {notes || "No notes for this appointment."}
          </p>
        )}
      </div>

      {/* Cancel Appointment */}
      <div className="mt-4 pt-4 border-t flex justify-end">
        {!isDeleting ? (
          <button
            onClick={() => setIsDeleting(true)}
            className="text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center"
          >
            <Trash className="h-3.5 w-3.5 mr-1" />
            Cancel Appointment
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <p className="text-xs text-destructive">Are you sure?</p>
            <button
              onClick={handleCancelAppointment}
              className="text-xs px-2 py-1 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => setIsDeleting(false)}
              className="text-xs px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80"
            >
              No, Keep
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentManager 