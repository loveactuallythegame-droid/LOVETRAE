import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc, addDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export default function SOSModal({ visible, onClose, navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sosSessionId, setSosSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    i_feel: '',
    when_partner: '',
    because_i_tell_myself: '',
    what_i_need: ''
  });
  const [sessionData, setSessionData] = useState<any>(null);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  useEffect(() => {
    if (visible) {
      const user = auth.currentUser;
      if (user) {
        // Create a new SOS session
        const createSession = async () => {
          const sessionRef = await addDoc(collection(db, 'sos_sessions'), {
            initiator_id: user.uid,
            couple_id: null, // Will be populated when partner joins
            status: "waiting_for_partner",
            started_at: new Date(),
            submissions: {},
            verdict: null
          });
          
          setSosSessionId(sessionRef.id);
          
          // Set up real-time sync with partner
          const q = query(
            collection(db, 'sos_sessions'),
            where('id', '==', sessionRef.id)
          );
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === "modified") {
                const data = change.doc.data();
                setSessionData(data);
                
                // Check if partner has submitted
                if (data.submissions && Object.keys(data.submissions).length > 1) {
                  setPartnerSubmitted(true);
                }
              }
            });
          });
          
          return () => unsubscribe();
        };
        
        createSession();
      }
    } else {
      // Reset when modal closes
      setCurrentStep(0);
      setFormData({
        i_feel: '',
        when_partner: '',
        because_i_tell_myself: '',
        what_i_need: ''
      });
    }
  }, [visible]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitForm = async () => {
    if (!sosSessionId) return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    // Submit the form data
    const sessionRef = doc(db, 'sos_sessions', sosSessionId);
    await updateDoc(sessionRef, {
      [`submissions.${user.uid}`]: {
        i_feel: formData.i_feel,
        when_partner: formData.when_partner,
        because_i_tell_myself: formData.because_i_tell_my_self,
        what_i_need: formData.what_i_need,
        submitted_at: new Date()
      }
    });
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete the session
      await updateDoc(sessionRef, {
        status: "submitted"
      });
      onClose();
    }
  };

  const steps = [
    {
      title: "I Feel...",
      field: "i_feel",
      placeholder: "Describe your emotion...",
      helper: "Name the feeling you're experiencing"
    },
    {
      title: "When Partner...",
      field: "when_partner",
      placeholder: "What did your partner do?",
      helper: "Describe the specific behavior or action"
    },
    {
      title: "Because I Tell Myself...",
      field: "because_i_tell_myself",
      placeholder: "What story are you telling yourself?",
      helper: "Identify your internal narrative"
    },
    {
      title: "What I Need...",
      field: "what_i_need",
      placeholder: "What would help you feel better?",
      helper: "Express your specific need"
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          onPress={onClose}
        />
        
        <View style={styles.modalContent}>
          <GlassCard style={styles.modalCard}>
            <LinearGradient
              colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <View style={styles.header}>
                <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
                  SOS: Fight Solver
                </Text>
                <Text variant="small" style={{ color: theme.COLORS.textHint }}>
                  Step {currentStep + 1} of {steps.length}
                </Text>
              </View>
              
              <View style={styles.stepIndicator}>
                {steps.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.stepDot, 
                      index === currentStep && styles.activeStepDot,
                      index < currentStep && styles.completedStepDot
                    ]} 
                  />
                ))}
              </View>
              
              <Text variant="title" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
                {currentStepData.title}
              </Text>
              
              <Text variant="small" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.lg }}>
                {currentStepData.helper}
              </Text>
              
              <TextInput
                style={styles.textInput}
                placeholder={currentStepData.placeholder}
                value={formData[currentStepData.field as keyof typeof formData] as string}
                onChangeText={(value) => updateFormData(currentStepData.field, value)}
                multiline
                numberOfLines={4}
              />
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={submitForm}
                  disabled={!formData[currentStepData.field as keyof typeof formData]}
                >
                  <LinearGradient
                    colors={[
                      formData[currentStepData.field as keyof typeof formData] 
                        ? theme.COLORS.primaryGradientStart 
                        : '#666',
                      formData[currentStepData.field as keyof typeof formData] 
                        ? theme.COLORS.primaryGradientEnd 
                        : '#666'
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text 
                      variant="header" 
                      style={{ 
                        color: formData[currentStepData.field as keyof typeof formData] 
                          ? theme.COLORS.background 
                          : theme.COLORS.textHint,
                        textAlign: 'center'
                      }}
                    >
                      {currentStep === steps.length - 1 ? 'Submit SOS' : 'Next'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton} 
                  onPress={onClose}
                >
                  <Text 
                    variant="header" 
                    style={{ 
                      color: theme.COLORS.textPrimary,
                      textAlign: 'center'
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalCard: {
    flex: 1,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.SPACING.lg,
    gap: 10,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.COLORS.textHint,
  },
  activeStepDot: {
    backgroundColor: theme.COLORS.primaryGradientStart,
  },
  completedStepDot: {
    backgroundColor: theme.COLORS.success,
  },
  textInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(250, 31, 99, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
    padding: theme.SPACING.md,
    color: theme.COLORS.textPrimary,
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: theme.SPACING.lg,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  button: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    marginBottom: theme.SPACING.md,
  },
  buttonGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  secondaryButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    borderWidth: 1,
    borderColor: theme.COLORS.textHint,
    padding: theme.SPACING.lg,
  },
});