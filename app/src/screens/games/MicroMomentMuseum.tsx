import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';

export default function MicroMomentMuseum({ route, navigation }: any) {
  const { gameId } = route.params;
  const [caption, setCaption] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  function upload() {
    setHasPhoto(true);
    speakMarcie("Photo received. Tiny but mighty.");
    HapticFeedbackSystem.selection();
  }

  function submit() {
    if (!hasPhoto) {
      speakMarcie("Where's the photo? The exhibit is empty.");
      return;
    }
    if (!caption) {
      speakMarcie("It needs a title. Don't be lazy.");
      return;
    }
    speakMarcie(`"${caption}" — A masterpiece of mundane affection.`);
    HapticFeedbackSystem.success();
    Alert.alert("Exhibit Curated", "Added to the museum.", [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        <Text variant="header">Curate a Moment</Text>
        <Text variant="body">Upload a photo of a small connection:</Text>
        <SquishyButton onPress={upload} style={styles.upload}>
            <Text variant="body">{hasPhoto ? "📸 Photo Selected" : "Tap to Upload Photo"}</Text>
        </SquishyButton>
        <Text variant="body" style={{ marginTop: 12 }}>Write a caption:</Text>
        <TextInput
          style={styles.input}
          placeholder="Title this moment..."
          placeholderTextColor="#666"
          value={caption}
          onChangeText={setCaption}
        />
        <SquishyButton onPress={submit} style={styles.btn}>
            <Text variant="header">Hang in Museum</Text>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Micro-Moment Museum',
    description: 'Catalog small acts of love',
    category: 'romance' as const,
    difficulty: 'easy' as const,
    xpReward: 100,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  upload: { height: 100, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8, borderStyle: 'dashed', borderWidth: 1, borderColor: '#666' },
  input: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: 12, borderRadius: 8, marginTop: 8 },
  btn: { marginTop: 16, backgroundColor: '#33DEA5', padding: 16, borderRadius: 12, alignItems: 'center' },
});
