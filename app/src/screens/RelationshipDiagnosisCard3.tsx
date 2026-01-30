
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const repairOptions = [
    { id: 'hug', title: '6-Second Hug', description: 'Release oxytocin and ground each other through physical presence.', category: 'Physical Connection', icon: 'favorite', color: '#f97316' },
    { id: 'apology', title: 'Direct Apology', description: 'Take ownership of your part in the friction with zero justifications.', category: 'Vulnerability', icon: 'verified', color: '#14b8a6' },
    { id: 'listening', title: 'Active Listening', description: 'Hold space for their perspective without planning your response.', category: 'Empathy', icon: 'hearing', color: '#eab308' },
    { id: 'humor', title: 'Silly Humor', description: 'Crack the tension with an inside joke or a lighthearted observation.', category: 'Playfulness', icon: 'sentiment-very-satisfied', color: '#ec4899' },
];

const ChoiceCard = ({ option, isSelected, onSelect }) => (
    <TouchableOpacity style={[styles.choiceCard, isSelected && { borderColor: option.color, borderWidth: 2 }]} onPress={() => onSelect(option.id)}>
        <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
            <MaterialIcons name={option.icon} size={32} color={option.color} />
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
            <LinearGradient colors={['#230f19', '#1a1618']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>Choose Your Peace Offering</Text>
                    <Text style={styles.subHeader}>Select a repair attempt to realign your orbits and restore harmony.</Text>

                    <View style={styles.cardsContainer}>
                        {repairOptions.map(option => (
                            <ChoiceCard key={option.id} option={option} isSelected={selectedOption === option.id} onSelect={setSelectedOption} />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.mainButton}>
                        <LinearGradient colors={['#8b5cf6', '#ee2b8c']} style={styles.mainButtonGradient}>
                            <Text style={styles.mainButtonText}>CHOOSE THIS PATH</Text>
                            <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1a1618' },
    container: { flex: 1 },
    scrollContent: { padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subHeader: { color: 'rgba(255,255,255,0.5)', fontSize: 16, textAlign: 'center', marginBottom: 24, maxWidth: 600, alignSelf: 'center' },
    cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 32 },
    choiceCard: {
        backgroundColor: 'rgba(26, 22, 24, 0.8)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        width: '46%', // Approximately 2 cards per row with gap
    },
    iconContainer: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    cardTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    cardDescription: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', marginBottom: 16 },
    cardFooter: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingTop: 12, width: '100%', alignItems: 'center' },
    cardCategory: { textTransform: 'uppercase', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    mainButton: { alignSelf: 'center' },
    mainButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 28, gap: 12 },
    mainButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});

export default RelationshipDiagnosisCard3;
