import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  appointments?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
  },
  { timestamps: true }
);

// Create model only if it doesn't exist (for Next.js hot reloading)
export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;