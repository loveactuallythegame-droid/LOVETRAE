importReact, { useState, useEffect }from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, GlassCard } from '../components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme';
import { gamesApi } from '../lib/api';

export default functionMainGameLibrary({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await gamesApi.getCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories
        setCategories([
          {
            id: "emotional-connection",
            name: "Emotional Connection",
            description: "SEEN Method focused games",
icon: "heart",
            color: theme.COLORS.emotionalConnection,
            games: ["truth-or-trust", "gratitude-cloud", "eye-contact-challenge", "memory-lane-map", "vibe-check"]
          },
          {
            id: "conflict-resolution",
            name: "Conflict Resolution",
            description: "Gottman-inspired games",
            icon: "shield",
            color: theme.COLORS.conflictResolution,
            games: ["slap-of-truth", "apology-auction", "defensiveness-detox", "whos-right", "stress-test"]
          },
          {
            id: "creative-chaos",
            name: "Creative Chaos",
            description: "Playful, creative challenges",
            icon: "sparkles",
            color: theme.COLORS.creativeChaos,
            games: ["role-swap-roast", "draw-your-feelings", "gif-battle", "karaoke-confessional", "ransom-note"]
          },
          {
            id: "romance-hub",
            name: "Romance Hub",
            description: "Spicy & sweet connections",
            icon: "flame",
            color: theme.COLORS.romanceHub,
            games: ["date-night-roulette", "bedroom-bingo", "six-second-kiss", "foreplay-slider", "touch-map"]
          },
          {
            id: "healing-hospital",
            name: "Healing Hospital",
            description: "Deep repair & recovery",
            icon: "medkit",
            color: theme.COLORS.healingHospital,
            games: ["windows-and-walls", "trigger-triage", "trust-bank", "the-iceberg", "secrecy-audit"]
          },
          {
            id: "game-show",
            name: "Game Show",
            description: "Classic game show formats",
icon: "trophy",
            color: theme.COLORS.gameShow,
            games: ["couples-jeopardy", "relationship-millionaire", "family-feud-couples", "newlywed-sync", "wheel-of-intimacy"]
          },
          {
            id: "love-arcade",
name: "The Love Arcade",
            description: "Championship matches of honesty, wit, and emotional parkour",
            icon: "game-controller",
            color: theme.COLORS.loveArcade,
            games: ["truth-teller-tower", "echo-chamber-escape", "intimacy-feud", "relational-jeopardy", "family-forge", "harbor-storm"]
          }
        ]);
      }
    };

    fetchCategories();
  }, []);

  const renderCategory = ({ item }: { item: any }) => {
    const isFeatured = item.id === 'love-arcade';
return (
      <TouchableOpacity 
        style={[styles.categoryCard, isFeatured && styles.featuredCategory]} 
        onPress={() => navigation.navigate('CategorySelectionScreen', { categoryId: item.id, categoryName: item.name })}
      >
        <LinearGradient
          colors={[
            item.color,
            isFeatured ? theme.COLORS.primaryGradientEnd : item.color + '80',
            theme.COLORS.background
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <GlassCard style={styles.glassCardContent}>
            <View style={styles.categoryHeader}>
              <Text variant="title" style={[styles.categoryTitle, { color: theme.COLORS.textPrimary }]}>
                {item.name}
              </Text>
              {isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text variant="keyword" style={{ color: theme.COLORS.background, fontSize: 10 }}>FEATURED</Text>
                </View>
              )}
            </View>
            <Text variant="body" style={{ color: theme.COLORS.textSecondary, marginBottom: theme.SPACING.md }}>
              {item.description}
            </Text>
           <View style={styles.gameCountContainer}>
              <Text variant="small" style={{ color: theme.COLORS.accentTeal }}>
                {item.games.length} games
              </Text>
            </View>
          </GlassCard>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
<LinearGradient
      colors={[theme.COLORS.background, '#392830', theme.COLORS.background]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="header" style={styles.title}>The Love Arcade</Text>
        <Text variant="body" style={styles.subtitle}>Couples therapy disguised as a game</Text>
      </View>

      <ScrollView style={styles.content}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: theme.SPACING.lg,
    paddingTop: theme.SAFE_AREA.top + theme.SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.TYPOGRAPHY.header.fontSize,
    color: theme.COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: theme.SPACING.sm,
    textShadow: '0px 0px 10px rgba(219, 20, 124, 0.5)',
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.body.fontSize,
    color: theme.COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal:theme.SPACING.md,
  },
  listContent: {
    paddingBottom: theme.SPACING.xxl,
  },
  categoryCard: {
    marginBottom: theme.SPACING.lg,
    borderRadius: theme.SIZES.borderRadius * 1.5,
    overflow: 'hidden',
  },
  featuredCategory: {
   transform: [{ scale: 1.03 }],
    shadowColor: theme.COLORS.loveArcade,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
 categoryGradient: {
    borderRadius: theme.SIZES.borderRadius * 1.5,
  },
  glassCardContent: {
    padding: theme.SPACING.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.SPACING.md,
  },
  categoryTitle: {
    flex: 1,
    fontSize: theme.TYPOGRAPHY.title.fontSize,
    fontWeight: theme.TYPOGRAPHY.title.fontWeight,
  },
  featuredBadge: {
    backgroundColor: theme.COLORS.accentOrange,
    paddingHorizontal: theme.SPACING.sm,
    paddingVertical: theme.SPACING.xs,
    borderRadius: theme.SIZES.borderRadius,
    marginLeft: theme.SPACING.sm,
  },
  gameCountContainer: {
    alignSelf: 'flex-start',
    marginTop: theme.SPACING.md,
  },
});
