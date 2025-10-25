# Testing Guide - Bottom Navigation Implementation

## Server Status ✅

**Backend Server**: Running on http://localhost:3001
- MongoDB Connected: ac-l06yhtt-shard-00-00.v0dwt8o.mongodb.net
- Network: http://192.168.1.8:3001

**Frontend App**: Running on http://localhost:8081
- Metro Bundler: Active
- Expo Go QR Code: Ready for scanning
- Web: Available at http://localhost:8081

## How to Access the App

### Option 1: Mobile Device (Recommended)
1. Install **Expo Go** app from Play Store (Android) or App Store (iOS)
2. Scan the QR code shown in the terminal
3. App will load on your device

### Option 2: Web Browser
1. Press **`w`** in the terminal where frontend is running
2. Or navigate to http://localhost:8081 in your browser

### Option 3: Android Emulator
1. Start your Android emulator
2. Press **`a`** in the terminal where frontend is running

## Testing Checklist

### Prerequisites
1. **Login as Resident User**
   - You need a resident account in the database
   - If you don't have one, you can register through the app or create one via admin

---

## 1. HOME TAB TESTS (🏠)

### Test 1.1: Bins Overview Display
- [ ] Header shows "Welcome back, [Your Name]"
- [ ] Stats card displays:
  - [ ] Total Bins count
  - [ ] Active bins count
  - [ ] Needs Collection count (bins ≥70% or scheduled)
  - [ ] Average Fill Level percentage
- [ ] All resident's bins are listed below stats

### Test 1.2: Bin Cards Display
For each bin card, verify:
- [ ] Bin ID is shown
- [ ] Bin type badge is displayed (color-coded)
- [ ] Location is shown
- [ ] Fill level percentage is displayed
- [ ] Progress bar shows fill level visually:
  - [ ] Red (≥90%)
  - [ ] Orange (70-89%)
  - [ ] Yellow (50-69%)
  - [ ] Green (<50%)
- [ ] Status badge is shown

### Test 1.3: Bin Interaction
- [ ] Tap on a bin card
- [ ] Alert modal appears showing:
  - [ ] Bin ID (as title)
  - [ ] Location
  - [ ] Zone
  - [ ] Type
  - [ ] Capacity (in kg)
  - [ ] Fill Level (percentage)
  - [ ] Status
- [ ] "Close" button dismisses modal
- [ ] No navigation occurs (stays on Home tab)

### Test 1.4: Add New Bin
- [ ] Tap the floating **+** button (bottom-right)
- [ ] Add Bin modal opens
- [ ] Fill in bin details (binId, location, zone, type, capacity)
- [ ] Submit form
- [ ] Success alert appears
- [ ] Modal closes
- [ ] Bins list refreshes with new bin

### Test 1.5: Pull to Refresh
- [ ] Pull down on the screen
- [ ] Loading spinner appears
- [ ] Bins data refreshes
- [ ] Stats recalculate

---

## 2. HISTORY TAB TESTS (📋)

### Test 2.1: Initial Display
- [ ] Header shows "Collection History"
- [ ] Search bar is visible at top
- [ ] Filter dropdown shows "All Bins"
- [ ] List of all collections is displayed
- [ ] Collections are sorted by date (newest first)

### Test 2.2: Collection Card Display
For each collection card, verify it shows:
- [ ] Bin ID with color-coded type badge
- [ ] Location
- [ ] Collection date and time
- [ ] Collector name
- [ ] Route name
- [ ] Weight collected (kg)
- [ ] Fill level at collection (%)

### Test 2.3: Search Functionality
- [ ] Tap search bar
- [ ] Type a bin ID → List filters to show only that bin's collections
- [ ] Clear search → All collections reappear
- [ ] Type a collector name → List filters to show that collector's collections
- [ ] Type a location → List filters to show collections at that location
- [ ] Type a route name → List filters to show that route's collections
- [ ] Search is case-insensitive

### Test 2.4: Filter by Bin
- [ ] Tap "All Bins" dropdown
- [ ] Dropdown shows list of all your bin IDs
- [ ] Select a specific bin ID
- [ ] List filters to show only that bin's collections
- [ ] Select "All Bins" again
- [ ] All collections reappear

### Test 2.5: Combined Search and Filter
- [ ] Select a bin from filter dropdown
- [ ] Type a collector name in search
- [ ] List shows only that bin's collections by that collector
- [ ] Clear filters one by one
- [ ] List updates accordingly

### Test 2.6: Empty States
- [ ] Search for non-existent text (e.g., "ZZZZZ")
- [ ] "No collections found" message appears
- [ ] Clear search → Collections reappear

### Test 2.7: Pull to Refresh
- [ ] Pull down on the list
- [ ] Loading spinner appears
- [ ] Collection history refreshes
- [ ] New collections appear (if any)

---

## 3. PAYMENT TAB TESTS (💳)

### Test 3.1: Placeholder Display
- [ ] Header shows "Payment"
- [ ] Large payment icon is displayed (💰)
- [ ] "Coming Soon" title is shown
- [ ] Description text is displayed
- [ ] Notice box with planned features is shown:
  - [ ] View billing statements
  - [ ] Make online payments
  - [ ] Payment history
  - [ ] Set up auto-pay
  - [ ] Payment reminders

### Test 3.2: Visual Design
- [ ] Screen is centered and professional
- [ ] Colors match app theme
- [ ] Notice box has left border accent
- [ ] Text is readable and well-spaced

---

## 4. SETTINGS TAB TESTS (⚙️)

### Test 4.1: Header and Logout
- [ ] Header shows "Settings" title
- [ ] Logout button is in top-right corner
- [ ] Logout button shows door emoji 🚪 and "Logout" text
- [ ] Tap Logout → Confirmation dialog appears
- [ ] Cancel → Dialog dismisses, stays logged in
- [ ] Confirm → Logs out, returns to login screen

### Test 4.2: Profile Information Display
- [ ] Avatar shows user initials
- [ ] Name is displayed correctly
- [ ] Email is displayed correctly
- [ ] Phone is displayed (or "Not provided")
- [ ] Role badge shows "Resident"
- [ ] "Edit Profile" button is visible

### Test 4.3: Edit Profile
- [ ] Tap "Edit Profile" button
- [ ] Modal opens with form
- [ ] Form is pre-filled with current data:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Email
  - [ ] Phone

#### Validation Tests:
- [ ] Clear First Name → Tap Save → Error appears "First name is required"
- [ ] Clear Last Name → Tap Save → Error appears "Last name is required"
- [ ] Enter invalid email (e.g., "test") → Error appears "Email is invalid"
- [ ] Enter invalid phone (e.g., "123") → Error appears "Phone must be 10 digits"
- [ ] Enter valid data in all fields → Tap Save
- [ ] Loading spinner appears
- [ ] Success alert appears
- [ ] Modal closes
- [ ] Profile information updates on Settings screen

#### Cancel Test:
- [ ] Tap "Edit Profile" again
- [ ] Make changes
- [ ] Tap Cancel
- [ ] Modal closes
- [ ] Changes are not saved

### Test 4.4: Change Password
- [ ] Tap "Change Password" card in Security section
- [ ] Modal opens with three password fields:
  - [ ] Current Password
  - [ ] New Password
  - [ ] Confirm New Password
- [ ] All fields have show/hide toggle buttons (👁️)

#### Password Field Tests:
- [ ] Tap eye icon on Current Password → Password becomes visible
- [ ] Tap again → Password becomes hidden
- [ ] Repeat for New Password field
- [ ] Repeat for Confirm Password field

#### Validation Tests:
- [ ] Leave Current Password empty → Tap Change Password → Error appears
- [ ] Enter password < 6 characters in New Password → Error appears "Password must be at least 6 characters"
- [ ] Enter different passwords in New and Confirm → Error appears "Passwords do not match"
- [ ] Enter same password in Current and New → Error appears "New password must be different from current password"
- [ ] Enter correct current password, valid new password, matching confirmation
- [ ] Tap "Change Password"
- [ ] Loading spinner appears
- [ ] Success alert appears: "Password changed successfully!"
- [ ] Tap OK
- [ ] Modal closes
- [ ] (Optional: App may log you out for security)

#### Cancel Test:
- [ ] Open Change Password modal
- [ ] Fill in fields
- [ ] Tap Cancel
- [ ] Modal closes
- [ ] Password not changed

### Test 4.5: About Section
- [ ] App Version displays (e.g., "1.0.0")
- [ ] Account Type shows "Resident"
- [ ] Member Since shows date in format "Jan 2025"

### Test 4.6: Security Notice
- [ ] Security notice box is visible in Change Password modal
- [ ] Shows lock icon 🔒
- [ ] States: "For security, you'll be logged out after changing your password"

---

## 5. BOTTOM NAVIGATION TESTS

### Test 5.1: Tab Navigation
- [ ] Bottom navigation is always visible
- [ ] Four tabs are present: Home, History, Payment, Settings
- [ ] Each tab has emoji icon and label
- [ ] Active tab is highlighted (Primary Dark Teal color)
- [ ] Inactive tabs are gray

### Test 5.2: Tab Switching
- [ ] Tap History tab → History screen appears
- [ ] Tap Payment tab → Payment screen appears
- [ ] Tap Settings tab → Settings screen appears
- [ ] Tap Home tab → Home screen appears
- [ ] Active tab icon changes (filled vs outlined emoji)

### Test 5.3: Tab State
- [ ] Switch from Home to History
- [ ] Perform a search in History
- [ ] Switch to Payment tab
- [ ] Switch back to History tab
- [ ] Search is cleared (no tab memory - fresh state)

### Test 5.4: Navigation Persistence
- [ ] Open Edit Profile modal in Settings
- [ ] Modal is visible over Settings screen
- [ ] Bottom navigation remains visible
- [ ] Tapping other tabs while modal is open is possible
- [ ] Switching tabs closes modal

---

## 6. INTEGRATION TESTS

### Test 6.1: Cross-Tab Data Consistency
- [ ] Add a new bin from Home tab
- [ ] Switch to History tab
- [ ] Verify bin appears in filter dropdown

### Test 6.2: Profile Updates Across Tabs
- [ ] Go to Settings tab
- [ ] Edit profile (change name)
- [ ] Go to Home tab
- [ ] Verify updated name in header

### Test 6.3: Collection After Adding Bin
(Requires admin/collector access to create route and collect)
- [ ] Add a new bin
- [ ] Create route with that bin (as admin)
- [ ] Collect bin (as collector)
- [ ] Switch to History tab
- [ ] Verify collection appears in history

### Test 6.4: Fill Level Updates
- [ ] Note current fill level of a bin on Home tab
- [ ] Have it collected (as collector)
- [ ] Return to Home tab (pull to refresh)
- [ ] Verify fill level updated to calculated percentage (weight/capacity * 100)
- [ ] If bin is scheduled for next collection → Fill level shows 0%

---

## 7. ERROR HANDLING TESTS

### Test 7.1: Network Errors
- [ ] Disconnect internet
- [ ] Try to refresh Home tab → Error alert appears
- [ ] Try to fetch History → Error alert appears
- [ ] Try to edit profile → Error alert appears
- [ ] Reconnect internet → Everything works again

### Test 7.2: Invalid Data
- [ ] Try to add bin with duplicate binId → Error alert appears
- [ ] Try to change password with wrong current password → Error alert appears

### Test 7.3: Empty States
- [ ] New resident with no bins
- [ ] Home tab shows "You don't have any bins yet" message
- [ ] History tab shows "No collection history yet" message

---

## 8. VISUAL/UI TESTS

### Test 8.1: Color Consistency
- [ ] Primary Dark Teal used for headers, active tabs, buttons
- [ ] Color-coded bin types (General, Recyclable, Organic)
- [ ] Progress bars color-coded by fill level
- [ ] Alert red for warnings/errors
- [ ] Accent green for success states

### Test 8.2: Typography
- [ ] All text is readable
- [ ] Font sizes are consistent across screens
- [ ] Bold text used appropriately for emphasis
- [ ] Labels are clear and descriptive

### Test 8.3: Spacing and Layout
- [ ] Cards have proper padding and margins
- [ ] No overlapping elements
- [ ] Bottom navigation doesn't cover content
- [ ] Floating action button doesn't obstruct content
- [ ] Modal forms are well-spaced

### Test 8.4: Responsive Design
- [ ] Test on different screen sizes (if possible)
- [ ] Scrolling works smoothly on all screens
- [ ] Modals fit on screen
- [ ] No horizontal scrolling required

---

## 9. PERFORMANCE TESTS

### Test 9.1: Loading Times
- [ ] Home tab loads quickly (<2 seconds)
- [ ] History tab loads quickly (<2 seconds)
- [ ] Settings tab loads quickly (<1 second)
- [ ] Switching tabs is instant

### Test 9.2: Smooth Animations
- [ ] Tab switching has smooth transition
- [ ] Modal open/close animates smoothly
- [ ] Pull-to-refresh animation is smooth
- [ ] Progress bars render without lag

---

## 10. ACCESSIBILITY TESTS

### Test 10.1: Touch Targets
- [ ] All buttons are easy to tap (not too small)
- [ ] Sufficient spacing between interactive elements
- [ ] Floating action button is easily reachable

### Test 10.2: Feedback
- [ ] Success messages appear for successful actions
- [ ] Error messages appear for failed actions
- [ ] Loading indicators show during operations
- [ ] Confirmation dialogs for destructive actions (logout, delete)

---

## Known Issues to Check

### Potential Issues to Watch For:
1. **ResidentTabNavigator Not Found Error**
   - If app crashes on resident login, check import path in AppNavigator

2. **ChangePasswordModal API Call**
   - Verify backend has `/auth/change-password` endpoint
   - Check if it expects `oldPassword` or `currentPassword`

3. **Collection History Empty**
   - New users won't have history until bins are collected
   - This is expected behavior

4. **Fill Level Display**
   - Should show calculated percentage after collection
   - Should show 0% only when scheduled for collection
   - Verify logic works correctly

---

## Reporting Issues

If you encounter any issues during testing, please note:
1. **What were you doing?** (Step-by-step)
2. **What did you expect to happen?**
3. **What actually happened?**
4. **Any error messages?** (Screenshot if possible)
5. **Which tab/screen?**

---

## Quick Test Summary

For a quick smoke test, perform these essential tests:
1. ✅ Login as resident
2. ✅ Verify all 4 tabs appear
3. ✅ Switch between all tabs
4. ✅ Home: View bins, tap a bin (modal appears)
5. ✅ History: See collections, try search
6. ✅ Payment: See placeholder
7. ✅ Settings: View profile, try Edit Profile, try Logout (cancel it)

If all of these work, the implementation is successful! 🎉

---

## Next Steps After Testing

Once testing is complete and any issues are fixed:
1. Create pull request for feature branch
2. Document any discovered bugs
3. Plan Payment screen implementation (future)
4. Consider additional features (notifications, etc.)

---

**Happy Testing!** 🧪✨
