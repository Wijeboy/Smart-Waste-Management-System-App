/**
 * Mock Data Tests
 * Tests for mock data structure and content validation
 */

import { 
  MOCK_STOPS, 
  MOCK_ROUTE_INFO, 
  MOCK_IMPACT_METRICS, 
  MOCK_COLLECTIONS_BY_TYPE 
} from '../mockData';

describe('MOCK_STOPS', () => {
  it('should be defined and be an array', () => {
    expect(MOCK_STOPS).toBeDefined();
    expect(Array.isArray(MOCK_STOPS)).toBe(true);
  });

  it('should have at least 5 stops', () => {
    expect(MOCK_STOPS.length).toBeGreaterThanOrEqual(5);
  });

  it('should have all required fields for each stop', () => {
    MOCK_STOPS.forEach((stop) => {
      expect(stop).toHaveProperty('id');
      expect(stop).toHaveProperty('binId');
      expect(stop).toHaveProperty('address');
      expect(stop).toHaveProperty('status');
      expect(stop).toHaveProperty('priority');
      expect(stop).toHaveProperty('distance');
      expect(stop).toHaveProperty('fillLevel');
      expect(stop).toHaveProperty('collectionType');
    });
  });

  it('should have valid id values', () => {
    MOCK_STOPS.forEach((stop) => {
      expect(typeof stop.id).toBe('number');
      expect(stop.id).toBeGreaterThan(0);
    });
  });

  it('should have valid binId format', () => {
    MOCK_STOPS.forEach((stop) => {
      expect(typeof stop.binId).toBe('string');
      expect(stop.binId).toMatch(/^BIN-\d{3}$/);
    });
  });

  it('should have valid status values', () => {
    const validStatuses = ['pending', 'completed', 'in-progress'];
    MOCK_STOPS.forEach((stop) => {
      expect(validStatuses).toContain(stop.status);
    });
  });

  it('should have valid priority values', () => {
    const validPriorities = ['high', 'normal', 'low'];
    MOCK_STOPS.forEach((stop) => {
      expect(validPriorities).toContain(stop.priority);
    });
  });

  it('should have valid distance format', () => {
    MOCK_STOPS.forEach((stop) => {
      expect(typeof stop.distance).toBe('string');
      expect(stop.distance).toMatch(/^\d+(\.\d+)?\s*km$/);
    });
  });

  it('should have valid fillLevel percentage', () => {
    MOCK_STOPS.forEach((stop) => {
      expect(typeof stop.fillLevel).toBe('number');
      expect(stop.fillLevel).toBeGreaterThanOrEqual(0);
      expect(stop.fillLevel).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid collectionType values', () => {
    const validTypes = ['general', 'recyclable', 'organic'];
    MOCK_STOPS.forEach((stop) => {
      expect(validTypes).toContain(stop.collectionType);
    });
  });
});

describe('MOCK_ROUTE_INFO', () => {
  it('should be defined and be an object', () => {
    expect(MOCK_ROUTE_INFO).toBeDefined();
    expect(typeof MOCK_ROUTE_INFO).toBe('object');
  });

  it('should have all required fields', () => {
    expect(MOCK_ROUTE_INFO).toHaveProperty('routeNumber');
    expect(MOCK_ROUTE_INFO).toHaveProperty('district');
    expect(MOCK_ROUTE_INFO).toHaveProperty('assignedTo');
  });

  it('should have valid routeNumber format', () => {
    expect(typeof MOCK_ROUTE_INFO.routeNumber).toBe('string');
    expect(MOCK_ROUTE_INFO.routeNumber).toMatch(/^Route #\d+$/);
  });

  it('should have valid district name', () => {
    expect(typeof MOCK_ROUTE_INFO.district).toBe('string');
    expect(MOCK_ROUTE_INFO.district.length).toBeGreaterThan(0);
  });

  it('should have valid assignedTo name', () => {
    expect(typeof MOCK_ROUTE_INFO.assignedTo).toBe('string');
    expect(MOCK_ROUTE_INFO.assignedTo.length).toBeGreaterThan(0);
  });
});

describe('MOCK_IMPACT_METRICS', () => {
  it('should be defined and be an object', () => {
    expect(MOCK_IMPACT_METRICS).toBeDefined();
    expect(typeof MOCK_IMPACT_METRICS).toBe('object');
  });

  it('should have all required impact fields', () => {
    expect(MOCK_IMPACT_METRICS).toHaveProperty('recycled');
    expect(MOCK_IMPACT_METRICS).toHaveProperty('co2Saved');
    expect(MOCK_IMPACT_METRICS).toHaveProperty('treesSaved');
  });

  it('should have valid recycled metric', () => {
    expect(MOCK_IMPACT_METRICS.recycled).toHaveProperty('value');
    expect(MOCK_IMPACT_METRICS.recycled).toHaveProperty('unit');
    expect(typeof MOCK_IMPACT_METRICS.recycled.value).toBe('number');
    expect(MOCK_IMPACT_METRICS.recycled.value).toBeGreaterThanOrEqual(0);
    expect(MOCK_IMPACT_METRICS.recycled.unit).toBe('tons');
  });

  it('should have valid co2Saved metric', () => {
    expect(MOCK_IMPACT_METRICS.co2Saved).toHaveProperty('value');
    expect(MOCK_IMPACT_METRICS.co2Saved).toHaveProperty('unit');
    expect(typeof MOCK_IMPACT_METRICS.co2Saved.value).toBe('number');
    expect(MOCK_IMPACT_METRICS.co2Saved.value).toBeGreaterThanOrEqual(0);
    expect(MOCK_IMPACT_METRICS.co2Saved.unit).toBe('kg');
  });

  it('should have valid treesSaved metric', () => {
    expect(MOCK_IMPACT_METRICS.treesSaved).toHaveProperty('value');
    expect(MOCK_IMPACT_METRICS.treesSaved).toHaveProperty('unit');
    expect(typeof MOCK_IMPACT_METRICS.treesSaved.value).toBe('number');
    expect(MOCK_IMPACT_METRICS.treesSaved.value).toBeGreaterThanOrEqual(0);
  });
});

describe('MOCK_COLLECTIONS_BY_TYPE', () => {
  it('should be defined and be an array', () => {
    expect(MOCK_COLLECTIONS_BY_TYPE).toBeDefined();
    expect(Array.isArray(MOCK_COLLECTIONS_BY_TYPE)).toBe(true);
  });

  it('should have at least 3 collection types', () => {
    expect(MOCK_COLLECTIONS_BY_TYPE.length).toBeGreaterThanOrEqual(3);
  });

  it('should have all required fields for each collection type', () => {
    MOCK_COLLECTIONS_BY_TYPE.forEach((collection) => {
      expect(collection).toHaveProperty('id');
      expect(collection).toHaveProperty('type');
      expect(collection).toHaveProperty('icon');
      expect(collection).toHaveProperty('count');
    });
  });

  it('should have valid id values', () => {
    MOCK_COLLECTIONS_BY_TYPE.forEach((collection) => {
      expect(typeof collection.id).toBe('number');
      expect(collection.id).toBeGreaterThan(0);
    });
  });

  it('should have valid type names', () => {
    const validTypes = ['General', 'Recyclable', 'Organic'];
    MOCK_COLLECTIONS_BY_TYPE.forEach((collection) => {
      expect(validTypes).toContain(collection.type);
    });
  });

  it('should have valid icon names', () => {
    MOCK_COLLECTIONS_BY_TYPE.forEach((collection) => {
      expect(typeof collection.icon).toBe('string');
      expect(collection.icon.length).toBeGreaterThan(0);
    });
  });

  it('should have valid count values', () => {
    MOCK_COLLECTIONS_BY_TYPE.forEach((collection) => {
      expect(typeof collection.count).toBe('number');
      expect(collection.count).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have unique ids', () => {
    const ids = MOCK_COLLECTIONS_BY_TYPE.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('Data Consistency', () => {
  it('should have collection counts match stops count by type', () => {
    const generalCount = MOCK_STOPS.filter(s => s.collectionType === 'general' && s.status === 'completed').length;
    const recyclableCount = MOCK_STOPS.filter(s => s.collectionType === 'recyclable' && s.status === 'completed').length;
    const organicCount = MOCK_STOPS.filter(s => s.collectionType === 'organic' && s.status === 'completed').length;

    const generalCollection = MOCK_COLLECTIONS_BY_TYPE.find(c => c.type === 'General');
    const recyclableCollection = MOCK_COLLECTIONS_BY_TYPE.find(c => c.type === 'Recyclable');
    const organicCollection = MOCK_COLLECTIONS_BY_TYPE.find(c => c.type === 'Organic');

    // These should be consistent with completed stops
    expect(generalCollection).toBeDefined();
    expect(recyclableCollection).toBeDefined();
    expect(organicCollection).toBeDefined();
  });

  it('should have unique stop ids', () => {
    const ids = MOCK_STOPS.map((stop) => stop.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique bin ids', () => {
    const binIds = MOCK_STOPS.map((stop) => stop.binId);
    const uniqueBinIds = new Set(binIds);
    expect(uniqueBinIds.size).toBe(binIds.length);
  });
});
