# Resident Dashboard Bottom Navigation Implementation Plan

## 📋 Overview
Implement a bottom navigation bar for the Resident Dashboard with 4 main screens: Home (Bins Overview), History, Payment, and Settings.

**Status:** Planning Phase
**Date:** October 24, 2025

---

## ❓ Clarifying Questions

Before implementation, please answer these questions:

### 1. **History Screen - Collection Details**
   - **Q1:** Should the history show collections for ALL bins owned by the resident, or should it be filterable by bin?
   - **Q2:** Should collections be grouped by date (newest first) or by bin?
   - **Q3:** What information should each collection record show?
     - Suggested: Date/Time, Bin ID, Collector Name, Weight, Fill Level at collection
   - **Q4:** Should there be a search/filter feature (by date range, bin, collector)?

### 2. **Payment Screen (Placeholder)**
   - **Q1:** What message should the placeholder show? (e.g., "Payment feature coming soon")
   - **Q2:** Should it show a mock UI of what's planned, or just a simple message?
   - **Q3:** Any specific design/color scheme in mind for the placeholder?

### 3. **Settings Screen - Profile Management**
   - **Q1:** Which profile details should be editable?
     - Suggested: First Name, Last Name, Phone, Email, Password
   - **Q2:** Should residents be able to:
     - Change password?
     - Update notification preferences?
     - Change language settings?
     - Enable/disable push notifications?
   - **Q3:** Should there be a logout button in Settings, or keep it in the profile section?

### 4. **Navigation Behavior**
   - **Q1:** Should the bottom nav be visible on all 4 screens, or hidden on certain screens?
   - **Q2:** When navigating to bin details (tapping a bin card), should we navigate away from bottom nav or use a modal?
   - **Q3:** Should the app remember which tab was last active when reopening?

### 5. **Home Screen (Bins Overview)**
   - **Q1:** Should the current ResidentDashboard become the "Home" tab, or should it be redesigned?
   - **Q2:** Should the FAB (+ button for adding bins) remain on the Home screen?
   - **Q3:** Any additional stats/widgets to show on home beyond current bins overview?

---

## 🎯 Proposed Implementation Plan

### **Phase 1: Setup Bottom Navigation Infrastructure**

#### 1.1 Install Dependencies (if needed)
- Check if `@react-navigation/bottom-tabs` is installed
- If not: `npm install @react-navigation/bottom-tabs`

#### 1.2 Create Bottom Tab Navigator
- **File:** `waste-management-app/src/navigation/ResidentTabNavigator.js` (NEW)
- Create a tab navigator with 4 tabs:
  - 🏠 Home
  - 📋 History
  - 💳 Payment
  - ⚙️ Settings

#### 1.3 Update AppNavigator
- **File:** `waste-management-app/src/navigation/AppNavigator.js` (MODIFY)
- Replace single `ResidentDashboard` screen with `ResidentTabNavigator`
- Maintain proper role-based routing

---

### **Phase 2: Home Screen (Bins Overview)**

#### 2.1 Rename/Refactor Current Dashboard
- **Option A:** Rename `ResidentDashboard.js` → `ResidentHomeScreen.js`
- **Option B:** Create new `ResidentHomeScreen.js` and import dashboard logic
- Keep all current functionality:
  - Bins statistics cards
  - Bin cards list
  - Add bin modal (FAB)
  - Pull-to-refresh

#### 2.2 Styling Adjustments
- Ensure proper padding for bottom navigation bar
- Test scroll behavior with bottom nav visible
- Adjust SafeAreaView if needed

---

### **Phase 3: History Screen**

#### 3.1 Backend API Endpoint (NEW)
- **File:** `backend/controllers/binController.js` (MODIFY)
- **Route:** GET `/api/bins/resident/collection-history`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "collection_id",
        "binId": "BIN0001",
        "binLocation": "123 Main St",
        "binType": "Recyclable",
        "collectedAt": "2025-10-20T10:30:00Z",
        "collectorName": "John Doe",
        "weight": 25.5,
        "fillLevelAtCollection": 85,
        "routeName": "Zone A Morning Route"
      }
    ],
    "count": 15
  }
  ```

#### 3.2 Frontend API Service
- **File:** `waste-management-app/src/services/api.js` (MODIFY)
- Add method: `getResidentCollectionHistory()`

#### 3.3 History Screen Component
- **File:** `waste-management-app/src/screens/Resident/CollectionHistoryScreen.js` (NEW)
- **Features:**
  - List all collections across all resident's bins
  - Sort by date (newest first)
  - Show: Date, Time, Bin ID, Collector, Weight, Fill Level
  - Pull-to-refresh
  - Empty state if no history
  - Loading state
  - Optional: Search/filter by date or bin

#### 3.4 History Card Component
- **File:** `waste-management-app/src/components/CollectionHistoryCard.js` (NEW)
- Display individual collection record
- Color-coded by bin type
- Show all relevant details

---

### **Phase 4: Payment Screen (Placeholder)**

#### 4.1 Payment Screen Component
- **File:** `waste-management-app/src/screens/Resident/PaymentScreen.js` (NEW)
- **Features:**
  - Placeholder message: "Payment feature coming soon"
  - Icon/illustration
  - Brief description of planned feature
  - Contact info if needed
  - Professional styling matching app theme

#### 4.2 Optional Mock UI
- Show mock payment cards
- Display "Coming Soon" overlay
- Give users preview of planned functionality

---

### **Phase 5: Settings Screen**

#### 5.1 Backend API Endpoints
- **File:** `backend/controllers/authController.js` (MODIFY)
- **Route:** PUT `/api/auth/update-profile` (may already exist)
- **Route:** PUT `/api/auth/change-password` (NEW if needed)
- Allow residents to update their own profile

#### 5.2 Settings Screen Component
- **File:** `waste-management-app/src/screens/Resident/SettingsScreen.js` (NEW)
- **Sections:**
  1. **Profile Information**
     - Display: Name, Email, Phone, NIC, Date of Birth
     - "Edit Profile" button
  2. **Account Settings**
     - Change Password
     - Notification Preferences (toggle switches)
  3. **App Preferences**
     - Language selection (if applicable)
     - Theme (light/dark) - future feature
  4. **About**
     - App version
     - Terms & Conditions
     - Privacy Policy
  5. **Danger Zone**
     - Logout button (red)

#### 5.3 Edit Profile Modal
- **File:** `waste-management-app/src/components/ResidentEditProfileModal.js` (NEW)
- Reuse or adapt existing `EditProfileModal.js` from collectors
- Form fields: First Name, Last Name, Phone, Email
- Validation
- Save/Cancel buttons

#### 5.4 Change Password Modal
- **File:** `waste-management-app/src/components/ChangePasswordModal.js` (NEW)
- Fields: Current Password, New Password, Confirm Password
- Validation (min length, match check)
- Secure input (password masked)

---

### **Phase 6: Navigation Integration**

#### 6.1 Tab Navigator Configuration
- **File:** `waste-management-app/src/navigation/ResidentTabNavigator.js`
- Configure icons for each tab (can use emojis or icon library)
- Set tab labels
- Configure active/inactive colors
- Set initial route to "Home"

#### 6.2 Update Initial Navigation
- **File:** `waste-management-app/src/navigation/AppNavigator.js`
- When user role is "resident", navigate to `ResidentTabs`
- `ResidentTabs` internally manages 4 bottom tabs

#### 6.3 Deep Linking (Optional)
- Allow navigation to specific tabs from push notifications
- Handle URL schemes if needed

---

### **Phase 7: Styling & Polish**

#### 7.1 Bottom Tab Styling
- Match app theme colors (COLORS.primaryDarkTeal)
- Active tab color: COLORS.accentGreen
- Inactive tab color: COLORS.iconGray
- Tab bar height: 60px
- Add subtle shadow/elevation

#### 7.2 Screen Consistency
- Ensure all 4 screens follow same design language
- Consistent header styles
- Consistent spacing/padding
- Matching card styles

#### 7.3 Icons
- **Option A:** Use emojis (🏠, 📋, 💳, ⚙️)
- **Option B:** Install icon library like `@expo/vector-icons`
- Ensure icons are clear and recognizable

---

## 📁 File Structure Summary

```
waste-management-app/src/
├── navigation/
│   ├── AppNavigator.js (MODIFY)
│   └── ResidentTabNavigator.js (NEW)
│
├── screens/
│   └── Resident/
│       ├── ResidentHomeScreen.js (RENAME from ResidentDashboard.js)
│       ├── CollectionHistoryScreen.js (NEW)
│       ├── PaymentScreen.js (NEW)
│       └── SettingsScreen.js (NEW)
│
├── components/
│   ├── CollectionHistoryCard.js (NEW)
│   ├── ResidentEditProfileModal.js (NEW)
│   └── ChangePasswordModal.js (NEW)
│
└── services/
    └── api.js (MODIFY - add history endpoint)

backend/
├── controllers/
│   ├── binController.js (MODIFY - add collection history)
│   └── authController.js (MODIFY - ensure update profile works)
│
└── routes/
    └── bins.js (MODIFY - add history route)
```

---

## 🧪 Testing Plan

### Test 1: Bottom Navigation
- [ ] All 4 tabs are visible
- [ ] Tapping each tab navigates correctly
- [ ] Active tab is highlighted
- [ ] Tab bar doesn't overlap content
- [ ] Back button works correctly on Android

### Test 2: Home Screen
- [ ] Current bins display correctly
- [ ] Stats are accurate
- [ ] Add bin FAB works
- [ ] Pull-to-refresh works
- [ ] Navigation to bin details works

### Test 3: History Screen
- [ ] Collections load from backend
- [ ] All relevant details displayed
- [ ] Sorted correctly (newest first)
- [ ] Empty state shows when no history
- [ ] Pull-to-refresh works
- [ ] Loading spinner shows during fetch

### Test 4: Payment Screen
- [ ] Placeholder message displays
- [ ] Styling matches app theme
- [ ] No console errors

### Test 5: Settings Screen
- [ ] Profile info displays correctly
- [ ] Edit profile modal opens
- [ ] Profile updates save successfully
- [ ] Change password works
- [ ] Logout works correctly
- [ ] All toggles function properly

### Test 6: Navigation Flow
- [ ] Resident logs in → sees Home tab
- [ ] Can switch between all tabs
- [ ] App remembers last active tab
- [ ] Deep links work (if implemented)
- [ ] No memory leaks when switching tabs

---

## 📊 Implementation Estimates

| Phase | Description | Estimated Time | Complexity |
|-------|-------------|----------------|------------|
| Phase 1 | Setup Bottom Nav | 1-2 hours | Low |
| Phase 2 | Home Screen | 1 hour | Low |
| Phase 3 | History Screen | 3-4 hours | Medium |
| Phase 4 | Payment Placeholder | 1 hour | Low |
| Phase 5 | Settings Screen | 3-4 hours | Medium |
| Phase 6 | Navigation Integration | 1-2 hours | Low |
| Phase 7 | Styling & Polish | 2-3 hours | Low |
| **Total** | | **12-17 hours** | **Medium** |

---

## 🎨 UI/UX Mockup Reference

### Bottom Navigation Bar
```
┌────────────────────────────────────────┐
│                                        │
│          SCREEN CONTENT HERE           │
│                                        │
└────────────────────────────────────────┘
┌────────────────────────────────────────┐
│  🏠     📋      💳       ⚙️           │
│ Home  History Payment  Settings        │
└────────────────────────────────────────┘
```

### History Screen Layout
```
┌──────────────────────────────────┐
│  Collection History         🔍   │
├──────────────────────────────────┤
│ ┌──────────────────────────────┐ │
│ │ 📦 BIN0001 • Recyclable      │ │
│ │ 📍 123 Main St               │ │
│ │ 🗓️  Oct 20, 2025 - 10:30 AM │ │
│ │ 👤 John Doe                  │ │
│ │ ⚖️  25.5 kg • 85% full       │ │
│ └──────────────────────────────┘ │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ 📦 BIN0002 • General Waste   │ │
│ │ ...                          │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### Settings Screen Layout
```
┌──────────────────────────────────┐
│          Settings                │
├──────────────────────────────────┤
│  PROFILE INFORMATION             │
│  ┌────────────────────────────┐  │
│  │ 👤 John Resident           │  │
│  │ 📧 john@example.com        │  │
│  │ 📱 0771234567              │  │
│  │           [Edit Profile]   │  │
│  └────────────────────────────┘  │
│                                  │
│  ACCOUNT                         │
│  ┌────────────────────────────┐  │
│  │ 🔒 Change Password      >  │  │
│  │ 🔔 Notifications        ⚪ │  │
│  └────────────────────────────┘  │
│                                  │
│  ABOUT                           │
│  ┌────────────────────────────┐  │
│  │ ℹ️  Version 1.0.0           │  │
│  │ 📄 Terms & Conditions    > │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │      🚪 LOGOUT             │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

---

## 🔑 Key Technical Considerations

### 1. **State Management**
- Use React Context or local state for tab navigation
- Persist last active tab in AsyncStorage (optional)
- Share user data across all screens via AuthContext

### 2. **API Design**
- Collection history endpoint should be efficient
- Consider pagination if history grows large
- Cache collection history on frontend to reduce API calls

### 3. **Performance**
- Lazy load screens (React Navigation does this by default)
- Optimize list rendering in History screen (FlatList with keyExtractor)
- Debounce search/filter operations

### 4. **Security**
- Ensure resident can only see their own collections
- Validate user permissions on backend for all endpoints
- Secure password change with proper authentication

### 5. **Accessibility**
- Ensure tab labels are readable
- Proper contrast ratios for colors
- Screen reader support for all interactive elements

---

## 🚀 Next Steps

**Please review this plan and answer the clarifying questions above. Once confirmed, I will:**

1. ✅ Start with Phase 1 (Bottom Navigation setup)
2. ✅ Implement each phase sequentially
3. ✅ Test thoroughly after each phase
4. ✅ Document changes in implementation summary

**Would you like me to proceed with any specific phase first, or should we go through the questions?**

---

## 📝 Notes

- Existing `ResidentBinCard` component can be reused for home screen
- `EditProfileModal` from collectors can be adapted for residents
- Collection history leverages existing `latestCollection` data in Bin model
- Payment screen is intentionally minimal as a placeholder for future development
- All screens should maintain consistent theming with COLORS constants

---

**Ready to implement once questions are answered! 🎉**
