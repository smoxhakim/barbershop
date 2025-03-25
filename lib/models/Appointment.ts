import mongoose, { Schema, Document } from 'mongoose';
import { AppointmentStatus } from '../../types/appointment';

export interface IAppointment extends Document {
  customerId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Customer', 
      required: true 
    },
    date: { 
      type: Date, 
      required: true 
    },
    time: { 
      type: String, 
      required: true 
    },
    service: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['booked', 'completed', 'cancelled', 'no-show'], 
      default: 'booked' 
    },
    notes: { 
      type: String 
    },
  },
  { timestamps: true }
);

// Create model only if it doesn't exist (for Next.js hot reloading)
export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

export default Appointment;
