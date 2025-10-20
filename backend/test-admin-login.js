const axios = require('axios');

// Backend URL
const BASE_URL = 'http://localhost:5000/api/auth';

// Test admin login
async function testAdminLogin() {
  console.log('🧪 Testing Admin Login...\n');

  try {
    // Test 1: Valid admin credentials
    console.log('Test 1: Valid admin credentials');
    const validResponse = await axios.post(`${BASE_URL}/admin-login`, {
      username: 'admin',
      password: 'admin123'
    });

    if (validResponse.data.success) {
      console.log('✅ SUCCESS: Admin login successful');
      console.log('   User:', validResponse.data.data.user.username);
      console.log('   Role:', validResponse.data.data.user.role);
      console.log('   Token:', validResponse.data.data.token.substring(0, 50) + '...');
      
      // Test protected route with admin token
      console.log('\nTest 2: Accessing protected route with admin token');
      const profileResponse = await axios.get(`${BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${validResponse.data.data.token}`
        }
      });
      
      if (profileResponse.data.success) {
        console.log('✅ SUCCESS: Protected route accessible with admin token');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 200) {
      console.log('✅ SUCCESS: Request completed');
    } else {
      console.log('❌ ERROR:', error.response?.data?.message || error.message);
    }
  }

  // Test 3: Invalid credentials
  console.log('\nTest 3: Invalid admin credentials');
  try {
    await axios.post(`${BASE_URL}/admin-login`, {
      username: 'admin',
      password: 'wrongpassword'
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ SUCCESS: Invalid credentials rejected');
      console.log('   Message:', error.response.data.message);
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }

  // Test 4: Missing fields
  console.log('\nTest 4: Missing password field');
  try {
    await axios.post(`${BASE_URL}/admin-login`, {
      username: 'admin'
    });
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ SUCCESS: Request with missing fields rejected');
    } else {
      console.log('❌ ERROR:', error.message);
    }
  }

  console.log('\n✨ Admin login tests completed!\n');
}

// Run tests
testAdminLogin().catch(err => {
  console.error('Test execution failed:', err.message);
  console.error('\n⚠️  Make sure the backend server is running on port 5000');
});
