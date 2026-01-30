
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const FaqItem = ({ question, answer, icon, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <View style={styles.faqItemContainer}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.faqQuestionRow}>
                 <Text style={{color, marginRight: 8, fontSize: 20}}>/* Icon */</Text>
                <Text style={styles.faqQuestion}>{question}</Text>
                {/* Arrow Icon */}
            </TouchableOpacity>
            {isOpen && <Text style={styles.faqAnswer}>{answer}</Text>}
        </View>
    );
};

const HelpAndFaqScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#102222', '#0d1a1a']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Help & FAQ</Text>
                <Text style={styles.subtitle}>Find answers in the stars. Our cosmic support guide is here to help.</Text>

                <View style={styles.searchBar}>
                    {/* Search Icon */}
                    <TextInput 
                        placeholder="Search for answers..."
                        placeholderTextColor="#94a3b8"
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.categoryGrid}>
                    {/* Category buttons would be mapped here */}
                </View>

                <FaqItem 
                    question="How to link your partner?"
                    answer="Linking your partner is easy! Go to Settings > Profile > Link Partner. You will receive a unique cosmic code to share."
                    icon="link"
                    color="#fc0c84"
                />
                <FaqItem 
                    question="What is SOS Mode?"
                    answer="SOS Mode is a specialized de-escalation tool designed for high-tension moments. It offers communication prompts and breathing exercises."
                    icon="warning"
                    color="#fbbf24"
                />
                 <FaqItem 
                    question="Why aren't our daily quests syncing?"
                    answer="Ensure both users are on the latest app version and connected to a stable network. If the issue persists, try restarting the app."
                    icon="sync_alt"
                    color="#4ade80"
                />

                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>Still orbiting the answer?</Text>
                    <Text style={styles.contactSubtitle}>Our support team is active 24/7.</Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>Email Support</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {/* Floating chat button fixed at the bottom */}
            <TouchableOpacity style={styles.chatButton}>
                {/* Chat Icon */}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0d1a1a' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 24 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8 },
    subtitle: { color: '#94a3b8', textAlign: 'center', marginBottom: 24, maxWidth: 300, alignSelf: 'center' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, marginBottom: 24 },
    searchInput: { flex: 1, color: '#FFF', height: 50 },
    categoryGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
    faqItemContainer: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 12 },
    faqQuestionRow: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
    faqQuestion: { color: '#FFF', fontWeight: '600', flex: 1 },
    faqAnswer: { color: '#94a3b8', paddingHorizontal: 16, paddingBottom: 16 },
    contactSection: { marginTop: 32, padding: 24, backgroundColor: 'rgba(252, 12, 132, 0.05)', borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(252, 12, 132, 0.2)' },
    contactTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    contactSubtitle: { color: '#94a3b8', marginBottom: 16 },
    contactButton: { backgroundColor: '#fc0c84', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24 },
    contactButtonText: { color: '#0d1a1a', fontWeight: 'bold' },
    chatButton: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#fc0c84', justifyContent: 'center', alignItems: 'center' },
});

export default HelpAndFaqScreen;
