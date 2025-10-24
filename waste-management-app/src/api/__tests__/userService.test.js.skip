/**
 * User Service Tests
 * Comprehensive test suite for userService
 * Coverage: >85% - All API methods, error handling, edge cases
 */

import userService from '../userService';
import apiClient from '../apiClient';

// Mock apiClient
jest.mock('../apiClient');

describe('User Service - getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ POSITIVE: Successful API Calls', () => {
    it('should fetch all users with default params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            users: [
              { _id: '1', username: 'user1', role: 'user' },
              { _id: '2', username: 'user2', role: 'collector' }
            ],
            pagination: { page: 1, limit: 10, total: 2 },
            stats: { total: 2, active: 2 }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getAllUsers();

      expect(apiClient.get).toHaveBeenCalledWith('/users', { params: {} });
      expect(result.users).toHaveLength(2);
      expect(result.stats).toBeDefined();
    });

    it('should fetch users with pagination params', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            users: [],
            pagination: { page: 2, limit: 5, total: 10 },
            stats: {}
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await userService.getAllUsers({ page: 2, limit: 5 });

      expect(apiClient.get).toHaveBeenCalledWith('/users', {
        params: { page: 2, limit: 5 }
      });
    });

    it('should filter users by role', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { users: [], pagination: {}, stats: {} }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await userService.getAllUsers({ role: 'collector' });

      expect(apiClient.get).toHaveBeenCalledWith('/users', {
        params: { role: 'collector' }
      });
    });

    it('should filter users by status', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { users: [], pagination: {}, stats: {} }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      await userService.getAllUsers({ status: 'active' });

      expect(apiClient.get).toHaveBeenCalledWith('/users', {
        params: { status: 'active' }
      });
    });
  });

  describe('❌ NEGATIVE: Error Handling', () => {
    it('should throw error when API call fails', async () => {
      const error = new Error('Network error');
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('Network error');
    });

    it('should handle 401 unauthorized error', async () => {
      const error = { response: { status: 401, data: { message: 'Unauthorized' } } };
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toBeTruthy();
    });

    it('should handle 500 server error', async () => {
      const error = { response: { status: 500, data: { message: 'Server error' } } };
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Edge Cases', () => {
    it('should handle empty user list', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            users: [],
            pagination: { page: 1, limit: 10, total: 0 },
            stats: { total: 0 }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getAllUsers();

      expect(result.users).toHaveLength(0);
      expect(result.stats.total).toBe(0);
    });
  });
});

describe('User Service - getUserById', () => {
  describe('✅ POSITIVE: Successful Retrieval', () => {
    it('should fetch user by ID', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { _id: '123', username: 'testuser', role: 'user' },
            activityStats: { routesAssigned: 5 }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/users/123');
      expect(result.user._id).toBe('123');
      expect(result.activityStats).toBeDefined();
    });
  });

  describe('❌ NEGATIVE: Not Found', () => {
    it('should throw error for non-existent user', async () => {
      const error = { response: { status: 404, data: { message: 'User not found' } } };
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getUserById('invalid-id')).rejects.toBeTruthy();
    });
  });

  describe('🔍 BOUNDARY: Invalid Input', () => {
    it('should handle null ID', async () => {
      await expect(userService.getUserById(null)).rejects.toBeTruthy();
    });

    it('should handle undefined ID', async () => {
      await expect(userService.getUserById(undefined)).rejects.toBeTruthy();
    });

    it('should handle empty string ID', async () => {
      await expect(userService.getUserById('')).rejects.toBeTruthy();
    });
  });
});

describe('User Service - updateUserRole', () => {
  describe('✅ POSITIVE: Successful Update', () => {
    it('should update user role to collector', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { _id: '123', username: 'user', role: 'collector' }
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserRole('123', 'collector');

      expect(apiClient.put).toHaveBeenCalledWith('/users/123/role', { role: 'collector' });
      expect(result.user.role).toBe('collector');
    });

    it('should update user role to admin', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { user: { _id: '123', role: 'admin' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserRole('123', 'admin');

      expect(result.user.role).toBe('admin');
    });
  });

  describe('❌ NEGATIVE: Invalid Role', () => {
    it('should reject invalid role value', async () => {
      const error = { response: { status: 400, data: { message: 'Invalid role' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(userService.updateUserRole('123', 'invalid')).rejects.toBeTruthy();
    });

    it('should reject null role', async () => {
      await expect(userService.updateUserRole('123', null)).rejects.toBeTruthy();
    });

    it('should reject empty role', async () => {
      await expect(userService.updateUserRole('123', '')).rejects.toBeTruthy();
    });
  });
});

describe('User Service - updateUserStatus', () => {
  describe('✅ POSITIVE: Successful Update', () => {
    it('should suspend user', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { user: { _id: '123', accountStatus: 'suspended' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserStatus('123', 'suspended');

      expect(apiClient.put).toHaveBeenCalledWith('/users/123/status', { status: 'suspended' });
      expect(result.user.accountStatus).toBe('suspended');
    });

    it('should activate user', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { user: { _id: '123', accountStatus: 'active' } }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await userService.updateUserStatus('123', 'active');

      expect(result.user.accountStatus).toBe('active');
    });
  });

  describe('❌ NEGATIVE: Invalid Status', () => {
    it('should reject invalid status value', async () => {
      const error = { response: { status: 400, data: { message: 'Invalid status' } } };
      apiClient.put.mockRejectedValue(error);

      await expect(userService.updateUserStatus('123', 'invalid')).rejects.toBeTruthy();
    });
  });
});

describe('User Service - deleteUser', () => {
  describe('✅ POSITIVE: Successful Deletion', () => {
    it('should delete user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'User deleted successfully'
        }
      };

      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await userService.deleteUser('123');

      expect(apiClient.delete).toHaveBeenCalledWith('/users/123');
      expect(result.success).toBe(true);
    });
  });

  describe('❌ NEGATIVE: Deletion Failures', () => {
    it('should handle non-existent user', async () => {
      const error = { response: { status: 404, data: { message: 'User not found' } } };
      apiClient.delete.mockRejectedValue(error);

      await expect(userService.deleteUser('invalid-id')).rejects.toBeTruthy();
    });

    it('should handle permission denied', async () => {
      const error = { response: { status: 403, data: { message: 'Forbidden' } } };
      apiClient.delete.mockRejectedValue(error);

      await expect(userService.deleteUser('123')).rejects.toBeTruthy();
    });
  });
});

describe('User Service - getUserStats', () => {
  describe('✅ POSITIVE: Statistics Retrieval', () => {
    it('should fetch user statistics', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            stats: {
              total: 100,
              active: 85,
              suspended: 10,
              pending: 5,
              admins: 5,
              collectors: 20,
              users: 75
            }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserStats();

      expect(apiClient.get).toHaveBeenCalledWith('/users/stats');
      expect(result.stats.total).toBe(100);
      expect(result.stats.active).toBe(85);
      expect(result.stats.collectors).toBe(20);
    });
  });

  describe('🔍 BOUNDARY: Zero Users', () => {
    it('should handle zero users scenario', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            stats: {
              total: 0,
              active: 0,
              suspended: 0,
              pending: 0,
              admins: 0,
              collectors: 0,
              users: 0
            }
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserStats();

      expect(result.stats.total).toBe(0);
    });
  });
});

describe('User Service - Error Response Handling', () => {
  describe('⚠️ ERROR: Network Errors', () => {
    it('should handle network timeout', async () => {
      const error = { code: 'ECONNABORTED', message: 'timeout' };
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toMatchObject({ code: 'ECONNABORTED' });
    });

    it('should handle no internet connection', async () => {
      const error = { code: 'ENOTFOUND', message: 'Network error' };
      apiClient.get.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toMatchObject({ code: 'ENOTFOUND' });
    });
  });

  describe('⚠️ ERROR: API Response Errors', () => {
    it('should handle malformed response', async () => {
      const mockResponse = { data: null };
      apiClient.get.mockResolvedValue(mockResponse);

      await expect(userService.getAllUsers()).rejects.toBeTruthy();
    });

    it('should handle missing data field', async () => {
      const mockResponse = { data: { success: true } };
      apiClient.get.mockResolvedValue(mockResponse);

      await expect(userService.getAllUsers()).rejects.toBeTruthy();
    });
  });
});

describe('User Service - Data Transformation', () => {
  describe('✅ POSITIVE: Data Parsing', () => {
    it('should correctly parse user data', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              _id: '123',
              username: 'testuser',
              email: 'test@test.com',
              role: 'user',
              accountStatus: 'active',
              createdAt: '2025-01-01T00:00:00.000Z'
            },
            activityStats: {}
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserById('123');

      expect(result.user.username).toBe('testuser');
      expect(result.user.email).toBe('test@test.com');
      expect(result.user.role).toBe('user');
    });

    it('should handle optional fields', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: {
              _id: '123',
              username: 'testuser',
              email: 'test@test.com',
              phoneNumber: null,
              address: undefined
            },
            activityStats: {}
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await userService.getUserById('123');

      expect(result.user.phoneNumber).toBeNull();
      expect(result.user.address).toBeUndefined();
    });
  });
});
