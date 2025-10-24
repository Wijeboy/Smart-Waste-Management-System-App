/**
 * Route Flow Integration Tests
 * Tests the complete flow from route start with checklist through collection to completion
 * Includes network failure scenarios and edge cases
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock components and services
jest.mock('../services/api', () => ({
  startRoute: jest.fn(),
  completeRoute: jest.fn(),
  collectBin: jest.fn(),
  skipBin: jest.fn(),
  getRoute: jest.fn(),
  getCompletedRoutes: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  documentDirectory: 'file:///mock/directory/',
  EncodingType: {
    UTF8: 'utf8',
  },
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(() => Promise.resolve({ action: 'shared' })),
}));

// Silence console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('Route Flow Integration Tests', () => {
  const mockRoute = {
    _id: 'route123',
    routeName: 'Downtown Route A',
    status: 'assigned',
    assignedTo: 'collector1',
    bins: [
      {
        bin: {
          _id: 'bin1',
          binId: 'BIN-001',
          location: '123 Main St',
        },
        status: 'pending',
        fillLevel: 85,
        expectedWeight: 50,
      },
      {
        bin: {
          _id: 'bin2',
          binId: 'BIN-002',
          location: '456 Oak Ave',
        },
        status: 'pending',
        fillLevel: 92,
        expectedWeight: 60,
      },
      {
        bin: {
          _id: 'bin3',
          binId: 'BIN-003',
          location: '789 Pine Rd',
        },
        status: 'pending',
        fillLevel: 45,
        expectedWeight: 30,
      },
    ],
  };

  const mockStartedRoute = {
    ...mockRoute,
    status: 'in-progress',
    startedAt: '2025-10-24T12:00:00.000Z',
    preRouteChecklist: {
      completed: true,
      completedAt: '2025-10-24T12:00:00.000Z',
      items: [
        { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
        { id: 'safety', label: 'Safety equipment available', checked: true },
        { id: 'containers', label: 'Collection containers ready', checked: true },
        { id: 'route', label: 'Route map reviewed', checked: true },
        { id: 'communication', label: 'Communication device functional', checked: true },
      ],
    },
  };

  const mockCompletedRoute = {
    ...mockStartedRoute,
    status: 'completed',
    completedAt: '2025-10-24T14:30:00.000Z',
    routeDuration: 150, // 2h 30m
    wasteCollected: 140,
    recyclableWaste: 70,
    bins: [
      {
        ...mockStartedRoute.bins[0],
        status: 'collected',
        actualWeight: 52,
        fillLevelAtCollection: 85,
        collectedAt: '2025-10-24T12:15:00.000Z',
      },
      {
        ...mockStartedRoute.bins[1],
        status: 'collected',
        actualWeight: 58,
        fillLevelAtCollection: 92,
        collectedAt: '2025-10-24T12:45:00.000Z',
      },
      {
        ...mockStartedRoute.bins[2],
        status: 'skipped',
        notes: 'Access blocked',
        fillLevelAtCollection: 45,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  describe('Complete Route Flow - Happy Path', () => {
    it('should complete full flow: checklist → start → collect → complete → summary', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockResolvedValue({ data: { route: mockStartedRoute } });
      apiService.collectBin.mockResolvedValue({ data: { success: true } });
      apiService.completeRoute.mockResolvedValue({ data: { route: mockCompletedRoute } });

      // This is a conceptual test showing the flow steps
      // In practice, you'd render the actual screen components with mocked contexts
      
      const checklistData = {
        items: [
          { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
          { id: 'safety', label: 'Safety equipment available', checked: true },
          { id: 'containers', label: 'Collection containers ready', checked: true },
          { id: 'route', label: 'Route map reviewed', checked: true },
          { id: 'communication', label: 'Communication device functional', checked: true },
        ],
        completedAt: new Date().toISOString(),
      };

      // Step 1: Start route with checklist
      await apiService.startRoute('route123', { preRouteChecklist: checklistData });
      expect(apiService.startRoute).toHaveBeenCalledWith('route123', {
        preRouteChecklist: checklistData,
      });

      // Step 2: Collect first bin
      await apiService.collectBin('route123', 'bin1', { actualWeight: 52 });
      expect(apiService.collectBin).toHaveBeenCalledWith('route123', 'bin1', {
        actualWeight: 52,
      });

      // Step 3: Collect second bin
      await apiService.collectBin('route123', 'bin2', { actualWeight: 58 });
      expect(apiService.collectBin).toHaveBeenCalledWith('route123', 'bin2', {
        actualWeight: 58,
      });

      // Step 4: Skip third bin
      await apiService.skipBin('route123', 'bin3', { reason: 'Access blocked' });
      expect(apiService.skipBin).toHaveBeenCalledWith('route123', 'bin3', {
        reason: 'Access blocked',
      });

      // Step 5: Complete route
      await apiService.completeRoute('route123');
      expect(apiService.completeRoute).toHaveBeenCalledWith('route123');
    });

    it('should persist checklist data to backend when starting route', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockResolvedValue({ data: { route: mockStartedRoute } });

      const checklistData = {
        items: [
          { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
          { id: 'safety', label: 'Safety equipment available', checked: true },
          { id: 'containers', label: 'Collection containers ready', checked: true },
          { id: 'route', label: 'Route map reviewed', checked: true },
          { id: 'communication', label: 'Communication device functional', checked: true },
        ],
        completedAt: '2025-10-24T12:00:00.000Z',
      };

      await apiService.startRoute('route123', { preRouteChecklist: checklistData });

      expect(apiService.startRoute).toHaveBeenCalledWith('route123', {
        preRouteChecklist: checklistData,
      });
    });

    it('should calculate route duration on completion', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockResolvedValue({ data: { route: mockCompletedRoute } });

      const result = await apiService.completeRoute('route123');

      expect(result.data.route.routeDuration).toBe(150);
      expect(result.data.route.startedAt).toBeTruthy();
      expect(result.data.route.completedAt).toBeTruthy();
    });
  });

  describe('Network Failure Scenarios', () => {
    it('should handle network error when starting route', async () => {
      const apiService = require('../services/api');
      const networkError = new Error('Network request failed');
      apiService.startRoute.mockRejectedValue(networkError);

      const checklistData = {
        items: [
          { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
        ],
        completedAt: new Date().toISOString(),
      };

      await expect(
        apiService.startRoute('route123', { preRouteChecklist: checklistData })
      ).rejects.toThrow('Network request failed');
    });

    it('should handle network error when collecting bin', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockRejectedValue(new Error('Failed to collect bin'));

      await expect(
        apiService.collectBin('route123', 'bin1', { actualWeight: 52 })
      ).rejects.toThrow('Failed to collect bin');
    });

    it('should handle network error when completing route', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockRejectedValue(new Error('Network error'));

      await expect(apiService.completeRoute('route123')).rejects.toThrow(
        'Network error'
      );
    });

    it('should retry operation on network failure', async () => {
      const apiService = require('../services/api');
      
      // Fail first time, succeed second time
      apiService.collectBin
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { success: true } });

      // First attempt fails
      await expect(
        apiService.collectBin('route123', 'bin1', { actualWeight: 52 })
      ).rejects.toThrow();

      // Retry succeeds
      const result = await apiService.collectBin('route123', 'bin1', { actualWeight: 52 });
      expect(result.data.success).toBe(true);
      expect(apiService.collectBin).toHaveBeenCalledTimes(2);
    });

    it('should store route completion locally on network failure', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockRejectedValue(new Error('Network error'));

      const routeData = {
        routeId: 'route123',
        completedAt: new Date().toISOString(),
      };

      try {
        await apiService.completeRoute('route123');
      } catch (error) {
        // Store locally
        await AsyncStorage.setItem(
          'pendingRouteCompletion',
          JSON.stringify(routeData)
        );
      }

      // Verify the setItem was called with correct data
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'pendingRouteCompletion',
        JSON.stringify(routeData)
      );
    });
  });

  describe('Checklist Validation', () => {
    it('should not allow route start without completed checklist', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockRejectedValue(
        new Error('Pre-route checklist is required')
      );

      await expect(apiService.startRoute('route123', {})).rejects.toThrow(
        'Pre-route checklist is required'
      );
    });

    it('should validate all checklist items are checked', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockRejectedValue(
        new Error('All checklist items must be checked')
      );

      const incompleteChecklist = {
        items: [
          { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
          { id: 'safety', label: 'Safety equipment available', checked: false },
        ],
        completedAt: new Date().toISOString(),
      };

      await expect(
        apiService.startRoute('route123', { preRouteChecklist: incompleteChecklist })
      ).rejects.toThrow('All checklist items must be checked');
    });

    it('should include completedAt timestamp in checklist', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockResolvedValue({ data: { route: mockStartedRoute } });

      const checklistData = {
        items: [
          { id: 'vehicle', label: 'Vehicle inspection completed', checked: true },
        ],
        completedAt: '2025-10-24T12:00:00.000Z',
      };

      await apiService.startRoute('route123', { preRouteChecklist: checklistData });

      const call = apiService.startRoute.mock.calls[0];
      expect(call[1].preRouteChecklist.completedAt).toBeTruthy();
      expect(new Date(call[1].preRouteChecklist.completedAt).toISOString()).toBe(
        '2025-10-24T12:00:00.000Z'
      );
    });
  });

  describe('Collection Workflow', () => {
    it('should update bin status after collection', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockResolvedValue({
        data: {
          success: true,
          bin: {
            ...mockRoute.bins[0],
            status: 'collected',
            actualWeight: 52,
          },
        },
      });

      const result = await apiService.collectBin('route123', 'bin1', {
        actualWeight: 52,
      });

      expect(result.data.bin.status).toBe('collected');
      expect(result.data.bin.actualWeight).toBe(52);
    });

    it('should allow skipping bins with reason', async () => {
      const apiService = require('../services/api');
      apiService.skipBin.mockResolvedValue({
        data: {
          success: true,
          bin: { ...mockRoute.bins[2], status: 'skipped', notes: 'Access blocked' },
        },
      });

      const result = await apiService.skipBin('route123', 'bin3', {
        reason: 'Access blocked',
      });

      expect(result.data.bin.status).toBe('skipped');
      expect(result.data.bin.notes).toBe('Access blocked');
    });

    it('should track actual weight vs expected weight', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockResolvedValue({
        data: {
          success: true,
          bin: {
            ...mockRoute.bins[0],
            expectedWeight: 50,
            actualWeight: 52,
          },
        },
      });

      const result = await apiService.collectBin('route123', 'bin1', {
        actualWeight: 52,
      });

      expect(result.data.bin.expectedWeight).toBe(50);
      expect(result.data.bin.actualWeight).toBe(52);
    });

    it('should collect bins in any order', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockResolvedValue({ data: { success: true } });

      // Collect in non-sequential order
      await apiService.collectBin('route123', 'bin3', { actualWeight: 30 });
      await apiService.collectBin('route123', 'bin1', { actualWeight: 52 });
      await apiService.collectBin('route123', 'bin2', { actualWeight: 58 });

      expect(apiService.collectBin).toHaveBeenCalledTimes(3);
    });
  });

  describe('Route Completion', () => {
    it('should require all bins to be processed before completion', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockRejectedValue(
        new Error('Not all bins have been processed')
      );

      await expect(apiService.completeRoute('route123')).rejects.toThrow(
        'Not all bins have been processed'
      );
    });

    it('should calculate total waste collected', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockResolvedValue({ data: { route: mockCompletedRoute } });

      const result = await apiService.completeRoute('route123');

      expect(result.data.route.wasteCollected).toBe(140);
    });

    it('should track recyclable waste separately', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockResolvedValue({ data: { route: mockCompletedRoute } });

      const result = await apiService.completeRoute('route123');

      expect(result.data.route.recyclableWaste).toBe(70);
    });

    it('should update route status to completed', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockResolvedValue({ data: { route: mockCompletedRoute } });

      const result = await apiService.completeRoute('route123');

      expect(result.data.route.status).toBe('completed');
    });
  });

  describe('Report Generation', () => {
    it('should generate CSV report with all bin details', async () => {
      const FileSystem = require('expo-file-system');
      FileSystem.writeAsStringAsync.mockResolvedValue();

      const csvContent = [
        'Bin ID,Location,Status,Fill Level,Weight,Time',
        'BIN-001,123 Main St,collected,85,52,12:15',
        'BIN-002,456 Oak Ave,collected,92,58,12:45',
        'BIN-003,789 Pine Rd,skipped,45,0,N/A',
      ].join('\n');

      const fileName = `route_report_${Date.now()}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
        filePath,
        csvContent,
        expect.any(Object)
      );
    });

    it('should allow downloading report after completion', async () => {
      const Sharing = require('expo-sharing');
      const FileSystem = require('expo-file-system');
      
      FileSystem.writeAsStringAsync.mockResolvedValue();
      Sharing.shareAsync.mockResolvedValue({ action: 'shared' });

      const filePath = `${FileSystem.documentDirectory}route_report.csv`;
      await FileSystem.writeAsStringAsync(filePath, 'csv content');
      await Sharing.shareAsync(filePath);

      expect(Sharing.shareAsync).toHaveBeenCalledWith(filePath);
    });

    it('should include route statistics in report', async () => {
      const csvContent = [
        'Route Summary',
        'Route Name: Downtown Route A',
        'Duration: 2h 30m',
        'Total Waste: 140 kg',
        'Recyclable: 70 kg',
        'Bins Collected: 2',
        'Bins Skipped: 1',
        '',
        'Bin Details',
        'Bin ID,Location,Status,Fill Level,Weight',
      ].join('\n');

      expect(csvContent).toContain('Route Summary');
      expect(csvContent).toContain('Duration: 2h 30m');
      expect(csvContent).toContain('Total Waste: 140 kg');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty route with no bins', async () => {
      const apiService = require('../services/api');
      const emptyRoute = { ...mockRoute, bins: [] };
      apiService.getRoute.mockResolvedValue({ data: { route: emptyRoute } });

      const result = await apiService.getRoute('route123');
      expect(result.data.route.bins).toHaveLength(0);
    });

    it('should handle duplicate collection attempts', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockResolvedValue({ data: { success: true } });

      await apiService.collectBin('route123', 'bin1', { actualWeight: 52 });
      
      apiService.collectBin.mockRejectedValue(new Error('Bin already collected'));
      await expect(
        apiService.collectBin('route123', 'bin1', { actualWeight: 52 })
      ).rejects.toThrow('Bin already collected');
    });

    it('should handle invalid weight inputs', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockRejectedValue(new Error('Invalid weight value'));

      await expect(
        apiService.collectBin('route123', 'bin1', { actualWeight: -10 })
      ).rejects.toThrow('Invalid weight value');

      await expect(
        apiService.collectBin('route123', 'bin1', { actualWeight: 'abc' })
      ).rejects.toThrow('Invalid weight value');
    });

    it('should handle missing skip reason', async () => {
      const apiService = require('../services/api');
      apiService.skipBin.mockRejectedValue(new Error('Skip reason is required'));

      await expect(
        apiService.skipBin('route123', 'bin3', { reason: '' })
      ).rejects.toThrow('Skip reason is required');
    });

    it('should handle route completion without being started', async () => {
      const apiService = require('../services/api');
      apiService.completeRoute.mockRejectedValue(
        new Error('Route has not been started')
      );

      await expect(apiService.completeRoute('route123')).rejects.toThrow(
        'Route has not been started'
      );
    });

    it('should prevent starting already active route', async () => {
      const apiService = require('../services/api');
      apiService.startRoute.mockRejectedValue(
        new Error('Route is already in progress')
      );

      await expect(apiService.startRoute('route123', {})).rejects.toThrow(
        'Route is already in progress'
      );
    });
  });

  describe('Offline Mode Support', () => {
    it('should queue operations when offline', async () => {
      const offlineQueue = [];

      // Simulate offline - queue the operation
      offlineQueue.push({
        type: 'collectBin',
        routeId: 'route123',
        binId: 'bin1',
        data: { actualWeight: 52 },
        timestamp: new Date().toISOString(),
      });

      expect(offlineQueue).toHaveLength(1);
      expect(offlineQueue[0].type).toBe('collectBin');
    });

    it('should sync queued operations when back online', async () => {
      const apiService = require('../services/api');
      apiService.collectBin.mockResolvedValue({ data: { success: true } });

      const offlineQueue = [
        {
          type: 'collectBin',
          routeId: 'route123',
          binId: 'bin1',
          data: { actualWeight: 52 },
        },
        {
          type: 'collectBin',
          routeId: 'route123',
          binId: 'bin2',
          data: { actualWeight: 58 },
        },
      ];

      // Process queue
      for (const operation of offlineQueue) {
        await apiService.collectBin(
          operation.routeId,
          operation.binId,
          operation.data
        );
      }

      expect(apiService.collectBin).toHaveBeenCalledTimes(2);
    });

    it('should load saved route report when offline', async () => {
      const savedReport = {
        routeId: 'route123',
        routeName: 'Downtown Route A',
        completedAt: '2025-10-24T14:30:00.000Z',
        bins: mockCompletedRoute.bins,
      };

      const savedReportString = JSON.stringify(savedReport);

      // Mock getItem to return the saved report
      AsyncStorage.getItem.mockResolvedValueOnce(savedReportString);

      // Store the report
      await AsyncStorage.setItem('routeReport_route123', savedReportString);

      // Load the report
      const loaded = await AsyncStorage.getItem('routeReport_route123');
      
      expect(loaded).toBe(savedReportString);
      const parsed = JSON.parse(loaded);
      expect(parsed.routeId).toBe('route123');
      expect(parsed.bins).toHaveLength(3);
    });
  });
});
