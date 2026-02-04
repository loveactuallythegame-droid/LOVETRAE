import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';

export default function GameResultsScreen({ route, navigation }: any) {
  const { gameId, gameTitle, score, maxScore, xpEarned, completed, responses, achievements } = route.params || {
    gameId: 'sample-game',
    gameTitle: 'Sample Game',
    score: 85,
    maxScore: 100,
    xpEarned: 50,
    completed: true,
    responses: [],
    achievements: []
  };
  
  const [userData, setUserData] = useState<any>(null);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          // Fetch user profile
          const userRef = doc(db, 'profiles', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
          
          // Fetch couple data if linked
          if (userSnap.data()?.partner_id) {
            const partnerRef = doc(db, 'profiles', userSnap.data().partner_id);
            const partnerSnap = await getDoc(partnerRef);
            
            if (partnerSnap.exists()) {
              setPartnerData(partnerSnap.data());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const percentage = Math.round((score / maxScore) * 100);
  const badgeColor = percentage >= 80 ? theme.COLORS.success : percentage >= 60 ? theme.COLORS.accentYellow : theme.COLORS.warning;

  const renderAchievement = (achievement: any) => (
    <GlassCard key={achievement.id} style={styles.achievementCard}>
      <LinearGradient
        colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.achievementGradient}
      >
        <View style={styles.achievementContent}>
          <Text variant="title" style={{ color: theme.COLORS.textPrimary }}>
            {achievement.title}
          </Text>
          <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>
            {achievement.description}
          </Text>
        </View>
      </LinearGradient>
    </GlassCard>
  );

  return (
    <LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="header" style={styles.title}>Game Results</Text>
          <Text variant="body" style={styles.subtitle}>{gameTitle}</Text>
        </View>

        <GlassCard style={styles.resultsCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.scoreContainer}>
              <Text variant="header" style={{ fontSize: 48, color: badgeColor }}>
                {percentage}%
              </Text>
              <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginTop: theme.SPACING.sm }}>
                {score}/{maxScore} points
              </Text>
            </View>

            <View style={styles.xpContainer}>
              <Text variant="body" style={{ color: theme.COLORS.textSecondary }}>
                XP Earned:
              </Text>
              <Text variant="header" style={{ color: theme.COLORS.accentTeal, marginLeft: theme.SPACING.sm }}>
                +{xpEarned}
              </Text>
            </View>

            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={[badgeColor, badgeColor + '80']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badgeGradient}
              >
                <Text variant="header" style={{ color: theme.COLORS.background, textAlign: 'center' }}>
                  {percentage >= 80 ? 'EXCELLENT' : percentage >= 60 ? 'GOOD' : 'KEEP GOING'}
                </Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </GlassCard>

        {achievements && achievements.length > 0 && (
          <View>
            <Text variant="title" style={styles.sectionTitle}>Achievements</Text>
            {achievements.map(renderAchievement)}
          </View>
        )}

        <View style={styles.statsContainer}>
          <GlassCard style={styles.statCard}>
            <LinearGradient
              colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                Responses
              </Text>
              <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
                {responses ? responses.length : 0}
              </Text>
            </LinearGradient>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <LinearGradient
              colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                Completion
              </Text>
              <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
                {completed ? 'Yes' : 'No'}
              </Text>
            </LinearGradient>
          </GlassCard>

          <GlassCard style={styles.statCard}>
            <LinearGradient
              colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.sm }}>
                Time
              </Text>
              <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
                5:42
              </Text>
            </LinearGradient>
          </GlassCard>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('GameLibraryGridView')}
          >
            <LinearGradient
              colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text variant="header" style={{ color: theme.COLORS.background, textAlign: 'center' }}>
                Play Another Game
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => navigation.navigate('DashboardHome')}
          >
            <Text variant="header" style={{ color: theme.COLORS.textPrimary, textAlign: 'center' }}>
              Return to Dashboard
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  title: {
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.sm,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    color: theme.COLORS.textSecondary,
  },
  resultsCard: {
    marginBottom: theme.SPACING.lg,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: theme.SPACING.lg,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.SPACING.lg,
  },
  badgeContainer: {
    alignSelf: 'center',
    marginTop: theme.SPACING.md,
  },
  badgeGradient: {
    paddingHorizontal: theme.SPACING.lg,
    paddingVertical: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  sectionTitle: {
    color: theme.COLORS.textPrimary,
    marginBottom: theme.SPACING.md,
  },
  achievementCard: {
    marginBottom: theme.SPACING.md,
  },
  achievementGradient: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  achievementContent: {
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SPACING.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.SPACING.sm,
  },
  buttonContainer: {
    marginTop: theme.SPACING.lg,
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