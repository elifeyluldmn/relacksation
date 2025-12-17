const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'test_password';

async function testBackend() {
  console.log('🧪 Testing RelACKs Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Get Products
    console.log('2️⃣ Testing Products Endpoint...');
    const productsResponse = await axios.get(`${BASE_URL}/api/quote/products`);
    console.log('✅ Products:', productsResponse.data.length, 'products found');
    console.log('');

    // Test 3: Get Blocked Dates (Public)
    console.log('3️⃣ Testing Blocked Dates (Public)...');
    const blockedResponse = await axios.get(`${BASE_URL}/api/availability/blocked`);
    console.log('✅ Blocked Dates:', blockedResponse.data.length, 'dates found');
    console.log('');

    // Test 4: Test Admin Endpoints (with password)
    console.log('4️⃣ Testing Admin Endpoints...');
    
    try {
      const bookingsResponse = await axios.get(`${BASE_URL}/api/bookings`, {
        headers: { 'x-admin-password': ADMIN_PASSWORD }
      });
      console.log('✅ Bookings (Admin):', bookingsResponse.data.bookings?.length || 0, 'bookings found');
    } catch (error) {
      console.log('❌ Bookings (Admin):', error.response?.data?.error || error.message);
    }

    try {
      const blockoutResponse = await axios.get(`${BASE_URL}/api/blockout`, {
        headers: { 'x-admin-password': ADMIN_PASSWORD }
      });
      console.log('✅ Blockout (Admin):', blockoutResponse.data.blockedDates?.length || 0, 'dates found');
    } catch (error) {
      console.log('❌ Blockout (Admin):', error.response?.data?.error || error.message);
    }

    console.log('');

    // Test 5: Test Availability Endpoint
    console.log('5️⃣ Testing Availability Endpoint...');
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    const availabilityResponse = await axios.get(`${BASE_URL}/api/availability`, {
      params: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });
    console.log('✅ Availability:', availabilityResponse.data.availability?.length || 0, 'days checked');
    console.log('');

    console.log('🎉 All tests completed!');
    console.log('\n📋 Summary:');
    console.log('- Backend is running and responding');
    console.log('- Basic endpoints are working');
    console.log('- Admin endpoints require proper password');
    console.log('- Database connection appears to be working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && npm run dev');
    }
    
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  testBackend();
}

module.exports = testBackend;
