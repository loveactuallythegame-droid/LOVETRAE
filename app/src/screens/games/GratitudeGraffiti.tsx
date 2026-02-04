import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { GameContainer } from '../../components/games/engine';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function GratitudeGraffiti({ route, navigation }: any) {
  const { gameId } = route.params || { gameId: 'gratitude-graffiti' };
  const [messages, setMessages] = useState<Array<{id: string, text: string, author: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const coupleId = useRef<string | null>(null);
  const [partnerMessages, setPartnerMessages] = useState<string[]>([]);
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
            state: { messages: [], currentInput: inputText },
          });
          setSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'game_sessions'),
            where('couple_id', '==', couple_code),
            where('gameId', '==', gameId),
            where('userId', '!=', user.uid) // Different user
          );
          
          const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added" || change.type === "modified") {
                const data = change.doc.data();
                if (data.state?.messages) {
                  setPartnerMessages(data.state.messages);
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

  const addMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        author: 'me'
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Update in Firebase
      if (sessionId) {
        const sessionRef = doc(db, 'game_sessions', sessionId);
        updateDoc(sessionRef, {
          state: { 
            messages: [...messages, newMessage], 
            currentInput: '' 
          }
        });
      }
      
      setInputText('');
    }
  };

  const inputArea = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.SPACING.lg }}>
      <GlassCard>
        <LinearGradient
          colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          <Text variant="header" style={{ marginBottom: theme.SPACING.md, color: theme.COLORS.textPrimary }}>
            Gratitude Graffiti Wall
          </Text>
          <Text variant="body" style={{ marginBottom: theme.SPACING.md, color: theme.COLORS.textSecondary }}>
            Leave messages of appreciation for your partner
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Write something appreciative..."
              placeholderTextColor={theme.COLORS.textHint}
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity 
            style={styles.addButton} 
            onPress={addMessage}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={[
                inputText.trim() ? theme.COLORS.primaryGradientStart : '#666',
                inputText.trim() ? theme.COLORS.primaryGradientEnd : '#666'
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text 
                variant="header" 
                style={{ 
                  color: inputText.trim() ? theme.COLORS.background : theme.COLORS.textHint,
                  textAlign: 'center'
                }}
              >
                Add Message
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </GlassCard>

      <GlassCard style={styles.wallContainer}>
        <Text variant="title" style={{ marginBottom: theme.SPACING.md, color: theme.COLORS.textPrimary }}>
          Messages
        </Text>
        
        <ScrollView style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <View key={msg.id} style={[styles.messageBubble, styles.myMessage]}>
              <Text variant="body" style={{ color: theme.COLORS.textPrimary }}>{msg.text}</Text>
              <Text variant="small" style={{ color: theme.COLORS.textHint, marginTop: theme.SPACING.sm, alignSelf: 'flex-end' }}>
                Me
              </Text>
            </View>
          ))}
          
          {partnerMessages.map((msg, index) => (
            <View key={`partner-${index}`} style={[styles.messageBubble, styles.partnerMessage]}>
              <Text variant="body" style={{ color: theme.COLORS.textPrimary }}>{msg}</Text>
              <Text variant="small" style={{ color: theme.COLORS.textHint, marginTop: theme.SPACING.sm, alignSelf: 'flex-end' }}>
                Partner
              </Text>
            </View>
          ))}
        </ScrollView>
      </GlassCard>
    </ScrollView>
  );

  const baseState = {
    id: gameId,
    title: 'Gratitude Graffiti',
    description: 'Leave messages of appreciation for your partner',
    category: 'emotional-connection' as const,
    difficulty: 'easy' as const,
    xpReward: 40,
    currentStep: messages.length,
    totalTime: 600,
    playerData: { 
      vulnerabilityScore: messages.length > 3 ? 80 : messages.length > 1 ? 60 : 40, 
      honestyScore: messages.length > 3 ? 85 : messages.length > 1 ? 65 : 45, 
      completionTime: 0, 
      partnerSync: partnerMessages.length > 0 ? 90 : 30 
    },
  };

  return (
    <GameContainer 
      state={baseState} 
      inputs={["text"]} 
      inputArea={inputArea} 
      onComplete={() => {
        if (sessionId) {
          const sessionRef = doc(db, 'game_sessions', sessionId);
          updateDoc(sessionRef, {
            finished_at: new Date().toISOString(),
            score: messages.length * 10,
            state: JSON.stringify({ completed: true, messageCount: messages.length })
          });
        }
        navigation.goBack();
      }} 
      sessionId={sessionId} 
    />
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  inputContainer: {
    marginBottom: theme.SPACING.md,
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    color: theme.COLORS.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  gradientButton: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  wallContainer: {
    marginTop: theme.SPACING.md,
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    marginVertical: theme.SPACING.sm,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(219, 20, 124, 0.2)',
    borderLeftColor: theme.COLORS.primaryGradientStart,
    borderLeftWidth: 3,
  },
  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(198, 10, 179, 0.2)',
    borderRightColor: theme.COLORS.profileRingEnd,
    borderRightWidth: 3,
  },
});