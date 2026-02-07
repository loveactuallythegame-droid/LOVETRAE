
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const WelcomeAndDisclaimer = () => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#2A002A', '#5A005A']} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.card}>
                        <ImageBackground 
                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcGP9hICew7NeEpanWX2Xk6Ne7MpOihuxXhlKCUck_vFi1-28g3qeRTJtvtXU660CUS_7DESrTEMFub5_JK_NQXSUB4s7XTKHHjkOs-Vil1nG99pGS1ghbHhZqSOzEwHsSR9fCRUaaN9xDrVoKdYn40cpGis1rbi2HPL_V2TURnmGCtSwXuNH6yt6ulVbQS4N7Pb_JVo-jTSOgGk5-yRiP9VfwJjJ6BvvL3EBZ-VcmVVXnD98VLGBZfwrDHpc7ZG5kJRpEw7MHtpfs' }} 
                            style={styles.heroImage}
                        >
                           <LinearGradient colors={['transparent', 'rgba(42,0,42,0.8)']} style={styles.heroOverlay} />
                           <Text style={styles.heroTitle}>WELCOME, SEEKERS</Text>
                        </ImageBackground>

                        <View style={styles.disclaimerContent}>
                            <Text style={styles.disclaimerHeader}>LEGAL DISCLAIMER</Text>
                            <Text style={styles.disclaimerText}>
                                This game, <Text style={{fontWeight: 'bold'}}>Love Actually... The Game</Text>, is designed for entertainment and connection.
                                It is NOT a replacement for professional therapy or medical advice.
                                By proceeding, you acknowledge that you are participating voluntarily.
                            </Text>

                            <BouncyCheckbox
                                size={25}
                                fillColor="#FF4081"
                                unfillColor="#FFFFFF"
                                text="I UNDERSTAND AND AGREE TO THE TERMS"
                                iconStyle={{ borderColor: "#FF4081" }}
                                innerIconStyle={{ borderWidth: 2 }}
                                textStyle={{ fontFamily: "JosefinSans-Regular" , textDecorationLine: 'none', color: '#FFF', fontWeight: 'bold'}}
                                onPress={(isChecked: boolean) => {setIsChecked(isChecked)}}
                                style={styles.checkboxContainer}
                            />

                            <TouchableOpacity style={[styles.continueButton, !isChecked && styles.disabledButton]} disabled={!isChecked}>
                                <Text style={styles.continueButtonText}>CONTINUE JOURNEY</Text>
                                <Text style={{fontSize: 22}}>🚀</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#2A002A' },
    container: { flex: 1, justifyContent: 'center', padding: 15 },
    contentContainer: { flexGrow: 1, justifyContent: 'center' },
    card: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 64, 129, 0.5)' },
    heroImage: { height: 180, justifyContent: 'flex-end', padding: 20 },
    heroOverlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' },
    disclaimerContent: { padding: 20 },
    disclaimerHeader: { color: '#FF4081', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
    disclaimerText: { color: '#D1C4E9', fontSize: 14, lineHeight: 22, marginBottom: 20 },
    checkboxContainer: { marginBottom: 20, alignSelf: 'flex-start', },
    continueButton: { flexDirection: 'row', backgroundColor: '#FF4081', padding: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    disabledButton: { backgroundColor: '#555' },
    continueButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginRight: 8, textTransform: 'uppercase' },
});

export default WelcomeAndDisclaimer;
