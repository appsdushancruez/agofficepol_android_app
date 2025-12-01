// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure JSON files are processed as source files (not assets) for Lottie
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'json');
if (!config.resolver.sourceExts.includes('json')) {
  config.resolver.sourceExts.push('json');
}

// Add path alias support for @
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

module.exports = config;

