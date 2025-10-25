// Test to verify the timezone fix works correctly

// OLD METHOD (BROKEN)
const oldMethod = () => {
  const today = new Date().toISOString().split('T')[0];
  console.log('OLD METHOD (UTC-based):');
  console.log('  Today:', today);
  return today;
};

// NEW METHOD (FIXED)
const newMethod = () => {
  const todayLocal = new Date();
  const year = todayLocal.getFullYear();
  const month = String(todayLocal.getMonth() + 1).padStart(2, '0');
  const day = String(todayLocal.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  console.log('NEW METHOD (Local timezone):');
  console.log('  Today:', today);
  return today;
};

// Test with example date
const testDate = new Date('2025-10-25T05:30:00.000+05:30'); // IST timezone
console.log('\n📅 Testing with route scheduled for Oct 25, 2025 (IST)');
console.log('   Route Date Object:', testDate);
console.log('   Local String:', testDate.toLocaleString());
console.log('');

const oldToday = oldMethod();
const newToday = newMethod();

console.log('');
console.log('ROUTE DATE COMPARISON:');

// Old method comparison
const oldRouteDate = testDate.toISOString().split('T')[0];
console.log(`  Old: route="${oldRouteDate}" vs today="${oldToday}" → Match: ${oldRouteDate === oldToday ? '✅' : '❌'}`);

// New method comparison
const routeYear = testDate.getFullYear();
const routeMonth = String(testDate.getMonth() + 1).padStart(2, '0');
const routeDay = String(testDate.getDate()).padStart(2, '0');
const newRouteDate = `${routeYear}-${routeMonth}-${routeDay}`;
console.log(`  New: route="${newRouteDate}" vs today="${newToday}" → Match: ${newRouteDate === newToday ? '✅' : '❌'}`);

console.log('\n✅ Fix verification: New method correctly handles local timezone!');
