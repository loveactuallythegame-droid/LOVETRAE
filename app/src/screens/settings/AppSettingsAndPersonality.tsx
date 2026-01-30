
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Header } from '../../components/ui/Header';

const PersonalityCard = ({ title, description, selected, onSelect }: { title: string, description: string, selected?: boolean, onSelect: () => void }) => (
    <TouchableOpacity 
        style={[styles.personalityCard, selected && styles.selectedCard ]}
        onPress={onSelect}
    >
        <Text style={styles.personalityTitle}>{title}</Text>
        <Text style={styles.personalityDescription}>{description}</Text>
    </TouchableOpacity>
);


const AppSettingsAndPersonalityScreen = () => {
    const [sassLevel, setSassLevel] = useState(75);
    const [gameMode, setGameMode] = useState('Spicy/Savage');

    const handleSassChange = (value: number) => {
        setSassLevel(value);
        // Here you would call an API to update the system_config
        // Example: updateSystemConfig({ sassLevel: value })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Header title="Personality Level" />
                <Text style={styles.pageDescription}>
                    Fine-tune the AI's temperament. This dictates how the game facilitates your sessions, adjusts the "bite" of the questions, and reacts to your answers.
                </Text>

                <Text style={styles.sectionTitle}>Select Game Mode</Text>
                <View style={styles.modeSelectionContainer}>
                    <PersonalityCard 
                        title="Sweet Marcie" 
                        description="Gentle, nurturing, and focuses on positive reinforcement."
                        selected={gameMode === 'Sweet'}
                        onSelect={() => setGameMode('Sweet')}
                    />
                    <PersonalityCard 
                        title="Neutral" 
                        description="Objective, direct, and balanced. Provides clinical yet warm insights."
                        selected={gameMode === 'Neutral'}
                        onSelect={() => setGameMode('Neutral')}
                    />
                    <PersonalityCard 
                        title="Spicy/Savage" 
                        description="Provocative, brutally honest, and high energy. Challenges assumptions with intensity."
                        selected={gameMode === 'Spicy/Savage'}
                        onSelect={() => setGameMode('Spicy/Savage')}
                    />
                </View>

                <View style={styles.sassSliderContainer}>
                    <Text style={styles.sectionTitle}>Sass Level</Text>
                    <Slider
                        style={{width: '100%', height: 40}}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={sassLevel}
                        onSlidingComplete={handleSassChange}
                        minimumTrackTintColor="#fc0c84"
                        maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                        thumbTintColor="#FFF"
                    />
                    <Text style={styles.sassLevelText}>{sassLevel}%</Text>
                </View>

                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirm Selection</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#120d09' },
    content: { padding: 20 },
    pageDescription: { fontFamily: 'SweetPink-Regular', fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 30, lineHeight: 24 },
    sectionTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 24, color: '#FFF', marginBottom: 20 },
    modeSelectionContainer: { marginBottom: 30 },
    personalityCard: {
        backgroundColor: 'rgba(29, 21, 14, 0.7)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    selectedCard: {
        borderColor: '#f48c25',
        shadowColor: '#f48c25',
        shadowRadius: 15,
        shadowOpacity: 0.4
    },
    personalityTitle: { fontFamily: 'BarbieDream-Regular', fontSize: 20, color: '#FFF', marginBottom: 5 },
    personalityDescription: { fontFamily: 'SweetPink-Regular', fontSize: 14, color: '#cbd5e1', lineHeight: 20 },
    sassSliderContainer: {
        backgroundColor: 'rgba(29, 21, 14, 0.7)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 30,
        alignItems: 'center'
    },
    sassLevelText: { fontFamily: 'WonderfulSometimes-Regular', fontSize: 20, color: '#fc0c84', marginTop: 10 },
    confirmButton: { backgroundColor: '#fc0c84', padding: 20, borderRadius: 15, alignItems: 'center' },
    confirmButtonText: { fontFamily: 'BarbieDream-Regular', fontSize: 18, color: '#1d150e', textTransform: 'uppercase' },
});

export default AppSettingsAndPersonalityScreen;
