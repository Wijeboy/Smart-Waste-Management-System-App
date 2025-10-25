// Quick test script to verify credit points API endpoint
const testUserId = '68fb6d72db66a95c311a8f7f'; // Namal Perera

console.log('Testing Credit Points API endpoint...\n');
console.log(`User ID: ${testUserId}`);
console.log(`URL: http://localhost:3001/api/users/${testUserId}/credit-points`);
console.log('\nNote: You need to have a valid JWT token to test this endpoint.');
console.log('\nTo test:');
console.log('1. Login as a resident to get a token');
console.log('2. Use that token in Authorization header');
console.log('3. Make GET request to the URL above');
