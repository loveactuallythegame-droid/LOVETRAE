import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Text, GlassCard } from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../../theme';
import { auth, db } from '../../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

export default function DashboardHome({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [coupleData, setCoupleData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          if (userSnap.data()?.couple_id) {
            const coupleRef = doc(db, 'couples', userSnap.data().couple_id);
            const coupleSnap = await getDoc(coupleRef);
            
            if (coupleSnap.exists()) {
              setCoupleData(coupleSnap.data());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metrics = [
    { name: 'Trust Meter', value: coupleData?.trust_meter || 0.5, color: theme.COLORS.success },
    { name: 'Vulnerability', value: coupleData?.vulnerability_meter || 0.4, color: theme.COLORS.accentViolet },
    { name: 'Romance', value: coupleData?.romance_meter || 0.6, color: theme.COLORS.romanceHub },
    { name: 'Connection', value: coupleData?.connection_meter || 0.55, color: theme.COLORS.emotionalConnection },
  ];

  const recentActivities = [
    { id: 1, game: 'Truth Teller Tower', date: 'Today', score: 85 },
    { id: 2, game: 'Gratitude Cloud', date: 'Yesterday', score: 72 },
    { id: 3, game: 'Apology Auction', date: '2 days ago', score: 90 },
  ];

  const renderMetricCard = (metric: any) => (
    <GlassCard key={metric.name} style={styles.metricCard}>
      <LinearGradient
        colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Text variant="title" style={{ color: metric.color, marginBottom: theme.SPACING.sm }}>
          {metric.name}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${metric.value * 100}%`, 
                  backgroundColor: metric.color 
                }
              ]} 
            />
          </View>
          <Text variant="small" style={{ color: theme.COLORS.textSecondary, marginTop: theme.SPACING.sm }}>
            {(metric.value * 100).toFixed(0)}%
          </Text>
        </View>
      </LinearGradient>
    </GlassCard>
  );

  const renderActivityItem = (activity: any) => (
    <TouchableOpacity 
      key={activity.id} 
      style={styles.activityItem}
      onPress={() => navigation.navigate('GamePlayScreen', { gameId: activity.game.toLowerCase().replace(/\s+/g, '-') })}
    >
      <LinearGradient
        colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityGradient}
      >
        <View style={styles.activityContent}>
          <Text variant="body" style={{ color: theme.COLORS.background }}>
            {activity.game}
          </Text>
          <Text variant="small" style={{ color: theme.COLORS.background }}>
            {activity.date}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text variant="header" style={{ color: theme.COLORS.background }}>
            {activity.score}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text variant="header" style={styles.title}>Welcome Back!</Text>
          <Text variant="body" style={styles.subtitle}>
            {userData?.display_name ? `Hi, ${userData.display_name}` : 'Ready to strengthen your bond?'}
          </Text>
        </View>

        <GlassCard style={styles.coupleCard}>
          <LinearGradient
            colors={['rgba(229, 20, 124, 0.2)', 'rgba(240, 93, 104, 0.2)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <Text variant="title" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.md }}>
              Your Connection
            </Text>
            
            <View style={styles.coupleInfo}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[theme.COLORS.profileRingStart, theme.COLORS.profileRingMid, theme.COLORS.profileRingEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarRing}
                >
                  <View style={styles.avatarPlaceholder}>
                    <Text variant="header" style={{ color: theme.COLORS.textPrimary }}>
                      {userData?.display_name?.charAt(0) || 'U'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
              
              <View style={styles.connectionInfo}>
                <Text variant="body" style={{ color: theme.COLORS.textPrimary, marginBottom: theme.SPACING.xs }}>
                  Together for {coupleData?.streak_days || 0} days
                </Text>
                <Text variant="small" style={{ color: theme.COLORS.textSecondary }}>
                  Total points: {coupleData?.total_points || 0}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        <Text variant="title" style={styles.sectionTitle}>Relationship Metrics</Text>
        <View style={styles.metricsGrid}>
          {metrics.map(renderMetricCard)}
        </View>

        <Text variant="title" style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activitiesContainer}>
          {recentActivities.map(renderActivityItem)}
        </View>

        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('MainGameLibrary')}
        >
          <LinearGradient
            colors={[theme.COLORS.primaryGradientStart, theme.COLORS.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Text variant="header" style={{ color: theme.COLORS.background }}>
              Play Again
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
  coupleCard: {
    marginBottom: theme.SPACING.lg,
  },
  gradientContainer: {
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  coupleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: theme.SPACING.md,
  },
  avatarRing: {
    borderRadius: theme.SIZES.largeAvatarSize / 2,
    padding: 3,
  },
  avatarPlaceholder: {
    width: theme.SIZES.largeAvatarSize - 6,
    height: theme.SIZES.largeAvatarSize - 6,
    borderRadius: (theme.SIZES.largeAvatarSize - 6) / 2,
    backgroundColor: theme.COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    color: theme.COLORS.textPrimary,
    marginVertical: theme.SPACING.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.SPACING.lg,
  },
  metricCard: {
    width: (width - theme.SPACING.lg * 3) / 2,
    marginBottom: theme.SPACING.md,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  activitiesContainer: {
    marginBottom: theme.SPACING.lg,
  },
  activityItem: {
    marginBottom: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
    overflow: 'hidden',
  },
  activityGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.SPACING.md,
    borderRadius: theme.SIZES.borderRadius,
  },
  activityContent: {
    flex: 1,
  },
  scoreContainer: {
    paddingHorizontal: theme.SPACING.md,
    paddingVertical: theme.SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.SIZES.borderRadius,
  },
  ctaButton: {
    borderRadius: theme.SIZES.buttonBorderRadius,
    overflow: 'hidden',
    marginTop: theme.SPACING.lg,
  },
  ctaGradient: {
    padding: theme.SPACING.lg,
    borderRadius: theme.SIZES.buttonBorderRadius,
    alignItems: 'center',
  },
});