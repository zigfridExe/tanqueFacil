const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Create the default Metro config
const config = getDefaultConfig(__dirname);

// Add support for absolute imports
config.resolver = {
  ...config.resolver,
  alias: {
    '@': path.resolve(__dirname, './'),
    '@src': path.resolve(__dirname, './src'),
  },
  // Add file extensions to look for
  sourceExts: [...config.resolver.sourceExts, 'mjs', 'cjs'],
};

module.exports = config;
