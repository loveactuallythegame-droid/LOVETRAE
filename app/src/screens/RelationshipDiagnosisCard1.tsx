
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const StarRating = ({ rating, setRating }) => (
    <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
                <Text style={[styles.star, {opacity: i <= rating ? 1 : 0.2}]}>★</Text>
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
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.header}>EMOTIONAL RE-ENTRY</Text>
                    <Text style={styles.subHeader}>A QUICK ALIGNMENT CHECK BEFORE WE CONCLUDE.</Text>

                    <View style={styles.glassPanel}>
                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>1. DO YOU FEEL HEARD BY YOUR PARTNER?</Text>
                            <StarRating rating={rating} setRating={setRating} />
                        </View>

                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>2. IS THE INITIAL TENSION RESOLVED?</Text>
                            <OptionButtons options={['COMPLETELY', 'MOSTLY', 'A LITTLE', 'NOT REALLY']} selected={resolution} setSelected={setResolution} />
                        </View>

                        <View style={styles.questionBlock}>
                            <Text style={styles.questionText}>3. CURRENT EMOTIONAL TEMPERATURE?</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                value={temperature}
                                onValueChange={setTemperature}
                                minimumTrackTintColor="#00FFFF"
                                maximumTrackTintColor="rgba(0,0,0,0.3)"
                                thumbTintColor="#00FFFF"
                            />
                             <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>COOL / DISTANT</Text>
                                <Text style={styles.sliderLabel}>WARM / CONNECTED</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.finishButton}>
                        <LinearGradient colors={['#FF4081', '#E040FB']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.finishButtonGradient}>
                            <Text style={styles.finishButtonText}>FINISH SOS SESSION</Text>
                            <Text>✅</Text>
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
    scrollContent: { alignItems: 'center', padding: 20 },
    header: { color: '#fff', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginTop: 20, textTransform: 'uppercase' },
    subHeader: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', fontWeight: 'bold' },
    glassPanel: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 24, padding: 24, width: '100%', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    questionBlock: { marginBottom: 32 },
    questionText: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 16, textTransform: 'uppercase' },
    starContainer: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
    star: { fontSize: 40, color: '#FFD700', textShadowColor: '#FFD700', textShadowRadius: 10 },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    optionButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)', backgroundColor: 'rgba(255,255,255,0.1)' },
    optionButtonSelected: { borderColor: '#00FFFF', backgroundColor: 'rgba(0, 255, 255, 0.2)' },
    optionButtonText: { color: '#fff', fontWeight: 'bold', textTransform: 'uppercase' },
    slider: { width: '100%', height: 40 },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    sliderLabel: { color: '#D1C4E9', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
    finishButton: { width: '90%', marginTop: 32 },
    finishButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 28, gap: 12 },
    finishButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase' },
});

export default RelationshipDiagnosisCard1;
