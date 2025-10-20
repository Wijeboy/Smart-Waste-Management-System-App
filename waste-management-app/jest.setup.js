// Jest setup file for React Native and Expo

// Mock Expo global objects
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((val) => JSON.parse(JSON.stringify(val)));

// Mock Expo modules
jest.mock('expo', () => ({
  __ExpoImportMetaRegistry: {},
}));
