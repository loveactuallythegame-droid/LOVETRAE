import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { TrustThermometer, Text, GlassCard, SquishyButton } from '../../components/ui';
import { COLORS } from '../../constants/colors';
import DailyChallengeCard from '../../components/games/DailyChallengeCard';
import ConfettiBurst from '../../components/effects/ConfettiBurst';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../state/store';
import SOSButton from '../../components/sos/SOSButton';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useAccess } from '../../lib/gating';

export default function DashboardHome({ navigation }: any) {
  const { trustLevel, vulnerabilityLevel } = useAppStore((s) => ({ trustLevel: s.trustLevel, vulnerabilityLevel: s.vulnerabilityLevel }));
  const { isBlocked, plan } = useAccess();
  // ... rest of state

  const [level, setLevel] = useState(trustLevel);
  const [vulnerability, setVulnerability] = useState(vulnerabilityLevel);
  const [leaders, setLeaders] = useState<{ name: string; points: number; streak: number }[]>([]);
  const [roast, setRoast] = useState('If your truth hurts, try honesty with a side of empathy.');
  const [points, setPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const trustAnim = useSharedValue(0);
  const vulnAnim = useSharedValue(0);
  const liquid = useSharedValue(0);

  useEffect(() => {
    trustAnim.value = withTiming(level, { duration: 1200, easing: Easing.out(Easing.cubic) });
    vulnAnim.value = withTiming(vulnerability, { duration: 1200, easing: Easing.out(Easing.cubic) });
    liquid.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [level, vulnerability]);

  const trustStyle = useAnimatedStyle(() => ({ width: `${Math.round(trustAnim.value * 100)}%` }));
  const vulnStyle = useAnimatedStyle(() => ({ width: `${Math.round(vulnAnim.value * 100)}%` }));
  const liquidStyle = useAnimatedStyle(() => ({ transform: [{ translateY: (liquid.value - 0.5) * 4 }] }));

  const todayRoast = useMemo(() => {
    const lines = [
      "Communication isn't mind-reading. Use words, not vibes.",
      "Apologies without change are just performance art.",
      "Secrets age poorly. Honesty doesn’t.",
      "Empathy: free, fast, and confusingly rare.",
    ];
    const i = new Date().getDate() % lines.length;
    return lines[i];
  }, []);
  useEffect(() => setRoast(todayRoast), [todayRoast]);

  useEffect(() => {
    setLeaders([
      { name: 'You', points: 1247, streak: 3 },
      { name: 'Partner', points: 1156, streak: 2 },
    ]);
  }, []);

  function incrementPoints(v: number) {
    const prev = points;
    const next = prev + v;
    setPoints(next);
    if (next > prev) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 1500); }
  }

  if (isBlocked) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <GlassCard>
          <Text variant="header">Account Suspended</Text>
          <Text variant="body">Please contact support.</Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text variant="header">Welcome back</Text>
          {plan !== 'free' && <Text variant="keyword" style={{fontSize: 12}}>Plan: {plan.toUpperCase()}</Text>}
        </View>
        <SquishyButton onPress={() => navigation.navigate('Settings')} style={styles.settingsBtn}><Text variant="header">Settings</Text></SquishyButton>
      </View>
      {/* ... rest of JSX */}

      <View style={styles.grid}>
        <GlassCard style={styles.card}>
          <Text variant="header">Trust Meter</Text>
          <View style={styles.barWrap}>
            <Animated.View style={[styles.liquid, liquidStyle]} />
            <Animated.View style={[styles.barFill, trustStyle]}>
              <LinearGradient colors={['#FA1F63', '#33DEA5']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.barFillInner} />
            </Animated.View>
          </View>
          <Text variant="keyword">{Math.round(level * 100)}%</Text>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text variant="header">Vulnerability</Text>
          <View style={styles.barWrap}>
            <Animated.View style={[styles.liquid, liquidStyle]} />
            <Animated.View style={[styles.barFill, vulnStyle]}>
              <LinearGradient colors={['#E4E831', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.barFillInner} />
            </Animated.View>
          </View>
          <Text variant="keyword">{Math.round(vulnerability * 100)}%</Text>
        </GlassCard>
      </View>

      <GlassCard>
        <Text variant="header">Relationship Leaderboard</Text>
        <View style={{ marginTop: 8, gap: 6 }}>
          <View style={styles.lbRow}>
            <View style={styles.crown} />
            <Text variant="body" style={{ color: '#33DEA5' }}>{leaders[0]?.name} — 1,247 pts</Text>
          </View>
          <View style={styles.lbRow}>
            <View style={styles.avatarSm} />
            <Text variant="body" style={{ color: '#BE1980' }}>{leaders[1]?.name} — 1,156 pts</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="header">Truth or Trust</Text>
          <Text variant="keyword">00:10:00</Text>
        </View>
        <Text variant="sass">Dr. Marcie says: if you can’t be honest, at least be consistent. Prefer honesty.</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Text variant="body">Difficulty: Medium</Text>
          <Text variant="body">XP: 150</Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
            <SquishyButton onPress={() => navigation.navigate('GameLibrary')} style={{ backgroundColor: 'transparent' }}>
              <Text variant="header">Play Now</Text>
            </SquishyButton>
          </LinearGradient>
        </View>
      </GlassCard>

      <View style={styles.quickGrid}>
        {[
          { title: 'Partner Translator', desc: 'Decode intent', onPress: () => navigation.navigate('PartnerTranslator') },
          { title: 'Game Library', desc: 'Play together', onPress: () => navigation.navigate('GameLibrary') },
          { title: 'SOS', desc: 'Emergency tools', onPress: () => navigation.navigate('SOSBooths') },
          { title: 'Settings', desc: 'Tune experience', onPress: () => navigation.navigate('Settings') },
        ].map((a, i) => (
          <Animated.View key={i} style={styles.quickCard}>
            <GlassCard>
              <Text variant="header">{a.title}</Text>
              <Text variant="body">{a.desc}</Text>
              <SquishyButton onPress={a.onPress} style={styles.quickBtn}><Text variant="header">Open</Text></SquishyButton>
            </GlassCard>
          </Animated.View>
        ))}
      </View>

      <GlassCard>
        <Text variant="header">Dr. Marcie's Daily Reality Check</Text>
        <Text variant="body" style={{ fontStyle: 'italic' }}>{roast}</Text>
      </GlassCard>
      {/* Marcie overlay is rendered globally at root */}
      <SOSButton onPress={() => navigation.navigate('SOSBooths')} style={styles.sos} />
      {showConfetti && <ConfettiBurst onEnd={() => setShowConfetti(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingsBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#33DEA5', borderRadius: 12 },
  grid: { flexDirection: 'row', gap: 12 },
  card: { flex: 1 } as any,
  barWrap: { height: 16, backgroundColor: '#120016', borderRadius: 8, overflow: 'hidden', marginTop: 8 },
  barFill: { height: 16 },
  barFillInner: { width: '100%', height: '100%' },
  liquid: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.25, backgroundColor: '#FFFFFF' },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  crown: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#E4E831' },
  avatarSm: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#5C1459' },
  primaryBtn: { borderRadius: 20, overflow: 'hidden' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickCard: { width: '48%' },
  quickBtn: { alignSelf: 'flex-end', marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#33DEA5', borderRadius: 12 },
  sos: { position: 'absolute', right: 16, bottom: 24, zIndex: 99 },
});
