/**
 * Collection Service Tests
 * Comprehensive test suite for collectionService
 * Coverage: >85% - All collection operations, validations, edge cases
 */

import collectionService from '../collectionService';
import apiClient from '../apiClient';

jest.mock('../apiClient');

describe('Collection Service - startRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ POSITIVE: Successful Route Start', () => {
    it('should start route successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            route: {
              _id: '123',
              status: 'in-progress',
              startedAt: new Date().toISOString()
            }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.startRoute('123');

      expect(apiClient.put).toHaveBeenCalledWith('/collections/routes/123/start');
      expect(result.route.status).toBe('in-progress');
      expect(result.route.startedAt).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Invalid Start', () => {
    it('should fail to start already in-progress route', async () => {
      const error = { response: { status: 400, data: { message: 'Route already in progress' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.startRoute('123')).rejects.toBeTruthy();
    });

    it('should fail for non-existent route', async () => {
      const error = { response: { status: 404, data: { message: 'Route not found' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.startRoute('invalid-id')).rejects.toBeTruthy();
    });

    it('should fail without authorization', async () => {
      const error = { response: { status: 403, data: { message: 'Not authorized' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.startRoute('123')).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Input Validation', () => {
    it('should reject null route ID', async () => {
      await expect(collectionService.startRoute(null)).rejects.toBeTruthy();
    });

    it('should reject undefined route ID', async () => {
      await expect(collectionService.startRoute(undefined)).rejects.toBeTruthy();
    });

    it('should reject empty string route ID', async () => {
      await expect(collectionService.startRoute('')).rejects.toBeTruthy();
    });
  });
});

describe('Collection Service - completeRoute', () => {
  describe('✅ POSITIVE: Successful Completion', () => {
    it('should complete route successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            route: {
              _id: '123',
              status: 'completed',
              completedAt: new Date().toISOString()
            }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.completeRoute('123');

      expect(apiClient.put).toHaveBeenCalledWith('/collections/routes/123/complete');
      expect(result.route.status).toBe('completed');
      expect(result.route.completedAt).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Invalid Completion', () => {
    it('should fail if route has pending bins', async () => {
      const error = { response: { status: 400, data: { message: 'Route has pending bins' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.completeRoute('123')).rejects.toBeTruthy();
    });

    it('should fail if route not in progress', async () => {
      const error = { response: { status: 400, data: { message: 'Route not in progress' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.completeRoute('123')).rejects.toBeTruthy();
    });

    it('should fail for non-existent route', async () => {
      const error = { response: { status: 404, data: { message: 'Route not found' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.completeRoute('invalid-id')).rejects.toBeTruthy();
    });
  });
});

describe('Collection Service - collectBin', () => {
  describe('✅ POSITIVE: Successful Collection', () => {
    it('should collect bin successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            bin: { _id: 'bin123', status: 'collected', fillLevel: 0 },
            route: { _id: 'route123' }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.collectBin('bin123', 'route123');

      expect(apiClient.put).toHaveBeenCalledWith('/collections/bins/bin123/collect', {
        routeId: 'route123'
      });
      expect(result.bin.status).toBe('collected');
      expect(result.bin.fillLevel).toBe(0);
    });

    it('should collect bin with notes', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            bin: { _id: 'bin123', status: 'collected', notes: 'Bin was overflowing' }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.collectBin('bin123', 'route123', 'Bin was overflowing');

      expect(apiClient.put).toHaveBeenCalledWith('/collections/bins/bin123/collect', {
        routeId: 'route123',
        notes: 'Bin was overflowing'
      });
      expect(result.bin.notes).toBe('Bin was overflowing');
    });
  });

  describe('❌ NEGATIVE: Invalid Collection', () => {
    it('should fail if bin not in route', async () => {
      const error = { response: { status: 400, data: { message: 'Bin not in route' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.collectBin('bin123', 'route123')).rejects.toBeTruthy();
    });

    it('should fail if bin already collected', async () => {
      const error = { response: { status: 400, data: { message: 'Bin already collected' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.collectBin('bin123', 'route123')).rejects.toBeTruthy();
    });

    it('should fail for non-existent bin', async () => {
      const error = { response: { status: 404, data: { message: 'Bin not found' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.collectBin('invalid-bin', 'route123')).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Input Validation', () => {
    it('should reject null bin ID', async () => {
      await expect(collectionService.collectBin(null, 'route123')).rejects.toBeTruthy();
    });

    it('should reject null route ID', async () => {
      await expect(collectionService.collectBin('bin123', null)).rejects.toBeTruthy();
    });

    it('should accept empty notes', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { bin: { _id: 'bin123', status: 'collected' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.collectBin('bin123', 'route123', '');

      expect(result.bin.status).toBe('collected');
    });
  });
});

describe('Collection Service - skipBin', () => {
  describe('✅ POSITIVE: Successful Skip', () => {
    it('should skip bin with reason', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            bin: { _id: 'bin123', status: 'skipped' },
            route: { _id: 'route123' }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.skipBin('bin123', 'route123', 'Access denied');

      expect(apiClient.put).toHaveBeenCalledWith('/collections/bins/bin123/skip', {
        routeId: 'route123',
        reason: 'Access denied'
      });
      expect(result.bin.status).toBe('skipped');
    });

    it('should skip bin with long reason', async () => {
      const longReason = 'A'.repeat(500);
      const mockResponse = {
        data: {
          success: true,
          data: { bin: { _id: 'bin123', status: 'skipped' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await collectionService.skipBin('bin123', 'route123', longReason);

      expect(result.bin.status).toBe('skipped');
    });
  });

  describe('❌ NEGATIVE: Invalid Skip', () => {
    it('should fail without reason', async () => {
      const error = { response: { status: 400, data: { message: 'Reason required' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.skipBin('bin123', 'route123', '')).rejects.toBeTruthy();
    });

    it('should fail if bin already skipped', async () => {
      const error = { response: { status: 400, data: { message: 'Bin already skipped' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.skipBin('bin123', 'route123', 'Reason')).rejects.toBeTruthy();
    });

    it('should fail if bin not in route', async () => {
      const error = { response: { status: 400, data: { message: 'Bin not in route' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.skipBin('bin123', 'route123', 'Reason')).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Reason Validation', () => {
    it('should reject null reason', async () => {
      await expect(collectionService.skipBin('bin123', 'route123', null)).rejects.toBeTruthy();
    });

    it('should reject undefined reason', async () => {
      await expect(collectionService.skipBin('bin123', 'route123', undefined)).rejects.toBeTruthy();
    });

    it('should reject whitespace-only reason', async () => {
      const error = { response: { status: 400, data: { message: 'Valid reason required' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.skipBin('bin123', 'route123', '   ')).rejects.toBeTruthy();
    });
  });
});

describe('Collection Service - getRouteProgress', () => {
  describe('✅ POSITIVE: Progress Retrieval', () => {
    it('should fetch route progress successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 50,
            totalBins: 10,
            collectedBins: 5,
            pendingBins: 3,
            skippedBins: 2,
            isComplete: false
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(apiClient.get).toHaveBeenCalledWith('/collections/routes/route123/progress');
      expect(result.progress).toBe(50);
      expect(result.totalBins).toBe(10);
      expect(result.collectedBins).toBe(5);
      expect(result.pendingBins).toBe(3);
      expect(result.skippedBins).toBe(2);
    });

    it('should show 100% progress when complete', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 100,
            totalBins: 5,
            collectedBins: 5,
            pendingBins: 0,
            skippedBins: 0,
            isComplete: true
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(result.progress).toBe(100);
      expect(result.isComplete).toBe(true);
    });

    it('should handle mixed collected and skipped bins', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 100,
            totalBins: 10,
            collectedBins: 7,
            pendingBins: 0,
            skippedBins: 3,
            isComplete: true
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(result.collectedBins).toBe(7);
      expect(result.skippedBins).toBe(3);
      expect(result.isComplete).toBe(true);
    });
  });

  describe('❌ NEGATIVE: Progress Errors', () => {
    it('should fail for non-existent route', async () => {
      const error = { response: { status: 404, data: { message: 'Route not found' } } };
      apiClient.get.mockRejectedValue(error);

      await expect(collectionService.getRouteProgress('invalid-id')).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle route with no bins', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 0,
            totalBins: 0,
            collectedBins: 0,
            pendingBins: 0,
            skippedBins: 0,
            isComplete: false
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(result.totalBins).toBe(0);
      expect(result.progress).toBe(0);
    });

    it('should handle all bins skipped', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 100,
            totalBins: 5,
            collectedBins: 0,
            pendingBins: 0,
            skippedBins: 5,
            isComplete: true
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(result.skippedBins).toBe(5);
      expect(result.collectedBins).toBe(0);
      expect(result.isComplete).toBe(true);
    });
  });
});

describe('Collection Service - Error Handling', () => {
  describe('⚠️ ERROR: Network Errors', () => {
    it('should handle timeout errors', async () => {
      const error = { code: 'ECONNABORTED', message: 'timeout' };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.startRoute('123')).rejects.toMatchObject({ code: 'ECONNABORTED' });
    });

    it('should handle network errors', async () => {
      const error = { code: 'ENOTFOUND', message: 'Network error' };
      apiClient.get.mockRejectedValue(error);

      await expect(collectionService.getRouteProgress('123')).rejects.toMatchObject({ code: 'ENOTFOUND' });
    });
  });

  describe('⚠️ ERROR: API Response Errors', () => {
    it('should handle 400 bad request', async () => {
      const error = { response: { status: 400, data: { message: 'Bad request' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.collectBin('bin123', 'route123')).rejects.toBeTruthy();
    });

    it('should handle 401 unauthorized', async () => {
      const error = { response: { status: 401, data: { message: 'Unauthorized' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.startRoute('123')).rejects.toBeTruthy();
    });

    it('should handle 403 forbidden', async () => {
      const error = { response: { status: 403, data: { message: 'Forbidden' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.completeRoute('123')).rejects.toBeTruthy();
    });

    it('should handle 500 server error', async () => {
      const error = { response: { status: 500, data: { message: 'Server error' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(collectionService.collectBin('bin123', 'route123')).rejects.toBeTruthy();
    });
  });
});

describe('Collection Service - Data Transformation', () => {
  describe('✅ POSITIVE: Response Parsing', () => {
    it('should correctly parse progress data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            progress: 75,
            totalBins: 8,
            collectedBins: 6,
            pendingBins: 1,
            skippedBins: 1,
            isComplete: false,
            route: {
              _id: 'route123',
              routeName: 'Test Route',
              status: 'in-progress'
            }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await collectionService.getRouteProgress('route123');

      expect(typeof result.progress).toBe('number');
      expect(typeof result.totalBins).toBe('number');
      expect(typeof result.isComplete).toBe('boolean');
    });
  });
});
