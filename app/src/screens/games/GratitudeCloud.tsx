import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Typography, GlassCard, ScreenLayout } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATIONS } from '../../theme';

const { width } = Dimensions.get('window');

type CloudWord = { text: string; weight: number; left: number; top: number; size: number };

export default function GratitudeCloud({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'gratitude-cloud' };
  const [input, setInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [cloud, setCloud] = useState<CloudWord[]>([]);
  const sessionId = useRef<string | null>(null);
  const coupleId = useRef<string | null>(null);
  const [partnerWords, setPartnerWords] = useState<string[]>([]);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        userId.current = user.uid;
        const profileRef = doc(db, 'profiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        const couple_code = profileSnap.data()?.couple_code;

        if (couple_code) {
          coupleId.current = couple_code;
          const sessionRef = await addDoc(collection(db, 'game_sessions'), {
            gameId,
            userId: user.uid,
            couple_id: couple_code,
            createdAt: new Date(),
            state: { words: [] },
          });
          sessionId.current = sessionRef.id;

          const q = query(
            collection(db, 'game_sessions'),
            where('couple_id', '==', couple_code),
            where('gameId', '==', gameId)
          );

          const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                if (change.doc.id !== sessionId.current) {
                  const data = change.doc.data();
                  if (data.state?.words) {
                    setPartnerWords(data.state.words);
                  }
                }
              }
            });
          });
          return () => unsubscribeSnapshot();
        }
      }
    });

    return () => unsubscribeAuth && unsubscribeAuth();
  }, [gameId]);

  async function updateWordsInFirestore(newWords: string[]) {
      if (sessionId.current) {
          const sessionRef = doc(db, 'game_sessions', sessionId.current);
          await updateDoc(sessionRef, {
              state: { words: newWords }
          });
      }
  }

  function addWord(t: string) {
    const cleaned = t.trim().toLowerCase();
    if (!cleaned) return;

    if (!words.includes(cleaned)) {
        const newWords = [...words, cleaned];
        setWords(newWords);
        updateWordsInFirestore(newWords);
    }
    
    setInput('');
    if (cleaned === 'tolerable') {
      try { const { speakMarcie } = require('../../lib/voice-engine'); speakMarcie("I see you typed 'tolerable' three times. How romantic."); } catch {}
    }
  }

  useEffect(() => {
    const items = words.map((w) => {
      const weight = Math.min(3, Math.max(1, w.length >= 8 ? 3 : w.length >= 5 ? 2 : 1));
      const size = TYPOGRAPHY.fontSize.bodyLarge + weight * 4;
      return { 
        text: w, 
        weight, 
        left: Math.random() * (width - 100), 
        top: Math.random() * 160, 
        size 
      };
    });
    setCloud(items);
  }, [words]);

  const pulse = useSharedValue(1);
  useEffect(() => { 
    pulse.value = withRepeat(
      withTiming(1.05, { duration: ANIMATIONS.duration.slow * 2.4, easing: Easing.inOut(Easing.ease) }), 
      -1, 
      true
    ); 
  }, []);
  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  
  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: SPACING.xlarge }}>
      <GlassCard>
        <View style={styles.gradientContainer}>
          <Typography variant="body" style={styles.inputLabel}>
            Type positive adjectives about your partner
          </Typography>
          <TextInput 
            placeholder="Loving, brave, hilarious..." 
            style={styles.input} 
            value={input} 
            onChangeText={setInput} 
            onSubmitEditing={() => addWord(input)}
            placeholderTextColor={COLORS.textHint}
          />
        </View>
      </GlassCard>
      
      <View style={styles.cloudContainer}>
        <Animated.View style={[styles.cloud, cloudStyle]}>
          {cloud.map((c, i) => (
            <Typography 
              key={`me_${i}`} 
              variant="body"
              style={[styles.word, { 
                position: 'absolute', 
                left: c.left, 
                top: c.top, 
                fontSize: c.size, 
                color: COLORS.brightYellow,
                fontWeight: 'bold'
              }]}
            >
              {c.text}
            </Typography>
          ))}
          {partnerWords.slice(0, 20).map((w, i) => (
            <Typography 
              key={`partner_${i}`} 
              variant="body"
              style={[styles.word, { 
                position: 'absolute', 
                left: Math.random() * (width - 100), 
                top: Math.random() * 160, 
                fontSize: TYPOGRAPHY.fontSize.bodyLarge + 2, 
                color: COLORS.softViolet,
                fontWeight: '600'
              }]}
            >
              {w}
            </Typography>
          ))}
        </Animated.View>
      </View>
    </ScrollView>
  );

  const uniqueCount = words.length;
  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Gratitude Cloud',
    description: 'Rapid typing of gratitude adjectives',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 30,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: Math.min(100, uniqueCount * 8), honestyScore: Math.min(100, uniqueCount * 6), completionTime: 0, partnerSync: 0 },
  }), [gameId, uniqueCount]);

  async function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(60, 30 + uniqueCount * 2);
    if (sessionId.current) {
        const sessionRef = doc(db, 'game_sessions', sessionId.current);
        await updateDoc(sessionRef, {
            finished_at: new Date().toISOString(),
            score: res.score,
            state: { words, xp }
        });
    }
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({
  gradientContainer: {
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.card,
  },
  inputLabel: {
    marginBottom: SPACING.medium,
    color: COLORS.textPrimary,
  },
  input: { 
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1, 
    borderColor: COLORS.borderSubtle, 
    borderRadius: BORDER_RADIUS.input, 
    padding: SPACING.medium, 
    color: COLORS.textPrimary, 
    marginTop: SPACING.medium,
    minHeight: 48,
    fontSize: TYPOGRAPHY.fontSize.bodyLarge
  },
  cloudContainer: {
    flex: 1,
    marginTop: SPACING.large,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.medium,
  },
  cloud: { 
    height: 220,
    width: '100%',
  },
  word: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
