import { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

export default function CompromiseJenga({ route, navigation }: any) {
  const { gameId } = route.params;
  const [blocks, setBlocks] = useState<string[]>([]);
  const [offer, setOffer] = useState('');

  function addBlock() {
    if (!offer) return;
    setBlocks(b => [...b, offer]);
    setOffer('');
    HapticFeedbackSystem.heavyImpact();
    speakMarcie("Block added. Careful, don't let it wobble.");
  }

  function finish() {
    if (blocks.length < 3) {
      speakMarcie("That's not a tower, that's a pile of rubble. Need more compromises.");
      return;
    }
    Alert.alert("Tower Built", `Height: ${blocks.length} compromises.`, [{ text: "Done", onPress: () => navigation.goBack() }]);
  }

  const inputArea = (
    <View style={{ gap: 12 }}>
      <GlassCard>
        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Build a compromise tower! Stack concessions to create a stable solution together.</Text>
          </View>
        </View>

        <Text variant="header">Compromise Tower</Text>
        <View style={styles.tower}>
            {blocks.map((b, i) => (
                <LinearGradient
                    key={i}
                    colors={i % 2 === 0 ? ['#db147c', '#f05d68'] : ['#37cf97', '#b37dec']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.block}
                >
                    <Text variant="body" style={{ color: '#ffffff', textAlign: 'center' }}>{b}</Text>
                </LinearGradient>
            ))}
            {blocks.length === 0 && <Text variant="body" style={{ textAlign: 'center', opacity: 0.5 }}>No blocks yet</Text>}
        </View>
        <Text variant="body">Add a concession:</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. I will cook on Mon/Wed"
            placeholderTextColor="#666"
            value={offer}
            onChangeText={setOffer}
        />
        <SquishyButton onPress={addBlock} style={styles.btn}>
            <LinearGradient
                colors={['#ffef1f', '#ff7600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
            >
                <Text variant="header" style={{ color: '#000' }}>Stack Block</Text>
            </LinearGradient>
        </SquishyButton>
        <SquishyButton onPress={finish} style={styles.done}>
            <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
            >
                <Text variant="header" style={{ color: '#ffffff' }}>Finish Tower</Text>
            </LinearGradient>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Compromise Jenga',
    description: 'Build a stable solution together',
    category: 'conflict' as const,
    difficulty: 'medium' as const,
    xpReward: 250,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={[]} inputArea={inputArea} onComplete={() => finish()} />;
}

const styles = StyleSheet.create({
  tower: { minHeight: 100, justifyContent: 'flex-end', gap: 2, marginBottom: 12 },
  block: { 
    padding: 10, 
    borderRadius: 4, 
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  input: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  btn: { 
    marginTop: 12, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  done: { 
    marginTop: 12, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
  },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fcc738',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover'
  },
  quoteBox: {
    flex: 1,
    backgroundColor: 'rgba(252, 199, 56, 0.2)',
    borderRadius: 12,
    padding: 12
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20
  }
});
