# Quick Test Guide - Bin Scheduling

## Overview
Quick reference for running Bin Scheduling tests (backend and frontend).

---

## 📦 Prerequisites

### Backend
```powershell
cd backend
npm install
```

### Frontend
```powershell
cd waste-management-app
npm install
```

---

## 🧪 Run Tests

### Backend Only (11 tests)
```powershell
cd backend
npm test __tests__/controllers/scheduling.test.js
```

**Expected Output:**
```
✅ PASS  __tests__/controllers/scheduling.test.js
  Scheduling - createRoute
    ✅ POSITIVE: Successful Route Scheduling
      ✓ should create a scheduled route with all required fields
      ✓ should create a route with multiple bins
      ✓ should create a route with assigned collector
    ❌ NEGATIVE: Failed Route Scheduling
      ✓ should fail without routeName
      ✓ should fail without scheduledDate
      ✓ should fail without scheduledTime
      ✓ should fail with empty bins array
  Scheduling - getAllRoutes
    ✅ POSITIVE: Get Scheduled Routes
      ✓ should retrieve all scheduled routes
      ✓ should filter routes by status
  Scheduling - updateRoute
    ✅ POSITIVE: Update Scheduled Route
      ✓ should update scheduled date and time
    ❌ NEGATIVE: Failed Route Update
      ✓ should not update in-progress route

Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
Time:        ~2.65s
```

### Frontend Only (47 tests)
```powershell
cd waste-management-app
npm test -- src/screens/Scheduling/__tests__/SchedulingScreen.test.js
```

**Expected Output:**
```
✅ PASS  src/screens/Scheduling/__tests__/SchedulingScreen.test.js
  SchedulingScreen Component
    ✅ POSITIVE: Component Rendering (10 tests)
    ✅ POSITIVE: Navigation (3 tests)
    ✅ POSITIVE: Layout and Structure (4 tests)
    ✅ POSITIVE: Text Content (7 tests)
    ✅ POSITIVE: Button Interaction (3 tests)
    ✅ POSITIVE: Context Integration (9 tests)
    ✅ POSITIVE: Screen State Management (3 tests)
    ✅ POSITIVE: Accessibility (3 tests)
    ✅ POSITIVE: Edge Cases (5 tests)

Test Suites: 1 passed, 1 total
Tests:       47 passed, 47 total
Time:        ~3.19s
```

### Both Backend + Frontend
```powershell
# Backend
cd backend
npm test __tests__/controllers/scheduling.test.js

# Frontend
cd ..\waste-management-app
npm test -- src/screens/Scheduling/__tests__/SchedulingScreen.test.js
```

---

## 📊 Test Files

| File | Location | Tests | Type |
|------|----------|-------|------|
| scheduling.test.js | backend/__tests__/controllers/ | 11 | Backend API |
| SchedulingScreen.test.js | waste-management-app/src/screens/Scheduling/__tests__/ | 47 | Frontend Component |

---

## ✅ Success Criteria

All tests should pass with:
- **Backend:** 11/11 passing ✅
- **Frontend:** 47/47 passing ✅
- **Total:** 58/58 passing ✅
- **Time:** <6 seconds total

---

## 🐛 Troubleshooting

### Backend Tests Failing?

**Issue:** MongoDB connection errors
```
Solution: Ensure mongodb-memory-server is installed:
cd backend
npm install --save-dev mongodb-memory-server
```

**Issue:** User validation errors (nic, dateOfBirth missing)
```
Solution: Tests already include these fields. Check your User model schema.
```

**Issue:** Bin enum validation errors
```
Solution: Use valid values:
- binType: 'General Waste', 'Recyclable', 'Organic', 'Hazardous'
- zone: 'Zone A', 'Zone B', 'Zone C', 'Zone D'
```

### Frontend Tests Failing?

**Issue:** Cannot find module errors
```
Solution: Ensure all dependencies installed:
cd waste-management-app
npm install
```

**Issue:** "Cannot read properties of undefined (reading 'goBack')"
```
Solution: Tests already mock navigation. Check jest.config.js for transform ignores.
```

**Issue:** "Found multiple elements with text"
```
Solution: Tests use getAllByText()[0] for multiple matches. This is expected behavior.
```

---

## 📝 Test Categories

### Backend (11 tests)
- ✅ Positive: Route creation (3 tests)
- ❌ Negative: Route creation failures (4 tests)
- ✅ Positive: Route retrieval (2 tests)
- ✅ Positive: Route updates (1 test)
- ❌ Negative: Route update failures (1 test)

### Frontend (47 tests)
- Component rendering (10 tests)
- Navigation (3 tests)
- Layout and structure (4 tests)
- Text content (7 tests)
- Button interaction (3 tests)
- Context integration (9 tests)
- Screen state management (3 tests)
- Accessibility (3 tests)
- Edge cases (5 tests)

---

## 🚀 Quick Commands Reference

```powershell
# Backend - Run scheduling tests only
cd backend ; npm test __tests__/controllers/scheduling.test.js

# Frontend - Run scheduling tests only
cd waste-management-app ; npm test -- src/screens/Scheduling/__tests__/SchedulingScreen.test.js

# Backend - Run all tests
cd backend ; npm test

# Frontend - Run all tests
cd waste-management-app ; npm test

# Backend - Run with coverage
cd backend ; npm test -- --coverage

# Frontend - Run with coverage
cd waste-management-app ; npm test -- --coverage
```

---

## 📈 Coverage Report

Run tests with coverage to see detailed report:

```powershell
# Backend coverage
cd backend
npm test -- --coverage __tests__/controllers/scheduling.test.js
```

Expected coverage:
- routeController.js: ~20-30%
- Route.js model: ~50-70%
- Bin.js model: ~50-60%
- User.js model: ~40-50%

---

## 🎯 Key Points

1. **All tests pass without modifying existing code** ✅
2. **Tests match actual implementation** ✅
3. **Mocks are properly configured** ✅
4. **Both positive and negative scenarios covered** ✅
5. **Total execution time: <6 seconds** ✅

---

## 📞 Need Help?

- Check `BIN_SCHEDULING_TESTS_SUMMARY.md` for detailed breakdown
- Review test files for implementation examples
- Ensure all dependencies installed: `npm install`
- Make sure Node.js and npm are up to date

---

*Quick Test Guide - Bin Scheduling*
*All 58 tests passing ✅*
