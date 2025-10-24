/**
 * RouteContext
 * Provides route data and collection management functions across the app
 * Integrates with backend API for route management
 * Also provides bin-based collection tracking for backward compatibility
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useBins } from './BinsContext';
import { useAuth } from './AuthContext';
import apiService from '../services/api';
import { MOCK_ROUTE_INFO } from '../api/mockData';

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
  // Get real bins from BinsContext
  const { bins, updateBin, loading: binsLoading } = useBins();
  const { user } = useAuth();
  
  // Route management state
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeStats, setRouteStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Track current day for auto-reset
  const [lastResetDate, setLastResetDate] = useState(
    () => new Date().toDateString()
  );
  
  // State for route information (backward compatibility)
  const [routeInfo] = useState(MOCK_ROUTE_INFO);
  
  // Transform bins into stops format
  const stops = bins.map((bin) => ({
    id: bin._id,
    binId: bin.binId,
    address: bin.location,
    status: bin.status === 'full' ? 'pending' : bin.status === 'active' ? 'completed' : 'pending',
    weight: bin.weight,
    fillLevel: bin.fillLevel,
    priority: bin.fillLevel >= 85 ? 'high' : bin.fillLevel >= 60 ? 'normal' : 'low',
    zone: bin.zone,
    binType: bin.binType
  }));
  
  // Auto-reset at day end (check every minute)
  useEffect(() => {
    const checkDayChange = () => {
      const currentDate = new Date().toDateString();
      
      if (currentDate !== lastResetDate) {
        console.log('🌅 New day detected! Auto-resetting bins...');
        console.log('Last reset:', lastResetDate);
        console.log('Current date:', currentDate);
        
        // Reset all bins for new day
        resetAllBins().then(() => {
          setLastResetDate(currentDate);
          console.log('✅ Auto-reset completed');
        }).catch((error) => {
          console.error('❌ Auto-reset failed:', error);
        });
      }
    };
    
    // Check immediately on mount
    checkDayChange();
    
    // Then check every minute
    const interval = setInterval(checkDayChange, 60000);
    
    return () => clearInterval(interval);
  }, [lastResetDate, bins.length]); // Re-run when date or bins change

  /**
   * Updates the status of a stop (bin)
   * @param {string} stopId - MongoDB ID of the bin
   * @param {string} newStatus - New status value ('active', 'full', 'maintenance', 'inactive')
   */
  const updateStopStatus = async (stopId, newStatus) => {
    await updateBin(stopId, { status: newStatus });
  };

  /**
   * Handles collection confirmation - finds bin and updates status + resets fill level
   * @param {string} binId - The bin ID to mark as collected
   */
  const handleCollectionConfirmed = async (binId) => {
    const bin = bins.find((b) => b.binId === binId);
    if (bin) {
      await updateBin(bin._id, { 
        status: 'active',
        fillLevel: 0,
        weight: 0,
        lastCollection: new Date().toISOString()
      });
    }
  };

  /**
   * Gets stop by bin ID
   * @param {string} binId - The bin ID to find
   * @returns {Object|undefined} The stop object or undefined
   */
  const getStopByBinId = (binId) => {
    const bin = bins.find((b) => b.binId === binId);
    if (!bin) return undefined;
    return {
      id: bin._id,
      binId: bin.binId,
      address: bin.location,
      status: bin.status === 'full' ? 'pending' : bin.status === 'active' ? 'completed' : 'pending',
      weight: bin.weight,
      fillLevel: bin.fillLevel,
      priority: bin.fillLevel >= 85 ? 'high' : bin.fillLevel >= 60 ? 'normal' : 'low',
      zone: bin.zone,
      binType: bin.binType
    };
  };

  /**
   * Updates technical details of a stop (bin)
   * @param {string} binId - The bin ID to update
   * @param {Object} updates - Object with fields to update (status, weight, fillLevel)
   */
  const updateStopDetails = async (binId, updates) => {
    console.log('📍 RouteContext.updateStopDetails called');
    console.log('   binId:', binId);
    console.log('   updates:', updates);
    
    const bin = bins.find((b) => b.binId === binId);
    console.log('   Found bin:', bin?._id || 'NOT FOUND');
    
    if (bin) {
      console.log('   Calling updateBin API...');
      const result = await updateBin(bin._id, updates);
      console.log('   Update result:', result);
      return result;
    } else {
      console.error('   ❌ Bin not found with binId:', binId);
      throw new Error(`Bin not found: ${binId}`);
    }
  };

  /**
   * Gets statistics from current bins
   * @returns {Object} Statistics object
   */
  const getStatistics = () => {
    // Completed: bins with status 'active' and fillLevel < 50
    const completed = bins.filter((bin) => bin.status === 'active' && bin.fillLevel < 50).length;
    // Pending: bins that need collection (fillLevel >= 50 or status 'full')
    const pending = bins.filter((bin) => bin.fillLevel >= 50 || bin.status === 'full').length;
    // Issues: bins in maintenance or inactive
    const issues = bins.filter((bin) => bin.status === 'maintenance' || bin.status === 'inactive').length;
    
    const total = bins.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const efficiency = percentage; // Efficiency equals completion percentage

    // Calculate ETA based on current time and estimated completion rate
    const now = new Date();
    const hoursToComplete = pending * 0.25; // Assume 15 minutes per bin
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
      issues,
    };
  };

  /**
   * Gets pending stops (bins that need collection) sorted by priority
   * @returns {Array} Array of stops sorted by priority (high first)
   */
  const getPendingStops = () => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    
    // Get bins that need collection (fillLevel >= 50 or status 'full')
    const pendingBins = bins.filter(
      (bin) => bin.fillLevel >= 50 || bin.status === 'full'
    );
    
    return pendingBins
      .map((bin) => ({
        id: bin._id,
        binId: bin.binId,
        address: bin.location,
        status: 'pending',
        weight: bin.weight,
        fillLevel: bin.fillLevel,
        priority: bin.fillLevel >= 85 ? 'high' : bin.fillLevel >= 60 ? 'normal' : 'low',
        zone: bin.zone,
        binType: bin.binType,
        notes: bin.notes
      }))
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  };
  
  /**
   * Gets completed stops (bins recently collected)
   * @returns {Array} Array of completed bins
   */
  const getCompletedStops = () => {
    const completedBins = bins.filter(
      (bin) => bin.status === 'active' && bin.fillLevel < 50
    );
    
    return completedBins.map((bin) => ({
      id: bin._id,
      binId: bin.binId,
      address: bin.location,
      status: 'completed',
      weight: bin.weight,
      fillLevel: bin.fillLevel,
      zone: bin.zone,
      binType: bin.binType,
      notes: bin.notes,
      lastCollection: bin.lastCollection
    }));
  };
  
  /**
   * Gets bins with issues (maintenance status)
   * @returns {Array} Array of bins with issues
   */
  const getIssueStops = () => {
    const issueBins = bins.filter(
      (bin) => bin.status === 'maintenance' || bin.status === 'inactive'
    );
    
    return issueBins.map((bin) => ({
      id: bin._id,
      binId: bin.binId,
      address: bin.location,
      status: 'issue',
      weight: bin.weight,
      fillLevel: bin.fillLevel,
      zone: bin.zone,
      binType: bin.binType,
      notes: bin.notes,
      complaint: bin.notes // Use notes as complaint
    }));
  };
  
  /**
   * Resets all bins to pending status (for new day)
   * Sets fillLevel to 85% to simulate bins needing collection
   */
  const resetAllBins = async () => {
    console.log('🔄 Resetting all bins to pending status...');
    
    // Update all bins
    const resetPromises = bins.map((bin) => 
      updateBin(bin._id, {
        fillLevel: 85, // Set to high fill level
        status: 'full', // Mark as needing collection
        weight: Math.round(bin.capacity * 0.85) // Estimate weight
      })
    );
    
    await Promise.all(resetPromises);
    console.log('✅ All bins reset to pending status');
  };
  
  /**
   * Calculate impact metrics based on completed bins (collected today)
   * @returns {Object} Impact metrics with waste collected, CO2 saved, trees saved
   */
  const getImpactMetrics = () => {
    // Get completed bins (recently collected)
    const completedBins = bins.filter(
      (bin) => bin.status === 'active' && bin.fillLevel < 50
    );
    
    // Calculate total waste collected (sum of all completed bin weights)
    const wasteCollected = completedBins.reduce((total, bin) => {
      // Use the bin's capacity as the amount collected (since it was full before collection)
      return total + (bin.capacity || 0);
    }, 0);
    
    // Calculate CO2 saved (estimate: 1kg waste = 0.5kg CO2 saved by proper disposal)
    const co2Saved = Math.round(wasteCollected * 0.5);
    
    // Calculate trees saved (estimate: 1 tree saves ~22kg CO2 per year, so per day ~0.06kg)
    // Trees saved = CO2 saved / 0.06
    const treesSaved = Math.round(co2Saved / 0.06);
    
    console.log('📊 Impact Metrics Calculated:');
    console.log(`   Completed bins: ${completedBins.length}`);
    console.log(`   Total waste collected: ${wasteCollected}kg`);
    console.log(`   CO2 saved: ${co2Saved}kg`);
    console.log(`   Trees saved: ${treesSaved}`);
    
    return {
      recycled: {
        value: wasteCollected.toString(),
        unit: 'kg',
      },
      co2Saved: {
        value: co2Saved.toString(),
        unit: 'kg',
      },
      treesSaved: {
        value: treesSaved.toString(),
        unit: 'trees',
      },
    };
  };
  
  /**
   * Calculate collections by bin type based on completed bins
   * @returns {Array} Array of collection counts by type
   */
  const getCollectionsByType = () => {
    // Get completed bins (recently collected)
    const completedBins = bins.filter(
      (bin) => bin.status === 'active' && bin.fillLevel < 50
    );
    
    // Count bins by type
    const typeCounts = {
      'General Waste': 0,
      'Recyclable': 0,
      'Organic': 0,
      'Hazardous': 0,
    };
    
    // Sum up weights by type
    const typeWeights = {
      'General Waste': 0,
      'Recyclable': 0,
      'Organic': 0,
      'Hazardous': 0,
    };
    
    completedBins.forEach((bin) => {
      const type = bin.binType || 'General Waste';
      if (typeCounts.hasOwnProperty(type)) {
        typeCounts[type]++;
        typeWeights[type] += (bin.capacity || 0);
      }
    });
    
    // Create array with icons
    const typeIcons = {
      'General Waste': '🗑️',
      'Recyclable': '♻️',
      'Organic': '🌱',
      'Hazardous': '☢️',
    };
    
    console.log('📊 Collections by Type:');
    Object.keys(typeCounts).forEach((type) => {
      console.log(`   ${typeIcons[type]} ${type}: ${typeCounts[type]} bins, ${typeWeights[type]}kg`);
    });
    
    return Object.keys(typeCounts).map((type) => ({
      type,
      count: typeCounts[type],
      weight: `${typeWeights[type]}kg`,
      icon: typeIcons[type],
    }));
  };

  // ========================================
  // NEW: Route Management API Methods
  // ========================================

  /**
   * Fetch all routes (Admin)
   */
  const fetchRoutes = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllRoutes(filters);
      setRoutes(response.data.routes);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch routes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch my routes (Collector)
   */
  const fetchMyRoutes = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMyRoutes(filters);
      setRoutes(response.data.routes);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch routes';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create new route (Admin)
   */
  const createRoute = async (routeData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createRoute(routeData);
      // Refresh routes list
      await fetchRoutes();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create route';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update route (Admin)
   */
  const updateRoute = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.updateRoute(id, updates);
      // Refresh routes list
      await fetchRoutes();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update route';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete route (Admin)
   */
  const deleteRoute = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteRoute(id);
      // Refresh routes list
      await fetchRoutes();
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete route';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Assign collector to route (Admin)
   */
  const assignCollector = async (routeId, collectorId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.assignCollector(routeId, collectorId);
      // Refresh routes list
      await fetchRoutes();
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to assign collector';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start route (Collector)
   */
  /**
   * Start route (Collector)
   * @param {string} routeId - The route ID to start
   * @param {Object} preRouteChecklist - The completed checklist data
   */
  const startRoute = async (routeId, preRouteChecklist) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.startRoute(routeId, preRouteChecklist);
      setSelectedRoute(response.data.route);
      // Refresh my routes
      if (user?.role === 'collector') {
        await fetchMyRoutes();
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to start route';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Collect bin (Collector)
   */
  const collectBin = async (routeId, binId, actualWeight) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.collectBin(routeId, binId, actualWeight);
      setSelectedRoute(response.data.route);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to collect bin';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Skip bin (Collector)
   */
  const skipBin = async (routeId, binId, reason) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.skipBin(routeId, binId, reason);
      setSelectedRoute(response.data.route);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to skip bin';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Complete route (Collector)
   */
  const completeRoute = async (routeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.completeRoute(routeId);
      setSelectedRoute(null);
      // Refresh my routes
      if (user?.role === 'collector') {
        await fetchMyRoutes();
      }
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to complete route';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch route statistics (Admin)
   */
  const fetchRouteStats = async () => {
    try {
      const response = await apiService.getRouteStats();
      setRouteStats(response.data.stats);
      return { success: true, data: response.data.stats };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch route stats';
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Select a route
   */
  const selectRoute = (route) => {
    setSelectedRoute(route);
  };

  // Calculate dynamic metrics
  const impactMetrics = getImpactMetrics();
  const collectionsByType = getCollectionsByType();

  const value = {
    // Existing bin-based functionality
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
    getCompletedStops,
    getIssueStops,
    resetAllBins,
    
    // New route management functionality
    routes,
    selectedRoute,
    routeStats,
    loading: loading || binsLoading,
    error,
    fetchRoutes,
    fetchMyRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
    assignCollector,
    startRoute,
    collectBin,
    skipBin,
    completeRoute,
    fetchRouteStats,
    selectRoute,
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
