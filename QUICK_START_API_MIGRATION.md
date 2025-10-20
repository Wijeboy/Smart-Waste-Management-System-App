# Quick Start - API Migration

## 📋 Executive Summary

**Current State**: App uses mock data in Context providers and static files
**Goal**: Replace all mock data with real backend APIs
**Exclusion**: Analytics Dashboard (colleague's responsibility)
**Timeline**: 5 weeks for full implementation

---

## 📊 Mock Data Inventory

### Files with Mock Data:
1. ✅ **Authentication** - Already using real API
2. 🔲 `src/data/mockDatabase.js` - Trucks, bins, collections, routes (351 lines)
3. 🔲 `src/api/mockData.js` - Route info, stops, impact metrics (119 lines)
4. 🔲 `src/utils/mockData.js` - Analytics, KPIs, reports (144 lines)
5. 🔲 `src/context/BinsContext.js` - 3 hardcoded bins
6. 🔲 `src/context/RouteContext.js` - Using MOCK_STOPS
7. 🔲 `src/context/UserContext.js` - Hardcoded user profile

### Features Needing APIs:
- ✅ User Registration/Login (done)
- 🔲 Bin Management (CRUD)
- 🔲 Truck Management
- 🔲 Route Management
- 🔲 Collection Recording
- 🔲 Stop Management
- 🔲 Reports Generation
- 🔲 User Profile Updates

---

## 🚀 Implementation Order

### Phase 1: Foundation (Week 1) - START HERE
**Priority: Critical**
```
1. Create Bin model & API
2. Create Truck model & API
3. Update BinsContext to use API
4. Test bin CRUD operations
```

### Phase 2: Collections (Week 2)
```
1. Create Route model & API
2. Create Collection model & API
3. Create Stop model & API
4. Update RouteContext to use API
```

### Phase 3: Advanced Features (Week 3-4)
```
1. Reports API
2. Analytics API (KPIs only, not dashboard)
3. Profile management
4. Settings
```

### Phase 4: Polish (Week 5)
```
1. Image uploads
2. Offline support
3. Real-time updates
4. Performance optimization
```

---

## 🎯 Start with Phase 1 - Bins

### Backend Tasks (2-3 days):

**Step 1**: Create Bin Model
```bash
# File: backend/models/Bin.js
# See PHASE1_IMPLEMENTATION_GUIDE.md for complete code
```

**Step 2**: Create Bin Controller
```bash
# File: backend/controllers/binController.js
# Handles all CRUD operations
```

**Step 3**: Create Bin Routes
```bash
# File: backend/routes/bins.js
# Define API endpoints
```

**Step 4**: Update server.js
```javascript
app.use('/api/bins', require('./routes/bins'));
```

**Step 5**: Seed test data (optional)
```bash
node backend/scripts/seedBins.js
```

### Frontend Tasks (1-2 days):

**Step 1**: Add bin methods to API service
```bash
# File: waste-management-app/src/services/api.js
```

**Step 2**: Update BinsContext
```bash
# File: waste-management-app/src/context/BinsContext.js
# Replace mock data with API calls
```

**Step 3**: Test in app
- Login to app
- Navigate to bin management screens
- Verify bins load from API
- Test CRUD operations

---

## 📁 Files to Create/Modify

### Backend (New Files):
```
backend/
├── models/
│   ├── Bin.js ✨ NEW
│   ├── Truck.js ✨ NEW
│   ├── Route.js ✨ NEW
│   ├── Collection.js ✨ NEW
│   └── Stop.js ✨ NEW
├── controllers/
│   ├── binController.js ✨ NEW
│   ├── truckController.js ✨ NEW
│   ├── routeController.js ✨ NEW
│   ├── collectionController.js ✨ NEW
│   └── reportController.js ✨ NEW
└── routes/
    ├── bins.js ✨ NEW
    ├── trucks.js ✨ NEW
    ├── routes.js ✨ NEW
    ├── collections.js ✨ NEW
    └── reports.js ✨ NEW
```

### Frontend (Files to Modify):
```
waste-management-app/src/
├── services/
│   └── api.js ✏️ UPDATE (add bin/route/truck methods)
├── context/
│   ├── BinsContext.js ✏️ UPDATE (use API)
│   ├── RouteContext.js ✏️ UPDATE (use API)
│   └── UserContext.js ✏️ UPDATE (use API)
└── data/
    └── mockDatabase.js ❌ REMOVE (eventually)
```

---

## 🔑 Key API Endpoints to Implement

### Bins (Phase 1)
```
GET    /api/bins              - Get all bins
POST   /api/bins              - Create bin
GET    /api/bins/:id          - Get single bin
PUT    /api/bins/:id          - Update bin
DELETE /api/bins/:id          - Delete bin
GET    /api/bins/stats        - Get statistics
PATCH  /api/bins/:id/status   - Update status
```

### Routes (Phase 2)
```
GET    /api/routes            - Get all routes
POST   /api/routes            - Create route
GET    /api/routes/:id        - Get route details
PUT    /api/routes/:id        - Update route
POST   /api/routes/:id/start  - Start route
POST   /api/routes/:id/complete - Complete route
```

### Collections (Phase 2)
```
GET    /api/collections       - Get all collections
POST   /api/collections       - Create collection
PUT    /api/collections/:id   - Update collection
POST   /api/collections/:id/bin - Add bin to collection
```

### Reports (Phase 3)
```
GET    /api/reports/daily     - Daily report
GET    /api/reports/weekly    - Weekly report
GET    /api/reports/monthly   - Monthly report
POST   /api/reports/generate  - Custom report
```

---

## 💻 Code Pattern Example

### Backend Pattern:
```javascript
// Model
const binSchema = new mongoose.Schema({
  binId: { type: String, unique: true },
  location: { type: String, required: true },
  // ... other fields
});

// Controller
exports.getAllBins = async (req, res) => {
  const bins = await Bin.find();
  res.json({ success: true, data: bins });
};

// Route
router.get('/bins', protect, getAllBins);
```

### Frontend Pattern:
```javascript
// API Service
async getBins() {
  return this.request('/bins', { method: 'GET' });
}

// Context
const fetchBins = async () => {
  setLoading(true);
  const response = await apiService.getBins();
  setBins(response.data);
  setLoading(false);
};

// Component
const { bins, loading } = useBins();
if (loading) return <Loading />;
return <BinList bins={bins} />;
```

---

## ✅ Testing Checklist

### Backend Testing:
- [ ] Can create bin via Postman
- [ ] Can get all bins
- [ ] Can update bin
- [ ] Can delete bin
- [ ] Stats endpoint returns correct data
- [ ] Authentication required for all endpoints
- [ ] Validation errors return proper messages

### Frontend Testing:
- [ ] Bins load when app starts
- [ ] Can add new bin from UI
- [ ] Can edit existing bin
- [ ] Can delete bin
- [ ] Loading state shows while fetching
- [ ] Errors display to user
- [ ] Data persists after app reload

---

## 🐛 Common Issues

### Issue: "Cannot connect to server"
**Solution**: Backend not running or wrong API URL
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd waste-management-app && npm start
```

### Issue: "Unauthorized"
**Solution**: Not logged in or token expired
- Login again
- Check token in AsyncStorage
- Verify protect middleware working

### Issue: Bins showing as empty array
**Solution**: No bins in database
```bash
node backend/scripts/seedBins.js
```

### Issue: Duplicate key error
**Solution**: Bin ID already exists
- Let it auto-generate
- Or check uniqueness before creating

---

## 📚 Documentation References

1. **`API_IMPLEMENTATION_PLAN.md`** - Complete 5-week plan
2. **`PHASE1_IMPLEMENTATION_GUIDE.md`** - Step-by-step code examples
3. **Backend README** - API documentation
4. **Frontend API docs** - Service methods

---

## 🎓 Learning Resources

### MongoDB/Mongoose:
- Schema design
- Validation
- Relationships (refs)
- Aggregation

### Express:
- Routing
- Middleware
- Error handling
- Authentication

### React Native:
- Context API
- Async operations
- Error boundaries
- Loading states

---

## 📞 Getting Help

### If Stuck:
1. Check console logs (both terminals)
2. Use Postman to test backend directly
3. Add console.log() everywhere
4. Check if backend running
5. Verify authentication working
6. Check MongoDB connection

### Debug Steps:
```javascript
// Backend
console.log('Request received:', req.body);
console.log('User:', req.user);
console.log('Query result:', bins);

// Frontend
console.log('Fetching bins...');
console.log('API Response:', response);
console.log('Bins state:', bins);
```

---

## 🎯 Success Metrics

### Week 1 Goals:
- ✅ Bin CRUD fully working
- ✅ At least 5 test bins in database
- ✅ Frontend loading bins from API
- ✅ No console errors
- ✅ Can add/edit/delete from UI

### Week 2 Goals:
- ✅ Routes API complete
- ✅ Collections API complete
- ✅ Route progress tracking works
- ✅ Can start/complete routes

### End Goals:
- ✅ All mock data replaced
- ✅ All features working with real API
- ✅ Reports generating
- ✅ User settings persisting
- ✅ App ready for production

---

## 🚀 Quick Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd waste-management-app && npm start

# Seed bins
node backend/scripts/seedBins.js

# Test API
curl http://localhost:5000/api/health

# Check MongoDB
mongo
show dbs
use waste_management
show collections
db.bins.find()
```

---

## 📈 Progress Tracking

Create a checklist file to track progress:

```markdown
## Phase 1: Bins
- [ ] Bin model created
- [ ] Bin controller created
- [ ] Bin routes created
- [ ] API service updated
- [ ] BinsContext updated
- [ ] Testing complete

## Phase 2: Routes
- [ ] Route model created
- [ ] Route controller created
...
```

---

## 💡 Pro Tips

1. **Start Small**: Get bins working first before moving to complex features
2. **Test Often**: Test each endpoint immediately after creating it
3. **Use Postman**: Create a collection for all endpoints
4. **Console Log**: Add lots of logs during development
5. **Error Handling**: Always handle errors gracefully
6. **Loading States**: Show loading indicators for better UX
7. **Validation**: Validate on both frontend and backend
8. **Documentation**: Document as you build

---

## 🎉 Next Steps

1. **Read** `API_IMPLEMENTATION_PLAN.md` for full details
2. **Start** with `PHASE1_IMPLEMENTATION_GUIDE.md`
3. **Create** Bin model, controller, routes
4. **Test** with Postman
5. **Update** frontend BinsContext
6. **Verify** everything works
7. **Move** to Phase 2

---

**Good luck! You've got this! 🚀**

For detailed code examples, see:
- `PHASE1_IMPLEMENTATION_GUIDE.md`
- `API_IMPLEMENTATION_PLAN.md`
