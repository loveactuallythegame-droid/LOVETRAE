
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const TheIcebergEmotionalGame1 = () => {
    const [revealed, setRevealed] = useState(false);

    const revealEmotion = () => {
        setRevealed(true);
        // In a real app, you would save this to Firestore here.
        console.log('Emotion revealed and saved to Firestore (simulated)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#191022', '#0a0612']} style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>THE ICEBERG</Text>
                    <Text style={styles.headerSubtitle}>From surface reactions to hidden core needs.</Text>
                </View>

                <View style={styles.icebergContainer}>
                    {/* Surface Emotion */}
                    <View style={styles.surfaceContainer}>
                        <View style={styles.emotionNode}>
                            <Text style={styles.emotionText}>ANGER</Text>
                        </View>
                    </View>

                    <View style={styles.waterline} />

                    {/* Deep Emotion */}
                    <View style={styles.deepContainer}>
                        {!revealed ? (
                            <TouchableOpacity style={styles.revealButton} onPress={revealEmotion}>
                                <Text style={styles.revealButtonText}>REVEAL CORE NEED</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.emotionNode}>
                                <Text style={styles.emotionText}>FEAR</Text>
                            </View>
                        )}
                    </View>
                </View>
                
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0a0612' },
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    headerContainer: { alignItems: 'center', marginBottom: 32 },
    headerTitle: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    headerSubtitle: { color: 'rgba(255,255,255,0.6)', marginTop: 8 },
    icebergContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    surfaceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deepContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    waterline: { height: 2, width: '100%', backgroundColor: '#ff006d', marginVertical: 20 },
    emotionNode: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: 'rgba(48, 40, 57, 0.8)',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    emotionText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    revealButton: {
        backgroundColor: '#ff006d',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 20,
    },
    revealButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default TheIcebergEmotionalGame1;
