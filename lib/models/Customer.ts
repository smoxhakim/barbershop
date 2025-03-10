import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppointment extends Document {
  customerId: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const AppointmentSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['booked', 'completed', 'cancelled'], 
      default: 'booked' 
    },
  },
  { timestamps: true }
);

// Create models only if they don't exist (for Next.js hot reloading)
export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema); 