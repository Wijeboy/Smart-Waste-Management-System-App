/**
 * Test Registration Endpoint
 * Quick script to test if registration is working from backend
 */

const testData = {
  firstName: "Test",
  lastName: "User",
  username: "testuser123",
  email: "test@example.com",
  password: "password123",
  nic: "123456789V",
  dateOfBirth: "1990-01-01",
  phoneNo: "0771234567"
};

console.log('Testing Registration Endpoint...');
console.log('Backend URL: http://localhost:5000/api/auth/register');
console.log('Test Data:', testData);
console.log('\n');

fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
  .then(response => {
    console.log('Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ SUCCESS! Registration endpoint is working!');
      console.log('User ID:', data.data.user.id);
      console.log('Token received:', data.data.token ? 'Yes' : 'No');
    } else {
      console.log('\n❌ FAILED! Error:', data.message);
    }
  })
  .catch(error => {
    console.error('\n❌ ERROR!');
    console.error('Error message:', error.message);
    console.error('Make sure the backend server is running on port 5000');
  });
