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

const MISSING_GAMES: Game[] = [
  { id: 'missing-1', name: 'Lie Detector: Lite', category: 'conflict', difficulty: 'Hard', xp: 400, description: 'Async voice response + AI prosody analysis.', mechanics: 'Partner records ≤10-sec answer. AI scores fluency and steadiness.', marcieIntro: '24/25. Only slipped on ‘uh’ once. I’ll allow it… this time.' },
  { id: 'missing-2', name: 'Transparency Toss', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Real-time text relay of low-stakes truths.', mechanics: 'Each “toss” = truth. Partner must tap ✅ to verify.', marcieIntro: 'You tossed ‘I scrolled TikTok while you talked’… and they confirmed? Bold.' },
  { id: 'missing-3', name: 'Boundary Bingo', category: 'conflict', difficulty: 'Medium', xp: 250, description: 'Async shared grid of boundaries.', mechanics: 'Mark squares after mutual ✅. Line = +20.', marcieIntro: 'BINGO on ‘I asked for space and didn’t feel guilty’? Someone upgraded their firmware.' },
  { id: 'missing-4', name: 'Vibe Sync', category: 'emotional', difficulty: 'Easy', xp: 150, description: 'Synchronous slider for emotional battery.', mechanics: 'A sets level (0–100) → B guesses. Match = points.', marcieIntro: 'You guessed 68… they’re at 69. Psychic or just that in love?' },
  { id: 'missing-5', name: 'Rewrite the Memory', category: 'emotional', difficulty: 'Hard', xp: 350, description: 'Shared canvas + AI narrative scoring.', mechanics: 'One types fragment, both edit with hope/absurdity.', marcieIntro: '‘…and then a raccoon stole his phone’? 28/30. Poetic and feral.' },
  { id: 'missing-6', name: 'Guilt vs. Shame Sort', category: 'emotional', difficulty: 'Easy', xp: 100, description: 'Rapid swipe (Tinder-style) for emotions.', mechanics: '“I messed up” (Guilt) vs. “I’m a failure” (Shame).', marcieIntro: 'Swiped ‘I’m unlovable’ left? Wrong. Hard right to the trash.' },
  { id: 'missing-7', name: 'Flashback Frenzy', category: 'emotional', difficulty: 'Medium', xp: 250, description: 'Async image association game.', mechanics: 'A sees image → types emotion → B guesses why.', marcieIntro: '‘Rain’ = ‘that night you didn’t come home’… and they guessed exactly? Listening level: 100.' },
  { id: 'missing-8', name: 'The Denial Detector', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Voice-to-text audit for the word "fine".', mechanics: 'Say “Everything’s fine.” <2x “fine” = points.', marcieIntro: 'You said ‘fine’ 7 times. Congrats—you’ve unlocked Emotional Bottleneck. 🏆' },
  { id: 'missing-9', name: 'Vulnerability Volley', category: 'emotional', difficulty: 'Hard', xp: 300, description: 'Timed text ping-pong.', mechanics: 'A replies ≤15s → B validates ≤15s.', marcieIntro: 'You blocked with ‘lol same’? That’s not a volley—that’s a miss.' },
  { id: 'missing-10', name: 'The Touch Map: Lite', category: 'romance', difficulty: 'Medium', xp: 200, description: 'Abstract body outline coloring.', mechanics: 'Tap zones for Green/Yellow/Red comfort levels.', marcieIntro: 'They marked ‘triangle’ yellow… you green. Wanna unpack over sparkling water?' },
  { id: 'missing-11', name: 'Avoidance Arcade', category: 'conflict', difficulty: 'Easy', xp: 150, description: 'Whac-A-Mole for avoidance phrases.', mechanics: 'Moles = “I’ll tell them later”. Whack with “Say It Now”.', marcieIntro: 'Missed ‘We should talk’? Congrats—now they think you’re leaving for a barista.' },
  { id: 'missing-12', name: 'The Needs Decoder', category: 'emotional', difficulty: 'Medium', xp: 200, description: 'Emoji cipher for needs.', mechanics: 'A sends 3 emojis. B guesses unmet need.', marcieIntro: '🌧️☕️🐶 = ‘Let me sulk in peace with snacks and the dog’? Genius.' },
  { id: 'missing-13', name: 'Escapism Escape Room', category: 'conflict', difficulty: 'Hard', xp: 350, description: '60-sec puzzle to escape habits.', mechanics: 'Solve riddle. Clues = real-life escapes.', marcieIntro: 'Escaped in 42s! …Wait, you used ‘work email’ as a clue? Touché.' },
  { id: 'missing-14', name: 'The Blame Flip', category: 'conflict', difficulty: 'Medium', xp: 200, description: 'Drag-and-drop rewrite of blame.', mechanics: 'Fix “You make me feel…” → drag “I feel…” to front.', marcieIntro: '‘You never listen’ → ‘I feel unheard when…’—YES.' },
  { id: 'missing-15', name: 'Micro-Betrayal Mini-Golf', category: 'creative', difficulty: 'Easy', xp: 150, description: 'Physics putt-putt for repair.', mechanics: 'Ball = small breach. Navigate assumption → hole (repair).', marcieIntro: 'Sunk it in 2 strokes? Impressive. Now apply that to actual texting.' },
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
    let list = [...games, ...MISSING_GAMES].filter((g) => g.category === cat);
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
    else if (g.name === 'Lie Detector: Lite') navigation.navigate('PlayLieDetector', { gameId: g.id });
    else if (g.name === 'Transparency Toss') navigation.navigate('PlayTransparencyToss', { gameId: g.id });
    else if (g.name === 'Boundary Bingo') navigation.navigate('PlayBoundaryBingo', { gameId: g.id });
    else if (g.name === 'Vibe Sync') navigation.navigate('PlayVibeSync', { gameId: g.id });
    else if (g.name === 'Rewrite the Memory') navigation.navigate('PlayRewriteMemory', { gameId: g.id });
    else if (g.name === 'Guilt vs. Shame Sort') navigation.navigate('PlayGuiltShameSort', { gameId: g.id });
    else if (g.name === 'Flashback Frenzy') navigation.navigate('PlayFlashbackFrenzy', { gameId: g.id });
    else if (g.name === 'The Denial Detector') navigation.navigate('PlayDenialDetector', { gameId: g.id });
    else if (g.name === 'Vulnerability Volley') navigation.navigate('PlayVulnerabilityVolley', { gameId: g.id });
    else if (g.name === 'The Touch Map: Lite') navigation.navigate('PlayTouchMap', { gameId: g.id });
    else if (g.name === 'Avoidance Arcade') navigation.navigate('PlayAvoidanceArcade', { gameId: g.id });
    else if (g.name === 'The Needs Decoder') navigation.navigate('PlayNeedsDecoder', { gameId: g.id });
    else if (g.name === 'Escapism Escape Room') navigation.navigate('PlayEscapismRoom', { gameId: g.id });
    else if (g.name === 'The Blame Flip') navigation.navigate('PlayBlameFlip', { gameId: g.id });
    else if (g.name === 'Micro-Betrayal Mini-Golf') navigation.navigate('PlayMicroBetrayalGolf', { gameId: g.id });
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
