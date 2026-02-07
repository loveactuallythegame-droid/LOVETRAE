
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ARCADE_GAMES = [
  {
    id: 'truth-teller-tower',
    name: 'TRUTH TELLER TOWER',
    phase: 'PHASE 1: FOUNDATION',
    format: 'Who Wants to Be a Millionaire meets Newlywed Game',
    description: "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain—if you're lucky.",
    icon: '🗼',
    color: '#FF4081',
    maxScore: 100,
  },
  {
    id: 'echo-chamber-escape',
    name: 'ESCAPE FROM THE ECHO CHAMBER',
    phase: 'PHASE 2: DECONSTRUCTION',
    format: 'Digital Escape Room',
    description: "Trapped in a hall of infinite mirrors, each reflecting a version of the 'love script.' Break the loop.",
    icon: '🪞',
    color: '#E040FB',
    maxScore: 100,
  },
  {
    id: 'intimacy-feud',
    name: 'THE INTIMACY FEUD',
    phase: 'PHASE 3: SHARED REALITY',
    format: 'Family Feud Style',
    description: "Survey says... be boring. Be authentic. Face off against The Ghost of the Old Script.",
    icon: '👨‍👩‍👧‍👦',
    color: '#00FFFF',
    maxScore: 250,
  },
];

const ArcadeGameCard = ({ game, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.arcadeCard}
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
          <Text>🏆</Text>
          <Text style={styles.scoreText}>MAX: {game.maxScore} PTS</Text>
        </View>
        <TouchableOpacity style={[styles.playBtn, { backgroundColor: game.color }]}>
          <Text style={styles.playText}>PLAY</Text>
          <Text>▶️</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function LoveArcadeHub({ navigation }: any) {
  const [totalScore, setTotalScore] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <Text style={{fontSize: 24}}>⬅️</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.arcadeTitle}>🎮 THE LOVE ARCADE 🎮</Text>
            <Text style={styles.arcadeSubtitle}>INSERT COIN. HOLD HANDS. PREPARE FOR TRUTH.</Text>
          </View>
        </View>

        {/* Dr. Marcie Intro */}
        <View style={styles.marcieIntro}>
          <Text style={styles.marcieQuote}>
            "Welcome to the Love Arcade, you glorious disaster couple. We don't do 'safe spaces.' We do safe SCORES."
          </Text>
          <Text style={styles.marcieSig}>— DR. MARCIE LISS, PHD IN CALLING IT LIKE SHE SEES IT</Text>
        </View>

        {/* Leaderboard Summary */}
        <View style={styles.leaderboard}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>TOTAL ARCADE SCORE</Text>
            <Text style={styles.totalScore}>{totalScore}</Text>
            <Text style={styles.maxLabel}>/ 2450 MAX</Text>
          </View>
          <View style={styles.badgesBox}>
            <Text style={styles.badgesLabel}>BADGES EARNED</Text>
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
          <Text style={styles.sectionTitle}>CHAMPIONSHIP GAMES</Text>
          {ARCADE_GAMES.map((game) => (
            <ArcadeGameCard
              key={game.id}
              game={game}
              onPress={() => {
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
  container: { flex: 1, backgroundColor: '#2A002A' },
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
    color: '#FF4081',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  arcadeSubtitle: {
    fontSize: 12,
    color: '#D1C4E9',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  marcieIntro: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#FF4081',
  },
  marcieQuote: {
    color: '#fff',
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 22,
  },
  marcieSig: {
    color: '#FF4081',
    fontSize: 11,
    marginTop: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  leaderboard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  scoreLabel: { color: '#D1C4E9', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  totalScore: { color: '#FFD700', fontSize: 32, fontWeight: 'bold' },
  maxLabel: { color: '#D1C4E9', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  badgesBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.5)',
  },
  badgesLabel: { color: '#D1C4E9', fontSize: 11, marginBottom: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  badgeRow: { flexDirection: 'row', gap: 8 },
  badge: { fontSize: 24 },
  gamesList: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  arcadeCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.5)',
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
  phaseText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' },
  gameName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4, textTransform: 'uppercase' },
  gameFormat: { fontSize: 12, color: '#D1C4E9', marginBottom: 8 },
  gameDesc: { fontSize: 14, color: '#D1C4E9', lineHeight: 20, marginBottom: 16 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreText: { color: '#FFD700', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  playText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  finalRitual: {
    backgroundColor: 'rgba(255,100,0,0.2)',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,100,0,0.5)',
  },
  ritualIcon: { fontSize: 48, marginBottom: 12 },
  ritualTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF6400', marginBottom: 8, textTransform: 'uppercase' },
  ritualDesc: { fontSize: 13, color: '#D1C4E9', textAlign: 'center', lineHeight: 20 },
});
