/**
 * Report Generator Utility
 * Functions to generate and download route completion reports
 */

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';

/**
 * Format duration from minutes to human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Generate CSV content from route data
 * @param {Object} routeData - Complete route data
 * @returns {string} CSV formatted string
 */
const generateCSVContent = (routeData) => {
  const {
    routeName,
    bins = [],
    wasteCollected = 0,
    recyclableWaste = 0,
    routeDuration = 0,
    completedAt,
    startedAt,
    assignedTo,
  } = routeData;

  let csv = 'Route Completion Report\n\n';
  
  // Route Information
  csv += 'Route Information\n';
  csv += 'Route Name,' + routeName + '\n';
  csv += 'Collector,' + (assignedTo?.firstName || '') + ' ' + (assignedTo?.lastName || '') + '\n';
  csv += 'Started At,' + (startedAt ? new Date(startedAt).toLocaleString() : 'N/A') + '\n';
  csv += 'Completed At,' + (completedAt ? new Date(completedAt).toLocaleString() : 'N/A') + '\n';
  csv += 'Total Duration,' + formatDuration(routeDuration) + '\n';
  csv += '\n';

  // Statistics
  const totalBins = bins.length;
  const collectedBins = bins.filter(b => b.status === 'collected').length;
  const skippedBins = bins.filter(b => b.status === 'skipped').length;

  csv += 'Statistics\n';
  csv += 'Total Bins,' + totalBins + '\n';
  csv += 'Collected Bins,' + collectedBins + '\n';
  csv += 'Skipped Bins,' + skippedBins + '\n';
  csv += 'Total Waste Collected,' + wasteCollected + ' kg\n';
  csv += 'Recyclable Waste,' + recyclableWaste + ' kg\n';
  csv += '\n';

  // Bin Details
  csv += 'Bin Details\n';
  csv += 'Bin ID,Location,Status,Fill Level (%),Weight (kg),Collection Time,Notes\n';

  bins.forEach((binItem) => {
    const { bin, status, actualWeight, fillLevelAtCollection, collectedAt, notes } = binItem;
    
    const binId = bin?.binId || 'N/A';
    const location = bin?.location || 'N/A';
    const fillLevel = fillLevelAtCollection !== undefined ? fillLevelAtCollection : 'N/A';
    const weight = actualWeight !== undefined ? actualWeight : 'N/A';
    const time = collectedAt ? new Date(collectedAt).toLocaleTimeString() : 'N/A';
    const binNotes = notes || '';

    // Escape commas in fields
    const escapedLocation = '"' + location.replace(/"/g, '""') + '"';
    const escapedNotes = '"' + binNotes.replace(/"/g, '""') + '"';

    csv += `${binId},${escapedLocation},${status},${fillLevel},${weight},${time},${escapedNotes}\n`;
  });

  return csv;
};

/**
 * Generate and download route completion report
 * @param {Object} routeData - Complete route data
 * @param {string} format - Report format ('csv' or 'txt')
 * @returns {Promise<Object>} Result object with success status and message
 */
export const downloadRouteReport = async (routeData, format = 'csv') => {
  try {
    if (!routeData) {
      throw new Error('Route data is required');
    }

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert(
        'Sharing not available',
        'Your device does not support sharing files. The report content will be logged to console instead.'
      );
      console.log('=== ROUTE REPORT ===');
      console.log(generateCSVContent(routeData));
      return { success: false, message: 'Sharing not available on this device' };
    }

    // Generate content
    const content = generateCSVContent(routeData);

    // Create filename with date
    const date = new Date().toISOString().split('T')[0];
    const routeName = routeData.routeName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Route_Report_${routeName}_${date}.${format}`;

    // Define file URI
    const fileUri = FileSystem.documentDirectory + filename;

    // Write file
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share file
    await Sharing.shareAsync(fileUri, {
      mimeType: format === 'csv' ? 'text/csv' : 'text/plain',
      dialogTitle: 'Save Route Report',
      UTI: format === 'csv' ? 'public.comma-separated-values-text' : 'public.plain-text',
    });

    return {
      success: true,
      message: 'Report downloaded successfully',
      fileUri,
    };
  } catch (error) {
    console.error('Error downloading report:', error);
    return {
      success: false,
      message: error.message || 'Failed to download report',
    };
  }
};

/**
 * Save route report data to local storage for offline access
 * @param {Object} routeData - Complete route data
 * @returns {Promise<boolean>} Success status
 */
export const saveRouteReportLocally = async (routeData) => {
  try {
    if (!routeData || !routeData._id) {
      throw new Error('Invalid route data');
    }

    const storageKey = `route_report_${routeData._id}`;
    const reportData = {
      ...routeData,
      savedAt: new Date().toISOString(),
    };

    // Save to AsyncStorage (you'll need to import AsyncStorage)
    // For now, using FileSystem as backup
    const fileUri = FileSystem.documentDirectory + storageKey + '.json';
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(reportData), {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return true;
  } catch (error) {
    console.error('Error saving report locally:', error);
    return false;
  }
};

/**
 * Load saved route report from local storage
 * @param {string} routeId - Route ID
 * @returns {Promise<Object|null>} Route data or null if not found
 */
export const loadSavedRouteReport = async (routeId) => {
  try {
    const storageKey = `route_report_${routeId}`;
    const fileUri = FileSystem.documentDirectory + storageKey + '.json';

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      return null;
    }

    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading saved report:', error);
    return null;
  }
};

export default {
  downloadRouteReport,
  saveRouteReportLocally,
  loadSavedRouteReport,
};
