
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const WelcomeAndDisclaimer = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#230f19', '#1a1317']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.card}>
                        <ImageBackground 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcGP9hICew7NeEpanWX2Xk6Ne7MpOihuxXhlKCUck_vFi1-28g3qeRTJtvtXU660CUS_7DESrTEMFub5_JK_NQXSUB4s7XTKHHjkOs-Vil1nG99pGS1ghbHhZqSOzEwHsSR9fCRUaaN9xDrVoKdYn40cpGis1rbi2HPL_V2TURnmGCtSwXuNH6yt6ulVbQS4N7Pb_JVo-jTSOgGk5-yRiP9VfwJjJ6BvvL3EBZ-VcmVVXnD98VLGBZfwrDHpc7ZG5kJRpEw7MHtpfs' }} 
                            style={styles.heroImage}
                        >
                           <LinearGradient colors={['transparent', '#1a1317']} style={styles.heroOverlay} />
                           <Text style={styles.heroTitle}>Welcome, Seekers</Text>
                        </ImageBackground>

                        <View style={styles.disclaimerContent}>
                            <Text style={styles.disclaimerHeader}>Legal Disclaimer</Text>
                            <Text style={styles.disclaimerText}>
                                This game, <Text style={{fontWeight: 'bold'}}>Love Actually... The Game</Text>, is designed for entertainment and connection.
                                It is NOT a replacement for professional therapy or medical advice.
                                By proceeding, you acknowledge that you are participating voluntarily.
                            </Text>

                            <BouncyCheckbox
                                size={25}
                                fillColor="#fc0c84"
                                unfillColor="#FFFFFF"
                                text="I understand and agree to the terms"
                                iconStyle={{ borderColor: "#fc0c84" }}
                                innerIconStyle={{ borderWidth: 2 }}
                                textStyle={{ fontFamily: "JosefinSans-Regular" , textDecorationLine: 'none'}}
                                onPress={(isChecked: boolean) => {setIsChecked(isChecked)}}
                                style={styles.checkboxContainer}
                            />

                            <TouchableOpacity style={[styles.continueButton, !isChecked && styles.disabledButton]} disabled={!isChecked}>
                                <Text style={styles.continueButtonText}>Continue Journey</Text>
                                <MaterialIcons name="arrow-forward" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#230f19' },
    container: { flex: 1, justifyContent: 'center', padding: 15 },
    contentContainer: { flexGrow: 1, justifyContent: 'center' },
    card: { backgroundColor: '#1a1317', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    heroImage: { height: 180, justifyContent: 'flex-end', padding: 20 },
    heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    disclaimerContent: { padding: 20 },
    disclaimerHeader: { color: '#fc0c84', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
    disclaimerText: { color: '#d1d5db', fontSize: 14, lineHeight: 22, marginBottom: 20 },
    checkboxContainer: { marginBottom: 20, alignSelf: 'flex-start', },
    continueButton: { flexDirection: 'row', backgroundColor: '#fc0c84', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { backgroundColor: '#555' },
    continueButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 8 },
});

export default WelcomeAndDisclaimer;
