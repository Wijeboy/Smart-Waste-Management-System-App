/**
 * RouteContext
 * Provides route data and collection management functions across the app
 */

import React, { createContext, useState, useContext } from 'react';
import { 
  MOCK_STOPS, 
  MOCK_ROUTE_INFO, 
  MOCK_IMPACT_METRICS, 
  MOCK_COLLECTIONS_BY_TYPE 
} from '../api/mockData';

/**
 * Create the Route Context
 */
const RouteContext = createContext();

/**
 * RouteProvider Component
 * Wraps the app and provides route state and functions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The RouteProvider component
 */
export const RouteProvider = ({ children }) => {
  // State to manage the list of stops
  const [stops, setStops] = useState(MOCK_STOPS);
  
  // State for route information
  const [routeInfo] = useState(MOCK_ROUTE_INFO);
  
  // State for impact metrics
  const [impactMetrics] = useState(MOCK_IMPACT_METRICS);
  
  // State for collections by type
  const [collectionsByType] = useState(MOCK_COLLECTIONS_BY_TYPE);

  /**
   * Updates the status of a stop
   * @param {number} stopId - ID of the stop to update
   * @param {string} newStatus - New status value
   */
  const updateStopStatus = (stopId, newStatus) => {
    setStops((prevStops) =>
      prevStops.map((stop) =>
        stop.id === stopId ? { ...stop, status: newStatus } : stop
      )
    );
  };

  /**
   * Handles collection confirmation - finds stop and updates to 'completed'
   * @param {string} binId - The bin ID to mark as completed
   */
  const handleCollectionConfirmed = (binId) => {
    setStops((prevStops) =>
      prevStops.map((stop) =>
        stop.binId === binId ? { ...stop, status: 'completed' } : stop
      )
    );
  };

  /**
   * Gets stop by bin ID
   * @param {string} binId - The bin ID to find
   * @returns {Object|undefined} The stop object or undefined
   */
  const getStopByBinId = (binId) => {
    return stops.find((stop) => stop.binId === binId);
  };

  /**
   * Updates technical details of a stop (status, weight, fillLevel)
   * @param {string} binId - The bin ID to update
   * @param {Object} updates - Object with fields to update (status, weight, fillLevel)
   */
  const updateStopDetails = (binId, updates) => {
    setStops((prevStops) =>
      prevStops.map((stop) =>
        stop.binId === binId ? { ...stop, ...updates } : stop
      )
    );
  };

  /**
   * Gets statistics from current stops
   * @returns {Object} Statistics object
   */
  const getStatistics = () => {
    const completed = stops.filter((stop) => stop.status === 'completed').length;
    const pending = stops.filter((stop) => stop.status === 'pending').length;
    const total = stops.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const efficiency = percentage; // Efficiency equals completion percentage

    // Calculate ETA based on current time and estimated completion rate
    const now = new Date();
    const hoursToComplete = pending * 0.25; // Assume 15 minutes per stop
    const etaDate = new Date(now.getTime() + hoursToComplete * 60 * 60 * 1000);
    const eta = etaDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    return {
      completed,
      remaining: pending,
      total,
      efficiency: `${efficiency}%`,
      percentage,
      eta,
      issues: 0, // Placeholder for future implementation
    };
  };

  /**
   * Gets all stops sorted by priority (excluding initially completed ones)
   * Returns all stops to keep them visible in Next Stops even after status updates
   * @returns {Array} Array of stops sorted by priority (high first)
   */
  const getPendingStops = () => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    
    return stops
      .slice(0, 3) // Get first 3 stops (the initially pending ones)
      .sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  const value = {
    stops,
    routeInfo,
    impactMetrics,
    collectionsByType,
    updateStopStatus,
    handleCollectionConfirmed,
    getStopByBinId,
    updateStopDetails,
    getStatistics,
    getPendingStops,
  };

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};

/**
 * Custom hook to use the Route Context
 * @returns {Object} Context value with stops and functions
 * @throws {Error} If used outside of RouteProvider
 */
export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

export default RouteContext;
