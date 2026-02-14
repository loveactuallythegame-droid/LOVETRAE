import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface GameFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onComplete?: () => void;
}

const GameFeedback: React.FC<GameFeedbackProps> = ({
  type,
  message,
  duration = 3000,
  onComplete,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Trigger haptic feedback based on type
    switch (type) {
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after duration
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onComplete) onComplete();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration, onComplete]);

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: '#4CAF50',
          icon: '#ffffff',
          text: '#ffffff',
          shadow: '#4CAF50',
        };
      case 'error':
        return {
          background: '#f44336',
          icon: '#ffffff',
          text: '#ffffff',
          shadow: '#f44336',
        };
      case 'warning':
        return {
          background: '#ff9800',
          icon: '#ffffff',
          text: '#ffffff',
          shadow: '#ff9800',
        };
      case 'info':
        return {
          background: '#2196F3',
          icon: '#ffffff',
          text: '#ffffff',
          shadow: '#2196F3',
        };
      default:
        return {
          background: '#2196F3',
          icon: '#ffffff',
          text: '#ffffff',
          shadow: '#2196F3',
        };
    }
  };

  const colors = getColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          shadowColor: colors.shadow,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Ionicons
        name={getIconName() as any}
        size={24}
        color={colors.icon}
        style={styles.icon}
      />
      <Text style={[styles.message, { color: colors.text }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});

export default GameFeedback;