
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Typography'; // Assuming you have a custom Text component
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.logoContainer}>
        <Ionicons name="sparkles-sharp" size={24} color="#fc0c84" />
        <Text style={styles.logoText}>Love Actually...</Text>
      </View>
      <View style={styles.navContainer}>
        <TouchableOpacity><Text style={styles.navText}>How to Play</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.navText}>Nebula Guide</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.navText}>About Us</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  navContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  navText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
});

export default Header;
