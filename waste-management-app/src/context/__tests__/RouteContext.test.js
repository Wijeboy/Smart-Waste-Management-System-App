/**
 * RouteContext Tests
 * Tests for RouteContext provider and functions
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { RouteProvider, useRoute } from '../RouteContext';

// Wrapper component for testing hooks
const wrapper = ({ children }) => <RouteProvider>{children}</RouteProvider>;

describe('RouteContext', () => {
  describe('useRoute hook', () => {
    it('should throw error when used outside RouteProvider', () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useRoute());
      }).toThrow('useRoute must be used within a RouteProvider');

      console.error = originalError;
    });

    it('should provide context value when used inside RouteProvider', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('stops');
      expect(result.current).toHaveProperty('routeInfo');
      expect(result.current).toHaveProperty('impactMetrics');
      expect(result.current).toHaveProperty('collectionsByType');
    });
  });

  describe('stops state', () => {
    it('should provide initial stops data', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(Array.isArray(result.current.stops)).toBe(true);
      expect(result.current.stops.length).toBeGreaterThan(0);
    });

    it('should have enhanced stop fields', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstStop = result.current.stops[0];

      expect(firstStop).toHaveProperty('id');
      expect(firstStop).toHaveProperty('binId');
      expect(firstStop).toHaveProperty('address');
      expect(firstStop).toHaveProperty('status');
      expect(firstStop).toHaveProperty('priority');
      expect(firstStop).toHaveProperty('distance');
      expect(firstStop).toHaveProperty('fillLevel');
      expect(firstStop).toHaveProperty('collectionType');
    });
  });

  describe('routeInfo state', () => {
    it('should provide route information', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.routeInfo).toBeDefined();
      expect(result.current.routeInfo).toHaveProperty('routeNumber');
      expect(result.current.routeInfo).toHaveProperty('district');
      expect(result.current.routeInfo).toHaveProperty('assignedTo');
    });

    it('should have valid route number format', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.routeInfo.routeNumber).toMatch(/^Route #\d+$/);
    });
  });

  describe('impactMetrics state', () => {
    it('should provide impact metrics', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.impactMetrics).toBeDefined();
      expect(result.current.impactMetrics).toHaveProperty('recycled');
      expect(result.current.impactMetrics).toHaveProperty('co2Saved');
      expect(result.current.impactMetrics).toHaveProperty('treesSaved');
    });

    it('should have valid metric structure', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const { recycled, co2Saved, treesSaved } = result.current.impactMetrics;

      expect(recycled).toHaveProperty('value');
      expect(recycled).toHaveProperty('unit');
      expect(co2Saved).toHaveProperty('value');
      expect(co2Saved).toHaveProperty('unit');
      expect(treesSaved).toHaveProperty('value');
      expect(treesSaved).toHaveProperty('unit');
    });
  });

  describe('collectionsByType state', () => {
    it('should provide collections by type', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(Array.isArray(result.current.collectionsByType)).toBe(true);
      expect(result.current.collectionsByType.length).toBeGreaterThanOrEqual(3);
    });

    it('should have valid collection type structure', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstCollection = result.current.collectionsByType[0];

      expect(firstCollection).toHaveProperty('id');
      expect(firstCollection).toHaveProperty('type');
      expect(firstCollection).toHaveProperty('icon');
      expect(firstCollection).toHaveProperty('count');
    });
  });

  describe('updateStopStatus function', () => {
    it('should be provided by context', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.updateStopStatus).toBeDefined();
      expect(typeof result.current.updateStopStatus).toBe('function');
    });

    it('should update stop status', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstStop = result.current.stops[0];
      const originalStatus = firstStop.status;

      act(() => {
        result.current.updateStopStatus(firstStop.id, 'completed');
      });

      const updatedStop = result.current.stops.find((s) => s.id === firstStop.id);
      expect(updatedStop.status).toBe('completed');
      expect(updatedStop.status).not.toBe(originalStatus);
    });

    it('should not affect other stops', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstStop = result.current.stops[0];
      const secondStop = result.current.stops[1];
      const originalSecondStatus = secondStop.status;

      act(() => {
        result.current.updateStopStatus(firstStop.id, 'completed');
      });

      const updatedSecondStop = result.current.stops.find((s) => s.id === secondStop.id);
      expect(updatedSecondStop.status).toBe(originalSecondStatus);
    });
  });

  describe('getStatistics function', () => {
    it('should be provided by context', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.getStatistics).toBeDefined();
      expect(typeof result.current.getStatistics).toBe('function');
    });

    it('should return statistics object with all fields', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();

      expect(stats).toHaveProperty('completed');
      expect(stats).toHaveProperty('remaining');
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('efficiency');
      expect(stats).toHaveProperty('issues');
      expect(stats).toHaveProperty('percentage');
      expect(stats).toHaveProperty('eta');
    });

    it('should calculate correct completed count', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();
      const completedStops = result.current.stops.filter((s) => s.status === 'completed');

      expect(stats.completed).toBe(completedStops.length);
    });

    it('should calculate correct remaining count', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();
      const pendingStops = result.current.stops.filter((s) => s.status === 'pending');

      expect(stats.remaining).toBe(pendingStops.length);
    });

    it('should calculate correct total count', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();

      expect(stats.total).toBe(result.current.stops.length);
    });

    it('should calculate efficiency percentage', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();

      expect(stats.efficiency).toMatch(/^\d+%$/);
      const efficiencyNumber = parseInt(stats.efficiency);
      expect(efficiencyNumber).toBeGreaterThanOrEqual(0);
      expect(efficiencyNumber).toBeLessThanOrEqual(100);
    });

    it('should calculate completion percentage', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const stats = result.current.getStatistics();

      expect(typeof stats.percentage).toBe('number');
      expect(stats.percentage).toBeGreaterThanOrEqual(0);
      expect(stats.percentage).toBeLessThanOrEqual(100);
    });

    it('should update statistics after status change', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const initialStats = result.current.getStatistics();
      const firstPendingStop = result.current.stops.find((s) => s.status === 'pending');

      if (firstPendingStop) {
        act(() => {
          result.current.updateStopStatus(firstPendingStop.id, 'completed');
        });

        const updatedStats = result.current.getStatistics();
        expect(updatedStats.completed).toBe(initialStats.completed + 1);
        expect(updatedStats.remaining).toBe(initialStats.remaining - 1);
      }
    });
  });

  describe('getStopByBinId function', () => {
    it('should be provided by context', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.getStopByBinId).toBeDefined();
      expect(typeof result.current.getStopByBinId).toBe('function');
    });

    it('should return stop by binId', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstStop = result.current.stops[0];

      const foundStop = result.current.getStopByBinId(firstStop.binId);

      expect(foundStop).toBeDefined();
      expect(foundStop.id).toBe(firstStop.id);
      expect(foundStop.binId).toBe(firstStop.binId);
    });

    it('should return undefined for non-existent binId', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      const foundStop = result.current.getStopByBinId('BIN-999');

      expect(foundStop).toBeUndefined();
    });
  });

  describe('handleCollectionConfirmed function', () => {
    it('should be provided by context', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.handleCollectionConfirmed).toBeDefined();
      expect(typeof result.current.handleCollectionConfirmed).toBe('function');
    });

    it('should mark stop as completed by binId', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const firstPendingStop = result.current.stops.find((s) => s.status === 'pending');

      if (firstPendingStop) {
        act(() => {
          result.current.handleCollectionConfirmed(firstPendingStop.binId);
        });

        const updatedStop = result.current.stops.find((s) => s.binId === firstPendingStop.binId);
        expect(updatedStop.status).toBe('completed');
      }
    });
  });

  describe('getPendingStops function', () => {
    it('should be provided by context', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });

      expect(result.current.getPendingStops).toBeDefined();
      expect(typeof result.current.getPendingStops).toBe('function');
    });

    it('should return only pending stops', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const pendingStops = result.current.getPendingStops();

      expect(Array.isArray(pendingStops)).toBe(true);
      pendingStops.forEach((stop) => {
        expect(stop.status).toBe('pending');
      });
    });

    it('should sort by priority (high first)', () => {
      const { result } = renderHook(() => useRoute(), { wrapper });
      const pendingStops = result.current.getPendingStops();

      if (pendingStops.length > 1) {
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        for (let i = 0; i < pendingStops.length - 1; i++) {
          const currentPriority = priorityOrder[pendingStops[i].priority];
          const nextPriority = priorityOrder[pendingStops[i + 1].priority];
          expect(currentPriority).toBeLessThanOrEqual(nextPriority);
        }
      }
    });
  });
});
