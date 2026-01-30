
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SOSButton = ({ title, subtitle, color, icon }) => (
    <TouchableOpacity style={[styles.sosButton, { borderColor: `${color}50` }]}>
        {/* Icon goes here */}
        <View style={styles.buttonTextContainer}>
            <Text style={[styles.buttonSubtitle, { color }]}>{subtitle}</Text>
            <Text style={styles.buttonTitle}>{title}</Text>
        </View>
    </TouchableOpacity>
);

const SOSConfirmationScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#12080d', '#1a1317']}
                style={styles.background}
            />

            <View style={styles.mainContent}>
                <View style={styles.glassPanel}>
                    {/* Emergency Home Icon */}
                    <Text style={styles.mainHeader}>Need Support?</Text>
                    <Text style={styles.description}>
                        You've hit the SOS beacon. Please select the current frequency of your connection.
                    </Text>

                    <View style={styles.buttonGrid}>
                        <SOSButton
                            title="I'm Frustrated"
                            subtitle="Low Intensity"
                            color="#FFD700"
                        />
                        <SOSButton
                            title="We're Fighting"
                            subtitle="High Intensity"
                            color="#FF1493"
                        />
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.cancelButton}>Cancel - Everything is okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1317' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, justifyContent: 'center', padding: 24 },
    glassPanel: {
        backgroundColor: 'rgba(26, 19, 23, 0.9)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainHeader: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
    description: { color: 'rgba(255,255,255,0.6)', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    buttonGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    sosButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonTextContainer: { alignItems: 'center' },
    buttonSubtitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    buttonTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    cancelButton: { color: '#9d4edd', fontWeight: '500', marginTop: 16 },
});

export default SOSConfirmationScreen;
