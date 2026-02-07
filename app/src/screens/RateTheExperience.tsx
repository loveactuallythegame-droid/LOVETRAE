
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Star = ({ filled, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text style={[styles.star, {opacity: filled ? 1 : 0.2}]}>★</Text>
    </TouchableOpacity>
);

const RateTheExperienceScreen = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>RATE THE EXPERIENCE</Text>
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
                        placeholder="TELL US MORE ABOUT YOUR SESSION... (OPTIONAL)"
                        placeholderTextColor="#D1C4E9"
                        multiline
                        value={feedback}
                        onChangeText={setFeedback}
                    />

                    <TouchableOpacity style={styles.submitButton}>
                       <LinearGradient
                            colors={['#FF4081', '#E040FB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.buttonGradient}
                        >
                        <Text style={styles.submitButtonText}>SUBMIT FEEDBACK</Text>
                        <Text style={{fontSize: 20}}>🚀</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.maybeLaterText}>MAYBE LATER</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 640,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    subtitle: {
        color: '#D1C4E9',
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    star: {
        fontSize: 50,
        color: '#FFD700',
        textShadowColor: '#FFD700',
        textShadowRadius: 8,
        marginHorizontal: 5,
    },
    textInput: {
        width: '100%',
        minHeight: 120,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
        padding: 16,
        color: '#fff',
        fontSize: 16,
        textAlignVertical: 'top',
        marginBottom: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
        textTransform: 'uppercase',
    },
    maybeLaterText: {
        color: '#D1C4E9',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default RateTheExperienceScreen;
