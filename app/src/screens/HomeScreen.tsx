
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Backend API imports
import { userApi, coupleApi, gamesApi, User, Couple, GameCategory } from '../lib/api';
import { auth } from '../lib/firebaseClient';

// Component
const HomeScreen = () => {
  const navigation = useNavigation();
  
  // State for user and couple data from backend
  const [user, setUser] = useState<User | null>(null);
  const [couple, setCouple] = useState<Couple | null>(null);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current Firebase user and token
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const token = await currentUser.getIdToken();

        // ============================================
        // FETCH USER DATA FROM BACKEND
        // ============================================
        const userData = await userApi.get(currentUser.uid, token);
        setUser(userData);
        console.log('✅ User data fetched from backend:', userData.display_name);

        // ============================================
        // FETCH COUPLE DATA FROM BACKEND (if linked)
        // ============================================
        if (userData.couple_id) {
          try {
            const coupleData = await coupleApi.get(userData.couple_id, token);
            setCouple(coupleData);
            console.log('✅ Couple data fetched from backend');
          } catch (coupleErr) {
            console.error('Failed to fetch couple data:', coupleErr);
            // Don't fail entirely if couple data fails
          }
        }

        // ============================================
        // FETCH GAME CATEGORIES FROM BACKEND
        // ============================================
        const categoriesData = await gamesApi.getCategories();
        setCategories(categoriesData.categories);
        console.log(`✅ ${categoriesData.categories.length} game categories fetched from backend`);

      } catch (err: any) {
        console.error('❌ Error fetching data:', err);
        setError(err.message || 'Failed to load data');
        
        // Show alert for critical errors
        Alert.alert(
          'Connection Error',
          'Could not connect to the game server. Please try again.',
          [{ text: 'Retry', onPress: fetchData }, { text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigate to game category
  const handleCategoryPress = (category: GameCategory) => {
    navigation.navigate('GameLibrary', {
      categoryId: category.id,
      categoryName: category.name
    });
  };

  // Navigate to couple linking if not linked
  const handleLinkPartner = () => {
    navigation.navigate('CoupleLinking');
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#db147c" />
          <Text style={styles.loadingText}>Loading your love data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Unable to load data</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.retryButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
      
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user?.display_name || 'Player'}!</Text>
          
          {couple ? (
            <View style={styles.coupleInfo}>
              <Text style={styles.coupleText}>Connected with partner ❤️</Text>
              <Text style={styles.statsText}>
                Trust: {Math.round((couple.trust_meter || 0) * 100)}% |
                Romance: {Math.round((couple.romance_meter || 0) * 100)}%
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.linkButton} onPress={handleLinkPartner}>
              <Text style={styles.linkButtonText}>🔗 Link with Your Partner</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Game Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Choose Your Adventure</Text>
          
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { borderLeftColor: category.color }]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
                <Text style={styles.gameCount}>{category.games.length} games</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('SOS')}
          >
            <Text style={styles.actionButtonText}>🆘 SOS - Fight Resolution</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MarcieChat')}
          >
            <Text style={styles.actionButtonText}>💬 Chat with Dr. Marcie</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  coupleInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  coupleText: {
    fontSize: 16,
    color: '#FF69B4',
    fontWeight: '600',
  },
  statsText: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 5,
  },
  linkButton: {
    backgroundColor: '#db147c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#AAA',
    marginTop: 4,
  },
  gameCount: {
    fontSize: 12,
    color: '#db147c',
    marginTop: 4,
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFF',
    marginTop: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#db147c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
