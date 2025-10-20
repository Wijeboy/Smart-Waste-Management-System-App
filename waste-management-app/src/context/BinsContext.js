/**
 * BinsContext
 * Provides bins data and CRUD operations across the app
 * Now using real API instead of mock data
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

/**
 * Create the Bins Context
 */
const BinsContext = createContext();

/**
 * BinsProvider Component
 * Wraps the app and provides bins state and functions
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The BinsProvider component
 */
export const BinsProvider = ({ children }) => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch bins on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🗑️ Fetching bins from API...');
      fetchBins();
    }
  }, [isAuthenticated]);

  /**
   * Fetches bins from the API
   * @param {Object} filters - Optional filters
   */
  const fetchBins = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBins(filters);
      console.log('✅ Bins fetched:', response.count);
      setBins(response.data);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching bins:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adds a new bin to the collection
   * @param {Object} binData - New bin data
   * @returns {Object} Success/error response
   */
  const addBin = async (binData) => {
    try {
      setLoading(true);
      const response = await apiService.createBin(binData);
      console.log('✅ Bin created:', response.data.binId);
      setBins(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      console.error('❌ Error creating bin:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates an existing bin
   * @param {string} binId - MongoDB ID of the bin to update
   * @param {Object} updates - Fields to update
   * @returns {Object} Success/error response
   */
  const updateBin = async (binId, updates) => {
    try {
      setLoading(true);
      const response = await apiService.updateBin(binId, updates);
      console.log('✅ Bin updated:', binId);
      setBins(prev => prev.map(bin => 
        bin._id === binId ? response.data : bin
      ));
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      console.error('❌ Error updating bin:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes a bin by ID
   * @param {string} binId - MongoDB ID of the bin to delete
   * @returns {Object} Success/error response
   */
  const deleteBin = async (binId) => {
    try {
      setLoading(true);
      await apiService.deleteBin(binId);
      console.log('✅ Bin deleted:', binId);
      setBins(prev => prev.filter(bin => bin._id !== binId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('❌ Error deleting bin:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gets a bin by ID
   * @param {string} binId - MongoDB ID of the bin to find
   * @returns {Object|undefined} The bin object or undefined
   */
  const getBinById = (binId) => {
    return bins.find(bin => bin._id === binId);
  };

  /**
   * Gets bins filtered by status
   * @param {string} status - Status to filter by
   * @returns {Array} Array of bins with the specified status
   */
  const getBinsByStatus = (status) => {
    return bins.filter(bin => bin.status === status);
  };

  /**
   * Gets bins filtered by waste type
   * @param {string} binType - Bin type to filter by
   * @returns {Array} Array of bins with the specified bin type
   */
  const getBinsByWasteType = (binType) => {
    return bins.filter(bin => bin.binType === binType);
  };

  /**
   * Gets all bins sorted by creation date (newest first)
   * @returns {Array} Sorted array of bins
   */
  const getAllBinsSorted = () => {
    return [...bins].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /**
   * Gets statistics about bins
   * @returns {Object} Statistics object
   */
  const getBinsStatistics = () => {
    return {
      total: bins.length,
      active: bins.filter(bin => bin.status === 'active').length,
      full: bins.filter(bin => bin.status === 'full').length,
      maintenance: bins.filter(bin => bin.status === 'maintenance').length,
      byWasteType: {
        'General Waste': bins.filter(bin => bin.binType === 'General Waste').length,
        'Recyclable': bins.filter(bin => bin.binType === 'Recyclable').length,
        'Organic': bins.filter(bin => bin.binType === 'Organic').length,
        'Hazardous': bins.filter(bin => bin.binType === 'Hazardous').length,
      },
    };
  };

  const value = {
    bins,
    loading,
    error,
    fetchBins,
    addBin,
    updateBin,
    deleteBin,
    getBinById,
    getBinsByStatus,
    getBinsByWasteType,
    getAllBinsSorted,
    getBinsStatistics,
  };

  return <BinsContext.Provider value={value}>{children}</BinsContext.Provider>;
};

/**
 * Custom hook to use the Bins Context
 * @returns {Object} Context value with bins and functions
 * @throws {Error} If used outside of BinsProvider
 */
export const useBins = () => {
  const context = useContext(BinsContext);
  if (!context) {
    throw new Error('useBins must be used within a BinsProvider');
  }
  return context;
};

export default BinsContext;
