import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';

export default function OnboardingMeetCute({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: 'first_meet',
      question: 'Where did you first meet your partner?',
      options: [
        { value: 'work', label: 'At Work' },
        { value: 'friends', label: 'Through Friends' },
        { value: 'travel', label: 'While Traveling' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'first_impression',
      question: 'What was your first impression of them?',
      options: [
        { value: 'kind', label: 'Kind & Caring' },
        { value: 'funny', label: 'Funny & Witty' },
        { value: 'attractive', label: 'Attractive & Charismatic' },
        { value: 'intelligent', label: 'Intelligent & Thoughtful' }
      ]
    },
    {
      id: 'memorable_date',
      question: 'What was your most memorable early date?',
      options: [
        { value: 'dinner', label: 'A Nice Dinner' },
        { value: 'outdoor', label: 'Outdoor Activity' },
        { value: 'arts', label: 'Arts & Culture' },
        { value: 'adventure', label: 'Adventure Activity' }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      navigation.navigate('OnboardingCurrentVibe');
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="header" style={styles.title}>Your Love Story</Text>
          <Text variant="body" style={styles.subtitle}>Let's start with the beginning</Text>
        </View>

        <GlassCard style={styles.card}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.stepIndicator}>
              <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>
                Step {currentStep + 1} of {questions.length}
              </Text>
            </View>

            <Text variant="title" style={styles.questionText}>
              {currentQuestion.question}
            </Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    answers[currentQuestion.id] === option.value && styles.selectedOption
                  ]}
                  onPress={() => handleAnswer(currentQuestion.id, option.value)}
                >
                  <LinearGradient
                    colors={
                      answers[currentQuestion.id] === option.value
                        ? [theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]
                        : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.optionGradient}
                  >
                    <Text
                      variant="body"
                      style={{
                        color:
                          answers[currentQuestion.id] === option.value
                            ? theme.COLORS.background
                            : theme.COLORS.textPrimary
                      }}
                    >
                      {option.label}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={nextStep}
              disabled={!answers[currentQuestion.id]}
            >
              <LinearGradient
                colors={[
                  answers[currentQuestion.id] ? theme.COLORS.primaryGradientStart : '#666',
                  answers[currentQuestion.id] ? theme.COLORS.primaryGradientEnd : '#666'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueGradient}
              >
                <Text
                  variant="header"
                  style={{
                    color: answers[currentQuestion.id] ? theme.COLORS.background : theme.COLORS.textHint,
                    textAlign: 'center'
                  }}
                >
                  {currentStep === questions.length - 1 ? 'Finish Setup' : 'Next Question'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </GlassCard>

        <GlassCard style={styles.storyCard}>
          <Text variant="title" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
            Your Story So Far
          </Text>
          <Text variant="body" style={{ color: theme.COLORS.textSecondary }}>
            {Object.keys(answers).length > 0
              ? "You're building a beautiful narrative together. Every answer adds another layer to your unique love story."
              : "Share your story and help us understand your relationship's foundation."}
          </Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.SPACING.lg,
    paddingBottom: theme.SPACING.xxl,
  },
  header: {
    marginBottom: theme.SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    color: theme.COLORS.textSecondary,
    textAlign: 'center',
  },
  card: {
    marginBottom: theme.SPACING.lg,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  stepIndicator: {
    alignSelf: 'flex-end',
    marginBottom: theme.SPACING.md,
  },
  questionText: {
    fontSize: theme.TYPOGRAPHY.title.fontSize,
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.lg,
  },
  optionsContainer: {
    gap: theme.SPACING.md,
    marginBottom: theme.SPACING.lg,
  },
  option: {
    borderRadius: theme.SIZES.borderRadius,
    overflow: 'hidden',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: theme.COLORS.success,
  },
  optionGradient: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  continueButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
  },
  continueGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
  },
  storyCard: {
    padding: theme.SPACING.md,
  },
});