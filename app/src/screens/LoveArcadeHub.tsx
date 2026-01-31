import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const ARCADE_GAMES = [
  {
    id: 'truth-teller-tower',
    name: 'Truth Teller Tower',
    phase: 'Phase 1: Foundation',
    modules: 'Modules 1-3',
    format: 'Who Wants to Be a Millionaire meets Newlywed Game',
    description: "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain—if you're lucky.",
    icon: '🗼',
    color: '#FF6B6B',
    maxScore: 100,
    badges: ['📡 The Unfiltered Signal', '📻 Truth Adjacent', '⚡ Static & Hope', '🎭 The Scripted Smile'],
  },
  {
    id: 'echo-chamber-escape',
    name: 'Escape from the Echo Chamber',
    phase: 'Phase 2: Deconstruction',
    modules: 'Modules 4-6',
    format: 'Digital Escape Room',
    description: "Trapped in a hall of infinite mirrors, each reflecting a version of the 'love script.' Break the loop.",
    icon: '🪞',
    color: '#9B59B6',
    maxScore: 100,
    badges: ['💥 Echo Exorcist', '🔧 Mirror Breaker', '➖ Reverb Reducer', '🌀 Still Whispering'],
  },
  {
    id: 'intimacy-feud',
    name: 'The Intimacy Feud',
    phase: 'Phase 3: Shared Reality',
    modules: 'Modules 7-9',
    format: 'Family Feud Style',
    description: "Survey says... be boring. Be authentic. Face off against The Ghost of the Old Script.",
    icon: '👨‍👩‍👧‍👦',
    color: '#3498DB',
    maxScore: 250,
    badges: ['👑 Authenticity Overlord', '🗡️ Realness Raider', '🔍 Script Skeptic', '🎤 Still Auditioning'],
  },
  {
    id: 'relational-jeopardy',
    name: 'Relational Jeopardy!',
    phase: 'Phase 4: The Future',
    modules: 'Modules 10-12',
    format: 'Jeopardy Style',
    description: "Categories designed by couples who rebuilt. Win 'The Sovereign Pact' or face a strongly worded email.",
    icon: '❓',
    color: '#2ECC71',
    maxScore: 2000,
    badges: ['📜 Sovereign Pact', '⏳ Provisional Truce', '📄 Treaty in Draft', '💣 Ceasefire Pending'],
  },
  {
    id: 'family-forge',
    name: 'Family Forge Edition',
    phase: 'Special: Family Building',
    modules: 'For couples building families after betrayal',
    format: 'Mixed Game Shows',
    description: "Insert Coin. Hold Baby. Choose Each Other—Again. You looked at a newborn and said: 'We're building here.'",
    icon: '👶',
    color: '#E74C3C',
    maxScore: 1800,
    badges: ['🔥 Forge Masters', '⚓ Unshakable Co-Captains', '🧱 Brave Builders', '🛠️ Work-in-Progress'],
  },
  {
    id: 'harbor-storm',
    name: 'Harbor & Storm Edition',
    phase: 'Special: Emotional Regulation',
    modules: 'BPD/Emotional sensitivity focus',
    format: 'Cooperative Challenges',
    description: "Build a better boat—and learn to sail as a crew. One feels the storm. The other reads the barometer.",
    icon: '⛵',
    color: '#1ABC9C',
    maxScore: 1900,
    badges: ['🏰 Harbor Masters', '⛵ Resilient Co-Captains', '🧭 Skilled Navigators', '🌟 Brave Apprentices'],
  },
];

const ArcadeGameCard = ({ game, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.arcadeCard}
    data-testid={`arcade-game-${game.id}`}
  >
    <LinearGradient
      colors={[`${game.color}30`, `${game.color}10`, 'transparent']}
      style={styles.cardGradient}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.gameIcon}>{game.icon}</Text>
        <View style={styles.phaseTag}>
          <Text style={[styles.phaseText, { color: game.color }]}>{game.phase}</Text>
        </View>
      </View>
      
      <Text style={styles.gameName}>{game.name}</Text>
      <Text style={styles.gameFormat}>{game.format}</Text>
      <Text style={styles.gameDesc}>{game.description}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.scoreTag}>
          <Ionicons name="trophy" size={14} color="#FFD700" />
          <Text style={styles.scoreText}>Max: {game.maxScore} pts</Text>
        </View>
        <TouchableOpacity style={[styles.playBtn, { backgroundColor: game.color }]}>
          <Text style={styles.playText}>PLAY</Text>
          <Ionicons name="play" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function LoveArcadeHub({ navigation }: any) {
  const [totalScore, setTotalScore] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0a0012', '#1a0025', '#2a0035']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.arcadeTitle}>🎮 THE LOVE ARCADE 🎮</Text>
            <Text style={styles.arcadeSubtitle}>Insert Coin. Hold Hands. Prepare for Truth.</Text>
          </View>
        </View>

        {/* Dr. Marcie Intro */}
        <View style={styles.marcieIntro}>
          <Text style={styles.marcieQuote}>
            "Welcome to the Love Arcade, you glorious disaster couple. We don't do 'safe spaces.' We do safe SCORES."
          </Text>
          <Text style={styles.marcieSig}>— Dr. Marcie Liss, PhD in Calling It Like She Sees It</Text>
        </View>

        {/* Leaderboard Summary */}
        <View style={styles.leaderboard}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Total Arcade Score</Text>
            <Text style={styles.totalScore}>{totalScore}</Text>
            <Text style={styles.maxLabel}>/ 2450 max</Text>
          </View>
          <View style={styles.badgesBox}>
            <Text style={styles.badgesLabel}>Badges Earned</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>🏗️</Text>
              <Text style={styles.badge}>🪞</Text>
              <Text style={styles.badge}>🗡️</Text>
              <Text style={styles.badge}>🏰</Text>
            </View>
          </View>
        </View>

        {/* Games List */}
        <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Championship Games</Text>
          {ARCADE_GAMES.map((game) => (
            <ArcadeGameCard
              key={game.id}
              game={game}
              onPress={() => {
                // Navigate to specific game
                const screenMap: Record<string, string> = {
                  'truth-teller-tower': 'TruthTellerTower',
                  'echo-chamber-escape': 'EscapeEchoChamber',
                  'intimacy-feud': 'IntimacyFeud',
                  'relational-jeopardy': 'RelationalJeopardy',
                  'family-forge': 'ChoppedFamily',
                  'harbor-storm': 'HarborMasterChallenge',
                };
                navigation?.navigate(screenMap[game.id] || 'MainGameLibrary');
              }}
            />
          ))}

          {/* Final Ritual Teaser */}
          <View style={styles.finalRitual}>
            <Text style={styles.ritualIcon}>🔥</Text>
            <Text style={styles.ritualTitle}>THE DIGITAL BONFIRE</Text>
            <Text style={styles.ritualDesc}>
              Complete all 4 phases to unlock the Final Ritual. Burn the workbook. Rise from the ashes.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0012' },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: { marginRight: 16 },
  headerCenter: { flex: 1 },
  arcadeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
  },
  arcadeSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
  },
  marcieIntro: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  marcieQuote: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 22,
  },
  marcieSig: {
    color: '#FF6B6B',
    fontSize: 11,
    marginTop: 8,
  },
  leaderboard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreLabel: { color: '#888', fontSize: 11 },
  totalScore: { color: '#FFD700', fontSize: 32, fontWeight: 'bold' },
  maxLabel: { color: '#666', fontSize: 11 },
  badgesBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  badgesLabel: { color: '#888', fontSize: 11, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: { fontSize: 24 },
  gamesList: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  arcadeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  cardGradient: { padding: 20 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gameIcon: { fontSize: 40 },
  phaseTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  phaseText: { fontSize: 11, fontWeight: '600' },
  gameName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  gameFormat: { fontSize: 12, color: '#888', marginBottom: 8 },
  gameDesc: { fontSize: 14, color: '#aaa', lineHeight: 20, marginBottom: 16 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreText: { color: '#FFD700', fontSize: 13 },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  playText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  finalRitual: {
    backgroundColor: 'rgba(255,100,0,0.1)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,100,0,0.3)',
  },
  ritualIcon: { fontSize: 48, marginBottom: 12 },
  ritualTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF6400', marginBottom: 8 },
  ritualDesc: { fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 20 },
});
