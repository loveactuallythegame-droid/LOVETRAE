import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const PHRASES = ["I'll tell them later", "It's not a big deal", "They're busy", "I forgot", "Just this once"];
const HAMMER = "Say It Now";

export default function AvoidanceArcade({ navigation }: any) {
  const [moles, setMoles] = useState<boolean[]>(new Array(5).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let interval: any;
    let moleTimer: any;

    if (active && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      moleTimer = setInterval(() => {
        const idx = Math.floor(Math.random() * 5);
        const newMoles = [...moles];
        // Randomly show/hide
        newMoles[idx] = Math.random() > 0.3;
        setMoles(newMoles);
      }, 800);
    } else if (timeLeft === 0 && active) {
      setActive(false);
    }

    return () => { clearInterval(interval); clearInterval(moleTimer); };
  }, [active, timeLeft, moles]);

  function whack(idx: number) {
    if (moles[idx]) {
      setScore(score + 5);
      const newMoles = [...moles];
      newMoles[idx] = false; // Whacked
      setMoles(newMoles);
    } else {
      setScore(Math.max(0, score - 2));
    }
  }

  function startGame() {
    setScore(0);
    setTimeLeft(30);
    setActive(true);
    setMoles(new Array(5).fill(false));
  }

  return (
    <LinearGradient colors={['#102010', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">Avoidance Arcade</Text>
        </View>

        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Face your avoidance patterns! Confrontation now prevents bigger issues later.</Text>
          </View>
        </View>

        <GlassCard style={styles.scoreboard}>
          <Text variant="header">Score: {score}</Text>
          <Text variant="header" style={{ color: timeLeft < 10 ? '#db147c' : '#37cf97' }}>{timeLeft}s</Text>
        </GlassCard>

        {!active ? (
          <GlassCard style={{ padding: 20, alignItems: 'center', gap: 10 }}>
            <Text variant="header">Whac-A-Mole: Avoidance Edition</Text>
            <Text variant="body" style={{ textAlign: 'center' }}>
              Tap the avoidance phrases before they disappear!
            </Text>
            <SquishyButton onPress={startGame} style={styles.btn}>
              <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text variant="header" style={{ color: '#ffffff' }}>Start</Text>
              </LinearGradient>
            </SquishyButton>
            {timeLeft === 0 && (
                <Text variant="body" style={{ marginTop: 10, fontStyle: 'italic', color: '#db147c' }}>
                    Marcie: "Game over. Don't avoid real life now."
                </Text>
            )}
          </GlassCard>
        ) : (
          <View style={styles.grid}>
            {PHRASES.map((phrase, i) => (
              <Pressable
                key={i}
                onPress={() => whack(i)}
                style={[styles.mole, moles[i] ? styles.moleActive : styles.moleInactive]}
              >
                <Text style={styles.moleText}>{moles[i] ? phrase : "..."}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  drMarcieSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20
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
  },
  scoreboard: { 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  grid: { gap: 10 },
  mole: { 
    height: 60, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  moleActive: { 
    backgroundColor: '#db147c',
  },
  moleInactive: { 
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  moleText: { 
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  btn: { 
    padding: 15, 
    borderRadius: 12, 
    width: 200, 
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
    paddingVertical: 15,
  }
});
