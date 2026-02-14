import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, TYPOGRAPHY, SPACING, SIZES } from '../theme';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon: string;
  color: string;
  category: string;
}

interface FaqCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const FaqItemComponent = ({ 
  item, 
  isOpen, 
  onToggle 
}: { 
  item: FaqItem; 
  isOpen: boolean; 
  onToggle: () => void; 
}) => {
  return (
    <View style={styles.faqItemContainer}>
      <TouchableOpacity 
        onPress={onToggle} 
        style={styles.faqQuestionRow}
        activeOpacity={0.8}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.faqIconContainer}>
          <Text style={[styles.faqIcon, { color: item.color }]}>{item.icon}</Text>
        </View>
        <Text style={styles.faqQuestion} numberOfLines={2}>
          {item.question}
        </Text>
        <Text style={[
          styles.faqToggle,
          isOpen && styles.faqToggleOpen
        ]}>
          {isOpen ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

const HelpAndFaqScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // FAQ categories from Design Bible
  const categories: FaqCategory[] = [
    { id: 'all', name: 'All', icon: '🌟', color: COLORS.accentViolet },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀', color: COLORS.accentTeal },
    { id: 'account', name: 'Account', icon: '👤', color: COLORS.accentPink },
    { id: 'games', name: 'Games', icon: '🎮', color: COLORS.accentOrange },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧', color: COLORS.accentYellow },
    { id: 'billing', name: 'Billing', icon: '💳', color: COLORS.accentRose },
  ];

  // FAQ data matching Design Bible specifications
  const faqData: FaqItem[] = [
    {
      id: '1',
      question: 'HOW TO LINK YOUR PARTNER?',
      answer: 'Linking your partner is easy! Go to Settings > Profile > Link Partner. You will receive a unique cosmic code to share with your partner. Once they enter this code, you\'ll be connected and can start playing together. Make sure both of you have verified email addresses for the connection to work properly.',
      icon: '🔗',
      color: COLORS.accentPink,
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'WHAT IS SOS MODE?',
      answer: 'SOS Mode is a specialized de-escalation tool designed for high-tension moments. It offers structured communication prompts, breathing exercises, and guided conflict resolution. Access it anytime by tapping the SOS button on your home screen. The mode provides private booths for each partner to express feelings safely before coming together for resolution.',
      icon: '🆘',
      color: COLORS.accentYellow,
      category: 'games'
    },
    {
      id: '3',
      question: 'WHY AREN\'T OUR DAILY QUESTS SYNCING?',
      answer: 'Ensure both users are on the latest app version and connected to a stable network. If the issue persists, try restarting the app and checking your partner connection status. Sometimes logging out and back in can resolve sync issues. Make sure both partners have completed the onboarding process.',
      icon: '🔄',
      color: COLORS.accentTeal,
      category: 'troubleshooting'
    },
    {
      id: '4',
      question: 'HOW DOES THE TRUST THERMOMETER WORK?',
      answer: 'The Trust Thermometer measures your relationship health based on game completion, communication quality, and consistency. It updates in real-time as you play games and interact with your partner. Higher trust levels unlock premium content and special achievements. The thermometer is influenced by both individual and collaborative activities.',
      icon: '🌡️',
      color: COLORS.innerLineStart,
      category: 'games'
    },
    {
      id: '5',
      question: 'CAN I CHANGE MY DR. MARCIE PERSONALITY LEVEL?',
      answer: 'Yes! Go to Settings > Dr. Marcie Personality to adjust her sarcasm and directness levels. You can choose from 4 levels: Tough Love Rookie, Reality Check Specialist, Radical Truth Wizard, or The Glamour Oracle. Your choice affects her dialogue style and the intensity of her feedback throughout the app.',
      icon: '👩‍⚕️',
      color: COLORS.accentRose,
      category: 'account'
    },
    {
      id: '6',
      question: 'WHAT HAPPENS TO MY DATA IF I DELETE MY ACCOUNT?',
      answer: 'When you delete your account, all personal data, game progress, and partner connections are permanently removed within 30 days. You can request a data export before deletion. Some anonymized usage data may be retained for analytics purposes. Your partner will be notified of the account deletion.',
      icon: '🗑️',
      color: COLORS.accentOrange,
      category: 'account'
    },
    {
      id: '7',
      question: 'HOW DO I UPGRADE TO PREMIUM?',
      answer: 'Tap the crown icon in the top right corner of your home screen, or go to Settings > Subscription. Premium unlocks all games, removes ads, provides advanced analytics, and includes priority support. You can choose monthly or annual billing, with a 7-day free trial for new users.',
      icon: '👑',
      color: COLORS.accentYellow,
      category: 'billing'
    },
    {
      id: '8',
      question: 'WHY CAN\'T I ACCESS CERTAIN GAMES?',
      answer: 'Some games are premium-only and require a subscription. Others may be locked until you reach certain trust levels or complete prerequisite games. Check the game requirements by tapping on the locked game card. Your current trust level and subscription status determine available content.',
      icon: '🔒',
      color: COLORS.accentViolet,
      category: 'games'
    }
  ];

  // Filter FAQ items based on search and category
  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (faqId: string) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  const handleContactSupport = () => {
    const supportEmail = 'support@lovetrae.com';
    const subject = 'LoveTrae Support Request';
    const body = 'Please describe your issue or question:\n\n';
    
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then(supported => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Contact Support',
          `Please email us at ${supportEmail}`,
          [{ text: 'OK' }]
        );
      }
    });
  };

  const handleChatPress = () => {
    // In a real app, this would open a chat interface
    Alert.alert(
      'Live Chat',
      'Live chat support is coming soon! For now, please email us.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={[COLORS.background, COLORS.surface]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>HELP & FAQ</Text>
            <Text style={styles.subtitle}>
              Find answers in the stars. Our cosmic support guide is here to help.
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="SEARCH FOR ANSWERS..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.name && styles.activeCategoryButton
                ]}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.categoryIcon,
                  { color: category.color }
                ]}>
                  {category.icon}
                </Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.name && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* FAQ Items */}
          <View style={styles.faqsContainer}>
            {filteredFaqs.map(faq => (
              <FaqItemComponent
                key={faq.id}
                item={faq}
                isOpen={openFaqId === faq.id}
                onToggle={() => handleFaqToggle(faq.id)}
              />
            ))}
          </View>

          {/* Contact Support Section */}
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>STILL ORBITING THE ANSWER?</Text>
            <Text style={styles.contactSubtitle}>
              Our support team is active 24/7.
            </Text>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.primaryGradientStart, COLORS.primaryGradientEnd]}
                style={styles.contactButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.contactButtonText}>EMAIL SUPPORT</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Floating Chat Button */}
        <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChatPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.accentViolet, COLORS.accentRose]}
            style={styles.chatButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.chatButtonText}>💬</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  scrollContainer: {
    paddingBottom: SPACING.xxl,
  },
  
  // Header
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.header,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center',
    lineHeight: 22,
  },
  
  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.textPrimary,
    height: 56, // Accessibility requirement
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  // Category Filter
  categoryContainer: {
    maxHeight: 80,
    marginBottom: SPACING.lg,
  },
  categoryContent: {
    paddingHorizontal: SPACING.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: SIZES.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 44, // Accessibility requirement
  },
  activeCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: COLORS.primaryGradientStart,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  
  // FAQ Items
  faqsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  faqItemContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    minHeight: 60, // Accessibility requirement
  },
  faqIconContainer: {
    marginRight: SPACING.sm,
  },
  faqIcon: {
    fontSize: 20,
  },
  faqQuestion: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  faqToggle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontSize: 16,
    marginLeft: SPACING.sm,
  },
  faqToggleOpen: {
    color: COLORS.primaryGradientStart,
  },
  faqAnswerContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    paddingTop: 0,
  },
  faqAnswer: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  
  // Contact Section
  contactSection: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.borderRadius * 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  contactTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  contactSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  contactButton: {
    borderRadius: SIZES.borderRadius * 2,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primaryGradientStart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  contactButtonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // Accessibility requirement
  },
  contactButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // Floating Chat Button
  chatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  chatButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 24,
  },
});

export default HelpAndFaqScreen;
