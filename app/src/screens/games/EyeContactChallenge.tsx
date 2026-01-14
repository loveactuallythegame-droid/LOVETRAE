import { useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';

export default function EyeContactChallenge({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'eye-contact' };
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [trackedSeconds, setTrackedSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      const couple_id = (await supabase.from('profiles').select('couple_code').eq('user_id', user?.id || '').single()).data?.couple_code;
      if (user && couple_id) {
        const session = await createGameSession(gameId, user.id, couple_id);
        sessionId.current = session.id;
      }
    });
  }, [gameId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const loader = Function('return import("react-native-vision-camera")');
        const mod: any = await (loader() as Promise<any>);
        const status = await mod.Camera.getCameraPermissionStatus();
        if (status !== 'authorized') {
          const r = await mod.Camera.requestCameraPermission();
          if (r !== 'authorized') setPermissionError('Camera permission denied');
        }
      } catch {
        setPermissionError('Face detection module not installed');
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let t: any;
    if (active) {
      t = setInterval(() => setTrackedSeconds((s) => s + 1), 1000);
    }
    return () => t && clearInterval(t);
  }, [active]);

  const inputArea = (
    <View>
      <GlassCard>
        <Text variant="body">Hold eye contact for at least 6 seconds</Text>
        {!!permissionError && <Text variant="sass">{permissionError}</Text>}
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Eye Contact Challenge',
    description: 'Maintain eye contact without distraction',
    category: 'emotional' as const,
    difficulty: 'hard' as const,
    xpReward: 75,
    currentStep: 0,
    totalTime: 30,
    playerData: { vulnerabilityScore: Math.min(100, trackedSeconds * 10), honestyScore: 50, completionTime: trackedSeconds, partnerSync: 0 },
  }), [gameId, trackedSeconds]);

  function onComplete(res: { score: number; xpEarned: number }) {
    const xp = Math.min(120, 75 + trackedSeconds * 4);
    if (trackedSeconds < 6) speakMarcie('Looking away already?');
    if (sessionId.current) updateGameSession(sessionId.current, { finished_at: new Date().toISOString(), score: res.score, state: JSON.stringify({ trackedSeconds, xp }) });
    navigation.goBack();
  }

  return <GameContainer state={baseState} inputs={["camera"]} inputArea={inputArea} onComplete={onComplete} />;
}

const styles = StyleSheet.create({});
