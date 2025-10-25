# Quick Start Guide: Testing Pre-Route Checklist & Post-Route Summary

## Prerequisites
1. Backend server running on `http://localhost:5000`
2. MongoDB database connected
3. Frontend app running (`npm start` in waste-management-app)
4. Test user account with collector role

---

## Setup

### 1. Install Dependencies
```bash
cd waste-management-app
npm install
```

This installs:
- `expo-file-system` - For file operations
- `expo-sharing` - For sharing/downloading reports

### 2. Start the Application
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd waste-management-app
npm start
```

---

## Testing the Features

### Test Scenario 1: Pre-Route Checklist

#### Steps:
1. **Login as Collector**
   - Use collector credentials
   - Navigate to Dashboard

2. **View Assigned Route**
   - Tap on "Route Management" or navigate to it
   - You should see today's assigned route

3. **Start Route with Checklist**
   - Tap "Start Route" button
   - **Pre-Route Checklist modal appears**
   
4. **Verify Checklist Behavior**
   - ✅ Modal should show 5 checklist items
   - ✅ "Proceed" button should be **DISABLED** (grayed out)
   - ✅ Try to dismiss modal (Android back button) - should NOT close
   
5. **Complete Checklist**
   - Check first item → Proceed button still disabled
   - Check second item → Proceed button still disabled
   - Check third item → Proceed button still disabled
   - Check fourth item → Proceed button still disabled
   - Check **fifth item** → **Proceed button now ENABLED** (green)

6. **Start Route**
   - Tap "Proceed to Start Route"
   - Loading spinner should appear briefly
   - Success alert: "Route started successfully!"
   - Redirected to Active Route screen
   - Route status changes to "in-progress"

7. **Verify Backend**
   - Check MongoDB database
   - Route document should have:
     ```javascript
     {
       status: "in-progress",
       startedAt: Date,
       preRouteChecklist: {
         completed: true,
         completedAt: Date,
         items: [
           { id: "vehicle", label: "...", checked: true },
           { id: "safety", label: "...", checked: true },
           { id: "containers", label: "...", checked: true },
           { id: "route", label: "...", checked: true },
           { id: "communication", label: "...", checked: true }
         ]
       }
     }
     ```

---

### Test Scenario 2: Post-Route Summary (Success Case)

#### Steps:
1. **Collect All Bins**
   - In Active Route screen
   - For each bin:
     - Tap bin card
     - Enter actual weight (e.g., 25, 30, 15, etc.)
     - Tap "Collect Bin"
     - OR tap "Skip Bin" with reason

2. **Complete Route**
   - Once all bins are collected/skipped
   - Tap "Complete Route" button
   - Confirm in alert dialog

3. **View Post-Route Summary**
   - **Post-Route Summary modal appears**
   - ✅ Verify displayed information:
     - ✓ icon and "Route Completed!" header
     - Route name
     - Total bins count
     - Collected bins count (green)
     - Skipped bins count (orange)
     - Total time taken (e.g., "3h 45m")
     - Total waste collected (e.g., "450 kg")
     - Recyclable waste (e.g., "120 kg")
     - Completion timestamp

4. **View Bin Details**
   - Scroll through bin list
   - Each bin should show:
     - Bin ID
     - Location
     - Status badge (collected/skipped)
     - Fill level percentage
     - Actual weight collected
     - Collection time
     - Skip reason (if skipped)

5. **Download Report**
   - Tap "Download Report" button
   - Loading spinner appears
   - Success alert: "Report downloaded successfully!"
   - File sharing dialog appears (on mobile)
   - Can save/share CSV file

6. **Close Summary**
   - Tap "Close" button
   - Modal closes
   - Navigated back to Dashboard/Route Management

7. **Verify CSV Report Content**
   - Open downloaded CSV file
   - Should contain:
     ```
     Route Completion Report

     Route Information
     Route Name,[Route name]
     Collector,[Name]
     Started At,[DateTime]
     Completed At,[DateTime]
     Total Duration,[Duration]

     Statistics
     Total Bins,[Number]
     Collected Bins,[Number]
     Skipped Bins,[Number]
     Total Waste Collected,[Weight] kg
     Recyclable Waste,[Weight] kg

     Bin Details
     Bin ID,Location,Status,Fill Level (%),Weight (kg),Collection Time,Notes
     BIN-001,"Main St & 1st Ave",collected,85,35,10:45:00 AM,
     BIN-002,"2nd St & Oak",collected,75,28,10:52:00 AM,
     ...
     ```

---

### Test Scenario 3: Network Failure Handling

#### Setup:
- Disable network/WiFi OR stop backend server before completing route

#### Steps:
1. **Complete Route with Network Disabled**
   - Collect all bins
   - Tap "Complete Route"
   - Confirm

2. **Verify Error Handling**
   - ✅ Alert appears: "Unable to complete route due to network issues..."
   - ✅ Message mentions data saved locally
   - ✅ Mentions viewing in Profile
   - ✅ User navigated back to Dashboard

3. **View Saved Route in Profile**
   - Navigate to Profile screen
   - Scroll to "Completed Routes" section
   - ✅ Recently completed route appears in list
   - ✅ Shows route name and date

4. **Access Summary from Profile**
   - Tap on the route in list
   - ✅ Post-Route Summary modal opens
   - ✅ All data displayed correctly (from local storage)
   - ✅ Can still download report

5. **Re-enable Network**
   - Turn WiFi back on / restart backend
   - Refresh Profile screen
   - ✅ Route should now show in server data too

---

### Test Scenario 4: Profile - Completed Routes History

#### Steps:
1. **Navigate to Profile**
   - Tap Profile icon in bottom navigation

2. **View Completed Routes Section**
   - Scroll down to "Completed Routes"
   - ✅ Section shows if user is collector
   - ✅ Shows loading spinner while fetching
   - ✅ Lists up to 5 most recent routes

3. **Route List Items**
   - Each route shows:
     - Route name
     - Completion date
     - Number of bins collected
     - Chevron (›) to view details

4. **View Route Summary**
   - Tap any route in list
   - ✅ Post-Route Summary modal opens
   - ✅ Shows all route details
   - ✅ Can download report

5. **Download from History**
   - In summary modal, tap "Download Report"
   - ✅ CSV file downloads successfully
   - ✅ Contains correct route data

6. **Empty State**
   - With new collector account (no completed routes)
   - ✅ Shows "No completed routes yet" message

---

## Edge Cases to Test

### Edge Case 1: Incomplete Checklist
- Try starting route with only some items checked
- **Expected**: "Proceed" button remains disabled
- **Expected**: Backend rejects request if somehow bypassed

### Edge Case 2: Try to Dismiss Checklist
- Press Android back button
- Tap outside modal (if possible)
- **Expected**: Modal does NOT close
- **Expected**: Must complete all items to proceed

### Edge Case 3: No Bins to Collect
- Route with 0 bins
- **Expected**: Can complete route immediately
- **Expected**: Summary shows "0 Total Bins"

### Edge Case 4: All Bins Skipped
- Skip all bins instead of collecting
- **Expected**: Can complete route
- **Expected**: Summary shows all skipped
- **Expected**: Total waste = 0 kg

### Edge Case 5: Mixed Collection
- Collect some bins, skip others
- **Expected**: Summary shows correct breakdown
- **Expected**: Only collected bins count toward waste total

### Edge Case 6: Zero Weight Collection
- Collect bin with 0 kg weight
- **Expected**: Accepts 0 as valid weight
- **Expected**: Summary includes bin with 0 kg

### Edge Case 7: Sharing Not Available
- Test on emulator or device without sharing capability
- **Expected**: Alert: "Sharing not available"
- **Expected**: Report content logged to console
- **Expected**: App doesn't crash

---

## Verification Checklist

### Frontend
- [ ] Pre-Route Checklist modal renders correctly
- [ ] All 5 checklist items visible
- [ ] Checkboxes work correctly
- [ ] Proceed button disabled/enabled logic works
- [ ] Modal cannot be dismissed prematurely
- [ ] Post-Route Summary modal renders correctly
- [ ] All statistics displayed accurately
- [ ] Bin list scrollable and complete
- [ ] Download button works
- [ ] Close button navigates correctly
- [ ] Profile shows completed routes
- [ ] Can view route summary from Profile
- [ ] Network errors handled gracefully

### Backend
- [ ] startRoute requires checklist
- [ ] startRoute validates all items checked
- [ ] preRouteChecklist saved to database
- [ ] completeRoute calculates duration
- [ ] completeRoute returns complete route data
- [ ] GET /routes/my-routes?status=completed works

### Data Persistence
- [ ] Checklist data stored in MongoDB
- [ ] Route duration calculated correctly
- [ ] Reports saved locally when network fails
- [ ] Can retrieve saved reports from Profile

---

## Common Issues & Solutions

### Issue: Cannot install expo-file-system
**Solution**: Check Expo SDK version compatibility. Using Expo 54, use:
```json
"expo-file-system": "~18.1.0",
"expo-sharing": "~13.1.0"
```

### Issue: Checklist doesn't save
**Solution**: Check network connection and backend logs for validation errors

### Issue: Summary doesn't show after completion
**Solution**: Check console for errors. Verify route data structure in response

### Issue: Cannot download report
**Solution**: Check device sharing capability. Works best on physical devices

### Issue: Profile doesn't load completed routes
**Solution**: Verify API endpoint `/routes/my-routes?status=completed` returns data

---

## Debug Tips

### Enable Verbose Logging
Add to components:
```javascript
console.log('=== PRE-ROUTE CHECKLIST ===');
console.log('Checklist Data:', checklistData);

console.log('=== POST-ROUTE SUMMARY ===');
console.log('Route Data:', routeData);
```

### Check Backend Logs
```bash
cd backend
npm start
# Watch for startRoute and completeRoute logs
```

### Inspect MongoDB
```javascript
// In MongoDB shell or Compass
db.routes.find({ status: 'in-progress' })
db.routes.find({ 'preRouteChecklist.completed': true })
db.routes.find({ status: 'completed' }).sort({ completedAt: -1 }).limit(5)
```

### Network Monitoring
- Use Chrome DevTools → Network tab
- Watch for POST/PUT requests to `/routes/:id/start` and `/routes/:id/complete`
- Check request payloads and responses

---

## Success Criteria

✅ **Pre-Route Checklist**:
- Modal appears before route start
- All items must be checked
- Cannot be dismissed without completion
- Data persisted in database

✅ **Post-Route Summary**:
- Appears after route completion
- Shows accurate statistics
- Displays all bin details
- Download functionality works

✅ **Network Resilience**:
- Handles network failures gracefully
- Saves data locally
- Accessible from Profile later

✅ **User Experience**:
- Smooth transitions
- Clear feedback
- No blocking errors
- Intuitive navigation

---

## Next Steps After Testing

1. **Review Test Results**
   - Document any bugs found
   - Note UX improvements needed

2. **Write Automated Tests** (See PRE_POST_ROUTE_IMPLEMENTATION.md)
   - Unit tests for components
   - Integration tests for flows
   - E2E tests for critical paths

3. **Performance Testing**
   - Test with large route (50+ bins)
   - Test offline → online sync
   - Test report generation speed

4. **User Acceptance Testing**
   - Get feedback from actual collectors
   - Iterate based on feedback

5. **Production Deployment**
   - Backend database migration
   - Frontend app release
   - User training materials

---

## Contact & Support

For issues or questions:
- Check `PRE_POST_ROUTE_IMPLEMENTATION.md` for detailed documentation
- Review backend logs in `backend/server.js`
- Check frontend console logs in React Native debugger
- Verify MongoDB database state

Happy Testing! 🎉
