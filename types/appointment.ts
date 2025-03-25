// types/appointment.ts
import { CustomerType } from '../types/customer';

export type AppointmentStatus = 'booked' | 'completed' | 'cancelled' | 'no-show';

export interface AppointmentType {
  id: string;
  date: Date;
  time: string;
  service: string;
  status: AppointmentStatus;
  notes?: string;
  customer?: CustomerType;
}

export interface AppointmentFormData {
  date: Date;
  time: string;
  service: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
}
