
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const categoriesData = [
  {
    id: "emotional-connection",
    name: "EMOTIONAL CONNECTION",
    description: "SEEN Method focused games",
    icon: "❤️",
    color: "#FF4081",
    games: ["truth-or-trust", "gratitude-cloud", "eye-contact-challenge", "memory-lane-map", "vibe-check"]
  },
  {
    id: "love-arcade",
    name: "THE LOVE ARCADE",
    description: "Championship matches of honesty, wit, and emotional parkour",
    icon: "🎮",
    color: "#FFD700",
    games: ["truth-teller-tower", "echo-chamber-escape", "intimacy-feud", "relational-jeopardy", "family-forge", "harbor-storm"]
  }
];

export default function MainGameLibrary({ navigation }: any) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setCategories(categoriesData);
  }, []);

  const renderCategory = ({ item }: { item: any }) => {
    const isFeatured = item.id === 'love-arcade';
    return (
      <TouchableOpacity 
        style={[styles.categoryCard, isFeatured && styles.featuredCategory]} 
        onPress={() => navigation.navigate('CategorySelectionScreen', { categoryId: item.id, categoryName: item.name })}
      >
        <LinearGradient
          colors={[`${item.color}30`, `${item.color}10`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryGradient}
        >
          <View style={styles.glassCardContent}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>
                {item.icon} {item.name}
              </Text>
              {isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>FEATURED</Text>
                </View>
              )}
            </View>
            <Text style={styles.categoryDescription}>
              {item.description}
            </Text>
            <View style={styles.gameCountContainer}>
              <Text style={styles.gameCountText}>
                {item.games.length} GAMES
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>THE LOVE ARCADE</Text>
        <Text style={styles.subtitle}>COUPLES THERAPY DISGUISED AS A GAME</Text>
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
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: '#FF4081',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#D1C4E9',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.5)',
  },
  featuredCategory: {
    transform: [{ scale: 1.03 }],
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  categoryGradient: {
    borderRadius: 20,
  },
  glassCardContent: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  featuredBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  featuredBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categoryDescription: {
    color: '#D1C4E9',
    marginBottom: 8,
  },
  gameCountContainer: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  gameCountText: {
    color: '#00FFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
