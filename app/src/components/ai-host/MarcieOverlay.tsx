import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MarcieHost } from '.';
import { Text } from '../ui';

export default function MarcieOverlay({ visible = true }: { visible?: boolean }) {
  const [showBubble, setShowBubble] = useState(true);
  useEffect(() => {
    if (!visible) return;
    setShowBubble(true);
    const t = setTimeout(() => setShowBubble(false), 5000);
    return () => clearTimeout(t);
  }, [visible]);
  if (!visible) return null as any;
  return (
    <View pointerEvents="none" style={styles.root}>
      <LinearGradient
        colors={['#FA1F63', 'rgba(250,31,99,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.border}
      >
        <View style={styles.avatar}>
          <MarcieHost mode="idle" size={120} float zIndex={1001} />
          <View style={styles.crown} />
        </View>
      </LinearGradient>
      {showBubble && (
        <View style={styles.bubble} aria-live="polite">
          <Text variant="sass">Stay honest and hydrated.</Text>
          <View style={styles.triangle} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', right: 20, bottom: 80, zIndex: 1001, alignItems: 'flex-end' },
  border: { padding: 2, borderRadius: 70 },
  avatar: { width: 120, height: 120, borderRadius: 60, overflow: 'hidden', backgroundColor: 'rgba(26,10,31,0.8)' },
  crown: { position: 'absolute', right: -6, top: -6, width: 22, height: 22, borderRadius: 11, backgroundColor: '#E4E831' },
  bubble: { maxWidth: 260, marginBottom: 8, padding: 10, backgroundColor: 'rgba(26,10,31,0.8)', borderRadius: 10, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)' },
  triangle: { position: 'absolute', right: 18, bottom: -8, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: 'rgba(26,10,31,0.8)' },
});
