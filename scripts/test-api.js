// scripts/test-api.js
// A simple script to test the API endpoints

require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error with ${method} ${endpoint}:`, error);
    return { status: 500, error: error.message };
  }
}

// Test functions
async function testBookingEndpoints() {
  console.log('\n=== Testing Booking Endpoints ===');
  
  // Test GET /api/bookings
  console.log('\nGetting all bookings...');
  const allBookings = await makeRequest('/api/bookings');
  console.log(`Status: ${allBookings.status}`);
  console.log(`Found ${allBookings.data?.data?.length || 0} bookings`);
  
  // Test POST /api/bookings
  console.log('\nCreating a test booking...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0];
  
  // First create a customer to get a valid customerId
  const newCustomer = await makeRequest('/api/customers', 'POST', {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '123-456-7890'
  });
  
  let customerId;
  if (newCustomer.status === 201 || newCustomer.status === 200) {
    customerId = newCustomer.data?.data?._id;
    console.log(`Created customer with ID: ${customerId}`);
  } else {
    console.log('Failed to create customer, using dummy ID');
    customerId = '000000000000000000000000'; // Fallback dummy ID
  }
  
  const newBooking = await makeRequest('/api/bookings', 'POST', {
    customerId: customerId,
    date: formattedDate,
    time: '10:00',
    service: 'Haircut',
    status: 'booked',
    notes: 'Test booking from API test script'
  });
  
  console.log(`Status: ${newBooking.status}`);
  if (newBooking.status === 201 || newBooking.status === 200) {
    console.log('Successfully created booking');
    const bookingId = newBooking.data?.data?._id;
    
    // Test GET /api/bookings/:id
    if (bookingId) {
      console.log(`\nGetting booking with ID: ${bookingId}`);
      const singleBooking = await makeRequest(`/api/bookings/${bookingId}`);
      console.log(`Status: ${singleBooking.status}`);
      console.log('Booking details:', singleBooking.data?.data ? 'Retrieved successfully' : 'Failed to retrieve');
      
      // Test PUT /api/bookings/:id
      console.log(`\nUpdating booking with ID: ${bookingId}`);
      const updatedBooking = await makeRequest(`/api/bookings/${bookingId}`, 'PUT', {
        notes: 'Updated test booking note'
      });
      console.log(`Status: ${updatedBooking.status}`);
      console.log('Update result:', updatedBooking.data?.success ? 'Success' : 'Failed');
      
      // Test DELETE /api/bookings/:id
      console.log(`\nDeleting booking with ID: ${bookingId}`);
      const deleteResult = await makeRequest(`/api/bookings/${bookingId}`, 'DELETE');
      console.log(`Status: ${deleteResult.status}`);
      console.log('Delete result:', deleteResult.data?.success ? 'Success' : 'Failed');
    }
  } else {
    console.log('Failed to create booking:', newBooking.data?.error || 'Unknown error');
  }
}

async function testBlockedDaysEndpoints() {
  console.log('\n=== Testing Blocked Days Endpoints ===');
  
  // Test GET /api/blocked-days
  console.log('\nGetting all blocked days...');
  const allBlockedDays = await makeRequest('/api/blocked-days');
  console.log(`Status: ${allBlockedDays.status}`);
  console.log(`Found ${allBlockedDays.data?.data?.length || 0} blocked days`);
  
  // Test POST /api/blocked-days
  console.log('\nCreating a test blocked day...');
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const formattedDate = nextWeek.toISOString().split('T')[0];
  
  const newBlockedDay = await makeRequest('/api/blocked-days', 'POST', {
    date: formattedDate,
    reason: 'Test blocked day'
  });
  
  console.log(`Status: ${newBlockedDay.status}`);
  if (newBlockedDay.status === 201 || newBlockedDay.status === 200) {
    console.log('Successfully created blocked day');
    const blockedDayId = newBlockedDay.data?.data?._id;
    
    if (blockedDayId) {
      // Test GET /api/blocked-days/:id
      console.log(`\nGetting blocked day with ID: ${blockedDayId}`);
      const singleBlockedDay = await makeRequest(`/api/blocked-days/${blockedDayId}`);
      console.log(`Status: ${singleBlockedDay.status}`);
      console.log('Blocked day details:', singleBlockedDay.data?.data ? 'Retrieved successfully' : 'Failed to retrieve');
      
      // Test DELETE /api/blocked-days/:id
      console.log(`\nDeleting blocked day with ID: ${blockedDayId}`);
      const deleteResult = await makeRequest(`/api/blocked-days/${blockedDayId}`, 'DELETE');
      console.log(`Status: ${deleteResult.status}`);
      console.log('Delete result:', deleteResult.data?.success ? 'Success' : 'Failed');
    }
  } else {
    console.log('Failed to create blocked day:', newBlockedDay.data?.error || 'Unknown error');
  }
}

async function testBlockedTimeSlotsEndpoints() {
  console.log('\n=== Testing Blocked Time Slots Endpoints ===');
  
  // Test GET /api/blocked-slots
  console.log('\nGetting all blocked time slots...');
  const allBlockedSlots = await makeRequest('/api/blocked-slots');
  console.log(`Status: ${allBlockedSlots.status}`);
  console.log(`Found ${allBlockedSlots.data?.data?.length || 0} blocked time slots`);
  
  // Test POST /api/blocked-slots
  console.log('\nCreating a test blocked time slot...');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().split('T')[0];
  
  const newBlockedSlot = await makeRequest('/api/blocked-slots', 'POST', {
    date: formattedDate,
    time: '14:00',
    reason: 'Test blocked time slot'
  });
  
  console.log(`Status: ${newBlockedSlot.status}`);
  if (newBlockedSlot.status === 201 || newBlockedSlot.status === 200) {
    console.log('Successfully created blocked time slot');
    const blockedSlotId = newBlockedSlot.data?.data?._id;
    
    if (blockedSlotId) {
      // Test GET /api/blocked-slots/:id
      console.log(`\nGetting blocked time slot with ID: ${blockedSlotId}`);
      const singleBlockedSlot = await makeRequest(`/api/blocked-slots/${blockedSlotId}`);
      console.log(`Status: ${singleBlockedSlot.status}`);
      console.log('Blocked time slot details:', singleBlockedSlot.data?.data ? 'Retrieved successfully' : 'Failed to retrieve');
      
      // Test DELETE /api/blocked-slots/:id
      console.log(`\nDeleting blocked time slot with ID: ${blockedSlotId}`);
      const deleteResult = await makeRequest(`/api/blocked-slots/${blockedSlotId}`, 'DELETE');
      console.log(`Status: ${deleteResult.status}`);
      console.log('Delete result:', deleteResult.data?.success ? 'Success' : 'Failed');
    }
  } else {
    console.log('Failed to create blocked time slot:', newBlockedSlot.data?.error || 'Unknown error');
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting API Tests ===');
  console.log('Make sure your Next.js server is running on http://localhost:3000');
  
  try {
    await testBookingEndpoints();
    await testBlockedDaysEndpoints();
    await testBlockedTimeSlotsEndpoints();
    
    console.log('\n=== All Tests Completed ===');
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

runAllTests();
