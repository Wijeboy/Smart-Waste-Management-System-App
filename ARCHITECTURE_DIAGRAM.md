# Bottom Navigation Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP NAVIGATOR                            │
│                    (Main Navigation Stack)                       │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RESIDENT TAB NAVIGATOR                         │
│                   (Bottom Tabs - Always Visible)                 │
├─────────┬───────────────┬───────────────┬──────────────────────┤
│  🏠 Home│  📋 History  │  💳 Payment  │  ⚙️ Settings        │
└─────────┴───────────────┴───────────────┴──────────────────────┘
     │            │               │                │
     ▼            ▼               ▼                ▼
┌─────────┐  ┌─────────┐   ┌─────────┐    ┌──────────┐
│  Home   │  │ History │   │ Payment │    │ Settings │
│ Screen  │  │ Screen  │   │ Screen  │    │  Screen  │
└─────────┘  └─────────┘   └─────────┘    └──────────┘
     │            │               │                │
     │            │               │                │
     ▼            ▼               ▼                ▼


═══════════════════════════════════════════════════════════════════
                        HOME SCREEN (🏠)
═══════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│  HEADER (Teal Background)                                     │
│  ┌─────────────────────────────────────────────────┐          │
│  │  Welcome back,                                  │          │
│  │  John Doe                                       │          │
│  └─────────────────────────────────────────────────┘          │
└───────────────────────────────────────────────────────────────┘
│                                                                 │
│  STATS CARD                                                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Your Bins Overview                                       │ │
│  ├──────────┬──────────┬─────────────┬────────────────────┤ │
│  │  Total   │  Active  │   Needs     │  Avg Fill Level    │ │
│  │    4     │    3     │ Collection  │      45%          │ │
│  │          │          │      2      │                    │ │
│  └──────────┴──────────┴─────────────┴────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
│                                                                 │
│  MY BINS                                                        │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  BIN-001  [General]        📍 123 Main St          │       │
│  │  Fill Level: 75%                                    │       │
│  │  ████████████████░░░░░░░░  [Orange Progress Bar]   │       │
│  └─────────────────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  BIN-002  [Recyclable]     📍 456 Oak Ave          │       │
│  │  Fill Level: 30%                                    │       │
│  │  ████████░░░░░░░░░░░░░░░░  [Green Progress Bar]    │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│                                    ┌────────┐                  │
│                                    │   +    │ ← Add Bin       │
│                                    └────────┘                  │
└───────────────────────────────────────────────────────────────┘

                           MODALS
              ┌─────────────────────────────┐
              │   Add Bin Modal             │
              │   (Floating + Button)       │
              └─────────────────────────────┘
              ┌─────────────────────────────┐
              │   Bin Details Modal         │
              │   (Tap Bin Card)            │
              └─────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      HISTORY SCREEN (📋)
═══════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  Collection History                                             │
└───────────────────────────────────────────────────────────────┘
│                                                                 │
│  SEARCH BAR                                                     │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  🔍  Search by bin, collector, location...          │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  FILTER DROPDOWN                                                │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Filter by Bin:  [All Bins ▼]                      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  COLLECTION CARDS                                               │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  BIN-001  [General]        📍 123 Main St          │       │
│  │  🗓️ Oct 20, 2025 10:30 AM                          │       │
│  │  👤 Collector: Mike Wilson                          │       │
│  │  🚛 Route: Morning Route A                          │       │
│  │  ⚖️ Weight: 45kg  📊 Fill: 85%                     │       │
│  └─────────────────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  BIN-002  [Recyclable]     📍 456 Oak Ave          │       │
│  │  🗓️ Oct 19, 2025 02:15 PM                          │       │
│  │  👤 Collector: Sarah Lee                            │       │
│  │  🚛 Route: Afternoon Route B                        │       │
│  │  ⚖️ Weight: 30kg  📊 Fill: 60%                     │       │
│  └─────────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      PAYMENT SCREEN (💳)
═══════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│                                                                 │
│                          💰                                     │
│                     Coming Soon                                 │
│                                                                 │
│           Payment features will be available soon               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  Planned Features:                                  │       │
│  │  • View billing statements                          │       │
│  │  • Make online payments                             │       │
│  │  • Payment history                                  │       │
│  │  • Set up auto-pay                                  │       │
│  │  • Payment reminders                                │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└───────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                      SETTINGS SCREEN (⚙️)
═══════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│  HEADER                                    ┌──────────┐        │
│  Settings                                  │🚪 Logout │        │
│                                            └──────────┘        │
└───────────────────────────────────────────────────────────────┘
│                                                                 │
│  PROFILE INFORMATION                                            │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              ┌──────────┐                           │       │
│  │              │    JD    │  ← Avatar (Initials)     │       │
│  │              └──────────┘                           │       │
│  │                                                      │       │
│  │  Name:    John Doe                                  │       │
│  │  ─────────────────────────────────────────────      │       │
│  │  Email:   john.doe@example.com                      │       │
│  │  ─────────────────────────────────────────────      │       │
│  │  Phone:   555-0123                                  │       │
│  │  ─────────────────────────────────────────────      │       │
│  │  Role:    [Resident]                                │       │
│  │                                                      │       │
│  │         ┌────────────────────┐                      │       │
│  │         │  ✏️ Edit Profile   │                      │       │
│  │         └────────────────────┘                      │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  SECURITY                                                       │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  🔒  Change Password                           ›    │       │
│  │      Update your password to keep your              │       │
│  │      account secure                                 │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  ABOUT                                                          │
│  ┌─────────────────────────────────────────────────────┐       │
│  │  App Version:     1.0.0                             │       │
│  │  ─────────────────────────────────────────────      │       │
│  │  Account Type:    Resident                          │       │
│  │  ─────────────────────────────────────────────      │       │
│  │  Member Since:    Jan 2025                          │       │
│  └─────────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────┘

                           MODALS
              ┌─────────────────────────────┐
              │   Edit Profile Modal        │
              │   - First Name              │
              │   - Last Name               │
              │   - Email                   │
              │   - Phone                   │
              └─────────────────────────────┘
              ┌─────────────────────────────┐
              │   Change Password Modal     │
              │   - Current Password        │
              │   - New Password            │
              │   - Confirm Password        │
              └─────────────────────────────┘


═══════════════════════════════════════════════════════════════════
                     BOTTOM NAVIGATION BAR
═══════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────┐
│  🏠 Home  │  📋 History  │  💳 Payment  │  ⚙️ Settings      │
│  (Teal)   │   (Gray)     │   (Gray)     │    (Gray)          │
│  ────────                                                      │
└───────────────────────────────────────────────────────────────┘
     ↑
  Active Tab (Teal color, underline)
  Inactive Tabs (Gray color)


═══════════════════════════════════════════════════════════════════
                     COLOR CODING LEGEND
═══════════════════════════════════════════════════════════════════

Fill Level Progress Bars:
  🟢 Green    (<50%)   - Low fill level
  🟡 Yellow   (50-69%) - Medium fill level
  🟠 Orange   (70-89%) - High fill level
  🔴 Red      (≥90%)   - Critical fill level

Bin Type Badges:
  🟦 Blue     - General waste
  🟩 Green    - Recyclable
  🟫 Brown    - Organic

Status Indicators:
  🟢 Active   - Bin in use
  ⚪ Inactive - Bin not active
  📅 Scheduled - Bin scheduled for collection


═══════════════════════════════════════════════════════════════════
                     DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════

                    USER ACTIONS
                        │
                        ▼
            ┌───────────────────────┐
            │  React Native App     │
            │  (Frontend)           │
            └───────────────────────┘
                        │
                        │ API Calls
                        ▼
            ┌───────────────────────┐
            │  apiService.js        │
            │  (axios)              │
            └───────────────────────┘
                        │
                        │ HTTP Requests
                        ▼
            ┌───────────────────────┐
            │  Backend Server       │
            │  (Express.js)         │
            │  Port 3001            │
            └───────────────────────┘
                        │
                        │ Queries
                        ▼
            ┌───────────────────────┐
            │  MongoDB Database     │
            │  (Cloud Atlas)        │
            └───────────────────────┘


═══════════════════════════════════════════════════════════════════
                     COMPONENT HIERARCHY
═══════════════════════════════════════════════════════════════════

App.js
└── NavigationContainer
    └── AuthProvider
        └── UserProvider
            └── AppNavigator
                └── ResidentTabNavigator
                    ├── Tab: Home
                    │   └── ResidentHomeScreen
                    │       ├── ResidentBinCard (multiple)
                    │       └── AddBinModal
                    │
                    ├── Tab: History
                    │   └── CollectionHistoryScreen
                    │       └── CollectionHistoryCard (multiple)
                    │
                    ├── Tab: Payment
                    │   └── PaymentScreen
                    │
                    └── Tab: Settings
                        └── SettingsScreen
                            ├── ResidentEditProfileModal
                            └── ChangePasswordModal


═══════════════════════════════════════════════════════════════════
                     STATE MANAGEMENT
═══════════════════════════════════════════════════════════════════

Global State (Context):
  • AuthContext
    - user: Current user object
    - token: Authentication token
    - login(): Login function
    - logout(): Logout function
  
  • UserContext
    - user: User profile data
    - refreshUser(): Refresh user data

Local State (useState):
  • ResidentHomeScreen
    - bins: Array of bins
    - loading: Loading state
    - refreshing: Refresh state
    - modalVisible: Add bin modal visibility
  
  • CollectionHistoryScreen
    - collections: Array of collections
    - searchTerm: Search text
    - selectedBin: Filtered bin
    - loading: Loading state
  
  • SettingsScreen
    - editProfileModalVisible: Modal state
    - changePasswordModalVisible: Modal state


═══════════════════════════════════════════════════════════════════
                     API ENDPOINTS USED
═══════════════════════════════════════════════════════════════════

GET    /api/bins/resident
       → Fetch all bins for logged-in resident

GET    /api/bins/resident/collection-history
       → Fetch all collection history for resident's bins

POST   /api/bins/resident
       → Create a new bin for resident

PUT    /api/auth/profile
       → Update user profile (name, email, phone)

POST   /api/auth/change-password
       → Change user password

POST   /api/auth/logout
       → Logout user


═══════════════════════════════════════════════════════════════════
                     NAVIGATION FLOW
═══════════════════════════════════════════════════════════════════

Login Screen
     │
     ▼ (Login as Resident)
ResidentTabNavigator ◄──────┐
     │                      │
     ├─► Home Tab           │
     │   - View bins        │
     │   - Add bin          │
     │   - Tap bin (modal)  │
     │                      │
     ├─► History Tab        │
     │   - View collections │
     │   - Search           │
     │   - Filter           │
     │                      │
     ├─► Payment Tab        │
     │   - Coming soon      │
     │                      │
     └─► Settings Tab       │
         - View profile     │
         - Edit profile     │
         - Change password  │
         - Logout ──────────┘


═══════════════════════════════════════════════════════════════════
                     KEY FEATURES SUMMARY
═══════════════════════════════════════════════════════════════════

✅ NAVIGATION
   • 4 bottom tabs always visible
   • Smooth tab switching
   • No tab memory (fresh state)

✅ HOME
   • Stats overview
   • Bins list with progress bars
   • Add new bins
   • Bin details modal

✅ HISTORY
   • All collections displayed
   • Search functionality
   • Filter by bin
   • Pull to refresh

✅ PAYMENT
   • Professional placeholder
   • Coming soon message

✅ SETTINGS
   • Profile display
   • Edit profile with validation
   • Change password securely
   • Logout with confirmation

✅ DATA
   • Real-time from MongoDB
   • Pull-to-refresh
   • Loading indicators
   • Error handling


═══════════════════════════════════════════════════════════════════

           🎉 BOTTOM NAVIGATION IMPLEMENTATION COMPLETE 🎉

═══════════════════════════════════════════════════════════════════
```
