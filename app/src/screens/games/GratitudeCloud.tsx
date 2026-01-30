import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { COLORS } from '../../constants/colors';

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
            snapshot.docs.forEach((doc) => {
              if (doc.id !== sessionId.current) {
                const data = doc.data();
                if (data.state?.words) {
                  setPartnerWords(data.state.words);
                }
              }
            });
          });
          return () => unsubscribeSnapshot();
        }
      }
    });

    return () => unsubscribeAuth();
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
      const size = 12 + weight * 6;
      return { text: w, weight, left: Math.random() * 240, top: Math.random() * 160, size };
    });
    setCloud(items);
  }, [words]);

  const pulse = useSharedValue(1);
  useEffect(() => { pulse.value = withRepeat(withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  const cloudStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Type positive adjectives about your partner</Text>
        <TextInput placeholder="Loving, brave, hilarious" style={styles.input} value={input} onChangeText={setInput} onSubmitEditing={() => addWord(input)} />
      </GlassCard>
      <Animated.View style={[styles.cloud, cloudStyle]}>
        {cloud.map((c, i) => (
          <Text key={`me_${i}`} style={{ position: 'absolute', left: c.left, top: c.top, fontSize: c.size, color: COLORS.warningYellow }}>{c.text}</Text>
        ))}
        {partnerWords.slice(0, 20).map((w, i) => (
          <Text key={`partner_${i}`} style={{ position: 'absolute', left: Math.random() * 240, top: Math.random() * 160, fontSize: 14, color: COLORS.violet }}>{w}</Text>
        ))}
      </Animated.View>
    </View>
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
  input: { backgroundColor: COLORS.darkSurface, borderWidth: 1, borderColor: 'rgba(250,31,99,0.2)', borderRadius: 10, padding: 10, color: '#fff', marginTop: 8 },
  cloud: { height: 220 },
});
