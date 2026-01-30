
import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, UIManager, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Section = ({ id, title, children }) => (
    <View style={styles.sectionContainer} nativeID={id}>
        <View style={styles.sectionHeader}>
            <View style={styles.sectionDot} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.sectionContent}>
            {children}
        </View>
    </View>
);

const InfoCard = ({ title, text }) => (
    <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>{title}</Text>
        <Text style={styles.infoCardText}>{text}</Text>
    </View>
);

const PrivacyPolicyScreen = () => {
    const scrollViewRef = useRef<ScrollView>(null);
    const sectionYPositions = useRef({ intro: 0, collection: 0, usage: 0, sharing: 0, security: 0, rights: 0 });

    const handleNavPress = (sectionId) => {
        const y = sectionYPositions.current[sectionId];
        scrollViewRef.current?.scrollTo({ y, animated: true });
    };

    const onSectionLayout = (event, sectionId) => {
        sectionYPositions.current[sectionId] = event.nativeEvent.layout.y;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#230f19', '#191022']} style={styles.background} />
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>Privacy Policy</Text>
                    <Text style={styles.sidebarVersion}>Version 2.0 â¢ Oct 2023</Text>
                    <View style={styles.navContainer}>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('intro')}>
                            <MaterialIcons name="info" size={20} color="#fff" /><Text style={styles.navText}>Introduction</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('collection')}>
                            <MaterialIcons name="storage" size={20} color="#fff" /><Text style={styles.navText}>Data Collection</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('usage')}>
                            <MaterialIcons name="insights" size={20} color="#fff" /><Text style={styles.navText}>Data Usage</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('sharing')}>
                            <MaterialIcons name="share" size={20} color="#fff" /><Text style={styles.navText}>Sharing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('security')}>
                            <MaterialIcons name="shield" size={20} color="#fff" /><Text style={styles.navText}>Security</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navItem} onPress={() => handleNavPress('rights')}>
                            <MaterialIcons name="person" size={20} color="#fff" /><Text style={styles.navText}>Your Rights</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView ref={scrollViewRef} style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <Text style={styles.mainTitle}>Privacy Policy</Text>
                    <Text style={styles.mainSubtitle}>Your intimacy and data security are our cosmic priority.</Text>

                    <View onLayout={(e) => onSectionLayout(e, 'intro')}>
                      <Section title="1. Introduction">
                          <Text style={styles.paragraph}>Welcome to Love Actually... The Game. We are committed to protecting your privacy and providing a safe and secure environment for your therapeutic journey. This Privacy Policy explains how we collect, use, and safeguard the information you provide.</Text>
                      </Section>
                    </View>

                    <View onLayout={(e) => onSectionLayout(e, 'collection')}>
                      <Section title="2. Data Collection">
                          <Text style={styles.paragraph}>We collect information to provide a personalized experience:</Text>
                          <Text style={styles.listItem}>â¢ Account Information: Names, emails, credentials.</Text>
                          <Text style={styles.listItem}>â¢ Game Progress: Choices, answers, module completion.</Text>
                           <Text style={styles.listItem}>â¢ Device Metadata: For optimization and crash reporting.</Text>
                      </Section>
                    </View>
                    
                    <View onLayout={(e) => onSectionLayout(e, 'usage')}>
                      <Section title="3. Data Usage">
                          <Text style={styles.paragraph}>Your data is the map to your relationship's galaxy. We use it for:</Text>
                          <View style={styles.cardGrid}>
                              <InfoCard title="Personalization" text="Tailoring prompts based on your relationship history." />
                              <InfoCard title="Progress Tracking" text="Visualizing your growth as a couple." />
                              <InfoCard title="App Optimization" text="Improving game performance and squashing bugs." />
                              <InfoCard title="Legal Compliance" text="Meeting international data protection standards." />
                          </View>
                      </Section>
                    </View>

                    <View onLayout={(e) => onSectionLayout(e, 'sharing')}>
                      <Section title="4. Sharing & Disclosure">
                          <Text style={styles.paragraph}>We never sell your private therapy data. Disclosure only occurs with your consent, with trusted service providers, or if required by law.</Text>
                      </Section>
                    </View>
                    
                    <View onLayout={(e) => onSectionLayout(e, 'security')}>
                        <Section title="5. Security">
                            <Text style={styles.paragraph}>We use AES-256 bit encryption to ensure your data is secure. Our servers are in Tier-4 data centers with 24/7 monitoring.</Text>
                        </Section>
                    </View>
                    
                     <View onLayout={(e) => onSectionLayout(e, 'rights')}>
                        <Section title="6. Your Rights">
                            <Text style={styles.paragraph}>You have full control over your digital footprint, including the right to access, correct, or delete your data.</Text>
                        </Section>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#230f19' },
    background: { ...StyleSheet.absoluteFillObject },
    container: { flex: 1, flexDirection: 'row', padding: 16 },
    sidebar: { width: 240, backgroundColor: 'rgba(25, 16, 34, 0.8)', borderRadius: 16, padding: 16 },
    sidebarTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    sidebarVersion: { color: '#ab9db9', fontSize: 12, marginBottom: 24 },
    navContainer: { flex: 1 },
    navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, marginBottom: 8 },
    navText: { color: '#fff', marginLeft: 12, fontWeight: '500' },
    contentContainer: { flex: 1, marginLeft: 16 },
    mainTitle: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginBottom: 8 },
    mainSubtitle: { color: '#ab9db9', fontSize: 16, marginBottom: 32 },
    sectionContainer: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff4dcc', marginRight: 12 },
    sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
    sectionContent: { marginLeft: 20 },
    paragraph: { color: '#ab9db9', fontSize: 14, lineHeight: 22, marginBottom: 12 },
    listItem: { color: '#ab9db9', fontSize: 14, lineHeight: 22, marginLeft: 8 },
    cardGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
    infoCard: { width: '50%', padding: 4 },
    infoCardInner: { backgroundColor: '#251b2e', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    infoCardTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 4 },
    infoCardText: { color: '#ab9db9', fontSize: 12 },
});

export default PrivacyPolicyScreen;
