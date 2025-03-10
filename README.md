# Modern Cuts Barbershop - Appointment Booking System

A full-stack Next.js application for a barbershop appointment booking system with customer information storage and admin dashboard.

## Features

- **Customer-facing booking system**:
  - Date and time slot selection
  - Customer information collection and storage
  - Booking confirmation
  
- **Admin dashboard**:
  - Manage available time slots
  - View all customer appointments
  - Filter appointments by date
  - View customer details

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with Mongoose)
- **Styling**: Tailwind CSS with shadcn/ui components

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database (local or cloud-based like MongoDB Atlas or Neon)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd modern-cuts-barbershop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # MongoDB connection string (replace with your actual MongoDB connection string)
   MONGODB_URI=mongodb://localhost:27017/barbershop
   
   # Next.js environment variables
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Schema

### Customer Collection

```typescript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Collection

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (reference to Customer),
  date: Date,
  time: String,
  status: String (enum: 'booked', 'completed', 'cancelled'),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- **POST /api/bookings**: Create a new booking
  - Request body: `{ name, email, phone, date, time }`
  - Response: `{ success, data: { appointment, customer } }`

- **GET /api/bookings**: Get all bookings
  - Response: `{ success, data: [appointments] }`

- **GET /api/customers**: Get all customers
  - Response: `{ success, data: [customers] }`

## Usage

### Customer Booking Flow

1. Visit the homepage and click "Book Now"
2. Select a date from the calendar
3. Choose an available time slot
4. Fill in your personal information
5. Confirm the booking
6. Receive a booking confirmation

### Admin Dashboard

1. Visit `/admin` to access the admin dashboard
2. View all appointments
3. Select a date to filter appointments
4. Manage time slot availability by blocking/unblocking slots

## Deployment

This application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

Make sure to set the environment variables in your deployment platform's settings.

## License

[MIT](LICENSE) 