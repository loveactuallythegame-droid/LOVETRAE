// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolve the workspace root and the app directory
const workspaceRoot = path.resolve(__dirname, '..');
const appDirectory = __dirname;

// Add the monorepo configuration
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(appDirectory, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Add support for absolute imports
config.resolver.alias = {
  ...config.resolver.alias,
  '@': path.resolve(appDirectory, 'src'),
  '@assets': path.resolve(appDirectory, 'assets'),
  '@components': path.resolve(appDirectory, 'src', 'components'),
  '@screens': path.resolve(appDirectory, 'src', 'screens'),
  '@lib': path.resolve(appDirectory, 'src', 'lib'),
  '@hooks': path.resolve(appDirectory, 'src', 'hooks'),
  '@utils': path.resolve(appDirectory, 'src', 'utils'),
  '@constants': path.resolve(appDirectory, 'src', 'constants'),
};

module.exports = config;