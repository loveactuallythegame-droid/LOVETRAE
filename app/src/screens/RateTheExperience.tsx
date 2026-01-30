
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const Star = ({ filled, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <MaterialIcons
            name={filled ? 'star' : 'star-border'}
            size={50}
            color={filled ? '#FFD700' : '#rgba(255,255,255,0.2)'}
            style={styles.star}
        />
    </TouchableOpacity>
);

const RateTheExperienceScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#230f19', '#1c1417']} style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Rate the Experience</Text>
                    <Text style={styles.subtitle}>Your feedback helps us bring more love to the universe.</Text>

                    <View style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((index) => (
                            <Star
                                key={index}
                                filled={index <= rating}
                                onPress={() => setRating(index)}
                            />
                        ))}
                    </View>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Tell us more about your session... (optional)"
                        placeholderTextColor="rgba(255,255,255,0.3)"
                        multiline
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    <TouchableOpacity style={styles.submitButton}>
                       <LinearGradient
                            colors={['#ee2b6c', '#8b5cf6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                        <Text style={styles.submitButtonText}>Submit Feedback</Text>
                        <MaterialIcons name="send" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.maybeLaterText}>Maybe later</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#12080b' },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 640,
        backgroundColor: 'rgba(28, 20, 23, 0.8)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(238, 43, 108, 0.2)',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    star: {
        marginHorizontal: 5,
        ...Platform.select({
            web: { textShadow: '0 0 15px rgba(255, 215, 0, 0.8)' },
        }),
    },
    textInput: {
        width: '100%',
        minHeight: 120,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        padding: 16,
        color: '#fff',
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    submitButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 12,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    maybeLaterText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
    },
});

export default RateTheExperienceScreen;
