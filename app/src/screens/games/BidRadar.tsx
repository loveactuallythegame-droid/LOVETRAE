import { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Alert, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { GameContainer, HapticFeedbackSystem } from '../../components/games/engine';
import { createGameSession, updateGameSession, supabase } from '../../lib/supabase';
import { speakMarcie } from '../../lib/voice-engine';
import { LinearGradient } from 'expo-linear-gradient';

export default function BidRadar({ route, navigation }: any) {
  const { gameId } = route.params;
  const [bid, setBid] = useState('');
  const [isReceived, setIsReceived] = useState(false);
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }: any) => {
      const user = data.session?.user;
      if (user) {
        const couple = await supabase.from('profiles').select('couple_code').eq('user_id', user.id).single();
        if (couple.data?.couple_code) {
          const session = await createGameSession(gameId, user.id, couple.data.couple_code);
          sessionId.current = session.id;
        }
      }
    });
  }, [gameId]);

  async function submit() {
    if (!bid.trim()) {
        speakMarcie("Silence is golden, but it doesn't count as a bid. Type something.");
        return;
    }

    // Simulate AI checking
    speakMarcie(isReceived ? "Noted. Let's see if they remember making it." : "Logged. If they missed this, they owe you chocolate.");
    HapticFeedbackSystem.success();

    const xp = 150;
    if (sessionId.current) {
        await updateGameSession(sessionId.current, {
            finished_at: new Date().toISOString(),
            score: 100,
            state: JSON.stringify({ bid, isReceived, xp })
        });
    }

    Alert.alert("Bid Logged", "We'll cross-reference this with your partner's logs.", [
        { text: "OK", onPress: () => navigation.goBack() }
    ]);
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
            <Text style={styles.quoteText} variant="sass">Log emotional bids to track connection attempts! Recognize when you make or receive bids for attention.</Text>
          </View>
        </View>

        <Text variant="header">Log a Bid</Text>
        <Text variant="body">What was the bid?</Text>
        <TextInput
            style={styles.input}
            placeholder="e.g. sighed while cooking..."
            placeholderTextColor="#9ca3af"
            value={bid}
            onChangeText={setBid}
            multiline
        />
        <View style={styles.toggleRow}>
            <SquishyButton
                onPress={() => setIsReceived(false)}
                style={[styles.toggleBtn, !isReceived ? styles.activeBtn : {}]}
            >
                <Text variant="body" style={{color: !isReceived ? '#120016' : '#fff'}}>I Made It</Text>
            </SquishyButton>
            <SquishyButton
                onPress={() => setIsReceived(true)}
                style={[styles.toggleBtn, isReceived ? styles.activeBtn : {}]}
            >
                <Text variant="body" style={{color: isReceived ? '#120016' : '#fff'}}>I Received It</Text>
            </SquishyButton>
        </View>
        <SquishyButton onPress={submit} style={styles.submitBtn}>
          <LinearGradient
            colors={['#db147c', '#f05d68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text variant="header" style={{ color: '#ffffff' }}>Submit to Marcie</Text>
          </LinearGradient>
        </SquishyButton>
      </GlassCard>
    </View>
  );

  const baseState = useMemo(() => ({
    id: gameId,
    title: 'Bid Radar',
    description: 'Log real-world emotional bids',
    category: 'emotional' as const,
    difficulty: 'easy' as const,
    xpReward: 150,
    currentStep: 0,
    totalTime: 60,
    playerData: { vulnerabilityScore: 0, honestyScore: 0, completionTime: 0, partnerSync: 0 },
  }), [gameId]);

  return <GameContainer state={baseState} inputs={["text"]} inputArea={inputArea} onComplete={() => submit()} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  toggleBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeBtn: {
    backgroundColor: '#37cf97',
  },
  submitBtn: {
    marginTop: 16,
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
