/**
 * Mock Data
 * Contains mock data for testing and development purposes.
 */

/**
 * Mock route information
 * @constant {Object} MOCK_ROUTE_INFO
 */
export const MOCK_ROUTE_INFO = {
  routeNumber: 'Route #12',
  district: 'Central District',
  assignedTo: 'Alex',
};

/**
 * Mock impact metrics for environmental tracking
 * @constant {Object} MOCK_IMPACT_METRICS
 */
export const MOCK_IMPACT_METRICS = {
  recycled: { value: 1.2, unit: 'tons' },
  co2Saved: { value: 89, unit: 'kg' },
  treesSaved: { value: 3.2, unit: '' },
};

/**
 * Mock collections by type
 * @constant {Array<Object>} MOCK_COLLECTIONS_BY_TYPE
 */
export const MOCK_COLLECTIONS_BY_TYPE = [
  { id: 1, type: 'General', icon: 'trash', count: 28 },
  { id: 2, type: 'Recyclable', icon: 'recycle', count: 15 },
  { id: 3, type: 'Organic', icon: 'leaf', count: 12 },
];

/**
 * Mock array of stop objects for bin collection routes
 * @constant {Array<Object>} MOCK_STOPS
 */
export const MOCK_STOPS = [
  {
    id: 1,
    binId: 'BIN-023',
    address: '567 Cedar Ave',
    status: 'pending',
    priority: 'high',
    distance: '0.2 km',
    fillLevel: 95,
    weight: 18.5,
    collectionType: 'general',
  },
  {
    id: 2,
    binId: 'BIN-024',
    address: '890 Birch St',
    status: 'pending',
    priority: 'normal',
    distance: '0.5 km',
    fillLevel: 78,
    weight: 14.2,
    collectionType: 'recyclable',
  },
  {
    id: 3,
    binId: 'BIN-025',
    address: '234 Maple Dr',
    status: 'pending',
    priority: 'normal',
    distance: '0.8 km',
    fillLevel: 65,
    weight: 12.8,
    collectionType: 'organic',
  },
  {
    id: 4,
    binId: 'BIN-026',
    address: '456 Oak Avenue, Westside',
    status: 'completed',
    priority: 'high',
    distance: '1.2 km',
    fillLevel: 88,
    weight: 16.3,
    collectionType: 'general',
  },
  {
    id: 5,
    binId: 'BIN-027',
    address: '789 Pine Road, Eastside',
    status: 'completed',
    priority: 'normal',
    distance: '1.5 km',
    fillLevel: 72,
    weight: 13.5,
    collectionType: 'recyclable',
  },
  {
    id: 6,
    binId: 'BIN-028',
    address: '321 Maple Drive, Northside',
    status: 'completed',
    priority: 'normal',
    distance: '1.8 km',
    fillLevel: 55,
    weight: 10.2,
    collectionType: 'organic',
  },
  {
    id: 7,
    binId: 'BIN-029',
    address: '654 Elm Street, Southside',
    status: 'completed',
    priority: 'high',
    distance: '2.1 km',
    fillLevel: 92,
    weight: 17.8,
    collectionType: 'general',
  },
];
