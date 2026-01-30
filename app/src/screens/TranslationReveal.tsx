
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const TranslationReveal = () => {

    const originalStatement = "I don't care where we eat...";
    const trueMeaning = "I'm feeling overwhelmed by decisions and just need to feel taken care of tonight.";
    const insight = "This insight suggests a need for emotional safety and leadership in small choices to alleviate mental fatigue.";

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#230f19', '#1e1b24']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.phaseTitle}>WHEN YOU SAID...</Text>
                    <Text style={styles.originalStatement}>"{originalStatement}"</Text>

                    <View style={styles.revealCard}>
                        <Text style={styles.revealTitle}>THE TRUE MEANING</Text>
                        <Text style={styles.trueMeaning}>{trueMeaning}</Text>

                        <View style={styles.insightContainer}>
                            <MaterialIcons name="psychology" size={24} color="#fc0c84" />
                            <Text style={styles.insightText}>{insight}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>View Action Plan</Text>
                        <MaterialIcons name="arrow-forward" size={22} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.nextStepText}>Next: Discover 3 ways to respond</Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#230f19' },
    container: { flex: 1 },
    contentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    phaseTitle: { color: '#fc0c84', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontSize: 12 },
    originalStatement: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 22, fontStyle: 'italic', textAlign: 'center', marginBottom: 32 },
    revealCard: {
        backgroundColor: '#1e1b24',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(127, 19, 236, 0.3)',
        shadowColor: "#7f13ec",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        width: '100%',
        marginBottom: 32,
    },
    revealTitle: { color: '#fc0c84', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 12, marginBottom: 16 },
    trueMeaning: { color: '#fff', fontSize: 26, fontWeight: 'bold', lineHeight: 34, marginBottom: 24 },
    insightContainer: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
    insightText: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, marginLeft: 12, flex: 1 },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        backgroundColor: '#ffd700', 
        shadowColor: '#ff8c00',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8
    },
    actionButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
    nextStepText: { color: 'rgba(255, 255, 255, 0.5)', marginTop: 16, fontSize: 12 }
});

export default TranslationReveal;
