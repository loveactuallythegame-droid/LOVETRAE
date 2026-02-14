import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameHeaderProps {
  title: string;
  icon?: string;
  onExit: () => void;
  timer?: number;
  partnerOnline?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  icon,
  onExit,
  timer,
  partnerOnline = true,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
        {icon && (
          <Text style={styles.icon}>{icon}</Text>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {timer !== undefined && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={16} color="#ef1b6e" />
            <Text style={styles.timer}>{formatTime(timer)}</Text>
          </View>
        )}
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot, 
            partnerOnline ? styles.onlineDot : styles.offlineDot
          ]} />
          <Text style={[
            styles.statusText,
            partnerOnline ? styles.onlineText : styles.offlineText
          ]}>
            {partnerOnline ? 'Partner Online' : 'Waiting...'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 64, 129, 0.3)',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitButton: {
    padding: 8,
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 27, 110, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  timer: {
    color: '#ef1b6e',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    fontFamily: 'monospace',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  offlineDot: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  onlineText: {
    color: '#4CAF50',
  },
  offlineText: {
    color: '#f44336',
  },
});

export default GameHeader;