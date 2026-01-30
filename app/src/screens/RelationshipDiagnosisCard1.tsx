
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const StarRating = ({ rating, setRating }) => (
    <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <MaterialIcons name="star" size={40} color={i <= rating ? '#FF8C00' : 'rgba(255,255,255,0.1)'} style={styles.star} />
            </TouchableOpacity>
        ))}
    </View>
);

const OptionButtons = ({ options, selected, setSelected }) => (
    <View style={styles.optionsContainer}>
        {options.map(option => (
            <TouchableOpacity
                key={option}
                style={[styles.optionButton, selected === option && styles.optionButtonSelected]}
                onPress={() => setSelected(option)}
            >
                <Text style={styles.optionButtonText}>{option}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

const RelationshipDiagnosisCard1 = () => {
    const [rating, setRating] = useState(0);
    const [resolution, setResolution] = useState(null);
    const [temperature, setTemperature] = useState(0.5);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#050505', '#230f19']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>Emotional Re-entry</Text>
                    <Text style={styles.subHeader}>A quick alignment check before we conclude.</Text>

                    <View style={styles.glassPanel}>
                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>1. Do you feel heard by your partner?</Text>
                            <StarRating rating={rating} setRating={setRating} />
                        </View>

                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>2. Is the initial tension resolved?</Text>
                            <OptionButtons options={['Completely', 'Mostly', 'A little', 'Not really']} selected={resolution} setSelected={setResolution} />
                        </View>

                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>3. Current emotional temperature?</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                value={temperature}
                                onValueChange={setTemperature}
                                minimumTrackTintColor="#008080"
                                maximumTrackTintColor="rgba(255,255,255,0.1)"
                                thumbTintColor="#40E0D0"
                            />
                             <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>Cool / Distant</Text>
                                <Text style={styles.sliderLabel}>Warm / Connected</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.finishButton}>
                        <LinearGradient colors={['#FF1493', '#8A2BE2']} style={styles.finishButtonGradient}>
                            <Text style={styles.finishButtonText}>FINISH SOS SESSION</Text>
                            <MaterialIcons name="check-circle" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#050505' },
    container: { flex: 1 },
    scrollContent: { alignItems: 'center', padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
    subHeader: { color: 'rgba(255,255,255,0.5)', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    glassPanel: { backgroundColor: 'rgba(18, 18, 20, 0.85)', borderRadius: 24, padding: 24, width: '100%' },
    questionBlock: { marginBottom: 32 },
    questionText: { color: '#fff', fontSize: 20, fontWeight: '500', marginBottom: 16 },
    starContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
    star: { textShadowColor: '#FF8C00', textShadowRadius: 10 },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    optionButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)' },
    optionButtonSelected: { borderColor: '#40E0D0', backgroundColor: 'rgba(64, 224, 208, 0.1)' },
    optionButtonText: { color: '#fff' },
    slider: { width: '100%', height: 40 },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    sliderLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, textTransform: 'uppercase' },
    finishButton: { width: '90%', marginTop: 32 },
    finishButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 28, gap: 12 },
    finishButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});

export default RelationshipDiagnosisCard1;
