# API Implementation Plan - Smart Waste Management System

## Executive Summary

This document outlines the comprehensive plan to replace mock data with backend API endpoints for the Smart Waste Management System. The plan covers all features except the Analytics Dashboard (to be implemented by colleague).

## Current State Analysis

### Mock Data Locations
1. **`src/data/mockDatabase.js`** - Main database with trucks, bins, collections, routes, and analytics
2. **`src/api/mockData.js`** - Route info, impact metrics, stops, collections by type
3. **`src/utils/mockData.js`** - Analytics data, KPIs, trends, financial data
4. **`src/context/BinsContext.js`** - Initial bins array (3 items)
5. **`src/context/RouteContext.js`** - Using mock stops, route info, impact metrics
6. **`src/context/UserContext.js`** - Initial user profile data

### Current Features Using Mock Data
1. **Bin Collection Management** (BinCollection screens)
   - Dashboard with route progress
   - Route management with stops
   - Bin scanning
   - Reports
   - Profile management

2. **Data Collection & Processing** (standalone screens)
   - Data collection
   - Data processing
   - Analysis
   - Performance metrics
   - Reports

3. **User Management**
   - Profile settings
   - User preferences

## Implementation Phases

---

## PHASE 1: Core Data Models & Authentication Enhancement (Week 1)

### 1.1 Backend Database Models

Create MongoDB schemas for all entities:

#### Models to Create:

**`models/Bin.js`**
```javascript
{
  binId: String (unique),
  location: String,
  zone: String,
  binType: String (enum: 'General Waste', 'Recyclable', 'Organic', 'Hazardous'),
  capacity: Number (kg),
  status: String (enum: 'active', 'inactive', 'maintenance', 'full'),
  fillLevel: Number (0-100),
  weight: Number,
  coordinates: {
    lat: Number,
    lng: Number
  },
  registrationDate: Date,
  lastCollection: Date,
  createdBy: ObjectId (ref: User),
  updatedAt: Date
}
```

**`models/Truck.js`**
```javascript
{
  truckId: String (unique),
  driverName: String,
  driverId: ObjectId (ref: User),
  licensePlate: String (unique),
  capacity: Number (kg),
  status: String (enum: 'active', 'inactive', 'maintenance', 'on-route'),
  currentRoute: ObjectId (ref: Route),
  registrationDate: Date,
  lastMaintenance: Date,
  nextMaintenance: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**`models/Route.js`**
```javascript
{
  routeId: String (unique),
  name: String,
  zones: [String],
  bins: [ObjectId] (ref: Bin),
  assignedTruck: ObjectId (ref: Truck),
  assignedDriver: ObjectId (ref: User),
  status: String (enum: 'scheduled', 'in-progress', 'completed', 'cancelled'),
  estimatedTime: Number (minutes),
  actualTime: Number (minutes),
  distance: Number (km),
  startTime: Date,
  endTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**`models/Collection.js`**
```javascript
{
  collectionId: String (unique),
  truckId: ObjectId (ref: Truck),
  routeId: ObjectId (ref: Route),
  driverId: ObjectId (ref: User),
  date: Date,
  binsCollected: [{
    binId: ObjectId (ref: Bin),
    wasteWeight: Number,
    binType: String,
    collectionTime: Date,
    fillLevel: Number,
    notes: String
  }],
  totalWeight: Number,
  totalBins: Number,
  status: String (enum: 'in-progress', 'completed', 'cancelled'),
  startTime: Date,
  endTime: Date,
  location: {
    start: { lat: Number, lng: Number },
    end: { lat: Number, lng: Number }
  },
  createdAt: Date,
  updatedAt: Date
}
```

**`models/Stop.js`**
```javascript
{
  binId: ObjectId (ref: Bin),
  routeId: ObjectId (ref: Route),
  collectionId: ObjectId (ref: Collection),
  address: String,
  status: String (enum: 'pending', 'in-progress', 'completed', 'skipped'),
  priority: String (enum: 'high', 'normal', 'low'),
  distance: Number,
  fillLevel: Number,
  weight: Number,
  collectionType: String,
  scheduledTime: Date,
  actualTime: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 1.2 Enhance User Model

Update existing `models/User.js` to include:
```javascript
{
  // ... existing fields (firstName, lastName, etc.)
  role: String (enum: ['user', 'admin', 'collector', 'supervisor']),
  employeeId: String (unique),
  assignedTruck: ObjectId (ref: Truck),
  assignedRoutes: [ObjectId] (ref: Route),
  settings: {
    audioConfirmation: Boolean,
    vibrationFeedback: Boolean,
    autoSync: Boolean,
    notifications: Boolean
  },
  lastLogin: Date,
  // ... existing timestamps
}
```

---

## PHASE 2: Bin Management APIs (Week 1-2)

### 2.1 Backend API Endpoints

Create `/backend/routes/bins.js`:

```
GET    /api/bins                 - Get all bins (with filters)
GET    /api/bins/:id             - Get single bin
POST   /api/bins                 - Create new bin
PUT    /api/bins/:id             - Update bin
DELETE /api/bins/:id             - Delete bin
GET    /api/bins/stats           - Get bin statistics
GET    /api/bins/zone/:zone      - Get bins by zone
GET    /api/bins/type/:type      - Get bins by type
GET    /api/bins/status/:status  - Get bins by status
PATCH  /api/bins/:id/status      - Update bin status only
PATCH  /api/bins/:id/fillLevel   - Update fill level
```

Create `/backend/controllers/binController.js` with all CRUD operations.

### 2.2 Frontend API Service

Update `/waste-management-app/src/services/api.js`:

```javascript
// Bin endpoints
async getBins(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return this.request(`/bins?${queryParams}`, { method: 'GET' });
}

async getBinById(id) {
  return this.request(`/bins/${id}`, { method: 'GET' });
}

async createBin(binData) {
  return this.request('/bins', {
    method: 'POST',
    body: JSON.stringify(binData)
  });
}

async updateBin(id, updates) {
  return this.request(`/bins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

async deleteBin(id) {
  return this.request(`/bins/${id}`, { method: 'DELETE' });
}

async getBinStats() {
  return this.request('/bins/stats', { method: 'GET' });
}
```

### 2.3 Update BinsContext

Modify `/src/context/BinsContext.js`:
- Remove `INITIAL_BINS` constant
- Add `loading` and `error` states
- Fetch bins from API on mount
- Update all CRUD functions to call API
- Add loading/error handling

---

## PHASE 3: Route & Collection Management APIs (Week 2-3)

### 3.1 Backend API Endpoints

Create `/backend/routes/routes.js`:

```
GET    /api/routes                    - Get all routes
GET    /api/routes/:id                - Get single route
POST   /api/routes                    - Create new route
PUT    /api/routes/:id                - Update route
DELETE /api/routes/:id                - Delete route
GET    /api/routes/active             - Get active routes
GET    /api/routes/:id/stops          - Get route stops
POST   /api/routes/:id/start          - Start route
POST   /api/routes/:id/complete       - Complete route
GET    /api/routes/driver/:driverId   - Get routes by driver
GET    /api/routes/stats              - Get route statistics
```

Create `/backend/routes/collections.js`:

```
GET    /api/collections               - Get all collections
GET    /api/collections/:id           - Get single collection
POST   /api/collections               - Create collection record
PUT    /api/collections/:id           - Update collection
DELETE /api/collections/:id           - Delete collection
GET    /api/collections/route/:routeId - Get collections by route
GET    /api/collections/date/:date    - Get collections by date
GET    /api/collections/stats         - Get collection statistics
POST   /api/collections/:id/bin       - Add bin to collection
```

Create `/backend/routes/stops.js`:

```
GET    /api/stops                     - Get all stops
GET    /api/stops/:id                 - Get single stop
POST   /api/stops                     - Create stop
PUT    /api/stops/:id                 - Update stop
DELETE /api/stops/:id                 - Delete stop
PATCH  /api/stops/:id/status          - Update stop status
GET    /api/stops/route/:routeId      - Get stops by route
GET    /api/stops/pending             - Get pending stops
```

### 3.2 Frontend API Service

Add to `/src/services/api.js`:

```javascript
// Route endpoints
async getRoutes(filters = {}) { ... }
async getRouteById(id) { ... }
async createRoute(routeData) { ... }
async updateRoute(id, updates) { ... }
async startRoute(id) { ... }
async completeRoute(id) { ... }
async getRouteStops(id) { ... }
async getRouteStats() { ... }

// Collection endpoints
async getCollections(filters = {}) { ... }
async getCollectionById(id) { ... }
async createCollection(data) { ... }
async updateCollection(id, updates) { ... }
async addBinToCollection(collectionId, binData) { ... }
async getCollectionStats() { ... }

// Stop endpoints
async getStops(filters = {}) { ... }
async getStopById(id) { ... }
async updateStopStatus(id, status) { ... }
async getPendingStops() { ... }
```

### 3.3 Update RouteContext

Modify `/src/context/RouteContext.js`:
- Remove mock data imports
- Fetch data from API
- Add loading/error states
- Update all functions to use API
- Add real-time updates capability

---

## PHASE 4: Truck Management APIs (Week 3)

### 4.1 Backend API Endpoints

Create `/backend/routes/trucks.js`:

```
GET    /api/trucks                - Get all trucks
GET    /api/trucks/:id            - Get single truck
POST   /api/trucks                - Register new truck
PUT    /api/trucks/:id            - Update truck
DELETE /api/trucks/:id            - Delete truck
PATCH  /api/trucks/:id/status     - Update truck status
GET    /api/trucks/available      - Get available trucks
GET    /api/trucks/maintenance    - Get trucks in maintenance
GET    /api/trucks/:id/routes     - Get truck's route history
GET    /api/trucks/stats          - Get truck statistics
```

### 4.2 Frontend Integration

Add truck management to API service and create new context if needed.

---

## PHASE 5: Report & Analytics APIs (Week 4)

### 5.1 Backend API Endpoints

Create `/backend/routes/reports.js`:

```
GET    /api/reports/daily           - Get daily report
GET    /api/reports/weekly          - Get weekly report
GET    /api/reports/monthly         - Get monthly report
GET    /api/reports/custom          - Get custom date range report
GET    /api/reports/collection      - Get collection report
GET    /api/reports/performance     - Get performance report
GET    /api/reports/financial       - Get financial report
POST   /api/reports/generate        - Generate custom report
GET    /api/reports/export/:id      - Export report (PDF/CSV)
```

Create `/backend/routes/analytics.js` (skip dashboard, but keep these for reports):

```
GET    /api/analytics/kpis          - Get KPIs
GET    /api/analytics/trends        - Get trends data
GET    /api/analytics/waste-distribution - Get waste type distribution
GET    /api/analytics/route-performance - Get route performance
GET    /api/analytics/crew-performance  - Get crew performance
```

### 5.2 Frontend Integration

Update relevant screens to fetch real data from these endpoints.

---

## PHASE 6: User Profile Management (Week 4)

### 6.1 Backend API Endpoints

Update `/backend/routes/auth.js`:

```
GET    /api/auth/profile          - Get user profile (existing)
PUT    /api/auth/profile          - Update profile (existing)
PUT    /api/auth/settings         - Update settings
POST   /api/auth/change-password  - Change password
GET    /api/auth/activity         - Get user activity log
```

### 6.2 Update UserContext

Modify `/src/context/UserContext.js`:
- Remove hardcoded initial user
- Fetch user from AuthContext instead
- Link user data with logged-in user
- Update settings via API

---

## PHASE 7: Real-time Features & Optimization (Week 5)

### 7.1 WebSocket Integration (Optional but Recommended)

For real-time updates:
- Route progress updates
- Bin fill level monitoring
- Live truck location tracking
- Collection status updates

### 7.2 Caching & Offline Support

Implement:
- AsyncStorage for offline data caching
- Sync queue for offline operations
- Conflict resolution strategies

### 7.3 Image Upload Support

For:
- Bin photos
- Collection proof photos
- User avatars
- Damage reports

Add to backend:
```
POST   /api/upload/image          - Upload image
GET    /api/upload/image/:id      - Get image
DELETE /api/upload/image/:id      - Delete image
```

---

## Implementation Priority Order

### Priority 1 (Critical - Week 1-2)
1. ✅ User authentication (already done)
2. 🔲 Bin management APIs & integration
3. 🔲 Route management APIs & integration
4. 🔲 Basic collection recording

### Priority 2 (High - Week 2-3)
5. 🔲 Stop management
6. 🔲 Collection details & history
7. 🔲 Truck management
8. 🔲 Profile updates

### Priority 3 (Medium - Week 3-4)
9. 🔲 Reports generation
10. 🔲 Basic analytics (KPIs)
11. 🔲 Route performance tracking
12. 🔲 Settings management

### Priority 4 (Low - Week 4-5)
13. 🔲 Advanced reports
14. 🔲 Export functionality
15. 🔲 Image uploads
16. 🔲 Real-time updates
17. 🔲 Offline support

---

## File Structure Changes

### Backend Structure
```
backend/
├── models/
│   ├── User.js (existing - enhance)
│   ├── Bin.js (new)
│   ├── Truck.js (new)
│   ├── Route.js (new)
│   ├── Collection.js (new)
│   ├── Stop.js (new)
│   └── Report.js (new)
├── controllers/
│   ├── authController.js (existing)
│   ├── binController.js (new)
│   ├── truckController.js (new)
│   ├── routeController.js (new)
│   ├── collectionController.js (new)
│   ├── stopController.js (new)
│   ├── reportController.js (new)
│   └── analyticsController.js (new)
├── routes/
│   ├── auth.js (existing)
│   ├── bins.js (new)
│   ├── trucks.js (new)
│   ├── routes.js (new)
│   ├── collections.js (new)
│   ├── stops.js (new)
│   ├── reports.js (new)
│   └── analytics.js (new)
├── middleware/
│   ├── auth.js (existing)
│   ├── validation.js (new)
│   ├── upload.js (new)
│   └── errorHandler.js (new)
└── utils/
    ├── reportGenerator.js (new)
    ├── statistics.js (new)
    └── dateHelpers.js (new)
```

### Frontend Structure
```
waste-management-app/src/
├── services/
│   ├── api.js (update - add all endpoints)
│   └── storage.js (new - for offline caching)
├── context/
│   ├── AuthContext.js (existing)
│   ├── BinsContext.js (update - use API)
│   ├── RouteContext.js (update - use API)
│   ├── UserContext.js (update - use API)
│   ├── TruckContext.js (new)
│   └── CollectionContext.js (new)
├── hooks/
│   ├── useApi.js (new - custom hook for API calls)
│   ├── useCache.js (new - for caching)
│   └── useOffline.js (new - offline detection)
└── data/
    ├── mockDatabase.js (deprecate/remove)
    └── constants.js (new - for enums and constants)
```

---

## Migration Strategy

### Step 1: Parallel Development
- Keep mock data working while developing APIs
- Add feature flags to switch between mock and real data

### Step 2: Gradual Rollout
- Replace mock data feature by feature
- Test each feature independently
- Keep fallback to mock data if API fails

### Step 3: Complete Migration
- Remove all mock data files
- Remove feature flags
- Update documentation

---

## Testing Strategy

### Backend Testing
- Unit tests for each controller function
- Integration tests for API endpoints
- Database seeding for test data
- API documentation with examples

### Frontend Testing
- Test API service functions
- Test context providers with real API
- Test error handling
- Test offline scenarios

---

## Error Handling Guidelines

### Backend
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for development
- Generic messages for production
- Logging for debugging

### Frontend
- User-friendly error messages
- Loading states for all API calls
- Retry mechanism for failed requests
- Offline mode detection
- Error boundaries for crash prevention

---

## Data Validation

### Backend Validation
- Input validation using express-validator
- Schema validation with Mongoose
- Business logic validation
- Permission checks

### Frontend Validation
- Form validation before API calls
- Type checking
- Format validation (dates, phone, NIC)
- Required field checks

---

## Security Considerations

1. **Authentication**: JWT tokens (already implemented)
2. **Authorization**: Role-based access control
3. **Data Protection**: Encrypt sensitive data
4. **API Security**: Rate limiting, CORS, input sanitization
5. **File Uploads**: Validate file types and sizes
6. **Audit Logging**: Track all data modifications

---

## Performance Optimization

1. **Pagination**: Implement for large data sets
2. **Caching**: Cache frequently accessed data
3. **Indexing**: Database indexes on commonly queried fields
4. **Lazy Loading**: Load data as needed
5. **Compression**: Enable gzip compression
6. **CDN**: For static assets and images

---

## API Documentation

Create comprehensive API documentation using:
- Swagger/OpenAPI specification
- Postman collection
- Example requests and responses
- Error codes and meanings

---

## Monitoring & Logging

1. **Backend Logging**: Winston or Morgan
2. **Error Tracking**: Sentry or similar
3. **Performance Monitoring**: New Relic or similar
4. **API Analytics**: Track usage, response times
5. **Database Monitoring**: Monitor query performance

---

## Timeline Summary

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 | Week 1 | Database models, enhanced auth |
| Phase 2 | Week 1-2 | Bin management complete |
| Phase 3 | Week 2-3 | Route & collection management |
| Phase 4 | Week 3 | Truck management |
| Phase 5 | Week 4 | Reports & analytics |
| Phase 6 | Week 4 | Profile management |
| Phase 7 | Week 5 | Real-time & optimization |

**Total Estimated Time**: 5 weeks (1 developer full-time)

---

## Success Criteria

✅ All mock data replaced with real API calls
✅ Full CRUD operations for all entities
✅ Authentication and authorization working
✅ Error handling implemented
✅ Loading states for all async operations
✅ Offline support (basic)
✅ Reports generation working
✅ API documentation complete
✅ Unit and integration tests passing
✅ Performance benchmarks met

---

## Next Steps

1. **Review and approve this plan**
2. **Set up development environment**
3. **Create GitHub issues for each phase**
4. **Begin with Phase 1 implementation**
5. **Daily standups to track progress**
6. **Weekly demos of completed features**

---

## Notes

- Analytics Dashboard excluded as per request (colleague responsibility)
- Authentication already implemented ✅
- Focus on core waste collection management features
- Maintain backward compatibility during migration
- Document all APIs as you build them
- Create Postman collection for testing

---

## Questions to Address

1. Do we need real-time updates or is polling acceptable?
2. What's the expected number of bins/trucks in production?
3. Do we need historical data migration?
4. What report formats are required (PDF, CSV, Excel)?
5. Do we need multi-language support?
6. What's the offline usage pattern?
7. Image storage: local server or cloud (S3)?

---

## Resources Needed

- MongoDB Atlas account (or local MongoDB)
- Cloud storage for images (optional)
- Testing devices/emulators
- API testing tools (Postman)
- Code editor with debugging tools

---

_Last Updated: October 20, 2025_
_Version: 1.0_
_Author: Development Team_
