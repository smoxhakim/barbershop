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
  updatedAt: Date,
  appointments: [ObjectId] (references to Appointment)
}
```

### Appointment Collection

```typescript
{
  _id: ObjectId,
  customerId: ObjectId (reference to Customer),
  date: Date,
  time: String,
  service: String,
  status: String (enum: 'booked', 'completed', 'cancelled', 'no-show'),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### BlockedDay Collection

```typescript
{
  _id: ObjectId,
  date: Date,
  reason: String,
  createdAt: Date,
  updatedAt: Date
}
```

### BlockedTimeSlot Collection

```typescript
{
  _id: ObjectId,
  date: Date,
  time: String,
  reason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Bookings

- **POST /api/bookings**: Create a new booking
  - Request body: `{ date, time, service, customer: { name, email, phone }, notes }`
  - Response: `{ success, data: { appointment } }`

- **GET /api/bookings**: Get all bookings
  - Query params: `date` (optional), `status` (optional)
  - Response: `{ success, data: [appointments] }`

- **GET /api/bookings/:id**: Get a specific booking
  - Response: `{ success, data: appointment }`

- **PUT /api/bookings/:id**: Update a booking
  - Request body: `{ date, time, service, status, notes }`
  - Response: `{ success, data: appointment }`

- **DELETE /api/bookings/:id**: Delete a booking
  - Response: `{ success, message: 'Appointment deleted successfully' }`

### Customers

- **POST /api/customers**: Create a new customer
  - Request body: `{ name, email, phone }`
  - Response: `{ success, data: customer, message: 'Customer created successfully' }`

- **GET /api/customers**: Get all customers
  - Query params: `search` (optional)
  - Response: `{ success, data: [customers] }`

- **GET /api/customers/:id**: Get a specific customer
  - Response: `{ success, data: customer }`

- **PUT /api/customers/:id**: Update a customer
  - Request body: `{ name, email, phone }`
  - Response: `{ success, data: customer }`

- **DELETE /api/customers/:id**: Delete a customer
  - Response: `{ success, message: 'Customer deleted successfully' }`

### Blocked Days

- **POST /api/blocked-days**: Create a new blocked day
  - Request body: `{ date, reason }`
  - Response: `{ success, data: blockedDay }`

- **GET /api/blocked-days**: Get all blocked days
  - Response: `{ success, data: [blockedDays] }`

- **GET /api/blocked-days/:id**: Get a specific blocked day
  - Response: `{ success, data: blockedDay }`

- **PUT /api/blocked-days/:id**: Update a blocked day
  - Request body: `{ date, reason }`
  - Response: `{ success, data: blockedDay }`

- **DELETE /api/blocked-days/:id**: Delete a blocked day
  - Response: `{ success, message: 'Blocked day deleted successfully' }`

### Blocked Time Slots

- **POST /api/blocked-slots**: Create a new blocked time slot
  - Request body: `{ day, time, reason }`
  - Response: `{ success, data: blockedTimeSlot }`

- **GET /api/blocked-slots**: Get all blocked time slots
  - Response: `{ success, data: [blockedTimeSlots] }`

- **GET /api/blocked-slots/:id**: Get a specific blocked time slot
  - Response: `{ success, data: blockedTimeSlot }`

- **PUT /api/blocked-slots/:id**: Update a blocked time slot
  - Request body: `{ day, time, reason }`
  - Response: `{ success, data: blockedTimeSlot }`

- **DELETE /api/blocked-slots/:id**: Delete a blocked time slot
  - Response: `{ success, message: 'Blocked time slot deleted successfully' }`

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

## Testing

### API Testing

A test script is provided to verify the functionality of the API endpoints. This script tests all CRUD operations for bookings, customers, blocked days, and blocked time slots.

To run the API tests:

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. In a separate terminal, run the test script:
   ```bash
   npm run test-api
   ```

The test script will output the results of each API call, allowing you to verify that all endpoints are functioning correctly.

### Manual Testing

You can also test the API endpoints manually using tools like Postman or cURL. Refer to the API Endpoints section for details on the available endpoints and their expected request/response formats.

## Deployment

This application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

### Vercel Deployment

1. Create a Vercel account if you don't have one already
2. Connect your GitHub repository to Vercel
3. Configure the following environment variables in Vercel:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_APP_URL`: The URL of your deployed application
4. Deploy the application

Make sure to set the environment variables in your deployment platform's settings.

## License

[MIT](LICENSE) 