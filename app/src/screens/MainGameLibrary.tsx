import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gamesApi, loveArcadeApi } from '../lib/api';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

// Game categories with all games mapped
const GAME_CATEGORIES = [
  {
    id: 'emotional-connection',
    name: 'Emotional Connection',
    description: 'SEEN Method focused games',
    icon: 'heart',
    color: '#FA1F63',
    games: [
      { id: 'truth-or-trust', name: 'Truth or Trust', screen: 'TruthOrTrust', time: 15, xp: 100 },
      { id: 'gratitude-cloud', name: 'Gratitude Cloud', screen: 'GratitudeCloud', time: 10, xp: 75 },
      { id: 'eye-contact', name: 'Eye Contact Challenge', screen: 'EyeContactChallenge', time: 5, xp: 50 },
      { id: 'memory-lane', name: 'Memory Lane Map', screen: 'MemoryLaneMap', time: 20, xp: 125 },
      { id: 'vibe-sync', name: 'Vibe Sync', screen: 'VibeSync', time: 8, xp: 60 },
    ],
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Gottman-inspired healing',
    icon: 'shield-checkmark',
    color: '#33DEA5',
    games: [
      { id: 'slap-of-truth', name: 'Slap of Truth', screen: 'SlapOfTruth', time: 12, xp: 100 },
      { id: 'apology-auction', name: 'Apology Auction', screen: 'ApologyAuction', time: 15, xp: 120 },
      { id: 'defensiveness-detox', name: 'Defensiveness Detox', screen: 'DefensivenessDetox', time: 18, xp: 150 },
      { id: 'whos-right', name: "Who's Right?", screen: 'WhosRight', time: 20, xp: 175 },
      { id: 'stress-test', name: 'Stress Test', screen: 'StressTest', time: 10, xp: 80 },
    ],
  },
  {
    id: 'creative-chaos',
    name: 'Creative Chaos',
    description: 'Playful creative challenges',
    icon: 'color-wand',
    color: '#E4E831',
    games: [
      { id: 'role-swap-roast', name: 'Role-Swap Roast', screen: 'RoleSwapRoast', time: 15, xp: 100 },
      { id: 'draw-feelings', name: 'Draw Your Feelings', screen: 'DrawYourFeelingsGame', time: 12, xp: 90 },
      { id: 'gif-battle', name: 'GIF Battle', screen: 'GifTheFeels', time: 8, xp: 60 },
      { id: 'karaoke', name: 'Karaoke Confessional', screen: 'KaraokeConfessional', time: 20, xp: 150 },
      { id: 'ransom-note', name: 'Ransom Note Romance', screen: 'RansomNoteRomance', time: 10, xp: 75 },
    ],
  },
  {
    id: 'romance-hub',
    name: 'Romance Hub',
    description: 'Spicy & sweet connections',
    icon: 'flame',
    color: '#BE1980',
    games: [
      { id: 'date-roulette', name: 'Date Night Roulette', screen: 'DateNightRoulette', time: 10, xp: 80 },
      { id: 'bedroom-bingo', name: 'Bedroom Bingo', screen: 'BedroomBingoGame1', time: 15, xp: 120 },
      { id: 'six-second-kiss', name: '6-Second Kiss', screen: 'SixSecondKiss', time: 3, xp: 50 },
      { id: 'foreplay-slider', name: 'Foreplay Forecast', screen: 'ForeplayForecast', time: 12, xp: 100 },
      { id: 'touch-map', name: 'Touch Map', screen: 'TouchMap', time: 15, xp: 125 },
    ],
  },
  {
    id: 'healing-hospital',
    name: 'Healing Hospital',
    description: 'Deep repair & recovery',
    icon: 'medical',
    color: '#5C1459',
    games: [
      { id: 'windows-walls', name: 'Windows & Walls', screen: 'WindowsAndWalls', time: 25, xp: 200 },
      { id: 'trigger-triage', name: 'Trigger Triage', screen: 'TriggerTriage', time: 20, xp: 175 },
      { id: 'trust-bank', name: 'Trust Bank', screen: 'TrustBank', time: 15, xp: 150 },
      { id: 'iceberg', name: 'The Iceberg', screen: 'TheIceberg', time: 18, xp: 160 },
      { id: 'secrecy-audit', name: 'Secrecy Audit', screen: 'SecrecyAudit', time: 12, xp: 100 },
    ],
  },
  {
    id: 'game-show',
    name: 'Game Show',
    description: 'Classic game show formats',
    icon: 'trophy',
    color: '#22d3ee',
    games: [
      { id: 'couples-jeopardy', name: "Couple's Jeopardy", screen: 'CouplesJeopardyGame', time: 25, xp: 200 },
      { id: 'millionaire', name: 'Relationship Millionaire', screen: 'RelationalJeopardy', time: 20, xp: 175 },
      { id: 'family-feud', name: 'Family Feud Couples', screen: 'CouplesFamilyFeudGame', time: 18, xp: 150 },
      { id: 'newlywed', name: 'Newlywed Sync', screen: 'NewlywedGame', time: 15, xp: 125 },
      { id: 'wheel-intimacy', name: 'Wheel of Intimacy', screen: 'IntimacyFeud', time: 12, xp: 100 },
    ],
  },
  {
    id: 'love-arcade',
    name: 'The Love Arcade',
    description: 'Championship matches of honesty & wit',
    icon: 'game-controller',
    color: '#FF6B6B',
    featured: true,
    games: [
      { id: 'truth-teller-tower', name: 'Truth Teller Tower', screen: 'TruthTellerTower', time: 30, xp: 300, phase: 'Foundation' },
      { id: 'echo-chamber', name: 'Echo Chamber Escape', screen: 'EscapeEchoChamber', time: 35, xp: 350, phase: 'Deconstruction' },
      { id: 'intimacy-feud', name: 'The Intimacy Feud', screen: 'IntimacyFeud', time: 25, xp: 250, phase: 'Shared Reality' },
      { id: 'relational-jeopardy', name: 'Relational Jeopardy!', screen: 'RelationalJeopardy', time: 40, xp: 400, phase: 'The Future' },
      { id: 'family-forge', name: 'Family Forge', screen: 'ChoppedFamily', time: 45, xp: 450, phase: 'Family Building' },
      { id: 'harbor-storm', name: 'Harbor & Storm', screen: 'HarborMasterChallenge', time: 40, xp: 400, phase: 'Emotional Regulation' },
    ],
  },
];

const CategoryCard = ({ category, onPress, isSelected }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.categoryCard,
      isSelected && { borderColor: category.color, borderWidth: 2 },
    ]}
    data-testid={`category-${category.id}`}
  >
    <LinearGradient
      colors={[`${category.color}20`, `${category.color}05`]}
      style={styles.categoryGradient}
    >
      <Ionicons name={category.icon as any} size={32} color={category.color} />
      <Text style={[styles.categoryName, { color: category.color }]}>{category.name}</Text>
      <Text style={styles.categoryDesc}>{category.description}</Text>
      {category.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>★ FEATURED</Text>
        </View>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const GameCard = ({ game, categoryColor, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.gameCard}
    data-testid={`game-${game.id}`}
  >
    <View style={[styles.gameIconBg, { backgroundColor: `${categoryColor}30` }]}>
      <Ionicons name="play-circle" size={24} color={categoryColor} />
    </View>
    <View style={styles.gameInfo}>
      <Text style={styles.gameName}>{game.name}</Text>
      <View style={styles.gameStats}>
        <Text style={styles.gameStat}>⏱️ {game.time}m</Text>
        <Text style={styles.gameStat}>✨ {game.xp} XP</Text>
        {game.phase && <Text style={[styles.gamePhase, { color: categoryColor }]}>{game.phase}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#666" />
  </TouchableOpacity>
);

export default function MainGameLibrary({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCat = useMemo(
    () => GAME_CATEGORIES.find((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  const filteredGames = useMemo(() => {
    if (!searchQuery) return selectedCat?.games || [];
    const query = searchQuery.toLowerCase();
    const allGames = selectedCat ? selectedCat.games : GAME_CATEGORIES.flatMap((c) => c.games);
    return allGames.filter((g) => g.name.toLowerCase().includes(query));
  }, [selectedCat, searchQuery]);

  const handleGamePress = (game: any) => {
    // Navigate to the game screen
    if (navigation && game.screen) {
      navigation.navigate(game.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.darkBg, '#1a0a20', COLORS.royalPurple]} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Love, Actually...</Text>
            <Text style={styles.tagline}>The Game</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => navigation?.navigate('DashboardHome')}
              style={styles.iconBtn}
              data-testid="home-btn"
            >
              <Ionicons name="home" size={24} color={COLORS.romancePink} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation?.navigate('ProfileScreen')}
              style={styles.iconBtn}
              data-testid="profile-btn"
            >
              <Ionicons name="person-circle" size={28} color={COLORS.romancePink} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            data-testid="search-input"
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories Grid */}
          <Text style={styles.sectionTitle}>Game Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[
                styles.categoryPill,
                !selectedCategory && { backgroundColor: COLORS.romancePink },
              ]}
            >
              <Text style={[styles.pillText, !selectedCategory && { color: '#fff' }]}>All Games</Text>
            </TouchableOpacity>
            {GAME_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  selectedCategory === cat.id && { backgroundColor: cat.color },
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={16}
                  color={selectedCategory === cat.id ? '#fff' : cat.color}
                />
                <Text
                  style={[
                    styles.pillText,
                    selectedCategory === cat.id && { color: '#fff' },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Category Cards */}
          {!selectedCategory && (
            <View style={styles.categoriesGrid}>
              {GAME_CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onPress={() => setSelectedCategory(cat.id)}
                  isSelected={selectedCategory === cat.id}
                />
              ))}
            </View>
          )}

          {/* Games List */}
          {(selectedCategory || searchQuery) && (
            <View style={styles.gamesList}>
              <Text style={styles.sectionTitle}>
                {selectedCat ? `${selectedCat.name} Games` : 'Search Results'}
                <Text style={styles.gameCount}> ({filteredGames.length})</Text>
              </Text>
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  categoryColor={selectedCat?.color || COLORS.romancePink}
                  onPress={() => handleGamePress(game)}
                />
              ))}
            </View>
          )}

          {/* Marcie Section */}
          <View style={styles.marcieSection}>
            <Image
              source={{ uri: '/marcieimages/marcieimage1.png' }}
              style={styles.marcieImage}
              resizeMode="contain"
            />
            <View style={styles.marcieBubble}>
              <Text style={styles.marcieQuote}>
                "Pick a game, any game. But remember—I see everything. And I judge accordingly."
              </Text>
              <Text style={styles.marcieSignature}>— Dr. Marcie Liss</Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          onPress={() => navigation?.navigate('SOSModal')}
          data-testid="sos-button"
        >
          <LinearGradient colors={['#ff4444', '#cc0000']} style={styles.sosGradient}>
            <Text style={styles.sosText}>SOS</Text>
            <Ionicons name="heart" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.darkBg },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.romancePink,
    fontFamily: 'barbie',
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textLight,
    opacity: 0.7,
  },
  headerIcons: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 8,
  },
  gameCount: { color: '#888', fontWeight: 'normal', fontSize: 14 },
  categoriesScroll: { marginBottom: 20 },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pillText: { color: '#aaa', fontWeight: '600' },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryGradient: {
    padding: 16,
    minHeight: 140,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 12,
    color: '#888',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  gamesList: { marginTop: 8 },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  gameIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: { flex: 1, marginLeft: 12 },
  gameName: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 4 },
  gameStats: { flexDirection: 'row', gap: 12 },
  gameStat: { fontSize: 12, color: '#888' },
  gamePhase: { fontSize: 12, fontWeight: '600' },
  marcieSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,31,99,0.1)',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(250,31,99,0.3)',
  },
  marcieImage: {
    width: 80,
    height: 120,
  },
  marcieBubble: {
    flex: 1,
    marginLeft: 12,
  },
  marcieQuote: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
  marcieSignature: {
    color: COLORS.romancePink,
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  sosButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  sosGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sosText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
