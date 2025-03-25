// lib/api.ts
// Client-side API utility functions for interacting with the backend

import { AppointmentType } from '../types/appointment';
import { CustomerType } from '../types/customer';
import { BlockedDayType } from '../types/blockedDay';
import { BlockedTimeSlotType } from '../types/blockedTimeSlot';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Error handling helper
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An error occurred');
  }
  return response.json();
};

// Appointment API functions
export const fetchAppointments = async (
  date?: string,
  status?: string
): Promise<AppointmentType[]> => {
  let url = `${API_BASE_URL}/api/bookings`;
  const params = new URLSearchParams();
  
  if (date) params.append('date', date);
  if (status) params.append('status', status);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  const result = await handleResponse(response);
  
  // Map the response data to our AppointmentType
  return result.data.map((appointment: any): AppointmentType => ({
    id: appointment._id,
    date: new Date(appointment.date),
    time: appointment.time,
    service: appointment.service,
    status: appointment.status,
    notes: appointment.notes || '',
    customer: appointment.customerId ? {
      id: appointment.customerId._id,
      name: appointment.customerId.name,
      email: appointment.customerId.email,
      phone: appointment.customerId.phone
    } : undefined
  }));
};

export const fetchAppointment = async (id: string): Promise<AppointmentType> => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
  const result = await handleResponse(response);
  
  const appointment = result.data;
  return {
    id: appointment._id,
    date: new Date(appointment.date),
    time: appointment.time,
    service: appointment.service,
    status: appointment.status,
    notes: appointment.notes || '',
    customer: appointment.customerId ? {
      id: appointment.customerId._id,
      name: appointment.customerId.name,
      email: appointment.customerId.email,
      phone: appointment.customerId.phone
    } : undefined
  };
};

export const createAppointment = async (
  appointmentData: Omit<AppointmentType, 'id'> & { 
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }
): Promise<AppointmentType> => {
  const { 
    date, 
    time, 
    service, 
    status, 
    notes, 
    customerName, 
    customerEmail, 
    customerPhone 
  } = appointmentData;
  
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: date instanceof Date ? date.toISOString().split('T')[0] : date,
      time,
      service,
      status: status || 'booked',
      notes,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    }),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const updateAppointment = async (
  id: string,
  appointmentData: Partial<AppointmentType>
): Promise<AppointmentType> => {
  const { date, time, service, status, notes } = appointmentData;
  
  const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: date instanceof Date ? date.toISOString().split('T')[0] : date,
      time,
      service,
      status,
      notes
    }),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
    method: 'DELETE',
  });
  
  await handleResponse(response);
};

// Customer API functions
export const fetchCustomers = async (search?: string): Promise<CustomerType[]> => {
  let url = `${API_BASE_URL}/api/customers`;
  
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url);
  const result = await handleResponse(response);
  
  // Map the response data to our CustomerType
  return result.data.map((customer: any): CustomerType => ({
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone
  }));
};

export const fetchCustomer = async (id: string): Promise<CustomerType> => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`);
  const result = await handleResponse(response);
  
  const customer = result.data;
  return {
    id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone
  };
};

export const createCustomer = async (customerData: Omit<CustomerType, 'id'>): Promise<CustomerType> => {
  const response = await fetch(`${API_BASE_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const updateCustomer = async (
  id: string,
  customerData: Partial<CustomerType>
): Promise<CustomerType> => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
    method: 'DELETE',
  });
  
  await handleResponse(response);
};

// Blocked Days API functions
export const fetchBlockedDays = async (): Promise<BlockedDayType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-days`);
  const result = await handleResponse(response);
  
  // Map the response data to our BlockedDayType
  return result.data.map((blockedDay: any): BlockedDayType => ({
    id: blockedDay._id,
    date: new Date(blockedDay.date),
    reason: blockedDay.reason || ''
  }));
};

export const createBlockedDay = async (
  blockedDayData: Omit<BlockedDayType, 'id'>
): Promise<BlockedDayType> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-days`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: blockedDayData.date instanceof Date 
        ? blockedDayData.date.toISOString().split('T')[0] 
        : blockedDayData.date,
      reason: blockedDayData.reason
    }),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const deleteBlockedDay = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-days/${id}`, {
    method: 'DELETE',
  });
  
  await handleResponse(response);
};

// Blocked Time Slots API functions
export const fetchBlockedTimeSlots = async (): Promise<BlockedTimeSlotType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-slots`);
  const result = await handleResponse(response);
  
  // Map the response data to our BlockedTimeSlotType
  return result.data.map((blockedSlot: any): BlockedTimeSlotType => ({
    id: blockedSlot._id,
    date: new Date(blockedSlot.date),
    time: blockedSlot.time,
    reason: blockedSlot.reason || ''
  }));
};

export const createBlockedTimeSlot = async (
  blockedSlotData: Omit<BlockedTimeSlotType, 'id'>
): Promise<BlockedTimeSlotType> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: blockedSlotData.date instanceof Date 
        ? blockedSlotData.date.toISOString().split('T')[0] 
        : blockedSlotData.date,
      time: blockedSlotData.time,
      reason: blockedSlotData.reason
    }),
  });
  
  const result = await handleResponse(response);
  return result.data;
};

export const deleteBlockedTimeSlot = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/blocked-slots/${id}`, {
    method: 'DELETE',
  });
  
  await handleResponse(response);
};
