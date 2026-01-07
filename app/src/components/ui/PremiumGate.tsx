import { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAccess } from '../../lib/gating';
import GlassCard from './GlassCard';
import Text from './Typography';
import { LinearGradient } from 'expo-linear-gradient';

type PremiumGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  override?: boolean;
  lockMessage?: string;
  onUnlock?: () => void;
};

export default function PremiumGate({ 
  children, 
  fallback, 
  override = false, 
  lockMessage = "Unlock with Premium",
  onUnlock 
}: PremiumGateProps) {
  const { isPremium } = useAccess();

  if (isPremium || override) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={[styles.overlay, StyleSheet.absoluteFill]}>
        <GlassCard style={styles.lockCard}>
          <Text variant="header" style={{ fontSize: 32 }}>🔒</Text>
          <Text variant="header">{lockMessage}</Text>
          <Text variant="body" style={{ textAlign: 'center', marginVertical: 8 }}>
            Get full access to all games, detailed insights, and Dr. Marcie's unfiltered wisdom.
          </Text>
          <TouchableOpacity onPress={onUnlock}>
            <LinearGradient
              colors={['#FA1F63', '#BE1980']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text variant="header" style={{ fontSize: 16 }}>Upgrade Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    opacity: 0.3,
    pointerEvents: 'none',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 10, 31, 0.6)',
    padding: 16,
  },
  lockCard: {
    alignItems: 'center',
    padding: 24,
    maxWidth: 320,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 12,
  },
});
