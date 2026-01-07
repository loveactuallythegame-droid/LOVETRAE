module.exports = function (api) {
  const isTest = api.env && api.env('test');
  const isWeb = api.caller && api.caller((caller) => caller && caller.platform === 'web');
  if (isWeb) {
    return {
      presets: [
        'babel-preset-expo',
      ],
      plugins: [
      'react-native-reanimated/plugin',
    ],
    };
  }
  return {
    presets: [
      'babel-preset-expo',
      ...(isTest ? ['@babel/preset-flow', '@babel/preset-typescript'] : []),
    ],
    plugins: [
      ...(isTest ? [] : ['nativewind/babel']),
      'react-native-reanimated/plugin',
    ],
  };
};
