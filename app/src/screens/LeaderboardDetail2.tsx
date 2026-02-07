
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const SOSButton = ({ title, subtitle, color, icon }) => (
    <TouchableOpacity style={[styles.sosButton, { borderColor: `${color}50` }]}>
        <Text style={{fontSize: 30}}>{icon}</Text>
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
                colors={['#2A002A', '#5A005A']}
                style={styles.background}
            />

            <View style={styles.mainContent}>
                <View style={styles.glassPanel}>
                    <Text style={{fontSize: 50}}>🚨</Text>
                    <Text style={styles.mainHeader}>NEED SUPPORT?</Text>
                    <Text style={styles.description}>
                        You've hit the SOS beacon. Please select the current frequency of your connection.
                    </Text>

                    <View style={styles.buttonGrid}>
                        <SOSButton
                            title="I'M FRUSTRATED"
                            subtitle="LOW INTENSITY"
                            color="#FFD700"
                            icon="😒"
                        />
                        <SOSButton
                            title="WE'RE FIGHTING"
                            subtitle="HIGH INTENSITY"
                            color="#FF4081"
                            icon="😡"
                        />
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.cancelButton}>CANCEL - EVERYTHING IS OKAY</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#2A002A' },
    background: { ...StyleSheet.absoluteFillObject },
    mainContent: { flex: 1, justifyContent: 'center', padding: 24 },
    glassPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 64, 129, 0.5)',
    },
    mainHeader: { color: '#FFF', fontSize: 36, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase' },
    description: { color: '#D1C4E9', fontSize: 16, textAlign: 'center', marginBottom: 24 },
    buttonGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
    sosButton: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonTextContainer: { alignItems: 'center', marginTop: 8 },
    buttonSubtitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    buttonTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase' },
    cancelButton: { color: '#D1C4E9', fontWeight: 'bold', marginTop: 16, textTransform: 'uppercase' },
});

export default SOSConfirmationScreen;
