
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const repairOptions = [
    { id: 'hug', title: '6-SECOND HUG', description: 'Release oxytocin and ground each other through physical presence.', category: 'PHYSICAL CONNECTION', icon: '🤗', color: '#FFD700' },
    { id: 'apology', title: 'DIRECT APOLOGY', description: 'Take ownership of your part in the friction with zero justifications.', category: 'VULNERABILITY', icon: '🙏', color: '#00FFFF' },
    { id: 'listening', title: 'ACTIVE LISTENING', description: 'Hold space for their perspective without planning your response.', category: 'EMPATHY', icon: '🎧', color: '#FF9100' },
    { id: 'humor', title: 'SILLY HUMOR', description: 'Crack the tension with an inside joke or a lighthearted observation.', category: 'PLAYFULNESS', icon: '😜', color: '#E040FB' },
];

const ChoiceCard = ({ option, isSelected, onSelect }) => (
    <TouchableOpacity style={[styles.choiceCard, isSelected && { borderColor: option.color, borderWidth: 2 }]} onPress={() => onSelect(option.id)}>
        <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
            <Text style={{fontSize: 32}}>{option.icon}</Text>
        </View>
        <Text style={styles.cardTitle}>{option.title}</Text>
        <Text style={styles.cardDescription}>{option.description}</Text>
        <View style={styles.cardFooter}>
            <Text style={[styles.cardCategory, { color: option.color }]}>{option.category}</Text>
        </View>
    </TouchableOpacity>
);

const RelationshipDiagnosisCard3 = () => {
    const [selectedOption, setSelectedOption] = useState(repairOptions[0].id);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>CHOOSE YOUR PEACE OFFERING</Text>
                    <Text style={styles.subHeader}>SELECT A REPAIR ATTEMPT TO REALIGN YOUR ORBITS AND RESTORE HARMONY.</Text>

                    <View style={styles.cardsContainer}>
                        {repairOptions.map(option => (
                            <ChoiceCard key={option.id} option={option} isSelected={selectedOption === option.id} onSelect={setSelectedOption} />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.mainButton}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.mainButtonGradient}>
                            <Text style={styles.mainButtonText}>CHOOSE THIS PATH</Text>
                            <Text style={{fontSize: 22}}>✨</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, textTransform: 'uppercase' },
    subHeader: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 24, maxWidth: 600, alignSelf: 'center', fontWeight: 'bold', textTransform: 'uppercase' },
    cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 32 },
    choiceCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        alignItems: 'center',
        width: '46%',
    },
    iconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase' },
    cardDescription: { color: '#D1C4E9', fontSize: 14, textAlign: 'center', marginBottom: 16 },
    cardFooter: { borderTopWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', paddingTop: 12, width: '100%', alignItems: 'center' },
    cardCategory: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    mainButton: { alignSelf: 'center' },
    mainButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 28, gap: 12 },
    mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
});

export default RelationshipDiagnosisCard3;
