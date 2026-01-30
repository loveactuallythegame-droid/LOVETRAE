
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Define the colors for the different states
const stateColors = {
    like: '#22c55e', // green-500
    dislike: '#ef4444', // red-500
    none: 'rgba(255, 255, 255, 0.2)',
};

const bodyParts = [
    { id: 'head', label: 'Head' },
    { id: 'neck', label: 'Neck' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'chest', label: 'Chest' },
    { id: 'stomach', label: 'Stomach' },
    { id: 'back', label: 'Back' },
    { id: 'arms', label: 'Arms' },
    { id: 'hands', label: 'Hands' },
    { id: 'legs', label: 'Legs' },
    { id: 'feet', label: 'Feet' },
];

const TouchMapConfiguration = ({ navigation }) => {
    const [touchMap, setTouchMap] = useState(
        bodyParts.reduce((acc, part) => ({ ...acc, [part.id]: 'none' }), {})
    );

    const toggleState = (partId) => {
        setTouchMap(prevMap => {
            const currentState = prevMap[partId];
            const nextState = currentState === 'none' ? 'like' : currentState === 'like' ? 'dislike' : 'none';
            return { ...prevMap, [partId]: nextState };
        });
    };

    const handleSave = () => {
        console.log("Saving Touch Map:", touchMap);
        // In a real app, this would be sent to a server.
        navigation.goBack();
    };

    return (
        <LinearGradient colors={['#230f19', '#0f0f12']} style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialIcons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Touch Map</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <Text style={styles.subtitle}>
                        Tap each body part to cycle through your touch preferences.
                    </Text>

                    <View style={styles.touchMapContainer}>
                        <TouchableOpacity style={[styles.bodyPart, styles.head, { backgroundColor: stateColors[touchMap.head] }]} onPress={() => toggleState('head')} />
                        <TouchableOpacity style={[styles.bodyPart, styles.neck, { backgroundColor: stateColors[touchMap.neck] }]} onPress={() => toggleState('neck')} />
                        <View style={styles.torsoContainer}>
                            <TouchableOpacity style={[styles.bodyPart, styles.arms, { backgroundColor: stateColors[touchMap.arms] }]} onPress={() => toggleState('arms')} />
                            <View style={styles.mainTorso}>
                                <TouchableOpacity style={[styles.bodyPart, styles.shoulders, { backgroundColor: stateColors[touchMap.shoulders] }]} onPress={() => toggleState('shoulders')} />
                                <TouchableOpacity style={[styles.bodyPart, styles.chest, { backgroundColor: stateColors[touchMap.chest] }]} onPress={() => toggleState('chest')} />
                                <TouchableOpacity style={[styles.bodyPart, styles.stomach, { backgroundColor: stateColors[touchMap.stomach] }]} onPress={() => toggleState('stomach')} />
                            </View>
                            <TouchableOpacity style={[styles.bodyPart, styles.arms, { backgroundColor: stateColors[touchMap.arms] }]} onPress={() => toggleState('arms')} />
                        </View>
                        <TouchableOpacity style={[styles.bodyPart, styles.legs, { backgroundColor: stateColors[touchMap.legs] }]} onPress={() => toggleState('legs')} />
                        <TouchableOpacity style={[styles.bodyPart, styles.feet, { backgroundColor: stateColors[touchMap.feet] }]} onPress={() => toggleState('feet')} />
                    </View>

                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: stateColors.like }]} />
                            <Text style={styles.legendText}>Like</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: stateColors.dislike }]} />
                            <Text style={styles.legendText}>Dislike</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: stateColors.none }]} />
                            <Text style={styles.legendText}>Neutral / Ask</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    touchMapContainer: {
        alignItems: 'center',
        marginBottom: 30,
        transform: [{ scale: 0.8 }]
    },
    bodyPart: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
    },
    head: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    neck: {
        width: 30,
        height: 20,
        marginBottom: 5,
    },
    torsoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainTorso: {
        width: 120,
        alignItems: 'center',
    },
    shoulders: {
        width: 140,
        height: 40,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    chest: {
        width: 120,
        height: 60,
        borderBottomWidth: 0,
        borderRadius: 0,
    },
    stomach: {
        width: 110,
        height: 70,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    arms: {
        width: 40,
        height: 150,
        marginHorizontal: 5,
        marginTop: 40,
        borderRadius: 20,
    },
    legs: {
        width: 100,
        height: 180,
        marginTop: 5,
    },
    feet: {
        width: 120,
        height: 40,
        marginTop: 5,
        borderRadius: 20,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
        padding: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    legendText: {
        color: 'white',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#fc0c84',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: '#fc0c84',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TouchMapConfiguration;
