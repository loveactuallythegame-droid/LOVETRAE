import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { listGames, Game, supabase } from '../../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { speakMarcie } from '../../lib/voice-engine';
import { useAccess } from '../../lib/gating';
import { useAppStore } from '../../state/store';

type CategoryKey = 'emotional' | 'conflict' | 'creative' | 'romance';

const UPCOMING_GAMES: Game[] = [
  { id: 'upcoming-1', name: 'Quantum Flirting', category: 'romance', difficulty: 'Hard', xp: 500, description: 'Flirt across dimensions. (Coming Soon)', mechanics: '', marcieIntro: '' },
  { id: 'upcoming-2', name: 'Argue-Bot 3000', category: 'conflict', difficulty: 'Medium', xp: 300, description: 'Practice fighting with AI. (Coming Soon)', mechanics: '', marcieIntro: '' }
];

export default function GameLibraryScreen({ navigation }: any) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<CategoryKey>('emotional');
  const { isPremium } = useAccess();
  const previewMode = useAppStore(s => s.previewMode);

  useEffect(() => {
    listGames().then((g) => { setGames(g); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = games.filter((g) => g.category === cat);
    if (previewMode) {
      list = [...list, ...UPCOMING_GAMES.filter(g => g.category === cat)];
    }
    return list;
  }, [games, cat, previewMode]);

  function openGame(g: Game) {
    if (g.id.startsWith('upcoming-')) {
      Alert.alert('Coming Soon', 'This game is in development. Beta testers will get early access soon!');
      return;
    }

    // Premium Check
    if (g.difficulty === 'Hard' && !isPremium) {
      // Launch Demo Mode
      Alert.alert(
        'Premium Preview',
        'Launching 30-second preview of this premium game.',
        [
          {
            text: 'Start Preview',
            onPress: () => {
              // Log event
              supabase.from('feedback_events').insert({
                user_id: useAppStore.getState().user_id, // Ensure user_id is in store or fetched
                event_type: 'game_demo_start',
                payload: { game_id: g.id }
              });
              
              // Navigate with demo flag
              if (g.name === 'Truth or Trust') navigation.navigate('PlayTruthOrTrust', { gameId: g.id, demo: true });
              // Add other mappings as needed or generic runner
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return; 
    }

    if (g.name === 'Truth or Trust') navigation.navigate('PlayTruthOrTrust', { gameId: g.id });
    else if (g.name === 'Apology Auction') navigation.navigate('PlayApologyAuction', { gameId: g.id });
    else if (g.name === 'Gratitude Cloud') navigation.navigate('PlayGratitudeCloud', { gameId: g.id });
    else if (g.name === 'Eye Contact Challenge') navigation.navigate('PlayEyeContactChallenge', { gameId: g.id });
    else if (g.name === 'Memory Lane Map') navigation.navigate('PlayMemoryLaneMap', { gameId: g.id });
    else if (g.name === 'The Slap of Truth') navigation.navigate('PlaySlapOfTruth', { gameId: g.id });
    else if (g.name === 'Defensiveness Detox') navigation.navigate('PlayDefensivenessDetox', { gameId: g.id });
    else if (g.name === "Who's Right?") navigation.navigate('PlayWhosRight', { gameId: g.id });
    else if (g.name === 'Stress Test') navigation.navigate('PlayStressTest', { gameId: g.id });
    else if (g.name === 'Role-Swap Roast') navigation.navigate('PlayRoleSwapRoast', { gameId: g.id });
    else if (g.name === 'Windows & Walls') navigation.navigate('PlayWindowsAndWalls', { gameId: g.id });
    else if (g.name === 'Trigger Triage') navigation.navigate('PlayTriggerTriage', { gameId: g.id });
    else if (g.name === 'Trust Bank') navigation.navigate('PlayTrustBank', { gameId: g.id });
    else if (g.name === 'The Iceberg') navigation.navigate('PlayTheIceberg', { gameId: g.id });
    else if (g.name === 'Secrecy Audit') navigation.navigate('PlaySecrecyAudit', { gameId: g.id });
  }
  function selectCategory(c: CategoryKey) {
    setCat(c);
    const lines: Record<CategoryKey, string> = {
      emotional: 'Intimacy builds with honest presence. Keep it tender.',
      conflict: 'Fix the fight, not the person. Repair over blame.',
      creative: 'Play together. Novelty unlocks connection.',
      romance: 'Spice respectfully. Consent plus curiosity, always.',
    };
    speakMarcie(lines[c]);
  }
  const scale1 = useSharedValue(1), scale2 = useSharedValue(1), scale3 = useSharedValue(1), scale4 = useSharedValue(1);
  const s1 = useAnimatedStyle(() => ({ transform: [{ scale: scale1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ scale: scale2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ scale: scale3.value }] }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ scale: scale4.value }] }));
  function hover(v: typeof scale1, on: boolean) { v.value = withTiming(on ? 1.05 : 1, { duration: 150 }); }
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.headerRow}>
        <SquishyButton onPress={() => navigation.goBack()} style={styles.back}><Text variant="header">Back</Text></SquishyButton>
        <Text variant="header">Game Library</Text>
        <Text variant="keyword">🎮</Text>
      </View>
      <View style={styles.grid}>
        <Animated.View style={[styles.card, s1]}>
          <Pressable
            onPress={() => selectCategory('emotional')}
            onHoverIn={() => hover(scale1, true)}
            onHoverOut={() => hover(scale1, false)}
            style={styles.cardInner}
          >
            <Text variant="header" style={{ color: '#FA1F63' }}>♥</Text>
            <Text variant="header">Emotional Connection</Text>
            <Text variant="body">Build intimacy</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s2]}>
          <Pressable onPress={() => selectCategory('conflict')} onHoverIn={() => hover(scale2, true)} onHoverOut={() => hover(scale2, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#E4E831' }}>🛡️</Text>
            <Text variant="header">Conflict Resolution</Text>
            <Text variant="body">Fix fights</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s3]}>
          <Pressable onPress={() => selectCategory('creative')} onHoverIn={() => hover(scale3, true)} onHoverOut={() => hover(scale3, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#BE1980' }}>🎨</Text>
            <Text variant="header">Creative Chaos</Text>
            <Text variant="body">Play together</Text>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.card, s4]}>
          <Pressable onPress={() => selectCategory('romance')} onHoverIn={() => hover(scale4, true)} onHoverOut={() => hover(scale4, false)} style={styles.cardInner}>
            <Text variant="header" style={{ color: '#33DEA5' }}>🔥</Text>
            <Text variant="header">Romance Hub</Text>
            <Text variant="body">Spice things up</Text>
          </Pressable>
        </Animated.View>
      </View>

      <View style={{ marginTop: 12 }}>
        {loading && <GlassCard><Text variant="body">Loading games…</Text></GlassCard>}
        {!loading && filtered.length === 0 && <GlassCard><Text variant="body">No games found</Text></GlassCard>}
        {!loading && filtered.map((g) => (
          <GlassCard key={g.id}>
            <View style={{ padding: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="header">{g.name}</Text>
                <View style={[styles.badge, g.difficulty === 'Easy' ? styles.badgeEasy : g.difficulty === 'Medium' ? styles.badgeMed : styles.badgeHard]}>
                  <Text variant="keyword">{g.difficulty}</Text>
                </View>
              </View>
              <Text variant="body" style={{ color: '#d1d5db' }}>{g.description}</Text>
              <Text variant="body" style={{ color: '#33DEA5' }}>{g.xp} XP</Text>
              <View style={{ marginTop: 8 }}>
                <LinearGradient colors={['#FA1F63', '#BE1980']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.primaryBtn}>
                  <SquishyButton onPress={() => openGame(g)} style={{ backgroundColor: 'transparent' }}>
                    <Text variant="header">Play</Text>
                  </SquishyButton>
                </LinearGradient>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#5C1459', borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '48%' },
  cardInner: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', gap: 6 },
  gameCard: { },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeEasy: { backgroundColor: '#33DEA5' },
  badgeMed: { backgroundColor: '#E4E831' },
  badgeHard: { backgroundColor: '#E11637' },
  primaryBtn: { borderRadius: 20, overflow: 'hidden' },
});
