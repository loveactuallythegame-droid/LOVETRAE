import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ResultsScreenProps {
  scores: {
    player1: number;
    player2: number;
  };
  marcieCommentary: string;
  onContinue: () => void;
  duration: number;
  achievements?: string[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  scores,
  marcieCommentary,
  onContinue,
  duration,
  achievements = [],
}) => {
  const winner = scores.player1 > scores.player2 ? 'player1' : 
                scores.player2 > scores.player1 ? 'player2' : 'tie';
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContinue();
  };

  const getWinnerMessage = () => {
    if (winner === 'tie') {
      return "It's a Perfect Tie!";
    }
    return winner === 'player1' ? 'Player One Wins!' : 'Player Two Wins!';
  };

  const getWinnerColor = () => {
    if (winner === 'tie') return '#FFD700';
    return winner === 'player1' ? '#ef1b6e' : '#9056ef';
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#1a0033', '#330066', '#4d0099']} 
        style={styles.background} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Winner Announcement */}
        <View style={styles.winnerContainer}>
          <Text style={[styles.winnerText, { color: getWinnerColor() }]}>
            {getWinnerMessage()}
          </Text>
          
          <View style={styles.scoresContainer}>
            <View style={[styles.scoreCard, winner === 'player1' && styles.winnerCard]}>
              <Text style={styles.scoreLabel}>Player 1</Text>
              <Text style={styles.scoreValue}>{scores.player1}</Text>
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            <View style={[styles.scoreCard, winner === 'player2' && styles.winnerCard]}>
              <Text style={styles.scoreLabel}>Player 2</Text>
              <Text style={styles.scoreValue}>{scores.player2}</Text>
            </View>
          </View>
        </View>

        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color="#ef1b6e" />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatTime(duration)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={24} color="#FFD700" />
            <Text style={styles.statLabel}>Total Points</Text>
            <Text style={styles.statValue}>{scores.player1 + scores.player2}</Text>
          </View>
        </View>

        {/* Marcie's Commentary */}
        <View style={styles.commentaryContainer}>
          <View style={styles.marcieHeader}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#ef1b6e" />
            <Text style={styles.marcieTitle}>Dr. Marcie Says</Text>
          </View>
          <Text style={styles.commentaryText}>{marcieCommentary}</Text>
        </View>

        {/* Achievements */}
        {achievements.length > 0 && (
          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Achievements Unlocked</Text>
            {achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <LinearGradient
            colors={['#ef1b6e', '#9056ef']}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.continueIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0033',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  winnerText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  scoresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    minWidth: 100,
  },
  winnerCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  scoreLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  vsContainer: {
    marginHorizontal: 20,
  },
  vsText: {
    color: '#ef1b6e',
    fontSize: 18,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentaryContainer: {
    backgroundColor: 'rgba(239, 27, 110, 0.1)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 27, 110, 0.3)',
    marginBottom: 24,
  },
  marcieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  marcieTitle: {
    color: '#ef1b6e',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  commentaryText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  achievementsContainer: {
    marginBottom: 32,
  },
  achievementsTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  achievementText: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  continueButton: {
    marginTop: 8,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  continueIcon: {
    marginLeft: 4,
  },
});

export default ResultsScreen;