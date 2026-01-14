import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function SoundtrackSync({ route, navigation }: any) {
  const { gameId } = route.params;
  const [song, setSong] = useState('');

  function submit() {
    if (!song) {
      speakMarcie("Silence isn't a soundtrack. Pick a song.");
      return;
    }
    const mood = song.toLowerCase().includes('love') ? 'Romantic' : 'Edgy';
    speakMarcie(`"${song}"? Giving me ${mood} vibes. Let's see if they match.`);
    HapticFeedbackSystem.success();
    Alert.alert("Track Queued", "Waiting for partner's pick.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Soundtrack of Us</Text>
        <Text variant="body">Pick a song that defines your relationship this week.</Text>
        <TextInput
          style={styles.input}
          placeholder="Song Title - Artist"
          placeholderTextColor="#666"
          value={song}
          onChangeText={setSong}
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Sync Track</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Soundtrack Sync',
    description: 'Musical mood matching',
    category: 'creative' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, marginTop: 12 },
  btn: { marginTop: 16, backgroundColor: '#BE1980', padding: 16, borderRadius: 12, alignItems: 'center' },
});
