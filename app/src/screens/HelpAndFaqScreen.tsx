
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const FaqItem = ({ question, answer, icon, color }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <View style={styles.faqItemContainer}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.faqQuestionRow}>
                 <Text style={{color, marginRight: 8, fontSize: 20}}>{icon}</Text>
                <Text style={styles.faqQuestion}>{question}</Text>
                <Text>{isOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {isOpen && <Text style={styles.faqAnswer}>{answer}</Text>}
        </View>
    );
};

const HelpAndFaqScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
             <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.background} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>HELP & FAQ</Text>
                <Text style={styles.subtitle}>Find answers in the stars. Our cosmic support guide is here to help.</Text>

                <View style={styles.searchBar}>
                    <TextInput
                        placeholder="SEARCH FOR ANSWERS..."
                        placeholderTextColor="#D1C4E9"
                        style={styles.searchInput}
                    />
                </View>

                <FaqItem 
                    question="HOW TO LINK YOUR PARTNER?"
                    answer="Linking your partner is easy! Go to Settings > Profile > Link Partner. You will receive a unique cosmic code to share."
                    icon="🔗"
                    color="#FF4081"
                />
                <FaqItem 
                    question="WHAT IS SOS MODE?"
                    answer="SOS Mode is a specialized de-escalation tool designed for high-tension moments. It offers communication prompts and breathing exercises."
                    icon="🆘"
                    color="#FFD700"
                />
                 <FaqItem 
                    question="WHY AREN'T OUR DAILY QUESTS SYNCING?"
                    answer="Ensure both users are on the latest app version and connected to a stable network. If the issue persists, try restarting the app."
                    icon="🔄"
                    color="#00FFFF"
                />

                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>STILL ORBITING THE ANSWER?</Text>
                    <Text style={styles.contactSubtitle}>Our support team is active 24/7.</Text>
                    <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.contactButtonText}>EMAIL SUPPORT</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <TouchableOpacity style={styles.chatButton}>
                <Text style={{fontSize: 30}}>💬</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    scrollContainer: { padding: 24 },
    title: { fontSize: 36, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subtitle: { color: '#D1C4E9', textAlign: 'center', marginBottom: 24, maxWidth: 300, alignSelf: 'center' },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, paddingHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    searchInput: { flex: 1, color: '#FFF', height: 50, fontWeight: 'bold', textTransform: 'uppercase' },
    faqItemContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', marginBottom: 12, padding: 16 },
    faqQuestionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    faqQuestion: { color: '#FFF', fontWeight: 'bold', flex: 1, textTransform: 'uppercase' },
    faqAnswer: { color: '#D1C4E9', marginTop: 8 },
    contactSection: { marginTop: 32, padding: 24, backgroundColor: 'rgba(255, 64, 129, 0.2)', borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    contactTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginBottom: 4, textTransform: 'uppercase' },
    contactSubtitle: { color: '#D1C4E9', marginBottom: 16 },
    contactButton: { backgroundColor: '#FF4081', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 20 },
    contactButtonText: { color: '#FFF', fontWeight: 'bold', textTransform: 'uppercase' },
    chatButton: { position: 'absolute', bottom: 24, right: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF4081', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.5)' },
});

export default HelpAndFaqScreen;
