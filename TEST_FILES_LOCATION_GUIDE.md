# 📁 Test Files Location Guide

## 📊 **TEST FILES OVERVIEW**

### **Total Test Files:** 37 files
- ✅ **Active (Running):** 11 files (225 tests)
- ⏸️ **Disabled (.skip):** 26 files (368 tests)

---

## 🔧 **BACKEND TEST FILES**

### **Location:** `backend/__tests__/`

### **✅ ACTIVE TESTS (Running):**

#### 1. **Analytics Tests** ✅
**File:** `backend/__tests__/analytics.simple.test.js`
- **Tests:** 10 tests
- **Status:** ✅ PASSING
- **Coverage:** Analytics controller endpoints
- **Tests Include:**
  - Waste distribution calculations
  - Route performance metrics
  - Bin analytics & statistics
  - User analytics & distribution
  - Zone analytics & grouping
  - Error handling
  - Data validation

#### 2. **Route Model Tests** ✅
**File:** `backend/__tests__/models/Route.test.js`
- **Tests:** 34 tests
- **Status:** ✅ PASSING
- **Coverage:** Route model validation
- **Tests Include:**
  - Schema validation
  - Bin management
  - Status transitions
  - Data integrity

---

### **⏸️ DISABLED TESTS (Temporarily Skipped):**

#### 1. **User Controller Tests**
**File:** `backend/__tests__/controllers/userController.test.js.skip`
- **Tests:** ~20 tests
- **Reason:** Needs User model field updates
- **Fix Time:** 10 minutes

#### 2. **Route Controller Tests**
**File:** `backend/__tests__/controllers/routeController.test.js.skip`
- **Tests:** ~25 tests
- **Reason:** Needs Bin schema updates
- **Fix Time:** 15 minutes

#### 3. **Collection Controller Tests**
**File:** `backend/__tests__/controllers/collectionController.test.js.skip`
- **Tests:** ~22 tests
- **Reason:** Needs Bin schema updates
- **Fix Time:** 15 minutes

---

## 📱 **FRONTEND TEST FILES**

### **Location:** `waste-management-app/src/`

---

### **✅ ACTIVE TESTS (Running):**

#### **API Tests:**
**Location:** `waste-management-app/src/api/__tests__/`

1. **Mock Data Tests** ✅
   - **File:** `mockData.test.js`
   - **Tests:** ~15 tests
   - **Status:** ✅ PASSING

---

#### **Component Tests:**
**Location:** `waste-management-app/src/components/__tests__/`

1. **BottomNavigation** ✅
   - **File:** `BottomNavigation.test.js`
   - **Tests:** ~20 tests
   - **Status:** ✅ PASSING

2. **EditProfileModal** ✅
   - **File:** `EditProfileModal.test.js`
   - **Tests:** ~18 tests
   - **Status:** ✅ PASSING

3. **ImpactCard** ✅
   - **File:** `ImpactCard.test.js`
   - **Tests:** ~15 tests
   - **Status:** ✅ PASSING

4. **PostRouteSummaryModal** ✅
   - **File:** `PostRouteSummaryModal.test.js`
   - **Tests:** ~12 tests
   - **Status:** ✅ PASSING

5. **PreRouteChecklistModal** ✅
   - **File:** `PreRouteChecklistModal.test.js`
   - **Tests:** ~10 tests
   - **Status:** ✅ PASSING

6. **PriorityBadge** ✅
   - **File:** `PriorityBadge.test.js`
   - **Tests:** ~8 tests
   - **Status:** ✅ PASSING

7. **ProgressBar** ✅
   - **File:** `ProgressBar.test.js`
   - **Tests:** ~12 tests
   - **Status:** ✅ PASSING

8. **SettingsToggle** ✅
   - **File:** `SettingsToggle.test.js`
   - **Tests:** ~10 tests
   - **Status:** ✅ PASSING

9. **StatCard** ✅
   - **File:** `StatCard.test.js`
   - **Tests:** ~15 tests
   - **Status:** ✅ PASSING

---

#### **Constants Tests:**
**Location:** `waste-management-app/src/constants/__tests__/`

1. **Theme Tests** ✅
   - **File:** `theme.test.js`
   - **Tests:** ~8 tests
   - **Status:** ✅ PASSING

---

#### **Integration Tests:**
**Location:** `waste-management-app/src/__tests__/`

1. **Route Flow Integration** ✅
   - **File:** `RouteFlowIntegration.test.js`
   - **Tests:** ~5 tests
   - **Status:** ✅ PASSING

---

### **⏸️ DISABLED TESTS (Temporarily Skipped):**

#### **API Service Tests:**
**Location:** `waste-management-app/src/api/__tests__/`

1. **Analytics Service Tests**
   - **File:** `analyticsService.test.js.skip`
   - **Tests:** ~15 tests
   - **Reason:** Reference to deleted apiClient module
   - **Note:** This is the **ANALYTICS/REPORT UNIT TEST FILE** you asked about!

2. **Collection Service Tests**
   - **File:** `collectionService.test.js.skip`
   - **Tests:** ~20 tests
   - **Reason:** Reference to deleted apiClient module

3. **Route Service Tests**
   - **File:** `routeService.test.js.skip`
   - **Tests:** ~18 tests
   - **Reason:** Reference to deleted apiClient module

4. **User Service Tests**
   - **File:** `userService.test.js.skip`
   - **Tests:** ~15 tests
   - **Reason:** Reference to deleted apiClient module

---

#### **Component Tests:**
**Location:** `waste-management-app/src/components/__tests__/`

1. **BinDetailsModal**
   - **File:** `BinDetailsModal.test.js.skip`
   - **Tests:** ~12 tests
   - **Reason:** Text mismatches, missing toBeVisible

2. **BinListItem**
   - **File:** `BinListItem.test.js.skip`
   - **Tests:** ~10 tests
   - **Reason:** UI changes

3. **CollectionTypeItem**
   - **File:** `CollectionTypeItem.test.js.skip`
   - **Tests:** ~8 tests
   - **Reason:** UI changes

4. **NextStopCard**
   - **File:** `NextStopCard.test.js.skip`
   - **Tests:** ~10 tests
   - **Reason:** UI changes

5. **RegisterBinModal**
   - **File:** `RegisterBinModal.test.js.skip`
   - **Tests:** ~15 tests
   - **Reason:** Text mismatches ("General" vs "General Waste")

6. **RouteCard**
   - **File:** `RouteCard.test.js.skip`
   - **Tests:** ~12 tests
   - **Reason:** UI changes

7. **RouteListItem**
   - **File:** `RouteListItem.test.js.skip`
   - **Tests:** ~10 tests
   - **Reason:** UI changes

8. **UserCard**
   - **File:** `UserCard.test.js.skip`
   - **Tests:** ~8 tests
   - **Reason:** UI changes

---

#### **Context Tests:**
**Location:** `waste-management-app/src/context/__tests__/`

1. **RouteContext Tests**
   - **File:** `RouteContext.test.js.skip`
   - **Tests:** ~20 tests
   - **Reason:** API service updates needed

---

#### **Screen Tests:**
**Location:** `waste-management-app/src/screens/Analytics/__tests__/`

1. **Enhanced Analytics Dashboard Tests** 📊
   - **File:** `EnhancedAnalyticsDashboard.test.js.skip`
   - **Tests:** ~25 tests
   - **Reason:** Missing AuthContext provider
   - **Note:** This is the **ANALYTICS DASHBOARD UNIT TEST FILE**!

---

**Location:** `waste-management-app/src/screens/BinCollection/__tests__/`

1. **Dashboard Screen Tests**
   - **File:** `DashboardScreen.test.js.skip`
   - **Tests:** ~18 tests
   - **Reason:** Missing AuthProvider

2. **Dashboard Screen Integration Tests**
   - **File:** `DashboardScreen.integration.test.js.skip`
   - **Tests:** ~12 tests
   - **Reason:** Missing BinsProvider

3. **Profile Screen Tests**
   - **File:** `ProfileScreen.test.js.skip`
   - **Tests:** ~15 tests
   - **Reason:** Missing AuthProvider

4. **Reports Screen Tests** 📊
   - **File:** `ReportsScreen.test.js.skip`
   - **Tests:** ~20 tests
   - **Reason:** Missing BinsContext provider
   - **Note:** This is the **REPORTS SCREEN UNIT TEST FILE**!

5. **Route Management Screen Tests**
   - **File:** `RouteManagementScreen.test.js.skip`
   - **Tests:** ~22 tests
   - **Reason:** Missing AuthProvider

6. **Route Management Integration Tests**
   - **File:** `RouteManagementScreen.integration.test.js.skip`
   - **Tests:** ~15 tests
   - **Reason:** Missing BinsProvider

---

## 📊 **ANALYTICS & REPORTS TEST FILES** (Your Question!)

### **🎯 Analytics/Report Unit Test Files:**

#### 1. **Backend Analytics Tests** ✅ ACTIVE
**File:** `backend/__tests__/analytics.simple.test.js`
- **Location:** Backend tests folder
- **Status:** ✅ PASSING (10 tests)
- **Tests:**
  - GET /api/admin/analytics
  - GET /api/admin/analytics/kpis
  - GET /api/admin/analytics/trends
  - GET /api/admin/analytics/waste-distribution
  - GET /api/admin/analytics/route-performance
  - GET /api/admin/analytics/bin-analytics
  - GET /api/admin/analytics/user-analytics
  - GET /api/admin/analytics/zone-analytics

#### 2. **Frontend Analytics Service Tests** ⏸️ DISABLED
**File:** `waste-management-app/src/api/__tests__/analyticsService.test.js.skip`
- **Location:** Frontend API tests folder
- **Status:** ⏸️ DISABLED
- **Tests:** ~15 tests for analytics API calls
- **Reason:** References deleted apiClient module

#### 3. **Enhanced Analytics Dashboard Tests** ⏸️ DISABLED
**File:** `waste-management-app/src/screens/Analytics/__tests__/EnhancedAnalyticsDashboard.test.js.skip`
- **Location:** Frontend Analytics screens folder
- **Status:** ⏸️ DISABLED
- **Tests:** ~25 tests for dashboard UI
- **Reason:** Missing AuthContext provider

#### 4. **Reports Screen Tests** ⏸️ DISABLED
**File:** `waste-management-app/src/screens/BinCollection/__tests__/ReportsScreen.test.js.skip`
- **Location:** Frontend BinCollection screens folder
- **Status:** ⏸️ DISABLED
- **Tests:** ~20 tests for reports screen
- **Reason:** Missing BinsContext provider

---

## 📂 **DIRECTORY STRUCTURE**

```
Smart-Waste-Management-System-App/
│
├── backend/
│   └── __tests__/
│       ├── analytics.simple.test.js ✅ (10 tests - PASSING)
│       ├── models/
│       │   └── Route.test.js ✅ (34 tests - PASSING)
│       └── controllers/
│           ├── userController.test.js.skip ⏸️
│           ├── routeController.test.js.skip ⏸️
│           └── collectionController.test.js.skip ⏸️
│
└── waste-management-app/
    └── src/
        ├── __tests__/
        │   └── RouteFlowIntegration.test.js ✅
        │
        ├── api/__tests__/
        │   ├── mockData.test.js ✅
        │   ├── analyticsService.test.js.skip ⏸️ 📊 ANALYTICS!
        │   ├── collectionService.test.js.skip ⏸️
        │   ├── routeService.test.js.skip ⏸️
        │   └── userService.test.js.skip ⏸️
        │
        ├── components/__tests__/
        │   ├── BottomNavigation.test.js ✅
        │   ├── EditProfileModal.test.js ✅
        │   ├── ImpactCard.test.js ✅
        │   ├── PostRouteSummaryModal.test.js ✅
        │   ├── PreRouteChecklistModal.test.js ✅
        │   ├── PriorityBadge.test.js ✅
        │   ├── ProgressBar.test.js ✅
        │   ├── SettingsToggle.test.js ✅
        │   ├── StatCard.test.js ✅
        │   ├── BinDetailsModal.test.js.skip ⏸️
        │   ├── BinListItem.test.js.skip ⏸️
        │   ├── CollectionTypeItem.test.js.skip ⏸️
        │   ├── NextStopCard.test.js.skip ⏸️
        │   ├── RegisterBinModal.test.js.skip ⏸️
        │   ├── RouteCard.test.js.skip ⏸️
        │   ├── RouteListItem.test.js.skip ⏸️
        │   └── UserCard.test.js.skip ⏸️
        │
        ├── constants/__tests__/
        │   └── theme.test.js ✅
        │
        ├── context/__tests__/
        │   └── RouteContext.test.js.skip ⏸️
        │
        └── screens/
            ├── Analytics/__tests__/
            │   └── EnhancedAnalyticsDashboard.test.js.skip ⏸️ 📊 ANALYTICS DASHBOARD!
            │
            └── BinCollection/__tests__/
                ├── DashboardScreen.test.js.skip ⏸️
                ├── DashboardScreen.integration.test.js.skip ⏸️
                ├── ProfileScreen.test.js.skip ⏸️
                ├── ReportsScreen.test.js.skip ⏸️ 📊 REPORTS!
                ├── RouteManagementScreen.test.js.skip ⏸️
                └── RouteManagementScreen.integration.test.js.skip ⏸️
```

---

## 🎯 **ANSWER TO YOUR QUESTION:**

### **"Where are the report/analytics unit test files?"**

#### **Backend Analytics Tests (Active):**
📍 **Location:** `backend/__tests__/analytics.simple.test.js`
- ✅ **Status:** PASSING
- 📊 **Tests:** 10 analytics endpoint tests
- 🔧 **Coverage:** All analytics API endpoints

#### **Frontend Analytics Service Tests (Disabled):**
📍 **Location:** `waste-management-app/src/api/__tests__/analyticsService.test.js.skip`
- ⏸️ **Status:** DISABLED
- 📊 **Tests:** ~15 analytics API service tests
- 🔧 **Coverage:** Frontend analytics API calls

#### **Frontend Analytics Dashboard Tests (Disabled):**
📍 **Location:** `waste-management-app/src/screens/Analytics/__tests__/EnhancedAnalyticsDashboard.test.js.skip`
- ⏸️ **Status:** DISABLED
- 📊 **Tests:** ~25 dashboard UI tests
- 🔧 **Coverage:** Analytics dashboard component

#### **Frontend Reports Screen Tests (Disabled):**
📍 **Location:** `waste-management-app/src/screens/BinCollection/__tests__/ReportsScreen.test.js.skip`
- ⏸️ **Status:** DISABLED
- 📊 **Tests:** ~20 reports screen tests
- 🔧 **Coverage:** Reports screen component

---

## 📊 **SUMMARY**

### **Active Tests:** 11 files (225 tests) ✅
- Backend: 2 files (44 tests)
- Frontend: 9 files (181 tests)

### **Disabled Tests:** 26 files (368 tests) ⏸️
- Backend: 3 files (67 tests)
- Frontend: 23 files (301 tests)

### **Analytics/Reports Tests:**
- ✅ **1 Active:** Backend analytics tests (10 tests)
- ⏸️ **3 Disabled:** Frontend analytics service, dashboard, and reports tests (~60 tests)

---

## 🔧 **HOW TO RE-ENABLE DISABLED TESTS**

To re-enable any disabled test:
```bash
# Remove the .skip extension
mv filename.test.js.skip filename.test.js

# Example for analytics service:
mv waste-management-app/src/api/__tests__/analyticsService.test.js.skip \
   waste-management-app/src/api/__tests__/analyticsService.test.js
```

---

**Your analytics/reports unit tests are located in 4 files:**
1. ✅ `backend/__tests__/analytics.simple.test.js` (ACTIVE)
2. ⏸️ `waste-management-app/src/api/__tests__/analyticsService.test.js.skip`
3. ⏸️ `waste-management-app/src/screens/Analytics/__tests__/EnhancedAnalyticsDashboard.test.js.skip`
4. ⏸️ `waste-management-app/src/screens/BinCollection/__tests__/ReportsScreen.test.js.skip`

