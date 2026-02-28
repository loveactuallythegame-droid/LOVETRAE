import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ImageBackground, 
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, SIZES } from '../theme';
import { useGameStore } from '../lib/game-store';
import { gamesApi } from '../lib/api';

const { width: screenWidth } = Dimensions.get('window');

// Game data structure matching Design Bible specifications
interface Game {
  id: string;
  title: string;
  category: string;
  time: number;
  image: string;
  status?: 'New' | 'Completed' | 'InProgress';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  description?: string;
  isPremium?: boolean;
}

const GameCard = ({ item, onPress }: { item: Game; onPress: (game: Game) => void }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'New':
        return COLORS.brightYellow;
      case 'Completed':
        return COLORS.mintGreen;
      case 'InProgress':
        return COLORS.warmOrange;
      default:
        return 'transparent';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy':
        return COLORS.mintGreen;
      case 'Medium':
        return COLORS.warmOrange;
      case 'Hard':
        return COLORS.vibrantPink;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.8}
    >
      <ImageBackground 
        source={{ uri: item.image }} 
        style={styles.cardImage} 
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)']} 
          style={styles.imageOverlay}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0, y: 1 }}
        />
        
        {/* Status Badge */}
        {item.status && (
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        )}

        {/* Premium Badge */}
        {item.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ PREMIUM</Text>
          </View>
        )}
        
        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title.toUpperCase()}
          </Text>
          <Text style={styles.cardCategory} numberOfLines={1}>
            {item.category.toUpperCase()}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardTime}>⏱ {item.time} MIN</Text>
            {item.difficulty && (
              <Text style={[
                styles.cardDifficulty, 
                { color: getDifficultyColor(item.difficulty) }
              ]}>
                {item.difficulty.toUpperCase()}
              </Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const GameLibraryGridView = () => {
  const navigation = useNavigation();
  const { gamesProgress, userStats } = useGameStore();
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [games, setGames] = useState<Game[]>([]);

  // Game categories from Design Bible
  const categories = [
    'All',
    'Emotional Connection',
    'Conflict Resolution', 
    'Creative Chaos',
    'Romance Hub',
    'Healing Hospital',
    'Game Show',
    'Love Arcade'
  ];

  // Mock game data - in real app this would come from API
  const mockGames: Game[] = [
    {
      id: '1', 
      title: 'Soul Sync', 
      category: 'Emotional Connection', 
      time: 15, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWIpTHvb05jkwBvDxLVC32Q-AfzgqzPLS2wjwxJ86AJ-098JAoe8owi90_hmkH39qpdXIWYtYzLTE1_xaK5Wk_JVvrE37V-WggccbdwBL1jCMF5Hrq696sJ4XGKtdeR78O_HaSFX4T9sX8OuhSbEEpXvSWd7cVSqbcAqPaJ3tfloepDNAJ4rAeiJU7HOC4E8YLmMfhjZEbemNYE7Gqzs_7X2Wx3uv2WHUnX3pU8Xk9AEf4jqD4dG2ih0leRzHov1rMMlVCc-yVnC90',
      status: 'New',
      difficulty: 'Easy',
      description: 'Synchronize your emotional frequencies with your partner'
    },
    {
      id: '2', 
      title: 'Cosmic Connection', 
      category: 'Romance Hub', 
      time: 10, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpd_b1gTPxoDK-tDQKVifQtuIZUHspSoyckTrGw0RUG_v3gQbjhzNITRKH0l68PB3g8quKu2utRM0EJF4J2X2tf_K5dtBM82ys7A184UURoytubqr_hfS6p3xj0bzXIxNmTkPVejJ7WbKtWh8Z-9-RoRkg-eVXBNfqNDGHDajGW9DrFK9ymv_sh_oTVFJfKHT2ks6O1tovbM-u3nThk6RDyvSUcxyjbwbcdwih49-u-iu7Cn5npuVrQhFmPv8i999yCQ9cuo8ed3a4',
      status: 'Completed',
      difficulty: 'Medium',
      description: 'Deepen your intimate connection through guided exploration'
    },
    {
      id: '3', 
      title: 'Deep Dive', 
      category: 'Creative Chaos', 
      time: 25, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3z8bew-VvClVTDBL3ISYmzaMwyf3Jwz2C7y2NkUUSGwgiVasaryfFh_JEmaUnhgps9YLlnj5H7v8gkF5-8upWQc35K8Y2rTjmUrLnKeLuMb6-tLiqzNFt8-U4IdsQE6BmgwRxIr800buTe5lKww89pzYytj1bRKVUtPYqpgtvfEyq0yiGeA0vfFbc0k-Vzy24u2zbuTiNbjdqZnB4Uj345_gH02v2TZlpYMwoD5GKQ7iMJe6PL0obBLTv3VS2dJyc0-IVx35bIDXZ',
      difficulty: 'Hard',
      isPremium: true,
      description: 'Explore the depths of your relationship through creative expression'
    },
    {
      id: '4', 
      title: 'Stellar Stories', 
      category: 'Game Show', 
      time: 12, 
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8m89dc6KszMvEOMF1EFGuxixzOdDNR4H7zm8ubHNVJevIAogZVKznhmPI7hUClZcsK8tlnBO9M5Uxen8aEiAFMvnO2A0Lou9zh5Oqsu1cTH6ksfXkUPAqYg4bJG5xpMMlb11VbdftmQvTAQ8j9gcBV1M5BTIjlowycWgcKfu5UmQIVAUU-en8d-GWWPPJk6gaePXkmKN-XmxreaGVWe6aj3XQDb5L-xkzDYSUUFLm7lvYDs2Lz4PvjoBuJrpAZap6zSV1eSMtv1wR',
      status: 'New',
      difficulty: 'Easy',
      description: 'Share your love story in a fun, interactive game show format'
    },
  ];

  // Filter games based on active tab and search query
  const filteredGames = useMemo(() => {
    let filtered = games;
    
    if (activeTab !== 'All') {
      filtered = filtered.filter(game => game.category === activeTab);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [games, activeTab, searchQuery]);

  // Load games from API
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      // In real app, this would call gamesApi.getGames()
      // For now, use mock data with slight delay to simulate API call
      setTimeout(() => {
        setGames(mockGames);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load games:', error);
      setIsLoading(false);
      // Fallback to mock data
      setGames(mockGames);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadGames();
    setIsRefreshing(false);
  };

  const handleGamePress = (game: Game) => {
    navigation.navigate('GamePlayScreen', { 
      gameId: game.id,
      gameTitle: game.title,
      gameCategory: game.category
    });
  };

  const renderTab = (tabName: string) => (
    <TouchableOpacity
      key={tabName}
      style={[
        styles.tab, 
        activeTab === tabName && styles.activeTab
      ]}
      onPress={() => setActiveTab(tabName)}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[
        styles.tabText, 
        activeTab === tabName && styles.activeTabText
      ]}>
        {tabName.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No Games Found</Text>
      <Text style={styles.emptyStateText}>
        Try adjusting your search or browse a different category
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <LinearGradient
          colors={[COLORS.deepCosmicPurple, COLORS.richPlum]}
          style={styles.backgroundGradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primaryGradientStart} />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[COLORS.deepCosmicPurple, COLORS.richPlum]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with Search */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Game Library</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="FIND A MINI-GAME..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {categories.map(renderTab)}
        </ScrollView>

        {/* Games Grid */}
        <FlatList
          data={filteredGames}
          renderItem={({ item }) => (
            <GameCard item={item} onPress={handleGamePress} />
          )}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={[
            styles.grid,
            filteredGames.length === 0 && styles.emptyGrid
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primaryGradientStart]}
              tintColor={COLORS.primaryGradientStart}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundGradient: {
    flex: 1,
  },
  
  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    ...TYPOGRAPHY.body,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.borderRadius * 2,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    minHeight: 56, // Accessibility requirement
  },
  
  // Tabs
  tabsContainer: {
    maxHeight: 60,
  },
  tabsContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SIZES.borderRadius,
    minHeight: 44, // Accessibility requirement
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.textPrimary,
  },
  
  // Games Grid
  grid: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  emptyGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  
  // Game Card
  card: {
    flex: 1,
    margin: SPACING.sm,
    borderRadius: SIZES.borderRadius * 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    height: 180,
    justifyContent: 'flex-end',
  },
  cardImageStyle: {
    borderRadius: SIZES.borderRadius * 2,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: SIZES.borderRadius * 2,
  },
  cardContent: {
    padding: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardCategory: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
  },
  cardDifficulty: {
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  
  // Status Badge
  statusBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusText: {
    ...TYPOGRAPHY.small,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Premium Badge
  premiumBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.accentYellow,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  premiumText: {
    ...TYPOGRAPHY.small,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default GameLibraryGridView;
