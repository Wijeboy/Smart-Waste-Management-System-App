/**
 * BinsContext
 * Provides bins data and CRUD operations across the app
 */

import React, { createContext, useState, useContext } from 'react';

/**
 * Mock bins data for initial state
 */
const INITIAL_BINS = [
  {
    id: 1,
    binId: 'BIN-001',
    location: '123 Main St, Downtown',
    wasteType: 'general',
    capacity: '240L',
    notes: 'Near the coffee shop',
    status: 'pending',
    weight: 15.2,
    fillLevel: 85,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 2,
    binId: 'BIN-002',
    location: '456 Oak Ave, Westside',
    wasteType: 'recyclable',
    capacity: '100L',
    notes: 'Residential area',
    status: 'completed',
    weight: 8.5,
    fillLevel: 45,
    createdAt: new Date('2025-01-12'),
  },
  {
    id: 3,
    binId: 'BIN-003',
    location: '789 Pine Rd, Eastside',
    wasteType: 'organic',
    capacity: '500L',
    notes: 'Community garden',
    status: 'pending',
    weight: 22.8,
    fillLevel: 92,
    createdAt: new Date('2025-01-15'),
  },
];

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
  const [bins, setBins] = useState(INITIAL_BINS);

  /**
   * Adds a new bin to the collection
   * @param {Object} binData - New bin data (without id)
   * @returns {Object} The newly created bin with id
   */
  const addBin = (binData) => {
    const newBin = {
      id: Date.now(), // Simple ID generation
      ...binData,
      status: binData.status || 'pending',
      weight: binData.weight || 0,
      fillLevel: binData.fillLevel || 0,
      createdAt: new Date(),
    };

    setBins((prevBins) => [...prevBins, newBin]);
    return newBin;
  };

  /**
   * Updates an existing bin
   * @param {number} binId - ID of the bin to update
   * @param {Object} updates - Fields to update
   */
  const updateBin = (binId, updates) => {
    setBins((prevBins) =>
      prevBins.map((bin) =>
        bin.id === binId ? { ...bin, ...updates } : bin
      )
    );
  };

  /**
   * Deletes a bin by ID
   * @param {number} binId - ID of the bin to delete
   */
  const deleteBin = (binId) => {
    setBins((prevBins) => prevBins.filter((bin) => bin.id !== binId));
  };

  /**
   * Gets a bin by ID
   * @param {number} binId - ID of the bin to find
   * @returns {Object|undefined} The bin object or undefined
   */
  const getBinById = (binId) => {
    return bins.find((bin) => bin.id === binId);
  };

  /**
   * Gets bins filtered by status
   * @param {string} status - Status to filter by
   * @returns {Array} Array of bins with the specified status
   */
  const getBinsByStatus = (status) => {
    return bins.filter((bin) => bin.status === status);
  };

  /**
   * Gets bins filtered by waste type
   * @param {string} wasteType - Waste type to filter by
   * @returns {Array} Array of bins with the specified waste type
   */
  const getBinsByWasteType = (wasteType) => {
    return bins.filter((bin) => bin.wasteType === wasteType);
  };

  /**
   * Gets all bins sorted by creation date (newest first)
   * @returns {Array} Sorted array of bins
   */
  const getAllBinsSorted = () => {
    return [...bins].sort((a, b) => b.createdAt - a.createdAt);
  };

  /**
   * Gets statistics about bins
   * @returns {Object} Statistics object
   */
  const getBinsStatistics = () => {
    return {
      total: bins.length,
      pending: bins.filter((bin) => bin.status === 'pending').length,
      completed: bins.filter((bin) => bin.status === 'completed').length,
      byWasteType: {
        general: bins.filter((bin) => bin.wasteType === 'general').length,
        recyclable: bins.filter((bin) => bin.wasteType === 'recyclable').length,
        organic: bins.filter((bin) => bin.wasteType === 'organic').length,
      },
    };
  };

  const value = {
    bins,
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
