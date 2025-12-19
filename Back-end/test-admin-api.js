// Script test Admin API
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAdminAPI() {
  console.log('🔍 Testing Admin Stats API...\n');

  try {
    // Test 1: API không có params
    console.log('1. Testing GET /api/admin/stats (no params)...');
    const response1 = await axios.get(`${BASE_URL}/admin/stats`);
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response1.data, null, 2));
    console.log('');

    // Test 2: API với date range
    console.log('2. Testing GET /api/admin/stats?startDate=2024-01-01&endDate=2024-12-31...');
    const response2 = await axios.get(`${BASE_URL}/admin/stats`, {
      params: {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
    });
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response2.data, null, 2));
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is server running?');
    }
    process.exit(1);
  }
}

testAdminAPI();

