import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { GlassCard, Text, SquishyButton } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const ORIGINAL = ["You", "make", "me", "feel", "ignored"];
const GOAL = ["I", "feel", "ignored", "when", "you"]; // Simplified check

export default function BlameFlip({ navigation }: any) {
  const [words, setWords] = useState(["You", "make", "me", "feel", "ignored"]);
  const [success, setSuccess] = useState(false);

  // Simplified "drag and drop" by just swapping specific words for this demo
  // A real implementation would use a drag-and-drop library

  function swapToI() {
     setWords(["I", "feel", "ignored", "when..."]);
     setSuccess(true);
  }

  return (
    <LinearGradient colors={['#201010', '#000000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SquishyButton onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text variant="body">Back</Text>
          </SquishyButton>
          <Text variant="header">The Blame Flip</Text>
        </View>

        {/* Dr. Marcie Section */}
        <View style={styles.drMarcieSection}>
          <View style={styles.avatarContainer}>
            <Image source={require('../../assets/images/MarcieAvatar.png')} style={styles.avatar} />
          </View>
          <View style={styles.quoteBox}>
            <Text style={styles.quoteText} variant="sass">Transform blame into ownership! Change "you" statements to "I" statements for better communication.</Text>
          </View>
        </View>

        <GlassCard style={styles.card}>
          <Text variant="header">Fix the Sentence</Text>
          <Text variant="body" style={{ textAlign: 'center', marginBottom: 20 }}>
            Change "You make me feel..." to an "I" statement.
          </Text>

          <View style={styles.wordRow}>
            {words.map((w, i) => (
              <View key={i} style={styles.wordBox}>
                <Text style={styles.wordText}>{w}</Text>
              </View>
            ))}
          </View>

          {!success ? (
            <SquishyButton onPress={swapToI} style={styles.btn}>
              <LinearGradient
                colors={['#db147c', '#f05d68']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text variant="header" style={{ color: '#ffffff' }}>Flip It</Text>
              </LinearGradient>
            </SquishyButton>
          ) : (
             <View style={{ marginTop: 20 }}>
               <Text variant="header" style={{ color: '#37cf97', textAlign: 'center' }}>Nice Flip! (+10 XP)</Text>
               <Text variant="body" style={{ textAlign: 'center', marginTop: 10 }}>
                 Marcie: "‘You never listen’ → ‘I feel unheard when…’—YES. Now say it without an eye roll."
               </Text>
             </View>
          )}
        </GlassCard>
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
  card: { 
    padding: 20, 
    gap: 20, 
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(219, 20, 124, 0.3)',
  },
  wordRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'center' },
  wordBox: { 
    padding: 10, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  wordText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  btn: { 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center', 
    width: 200,
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
