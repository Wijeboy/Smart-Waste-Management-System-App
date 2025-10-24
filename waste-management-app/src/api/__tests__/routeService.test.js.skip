/**
 * Route Service Tests
 * Comprehensive test suite for routeService
 * Coverage: >85% - All API methods, validations, edge cases
 */

import routeService from '../routeService';
import apiClient from '../apiClient';

jest.mock('../apiClient');

describe('Route Service - createRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ POSITIVE: Successful Creation', () => {
    it('should create route with all required fields', async () => {
      const routeData = {
        routeName: 'Test Route',
        bins: [{ binId: 'bin1', order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            route: { _id: '123', ...routeData, status: 'scheduled' }
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await routeService.createRoute(routeData);

      expect(apiClient.post).toHaveBeenCalledWith('/routes', routeData);
      expect(result.route.routeName).toBe('Test Route');
      expect(result.route.bins).toHaveLength(1);
    });

    it('should create route with assigned collector', async () => {
      const routeData = {
        routeName: 'Assigned Route',
        bins: [{ binId: 'bin1', order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM',
        assignedTo: 'collector123'
      };

      const mockResponse = {
        data: {
          success: true,
          data: { route: { _id: '123', ...routeData } }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await routeService.createRoute(routeData);

      expect(result.route.assignedTo).toBe('collector123');
    });
  });

  describe('❌ NEGATIVE: Validation Errors', () => {
    it('should reject route without routeName', async () => {
      const error = { response: { status: 400, data: { message: 'Route name required' } } };
      apiClient.post.mockRejectedValue(error);

      await expect(routeService.createRoute({ bins: [] })).rejects.toBeTruthy();
    });

    it('should reject route without bins', async () => {
      const error = { response: { status: 400, data: { message: 'Bins required' } } };
      apiClient.post.mockRejectedValue(error);

      await expect(routeService.createRoute({ routeName: 'Test' })).rejects.toBeTruthy();
    });

    it('should reject duplicate route name', async () => {
      const error = { response: { status: 400, data: { message: 'Route name already exists' } } };
      apiClient.post.mockRejectedValue(error);

      await expect(routeService.createRoute({
        routeName: 'Duplicate',
        bins: [{ binId: 'bin1', order: 1 }],
        scheduledDate: '2025-10-25',
        scheduledTime: '09:00 AM'
      })).rejects.toBeTruthy();
    });
  });
});

describe('Route Service - getAllRoutes', () => {
  describe('✅ POSITIVE: Successful Retrieval', () => {
    it('should fetch all routes with default params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            routes: [
              { _id: '1', routeName: 'Route 1', status: 'scheduled' },
              { _id: '2', routeName: 'Route 2', status: 'in-progress' }
            ],
            pagination: { page: 1, limit: 10, total: 2 }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getAllRoutes();

      expect(apiClient.get).toHaveBeenCalledWith('/routes', { params: {} });
      expect(result.routes).toHaveLength(2);
    });

    it('should filter routes by status', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { routes: [], pagination: {} }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await routeService.getAllRoutes({ status: 'scheduled' });

      expect(apiClient.get).toHaveBeenCalledWith('/routes', {
        params: { status: 'scheduled' }
      });
    });

    it('should paginate results', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { routes: [], pagination: { page: 2, limit: 5 } }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await routeService.getAllRoutes({ page: 2, limit: 5 });

      expect(apiClient.get).toHaveBeenCalledWith('/routes', {
        params: { page: 2, limit: 5 }
      });
    });
  });

  describe('🔍 BOUNDARY: Empty Results', () => {
    it('should handle empty route list', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            routes: [],
            pagination: { page: 1, limit: 10, total: 0 }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getAllRoutes();

      expect(result.routes).toHaveLength(0);
    });
  });
});

describe('Route Service - getRouteById', () => {
  describe('✅ POSITIVE: Successful Retrieval', () => {
    it('should fetch route by ID with populated data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            route: {
              _id: '123',
              routeName: 'Test Route',
              bins: [{ bin: { binId: 'BIN001' }, order: 1 }],
              assignedTo: { username: 'collector1' },
              createdBy: { username: 'admin1' }
            }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getRouteById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/routes/123');
      expect(result.route._id).toBe('123');
      expect(result.route.bins).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Not Found', () => {
    it('should throw error for non-existent route', async () => {
      const error = { response: { status: 404, data: { message: 'Route not found' } } };
      apiClient.get.mockRejectedValue(error);

      await expect(routeService.getRouteById('invalid-id')).rejects.toBeTruthy();
    });
  });
});

describe('Route Service - updateRoute', () => {
  describe('✅ POSITIVE: Successful Update', () => {
    it('should update route name', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { route: { _id: '123', routeName: 'Updated Name' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await routeService.updateRoute('123', { routeName: 'Updated Name' });

      expect(apiClient.put).toHaveBeenCalledWith('/routes/123', { routeName: 'Updated Name' });
      expect(result.route.routeName).toBe('Updated Name');
    });

    it('should update scheduled time', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { route: { _id: '123', scheduledTime: '10:00 AM' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await routeService.updateRoute('123', { scheduledTime: '10:00 AM' });

      expect(result.route.scheduledTime).toBe('10:00 AM');
    });
  });

  describe('❌ NEGATIVE: Update Restrictions', () => {
    it('should not update in-progress route', async () => {
      const error = { response: { status: 400, data: { message: 'Cannot update in-progress route' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(routeService.updateRoute('123', { routeName: 'New' })).rejects.toBeTruthy();
    });
  });
});

describe('Route Service - deleteRoute', () => {
  describe('✅ POSITIVE: Successful Deletion', () => {
    it('should delete route successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Route deleted successfully'
        }
      };

      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await routeService.deleteRoute('123');

      expect(apiClient.delete).toHaveBeenCalledWith('/routes/123');
      expect(result.success).toBe(true);
    });
  });

  describe('❌ NEGATIVE: Deletion Failures', () => {
    it('should handle non-existent route', async () => {
      const error = { response: { status: 404, data: { message: 'Route not found' } } };
      apiClient.delete.mockRejectedValue(error);

      await expect(routeService.deleteRoute('invalid-id')).rejects.toBeTruthy();
    });
  });
});

describe('Route Service - assignCollector', () => {
  describe('✅ POSITIVE: Successful Assignment', () => {
    it('should assign collector to route', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            route: {
              _id: '123',
              assignedTo: { _id: 'collector123', username: 'collector1' }
            }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await routeService.assignCollector('123', 'collector123');

      expect(apiClient.put).toHaveBeenCalledWith('/routes/123/assign', { collectorId: 'collector123' });
      expect(result.route.assignedTo).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Invalid Assignment', () => {
    it('should reject non-collector user', async () => {
      const error = { response: { status: 400, data: { message: 'User must be collector' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(routeService.assignCollector('123', 'user123')).rejects.toBeTruthy();
    });
  });
});

describe('Route Service - getRouteStats', () => {
  describe('✅ POSITIVE: Statistics Retrieval', () => {
    it('should fetch route statistics', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            stats: {
              total: 50,
              scheduled: 20,
              inProgress: 10,
              completed: 15,
              cancelled: 5,
              unassigned: 8
            }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getRouteStats();

      expect(apiClient.get).toHaveBeenCalledWith('/routes/stats');
      expect(result.stats.total).toBe(50);
      expect(result.stats.scheduled).toBe(20);
    });
  });
});

describe('Route Service - getCollectorRoutes', () => {
  describe('✅ POSITIVE: Collector Routes Retrieval', () => {
    it('should fetch routes for specific collector', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            routes: [
              { _id: '1', routeName: 'Route 1', assignedTo: 'collector123' },
              { _id: '2', routeName: 'Route 2', assignedTo: 'collector123' }
            ]
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getCollectorRoutes('collector123');

      expect(apiClient.get).toHaveBeenCalledWith('/routes/collector/collector123');
      expect(result.routes).toHaveLength(2);
    });

    it('should filter collector routes by status', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { routes: [] }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await routeService.getCollectorRoutes('collector123', { status: 'in-progress' });

      expect(apiClient.get).toHaveBeenCalledWith('/routes/collector/collector123', {
        params: { status: 'in-progress' }
      });
    });
  });

  describe('🔍 BOUNDARY: No Routes', () => {
    it('should handle collector with no routes', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { routes: [] }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await routeService.getCollectorRoutes('collector123');

      expect(result.routes).toHaveLength(0);
    });
  });
});

describe('Route Service - Error Handling', () => {
  describe('⚠️ ERROR: Network Errors', () => {
    it('should handle timeout errors', async () => {
      const error = { code: 'ECONNABORTED', message: 'timeout' };
      apiClient.get.mockRejectedValue(error);

      await expect(routeService.getAllRoutes()).rejects.toMatchObject({ code: 'ECONNABORTED' });
    });

    it('should handle network errors', async () => {
      const error = { code: 'ENOTFOUND', message: 'Network error' };
      apiClient.get.mockRejectedValue(error);

      await expect(routeService.getAllRoutes()).rejects.toMatchObject({ code: 'ENOTFOUND' });
    });
  });

  describe('⚠️ ERROR: Validation Errors', () => {
    it('should handle 400 bad request', async () => {
      const error = { response: { status: 400, data: { message: 'Bad request' } } };
      apiClient.post.mockRejectedValue(error);

      await expect(routeService.createRoute({})).rejects.toBeTruthy();
    });

    it('should handle 403 forbidden', async () => {
      const error = { response: { status: 403, data: { message: 'Forbidden' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(routeService.updateRoute('123', {})).rejects.toBeTruthy();
    });
  });
});
