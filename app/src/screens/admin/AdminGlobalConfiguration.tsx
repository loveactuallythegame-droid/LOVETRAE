
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { GlobalMarcieOverlay } from '../../components/GlobalMarcieOverlay';
import { functions } from '../../services/firebase';

const AdminGlobalConfiguration = () => {
  const handleSaveChanges = async () => {
    try {
      const saveConfig = functions.httpsCallable('saveConfig');
      await saveConfig({ sass_level: 'high' });
      console.log('Configuration saved.');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Global Configuration</Text>
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <GlobalMarcieOverlay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BarbieDream-Regular',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AdminGlobalConfiguration;
