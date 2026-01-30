
import React from 'react';
import { View, Text } from 'react-native';

const GlobalConfig = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#5C1459', padding: 20 }}>
      <Text style={{ fontSize: 32, fontFamily: 'BarbieDream-Regular', color: '#FA1F63' }}>Global Configuration</Text>
      {/* TODO: Implement UI based on AdminGlobalConfiguration.html */}
    </View>
  );
};

export default GlobalConfig;
