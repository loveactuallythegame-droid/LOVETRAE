
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TranslationReveal = () => {

    const originalStatement = "I don't care where we eat...";
    const trueMeaning = "I'm feeling overwhelmed by decisions and just need to feel taken care of tonight.";
    const insight = "This insight suggests a need for emotional safety and leadership in small choices to alleviate mental fatigue.";

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.phaseTitle}>WHEN YOU SAID...</Text>
                    <Text style={styles.originalStatement}>"{originalStatement}"</Text>

                    <View style={styles.revealCard}>
                        <Text style={styles.revealTitle}>THE TRUE MEANING</Text>
                        <Text style={styles.trueMeaning}>{trueMeaning}</Text>

                        <View style={styles.insightContainer}>
                            <Text style={{fontSize: 24}}>💡</Text>
                            <Text style={styles.insightText}>{insight}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>VIEW ACTION PLAN</Text>
                        <Text style={{fontSize: 22}}>▶️</Text>
                    </TouchableOpacity>
                    <Text style={styles.nextStepText}>NEXT: DISCOVER 3 WAYS TO RESPOND</Text>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    contentContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    phaseTitle: { color: '#FF4081', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, fontSize: 12 },
    originalStatement: { color: '#D1C4E9', fontSize: 22, fontStyle: 'italic', textAlign: 'center', marginBottom: 32 },
    revealCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        shadowColor: "#E040FB",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
        width: '100%',
        marginBottom: 32,
    },
    revealTitle: { color: '#FF4081', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 1.5, fontSize: 12, marginBottom: 16 },
    trueMeaning: { color: '#fff', fontSize: 26, fontWeight: 'bold', lineHeight: 34, marginBottom: 24 },
    insightContainer: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255, 64, 129, 0.5)' },
    insightText: { color: '#D1C4E9', fontSize: 14, marginLeft: 12, flex: 1 },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 20,
        backgroundColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8
    },
    actionButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold', marginRight: 8, textTransform: 'uppercase' },
    nextStepText: { color: '#D1C4E9', marginTop: 16, fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' }
});

export default TranslationReveal;
